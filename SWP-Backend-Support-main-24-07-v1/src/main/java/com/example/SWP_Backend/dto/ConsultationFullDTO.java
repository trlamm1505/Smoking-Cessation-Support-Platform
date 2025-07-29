package com.example.SWP_Backend.dto;

import java.time.LocalDateTime;

/**
 * DTO trả về thông tin đầy đủ của một cuộc tư vấn (Consultation) giữa User và Coach,
 * dùng chủ yếu cho admin hoặc các màn hình quản lý tổng hợp.
 */
public class ConsultationFullDTO {
    private Long userId;             // ID của thành viên đặt lịch tư vấn
    private Long coachId;            // ID của huấn luyện viên nhận lịch tư vấn
    private Long consultationId;     // ID của cuộc tư vấn (primary key)
    private String userFullName;     // Họ tên của member đặt lịch
    private String coachName;        // Họ tên huấn luyện viên
    private LocalDateTime scheduledTime; // Thời gian hẹn tư vấn (giờ bắt đầu)
    private LocalDateTime endTime;       // Thời gian kết thúc thực tế tư vấn
    private String feedback;             // Phản hồi/nhận xét của member sau buổi tư vấn
    private Integer feedbackRating;      // Số sao/hạng điểm đánh giá (VD: 1-5)
    private String status;               // Trạng thái: pending, approved, completed, rejected, cancelled...
    private String notes;                // Ghi chú thêm cho buổi tư vấn (do user/coach nhập)
    private String meetingLink;          // Link phòng họp (Google Meet hoặc channelName của Agora)

    // Constructor mặc định
    public ConsultationFullDTO() {}

    // Getter & Setter cho từng trường

    // Lấy ID cuộc tư vấn
    public Long getConsultationId() {
        return consultationId;
    }

    public void setConsultationId(Long consultationId) {
        this.consultationId = consultationId;
    }

    // Lấy tên member
    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    // Lấy tên coach
    public String getCoachName() {
        return coachName;
    }

    public void setCoachName(String coachName) {
        this.coachName = coachName;
    }

    // Lấy thời gian bắt đầu
    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    // Lấy thời gian kết thúc thực tế
    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    // Lấy nội dung feedback
    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    // Lấy số điểm đánh giá
    public Integer getFeedbackRating() {
        return feedbackRating;
    }

    public void setFeedbackRating(Integer feedbackRating) {
        this.feedbackRating = feedbackRating;
    }

    // Lấy trạng thái hiện tại của lịch tư vấn
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Lấy ghi chú
    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    // Lấy link họp (Google Meet hoặc Agora)
    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    // Lấy userId
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // Lấy coachId
    public Long getCoachId() {
        return coachId;
    }

    public void setCoachId(Long coachId) {
        this.coachId = coachId;
    }
}
