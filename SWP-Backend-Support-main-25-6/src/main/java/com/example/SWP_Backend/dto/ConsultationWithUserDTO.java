package com.example.SWP_Backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ConsultationWithUserDTO {
    private Long consultationId;
    private Long userId;
    private String username;   // Thêm trường này
    private String fullName;   // Có thể thêm luôn nếu muốn
    private Long coachId;
    private LocalDateTime scheduledTime;
    private String status;
    private String notes;
    private String meetingLink;
}