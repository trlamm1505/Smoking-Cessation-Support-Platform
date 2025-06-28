package com.example.SWP_Backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ConsultationWithUserDTO {
    private Long consultationId;
    private Long userId;
    private String username;
    private String fullName;
    private Long coachId;
    private LocalDateTime scheduledTime;
    private LocalDateTime endTime; // <--- THÊM TRƯỜNG NÀY
    private String status;
    private String notes;
    private String meetingLink;
    private String phoneNumber;    // <--- THÊM
    private String email;          // <--- THÊM
}