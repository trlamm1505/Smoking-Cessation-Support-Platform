package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.*;
import com.example.SWP_Backend.entity.Coach;
import com.example.SWP_Backend.entity.Consultation;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.CoachRepository;
import com.example.SWP_Backend.repository.ConsultationRepository;
import com.example.SWP_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service xử lý chức năng đặt lịch và quản lý cuộc tư vấn giữa user và coach.
 */
@Service
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService; // Inject NotificationService để gửi thông báo

    /**
     * Tạo yêu cầu tư vấn mới sau khi xác thực user và coach có tồn tại.
     * Đồng thời gửi thông báo cho coach (thành viên vừa đặt lịch).
     */
    public Consultation createConsultation(ConsultationRequest request) {
        // Kiểm tra người dùng
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User ID không tồn tại: " + request.getUserId()));

        // Kiểm tra huấn luyện viên
        Coach coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new IllegalArgumentException("Coach ID không tồn tại: " + request.getCoachId()));

        if (!coach.isActive()) {
            throw new IllegalArgumentException("Huấn luyện viên hiện không hoạt động.");
        }

        // Kiểm tra thời gian
        if (request.getScheduledTime() == null || request.getScheduledTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Thời gian tư vấn không hợp lệ.");
        }

        // Tạo mới cuộc hẹn
        Consultation consultation = new Consultation();
        consultation.setUserId(user.getUserId());
        consultation.setCoachId(coach.getCoachId());
        consultation.setScheduledTime(request.getScheduledTime());
        consultation.setNotes(request.getNotes());
        consultation.setStatus("pending");
        consultation.setMeetingLink(null); // Chưa xác nhận

        Consultation saved = consultationRepository.save(consultation);

        // ======= Gửi thông báo cho Coach khi có lịch mới =======
        User coachUser = coach.getUser(); // Entity User của coach
        String timeStr = request.getScheduledTime().toString(); // Có thể format đẹp lại nếu muốn

        NotificationRequestDTO coachNoti = new NotificationRequestDTO();
        coachNoti.setTitle("Bạn vừa nhận lịch tư vấn mới");
        coachNoti.setContent("Thành viên " + user.getFullName() + " vừa đặt lịch tư vấn vào lúc " + timeStr);
        coachNoti.setType("consultation");
        coachNoti.setSenderId(user.getUserId()); // Người đặt lịch là sender
        coachNoti.setRecipientId(coachUser.getUserId()); // Gửi riêng cho coach

        notificationService.sendNotification(coachNoti);

        // Member CHƯA được xác nhận, chỉ gửi thông báo xác nhận khi coach xác nhận (ở hàm updateMeetingLinkAndStatus)
        return saved;
    }

    /**
     * Coach xác nhận và dán link Google Meet (và đổi trạng thái).
     * Đồng thời gửi thông báo xác nhận lại cho member.
     */
    public Consultation updateMeetingLinkAndStatus(Long id, String meetingLink, String status) {
        Consultation c = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with ID: " + id));

        c.setMeetingLink(meetingLink);
        c.setStatus(status);

        Consultation saved = consultationRepository.save(c);

        // ======= Gửi thông báo xác nhận HOẶC từ chối lại cho Member =======
        User user = userRepository.findById(c.getUserId()).orElse(null);
        Coach coach = coachRepository.findById(c.getCoachId()).orElse(null);

        if (user != null && coach != null) {
            String timeStr = c.getScheduledTime() != null ? c.getScheduledTime().toString() : "";
            NotificationRequestDTO memberNoti = new NotificationRequestDTO();

            // Nếu được xác nhận (approved/confirmed)
            if ("approved".equalsIgnoreCase(status) || "confirmed".equalsIgnoreCase(status)) {
                memberNoti.setTitle("Lịch tư vấn của bạn đã được xác nhận");
                memberNoti.setContent("Huấn luyện viên " + coach.getFullName() + " đã xác nhận lịch tư vấn vào lúc " + timeStr
                        + (meetingLink != null ? ". Link: " + meetingLink : ""));
                memberNoti.setType("consultation_approved");
            }
            // Nếu bị từ chối/hủy
            else if ("rejected".equalsIgnoreCase(status) || "cancelled".equalsIgnoreCase(status) || "denied".equalsIgnoreCase(status)) {
                memberNoti.setTitle("Lịch tư vấn của bạn bị từ chối/hủy");
                memberNoti.setContent("Huấn luyện viên " + coach.getFullName() + " đã từ chối/hủy lịch tư vấn vào lúc " + timeStr + ".");
                memberNoti.setType("consultation_rejected");
            }
            // Gửi nếu là 2 trường hợp trên
            else {
                // Không gửi noti cho trạng thái khác
                return saved;
            }

            memberNoti.setSenderId(coach.getUser().getUserId());
            memberNoti.setRecipientId(user.getUserId());

            notificationService.sendNotification(memberNoti);
        }
        return saved;
    }

    // ... các hàm getByUserId, getByCoachId giữ nguyên như cũ (không thay đổi gì)
    // (copy các hàm getByUserId, getByCoachId từ code của bạn bên trên)
    // ...
    public List<ConsultationDetailDTO> getByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        List<Consultation> consultations = consultationRepository.findByUserId(userId);

        User user = userRepository.findById(userId).orElse(null);

        List<Long> coachIds = consultations.stream()
                .map(Consultation::getCoachId)
                .distinct()
                .collect(Collectors.toList());
        Map<Long, Coach> coachMap = coachRepository.findAllById(coachIds).stream()
                .collect(Collectors.toMap(Coach::getCoachId, c -> c));

        List<Long> coachUserIds = coachMap.values().stream()
                .map(c -> c.getUser().getUserId())
                .distinct()
                .collect(Collectors.toList());
        Map<Long, User> coachUserMap = userRepository.findAllById(coachUserIds).stream()
                .collect(Collectors.toMap(User::getUserId, u -> u));

        return consultations.stream().map(c -> {
            ConsultationDetailDTO dto = new ConsultationDetailDTO();
            dto.setConsultationId(c.getConsultationId());
            dto.setUserId(c.getUserId());
            dto.setUsername(user != null ? user.getUsername() : null);
            dto.setUserFullName(user != null ? user.getFullName() : null);
            dto.setUserPhoneNumber(user != null ? user.getPhoneNumber() : null);
            dto.setUserEmail(user != null ? user.getEmail() : null);

            dto.setCoachId(c.getCoachId());
            Coach coachObj = coachMap.get(c.getCoachId());
            if (coachObj != null) {
                dto.setCoachName(coachObj.getFullName());
                dto.setCoachSpecialization(coachObj.getSpecialization());
                User coachUserObj = coachUserMap.get(coachObj.getUser().getUserId());
                dto.setCoachUsername(coachUserObj != null ? coachUserObj.getUsername() : null);
            }
            dto.setScheduledTime(c.getScheduledTime());
            if (c.getScheduledTime() != null) {
                dto.setEndTime(c.getScheduledTime().plusHours(2));
            }
            dto.setStatus(c.getStatus());
            dto.setNotes(c.getNotes());
            dto.setMeetingLink(c.getMeetingLink());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<ConsultationWithUserDTO> getByCoachId(Long coachId) {
        if (!coachRepository.existsById(coachId)) {
            throw new RuntimeException("Coach not found with ID: " + coachId);
        }
        List<Consultation> consultations = consultationRepository.findByCoachId(coachId);

        List<Long> userIds = consultations.stream()
                .map(Consultation::getUserId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getUserId, u -> u));

        return consultations.stream().map(c -> {
            ConsultationWithUserDTO dto = new ConsultationWithUserDTO();
            dto.setConsultationId(c.getConsultationId());
            dto.setUserId(c.getUserId());
            User userObj = userMap.get(c.getUserId());
            dto.setUsername(userObj != null ? userObj.getUsername() : null);
            dto.setFullName(userObj != null ? userObj.getFullName() : null);
            dto.setPhoneNumber(userObj != null ? userObj.getPhoneNumber() : null);
            dto.setEmail(userObj != null ? userObj.getEmail() : null);

            dto.setCoachId(c.getCoachId());
            dto.setScheduledTime(c.getScheduledTime());
            if (c.getScheduledTime() != null) {
                dto.setEndTime(c.getScheduledTime().plusHours(2));
            }
            dto.setStatus(c.getStatus());
            dto.setNotes(c.getNotes());
            dto.setMeetingLink(c.getMeetingLink());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<ConsultationFullDTO> getAllConsultations() {
        List<Consultation> consultations = consultationRepository.findAll();

        List<Long> userIds = consultations.stream().map(Consultation::getUserId).distinct().collect(Collectors.toList());
        List<Long> coachIds = consultations.stream().map(Consultation::getCoachId).distinct().collect(Collectors.toList());
        Map<Long, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getUserId, u -> u));
        Map<Long, Coach> coachMap = coachRepository.findAllById(coachIds).stream()
                .collect(Collectors.toMap(Coach::getCoachId, c -> c));

        return consultations.stream().map(c -> {
            ConsultationFullDTO dto = new ConsultationFullDTO();
            dto.setConsultationId(c.getConsultationId());
            dto.setUserFullName(userMap.get(c.getUserId()) != null ? userMap.get(c.getUserId()).getFullName() : null);
            dto.setCoachName(coachMap.get(c.getCoachId()) != null ? coachMap.get(c.getCoachId()).getFullName() : null);
            dto.setScheduledTime(c.getScheduledTime());
            dto.setEndTime(c.getEndTime());
            dto.setFeedback(c.getFeedback());
            dto.setFeedbackRating(c.getFeedbackRating());
            dto.setStatus(c.getStatus());
            dto.setNotes(c.getNotes());
            dto.setMeetingLink(c.getMeetingLink());
            return dto;
        }).collect(Collectors.toList());
    }


    /**
     * Coach từ chối hoặc hủy lịch tư vấn.
     * Tự động gửi thông báo cho member.
     * @param id       ID cuộc tư vấn
     * @param status   "rejected" hoặc "cancelled"
     * @param note     Lý do từ chối/hủy (có thể null)
     */
    public Consultation rejectOrCancelConsultation(Long id, String status, String note) {
        Consultation c = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with ID: " + id));

        c.setStatus(status);
        if (note != null && !note.trim().isEmpty()) {
            c.setNotes(note);
        }
        // Nếu là cancelled có thể set lại meetingLink = null
        if ("cancelled".equalsIgnoreCase(status)) {
            c.setMeetingLink(null);
        }

        Consultation saved = consultationRepository.save(c);

        // Gửi thông báo cho member
        User user = userRepository.findById(c.getUserId()).orElse(null);
        Coach coach = coachRepository.findById(c.getCoachId()).orElse(null);

        if (user != null && coach != null) {
            String timeStr = c.getScheduledTime() != null ? c.getScheduledTime().toString() : "";
            String title = "Lịch tư vấn của bạn đã bị ";
            String content;

            if ("rejected".equalsIgnoreCase(status)) {
                title += "từ chối";
                content = "Huấn luyện viên " + coach.getFullName() + " đã từ chối lịch tư vấn vào lúc " + timeStr
                        + (note != null && !note.trim().isEmpty() ? ". Lý do: " + note : ".");
            } else if ("cancelled".equalsIgnoreCase(status)) {
                title += "hủy";
                content = "Huấn luyện viên " + coach.getFullName() + " đã hủy lịch tư vấn vào lúc " + timeStr
                        + (note != null && !note.trim().isEmpty() ? ". Lý do: " + note : ".");
            } else {
                title += "thay đổi";
                content = "Lịch tư vấn đã được cập nhật.";
            }

            NotificationRequestDTO memberNoti = new NotificationRequestDTO();
            memberNoti.setTitle(title);
            memberNoti.setContent(content);
            memberNoti.setType("consultation");
            memberNoti.setSenderId(coach.getUser().getUserId());
            memberNoti.setRecipientId(user.getUserId());

            notificationService.sendNotification(memberNoti);
        }

        return saved;
    }




// == BỔ SUNG: Nếu dùng AgoraService để sinh token (chưa cần thêm vào service này) ==

    /**
     * Coach xác nhận lịch tư vấn, tự động sinh channelName (không còn Google Meet)
     * Đổi trạng thái, gửi thông báo cho member.
     */
    public Consultation approveConsultation(Long consultationId) {
        Consultation c = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found with ID: " + consultationId));

        // Tạo channelName theo chuẩn (cố định theo ID consultation, để luôn join cùng phòng)
        String channelName = "consultation_" + c.getConsultationId();
        c.setMeetingLink(channelName);  // meetingLink giờ chính là channelName Agora
        c.setStatus("approved");

        Consultation saved = consultationRepository.save(c);

        // Gửi thông báo cho user
        User user = userRepository.findById(c.getUserId()).orElse(null);
        Coach coach = coachRepository.findById(c.getCoachId()).orElse(null);
        if (user != null && coach != null) {
            String timeStr = c.getScheduledTime() != null ? c.getScheduledTime().toString() : "";
            NotificationRequestDTO memberNoti = new NotificationRequestDTO();
            memberNoti.setTitle("Lịch tư vấn của bạn đã được xác nhận");
            memberNoti.setContent("Huấn luyện viên " + coach.getFullName() + " đã xác nhận lịch tư vấn vào lúc " + timeStr
                    + ". Hãy tham gia phòng video tư vấn khi đến giờ.");
            memberNoti.setType("consultation_approved");
            memberNoti.setSenderId(coach.getUser().getUserId());
            memberNoti.setRecipientId(user.getUserId());
            notificationService.sendNotification(memberNoti);
        }
        return saved;
    }

    public Consultation saveFeedback(Long id, FeedbackRequest feedbackRequest) {
        Consultation c = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with ID: " + id));

        // Kiểm tra đã hoàn thành tư vấn mới cho feedback
        if (!"completed".equalsIgnoreCase(c.getStatus()) && !"approved".equalsIgnoreCase(c.getStatus())) {
            throw new RuntimeException("Chỉ đánh giá khi tư vấn đã hoàn tất.");
        }

        c.setFeedback(feedbackRequest.getFeedback());
        c.setFeedbackRating(feedbackRequest.getRating());
        c.setStatus("completed"); // Set lại trạng thái nếu muốn

        return consultationRepository.save(c);
    }

    public Consultation endConsultation(Long consultationId) {
        Consultation c = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        c.setEndTime(LocalDateTime.now());
        c.setStatus("completed");

        return consultationRepository.save(c);
    }


    public Consultation finishConsultation(Long id, EndConsultationRequest req) {
        Consultation c = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        // Chỉ cho phép kết thúc khi đang ở trạng thái approved
        if (!"approved".equalsIgnoreCase(c.getStatus())) {
            throw new RuntimeException("Chỉ có thể kết thúc khi trạng thái là 'approved'");
        }

        c.setEndTime(LocalDateTime.now());
        c.setStatus("completed");

        if (req.getFeedback() != null) c.setFeedback(req.getFeedback());
        if (req.getFeedbackRating() != null) c.setFeedbackRating(req.getFeedbackRating());

        return consultationRepository.save(c);
    }

    public ConsultationSummaryDTO getConsultationSummary(Long consultationId) {
        Consultation c = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        User user = userRepository.findById(c.getUserId()).orElse(null);
        Coach coach = coachRepository.findById(c.getCoachId()).orElse(null);

        ConsultationSummaryDTO dto = new ConsultationSummaryDTO();
        dto.setUserFullName(user != null ? user.getFullName() : null);
        dto.setCoachName(coach != null ? coach.getFullName() : null);
        dto.setScheduledTime(c.getScheduledTime());
        dto.setEndTime(c.getEndTime());
        dto.setFeedback(c.getFeedback());
        dto.setFeedbackRating(c.getFeedbackRating());
        return dto;
    }


}
