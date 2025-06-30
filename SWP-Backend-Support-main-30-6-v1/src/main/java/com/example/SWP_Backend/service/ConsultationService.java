package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.ConsultationDetailDTO;
import com.example.SWP_Backend.dto.ConsultationRequest;
import com.example.SWP_Backend.dto.ConsultationWithUserDTO;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
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

        // ======= Gửi thông báo xác nhận lại cho Member =======
        User user = userRepository.findById(c.getUserId()).orElse(null);
        Coach coach = coachRepository.findById(c.getCoachId()).orElse(null);
        if (user != null && coach != null && "confirmed".equalsIgnoreCase(status)) {
            String timeStr = c.getScheduledTime() != null ? c.getScheduledTime().toString() : "";

            NotificationRequestDTO memberNoti = new NotificationRequestDTO();
            memberNoti.setTitle("Lịch tư vấn của bạn đã được xác nhận");
            memberNoti.setContent("Huấn luyện viên " + coach.getFullName() + " đã xác nhận lịch tư vấn vào lúc " + timeStr
                    + (meetingLink != null ? ". Link: " + meetingLink : ""));
            memberNoti.setType("consultation");
            memberNoti.setSenderId(coach.getUser().getUserId()); // coach là người xác nhận
            memberNoti.setRecipientId(user.getUserId()); // gửi cho member

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
}
