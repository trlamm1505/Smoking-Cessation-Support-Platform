package com.example.SWP_Backend.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class ConsultationDetailDTO {
    private Long consultationId;
    private Long userId;
    private String username; // Member đặt lịch
    private String userFullName;
    private String userPhoneNumber; // số điện thoại của member
    private String userEmail;       // email của member
    private LocalDateTime endTime;  // thời gian kết thúc (scheduledTime + 2h)

    private Long coachId;
    private String coachName;    // tên Coach (Coach.fullName hoặc Coach.user.fullName)
    private String coachUsername; // username Coach
    private String coachSpecialization;

    private LocalDateTime scheduledTime;
    private String status;
    private String notes;
    private String meetingLink;

    private String feedback;
    private Integer feedbackRating;

// Getter/Setter...

}
