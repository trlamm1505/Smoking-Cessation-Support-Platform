package com.example.SWP_Backend.dto;

import java.time.LocalDateTime;

public class ConsultationSummaryDTO {
    private String userFullName;
    private String coachName;
    private LocalDateTime scheduledTime;
    private LocalDateTime endTime;
    private String feedback;
    private Integer feedbackRating;

    // --- Getter & Setter ---
    public String getUserFullName() {
        return userFullName;
    }
    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }
    public String getCoachName() {
        return coachName;
    }
    public void setCoachName(String coachName) {
        this.coachName = coachName;
    }
    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }
    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }
    public LocalDateTime getEndTime() {
        return endTime;
    }
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    public String getFeedback() {
        return feedback;
    }
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
    public Integer getFeedbackRating() {
        return feedbackRating;
    }
    public void setFeedbackRating(Integer feedbackRating) {
        this.feedbackRating = feedbackRating;
    }
}
