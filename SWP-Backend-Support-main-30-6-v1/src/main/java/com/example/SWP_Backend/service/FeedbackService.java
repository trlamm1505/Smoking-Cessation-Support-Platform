package com.example.SWP_Backend.service;

import com.example.SWP_Backend.entity.Feedback;
import com.example.SWP_Backend.dto.FeedbackDTO;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.FeedbackRepository;
import com.example.SWP_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service xử lý logic cho Feedback, trả về DTO.
 */
@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    public Optional<Feedback> getEntityById(Long id) {
        return feedbackRepository.findById(id);
    }

    /**
     * Tạo mới feedback, trả về DTO.
     */
    public FeedbackDTO createFeedback(Feedback feedback) {
        Feedback saved = feedbackRepository.save(feedback);

        // ======= TÍCH HỢP THÔNG BÁO =======
        User sender = feedback.getUser(); // Người gửi feedback
        String senderName = sender != null ? sender.getFullName() : "Người dùng";
        String feedbackTitle = feedback.getTitle() != null ? feedback.getTitle() : "";
        String type = "feedback";
        String content = senderName + " đã gửi phản hồi: \"" + feedbackTitle + "\"";

        // 1. Thông báo cho Coach (nếu feedback target là coach)
        if ("coach".equalsIgnoreCase(feedback.getTargetType())) {
            // Gửi cho đúng coach nhận feedback (giả sử targetId là coachId, và coach có user liên kết)
            Long coachId = feedback.getTargetId();
            if (coachId != null) {
                Optional<User> coachUserOpt = userRepository.findCoachUserByCoachId(coachId); // Hàm này bạn phải có
                coachUserOpt.ifPresent(coachUser -> {
                    NotificationRequestDTO noti = new NotificationRequestDTO();
                    noti.setTitle("Bạn nhận được phản hồi mới");
                    noti.setContent(content);
                    noti.setType(type);
                    noti.setSenderId(sender != null ? sender.getUserId() : null);
                    noti.setRecipientId(coachUser.getUserId());
                    notificationService.sendNotification(noti);
                });
            }
        }

        // 2. Thông báo cho Admin (tất cả feedback đều gửi cho admin)
        NotificationRequestDTO adminNoti = new NotificationRequestDTO();
        adminNoti.setTitle("Có phản hồi mới từ người dùng");
        adminNoti.setContent(content);
        adminNoti.setType(type);
        adminNoti.setSenderId(sender != null ? sender.getUserId() : null);
        adminNoti.setTargetRole("admin"); // Gửi broadcast cho tất cả admin
        notificationService.sendNotification(adminNoti);

        return toDTO(saved);
    }

    /**
     * Lấy tất cả feedback (list DTO).
     */
    public List<FeedbackDTO> getAllFeedback() {
        return feedbackRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Lấy feedback theo ID (DTO).
     */
    public Optional<FeedbackDTO> getFeedbackById(Long id) {
        return feedbackRepository.findById(id).map(this::toDTO);
    }

    /**
     * Update feedback, trả về DTO.
     */
    public FeedbackDTO updateFeedback(Long id, Feedback updatedFeedback) {
        return feedbackRepository.findById(id).map(feedback -> {
            feedback.setTargetType(updatedFeedback.getTargetType());
            feedback.setTargetId(updatedFeedback.getTargetId());
            feedback.setRating(updatedFeedback.getRating());
            feedback.setComment(updatedFeedback.getComment());
            feedback.setTitle(updatedFeedback.getTitle());
            feedback.setRespon(updatedFeedback.getRespon());
            feedback.setStatus(updatedFeedback.getStatus());
            Feedback saved = feedbackRepository.save(feedback);
            return toDTO(saved);
        }).orElseThrow(() -> new RuntimeException("Feedback not found with id " + id));
    }

    /**
     * Xóa feedback theo id.
     */
    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }

    /**
     * Chuyển entity feedback sang DTO.
     */
    public FeedbackDTO toDTO(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setFeedbackId(feedback.getFeedbackId());
        dto.setUserId(feedback.getUser() != null ? feedback.getUser().getUserId() : null);
        dto.setUserFullName(feedback.getUser() != null ? feedback.getUser().getFullName() : null);
        dto.setTargetType(feedback.getTargetType());
        dto.setTargetId(feedback.getTargetId());
        dto.setRating(feedback.getRating());
        dto.setComment(feedback.getComment());
        dto.setSubmissionDate(feedback.getSubmissionDate() != null ? feedback.getSubmissionDate().toString() : null);
        dto.setTitle(feedback.getTitle());
        dto.setRespon(feedback.getRespon());
        dto.setStatus(feedback.getStatus());
        return dto;
    }
}
