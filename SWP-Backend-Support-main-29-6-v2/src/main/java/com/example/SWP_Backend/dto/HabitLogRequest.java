package com.example.SWP_Backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
// DTO chỉ nhận thông tin cần thiết từ FE
public class HabitLogRequest {
    private Long userId;
    private LocalDate logDate;
    private Boolean smokedToday;
    private Integer cigarettesSmoked;
    private Integer cravingsLevel;
    private String mood;
    private String notes;
    private double moneySaved;
    // Không cần cessationPlan!
    // ...getter/setter
}

