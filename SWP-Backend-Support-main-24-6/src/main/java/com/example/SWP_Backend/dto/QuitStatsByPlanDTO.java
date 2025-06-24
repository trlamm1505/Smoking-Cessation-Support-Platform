package com.example.SWP_Backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class QuitStatsByPlanDTO {
    private Long planId;
    private String planName;
    private BigDecimal costPerPack;
    private Integer cigarettesPerDay;
    private long totalNoSmokeDays;
    private double totalMoneySaved;

    // Constructors, getters, setters

    public QuitStatsByPlanDTO() {}

    public QuitStatsByPlanDTO(Long planId, String planName, BigDecimal costPerPack, Integer cigarettesPerDay,
                              long totalNoSmokeDays, double totalMoneySaved) {
        this.planId = planId;
        this.planName = planName;
        this.costPerPack = costPerPack;
        this.cigarettesPerDay = cigarettesPerDay;
        this.totalNoSmokeDays = totalNoSmokeDays;
        this.totalMoneySaved = totalMoneySaved;
    }

    // ...getter/setter
}
