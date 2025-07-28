package com.example.SWP_Backend.dto;

public class EndConsultationRequest {
    private String feedback;
    private Integer feedbackRating;

    // Constructors
    public EndConsultationRequest() {}

    public EndConsultationRequest(String feedback, Integer feedbackRating) {
        this.feedback = feedback;
        this.feedbackRating = feedbackRating;
    }

    // Getters and setters
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public Integer getFeedbackRating() { return feedbackRating; }
    public void setFeedbackRating(Integer feedbackRating) { this.feedbackRating = feedbackRating; }
}
