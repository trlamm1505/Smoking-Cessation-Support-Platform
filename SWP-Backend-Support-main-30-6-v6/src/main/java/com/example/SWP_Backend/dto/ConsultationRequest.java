package com.example.SWP_Backend.dto;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationRequest {
    private Long userId;
    private Long coachId;
    private LocalDateTime scheduledTime; // thời gian hẹn tư vấn
    private String notes;


    // ghi chú (nếu có)
}
