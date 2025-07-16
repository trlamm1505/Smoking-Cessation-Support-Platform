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

@RestController
@RequestMapping("/api/consultations")
//@CrossOrigin("*")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    // B1: User tạo yêu cầu tư vấn
    @PostMapping("/request")
    public ResponseEntity<?> requestConsultation(@RequestBody ConsultationRequest consultationRequest) {
        try {
            // Tạo cuộc hẹn tư vấn
            Consultation created = consultationService.createConsultation(consultationRequest);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Yêu cầu tư vấn đã được gửi. Vui lòng chờ huấn luyện viên xác nhận.",
                    "data", created
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Đã xảy ra lỗi khi gửi yêu cầu tư vấn."
            ));
        }
    }


    // B2: Coach xác nhận và gửi link
//    @PutMapping("/{id}/approve")
//    public ResponseEntity<?> approveConsultation(
//            @PathVariable Long id,
//            @RequestParam String meetingLink
//    ) {
//        Consultation updated = consultationService.updateMeetingLinkAndStatus(id, meetingLink, "approved");
//        return ResponseEntity.ok(updated);
//    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveConsultation(@PathVariable Long id) {
        Consultation updated = consultationService.approveConsultation(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Lịch tư vấn đã được xác nhận.",
                "data", updated
        ));
    }



    // Coach từ chối lịch tư vấn (status = "rejected")
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

    // Coach hủy lịch tư vấn (status = "cancelled")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelConsultation(
            @PathVariable Long id,
            @RequestParam(required = false) String note // Lý do hủy (tùy chọn)
    ) {
        Consultation updated = consultationService.rejectOrCancelConsultation(id, "cancelled", note);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã hủy lịch thành công.",
                "data", updated
        ));
    }


    // Optional: Lấy tư vấn của User
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<?> getByUser(@PathVariable Long userId) {
//        return ResponseEntity.ok(consultationService.getByUserId(userId));
//    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(consultationService.getByUserId(userId));
    }


    // Optional: Lấy tư vấn của Coach
    @GetMapping("/coach/{coachId}")
    public List<ConsultationWithUserDTO> getConsultationsByCoach(@PathVariable Long coachId) {
        return consultationService.getByCoachId(coachId);
    }


    @Autowired
    private AgoraService agoraService;

    @Autowired
    private ConsultationRepository consultationRepository;

    @GetMapping("/{consultationId}/agora-token")
    public ResponseEntity<?> getAgoraToken(
            @PathVariable Long consultationId,
            @RequestParam int uid
    ) {
        // Tìm cuộc tư vấn
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        // Kiểm tra trạng thái
        if (!"approved".equalsIgnoreCase(consultation.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Lịch tư vấn chưa được duyệt!"
            ));
        }

        String channelName = consultation.getMeetingLink(); // Giờ là tên phòng agora
        int expireSeconds = 3600; // 1h
        String token = agoraService.generateRtcToken(channelName, uid, expireSeconds);
        System.out.println("[DEBUG] API nhận uid = " + uid + " | consultationId=" + consultationId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "channelName", channelName,
                "token", token,
                "uid", uid
        ));
    }


    // ConsultationController.java
//
//    @PostMapping("/{id}/feedback")
//    public ResponseEntity<?> submitFeedback(
//            @PathVariable Long id,
//            @RequestBody FeedbackRequest feedbackRequest
//    ) {
//        try {
//            Consultation updated = consultationService.saveFeedback(id, feedbackRequest);
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "message", "Phản hồi của bạn đã được lưu.",
//                    "data", updated
//            ));
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(Map.of(
//                    "success", false,
//                    "message", e.getMessage()
//            ));
//        }
//    }
//
//
//    @PostMapping("/{id}/end")
//    public ResponseEntity<?> endConsultation(@PathVariable Long id) {
//        Consultation updated = consultationService.endConsultation(id);
//        return ResponseEntity.ok(Map.of(
//                "success", true,
//                "message", "Đã lưu giờ kết thúc.",
//                "data", updated
//        ));
//    }


// ...

    @GetMapping("/{id}/summary")
    public ResponseEntity<?> getConsultationSummary(@PathVariable Long id) {
        ConsultationSummaryDTO dto = consultationService.getConsultationSummary(id);
        return ResponseEntity.ok(dto);
    }

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

    @GetMapping("/all")
    public ResponseEntity<?> getAllConsultations() {
        List<ConsultationFullDTO> list = consultationService.getAllConsultations();
        return ResponseEntity.ok(list);
    }





}
