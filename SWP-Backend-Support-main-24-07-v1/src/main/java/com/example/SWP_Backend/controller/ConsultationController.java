package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.*;
import com.example.SWP_Backend.entity.Consultation;
import com.example.SWP_Backend.repository.ConsultationRepository;
import com.example.SWP_Backend.service.ConsultationService;
import com.example.SWP_Backend.service.AgoraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ConsultationController quản lý các API về ĐẶT LỊCH TƯ VẤN và QUẢN LÝ lịch tư vấn
 * - Đặt lịch (user request)
 * - Coach duyệt/từ chối/hủy
 * - Lấy danh sách lịch tư vấn của user/coach
 * - Xử lý phòng gọi Agora (gửi token)
 * - Kết thúc tư vấn, lưu feedback
 */
@RestController
@RequestMapping("/api/consultations")
//@CrossOrigin("*")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    // ========== B1: User gửi yêu cầu tư vấn ==========

    /**
     * API: POST /api/consultations/request
     * User gửi yêu cầu đặt lịch tư vấn với coach
     * @param consultationRequest thông tin lịch hẹn, coach, thời gian, ghi chú
     * @return Kết quả tạo lịch và thông báo chờ coach xác nhận
     */
    @PostMapping("/request")
    public ResponseEntity<?> requestConsultation(@RequestBody ConsultationRequest consultationRequest) {
        try {
            // Gọi service để lưu thông tin đặt lịch
            Consultation created = consultationService.createConsultation(consultationRequest);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Yêu cầu tư vấn đã được gửi. Vui lòng chờ huấn luyện viên xác nhận.",
                    "data", created
            ));
        } catch (IllegalArgumentException e) {
            // Trả về lỗi nếu dữ liệu không hợp lệ
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            // Trả về lỗi server nếu có vấn đề hệ thống
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Đã xảy ra lỗi khi gửi yêu cầu tư vấn."
            ));
        }
    }


    // ========== B2: Coach xác nhận/duyệt lịch tư vấn ==========

    /**
     * API: PUT /api/consultations/{id}/approve
     * Coach xác nhận (duyệt) một lịch tư vấn
     * @param id ID lịch tư vấn
     * @return Thông báo duyệt thành công và thông tin lịch đã duyệt
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveConsultation(@PathVariable Long id) {
        Consultation updated = consultationService.approveConsultation(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Lịch tư vấn đã được xác nhận.",
                "data", updated
        ));
    }

    /**
     * API: PUT /api/consultations/{id}/reject
     * Coach từ chối một lịch tư vấn (status = "rejected")
     * @param id ID lịch tư vấn
     * @param note Ghi chú lý do từ chối (có thể null)
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectConsultation(
            @PathVariable Long id,
            @RequestParam(required = false) String note // Lý do từ chối (tùy chọn)
    ) {
        Consultation updated = consultationService.rejectOrCancelConsultation(id, "rejected", note);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã từ chối lịch thành công.",
                "data", updated
        ));
    }

    /**
     * API: PUT /api/consultations/{id}/cancel
     * Coach hủy lịch tư vấn (status = "cancelled")
     * @param id ID lịch tư vấn
     * @param note Lý do hủy (tùy chọn)
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelConsultation(
            @PathVariable Long id,
            @RequestParam(required = false) String note
    ) {
        Consultation updated = consultationService.rejectOrCancelConsultation(id, "cancelled", note);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã hủy lịch thành công.",
                "data", updated
        ));
    }

    // ========== API lấy lịch tư vấn theo user hoặc coach ==========

    /**
     * API: GET /api/consultations/user/{userId}
     * Lấy danh sách lịch tư vấn của 1 user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(consultationService.getByUserId(userId));
    }

    /**
     * API: GET /api/consultations/coach/{coachId}
     * Lấy danh sách lịch tư vấn của 1 coach
     */
    @GetMapping("/coach/{coachId}")
    public List<ConsultationWithUserDTO> getConsultationsByCoach(@PathVariable Long coachId) {
        return consultationService.getByCoachId(coachId);
    }

    // ========== Xử lý lấy token/phòng gọi Agora (Video Call) ==========

    @Autowired
    private AgoraService agoraService;

    @Autowired
    private ConsultationRepository consultationRepository;

    /**
     * API: GET /api/consultations/{consultationId}/agora-token?uid=xxx
     * Lấy token và thông tin phòng Agora để tạo phòng gọi video cho tư vấn
     * Kiểm tra trạng thái duyệt trước khi cấp token phòng gọi
     */
    @GetMapping("/{consultationId}/agora-token")
    public ResponseEntity<?> getAgoraToken(
            @PathVariable Long consultationId,
            @RequestParam int uid
    ) {
        // Lấy thông tin lịch tư vấn theo ID
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        // Kiểm tra trạng thái, chỉ cho phép vào phòng nếu đã duyệt
        if (!"approved".equalsIgnoreCase(consultation.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Lịch tư vấn chưa được duyệt!"
            ));
        }

        String channelName = consultation.getMeetingLink(); // Tên phòng là meetingLink
        int expireSeconds = 3600; // Token có hiệu lực 1h
        String token = agoraService.generateRtcToken(channelName, uid, expireSeconds);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "channelName", channelName,
                "token", token,
                "uid", uid
        ));
    }

    // ========== Kết thúc tư vấn, feedback ==========

    /**
     * API: GET /api/consultations/{id}/summary
     * Lấy tóm tắt thông tin buổi tư vấn
     */
    @GetMapping("/{id}/summary")
    public ResponseEntity<?> getConsultationSummary(@PathVariable Long id) {
        ConsultationSummaryDTO dto = consultationService.getConsultationSummary(id);
        return ResponseEntity.ok(dto);
    }

    /**
     * API: POST /api/consultations/{id}/finish
     * Kết thúc tư vấn, lưu phản hồi/feedback sau buổi gọi
     * @param id ID tư vấn
     * @param request thông tin feedback (người dùng điền, coach điền)
     */
    @PostMapping("/{id}/finish")
    public ResponseEntity<?> finishConsultation(
            @PathVariable Long id,
            @RequestBody EndConsultationRequest request
    ) {
        try {
            Consultation updated = consultationService.finishConsultation(id, request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã kết thúc tư vấn và lưu phản hồi.",
                    "data", updated
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * API: GET /api/consultations/all
     * Lấy tất cả lịch tư vấn (cho admin/coach)
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllConsultations() {
        List<ConsultationFullDTO> list = consultationService.getAllConsultations();
        return ResponseEntity.ok(list);
    }
}
