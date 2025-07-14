package com.example.SWP_Backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequest {
    private Long consultationId;
    private String feedback;
    private Integer rating;
    // Getter/Setter
}