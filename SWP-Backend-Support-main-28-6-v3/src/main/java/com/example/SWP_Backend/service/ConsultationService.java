package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.ConsultationDetailDTO;
import com.example.SWP_Backend.dto.ConsultationRequest;
import com.example.SWP_Backend.dto.ConsultationWithUserDTO;
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

@Service
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Tạo yêu cầu tư vấn mới sau khi xác thực user và coach có tồn tại.
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

        return consultationRepository.save(consultation);
    }


    /**
     * Coach xác nhận và dán link Google Meet.
     */
    public Consultation updateMeetingLinkAndStatus(Long id, String meetingLink, String status) {
        Consultation c = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with ID: " + id));

        c.setMeetingLink(meetingLink);
        c.setStatus(status);

        return consultationRepository.save(c);
    }

    /**
     * Lấy danh sách lịch tư vấn theo User.
     */
//    public List<Consultation> getByUserId(Long userId) {
//        if (!userRepository.existsById(userId)) {
//            throw new RuntimeException("User not found with ID: " + userId);
//        }
//        return consultationRepository.findByUserId(userId);
//    }
    public List<ConsultationDetailDTO> getByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        List<Consultation> consultations = consultationRepository.findByUserId(userId);

        // Lấy user (chủ account - member) luôn 1 lần
        User user = userRepository.findById(userId).orElse(null);

        // Lấy list coachId unique
        List<Long> coachIds = consultations.stream()
                .map(Consultation::getCoachId)
                .distinct()
                .collect(Collectors.toList());
        // Lấy map coachId -> Coach
        Map<Long, Coach> coachMap = coachRepository.findAllById(coachIds).stream()
                .collect(Collectors.toMap(Coach::getCoachId, c -> c));

        // Nếu cần lấy cả thông tin coachUser
        List<Long> coachUserIds = coachMap.values().stream()
                .map(c -> c.getUser().getUserId())
                .distinct()
                .collect(Collectors.toList());
        Map<Long, User> coachUserMap = userRepository.findAllById(coachUserIds).stream()
                .collect(Collectors.toMap(User::getUserId, u -> u));

        // Build DTO
        return consultations.stream().map(c -> {
            ConsultationDetailDTO dto = new ConsultationDetailDTO();
            dto.setConsultationId(c.getConsultationId());
            dto.setUserId(c.getUserId());
            dto.setUsername(user != null ? user.getUsername() : null);
            dto.setUserFullName(user != null ? user.getFullName() : null);

            // Bổ sung số điện thoại và email của member cho FE
            dto.setUserPhoneNumber(user != null ? user.getPhoneNumber() : null);
            dto.setUserEmail(user != null ? user.getEmail() : null);

            dto.setCoachId(c.getCoachId());
            Coach coach = coachMap.get(c.getCoachId());
            if (coach != null) {
                dto.setCoachName(coach.getFullName());
                dto.setCoachSpecialization(coach.getSpecialization());
                User coachUser = coachUserMap.get(coach.getUser().getUserId());
                dto.setCoachUsername(coachUser != null ? coachUser.getUsername() : null);
            }
            dto.setScheduledTime(c.getScheduledTime());
            // Bổ sung thời gian kết thúc: endTime = scheduledTime + 2 tiếng
            if (c.getScheduledTime() != null) {
                dto.setEndTime(c.getScheduledTime().plusHours(2));
            }
            dto.setStatus(c.getStatus());
            dto.setNotes(c.getNotes());
            dto.setMeetingLink(c.getMeetingLink());
            return dto;
        }).collect(Collectors.toList());
    }


    /**
     * Lấy danh sách lịch tư vấn theo Coach.
     */
    public List<ConsultationWithUserDTO> getByCoachId(Long coachId) {
        if (!coachRepository.existsById(coachId)) {
            throw new RuntimeException("Coach not found with ID: " + coachId);
        }
        List<Consultation> consultations = consultationRepository.findByCoachId(coachId);

        // Lấy userId unique để tránh query dư thừa
        List<Long> userIds = consultations.stream()
                .map(Consultation::getUserId)
                .distinct()
                .collect(Collectors.toList());

        // Lấy map userId -> User cho nhanh
        Map<Long, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getUserId, u -> u));

        // Build DTO
        return consultations.stream().map(c -> {
            ConsultationWithUserDTO dto = new ConsultationWithUserDTO();
            dto.setConsultationId(c.getConsultationId());
            dto.setUserId(c.getUserId());
            User user = userMap.get(c.getUserId());
            dto.setUsername(user != null ? user.getUsername() : null);
            dto.setFullName(user != null ? user.getFullName() : null);

            // Bổ sung số điện thoại và email của member cho Coach xem
            dto.setPhoneNumber(user != null ? user.getPhoneNumber() : null);
            dto.setEmail(user != null ? user.getEmail() : null);

            dto.setCoachId(c.getCoachId());
            dto.setScheduledTime(c.getScheduledTime());
            // Bổ sung thời gian kết thúc: endTime = scheduledTime + 2 tiếng
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
