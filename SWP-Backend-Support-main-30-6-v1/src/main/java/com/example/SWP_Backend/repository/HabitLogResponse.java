package com.example.SWP_Backend.repository;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class HabitLogResponse {
    private Long id;
    private Long userId;
    private LocalDate logDate;
    private Boolean smokedToday;
    private Integer cigarettesSmoked;
    private Integer cravingsLevel;
    private String mood;
    private String notes;
    private double moneySaved;
    private Long cessationPlanId;
    // ...getter/setter
}
