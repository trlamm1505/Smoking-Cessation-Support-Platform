package com.example.SWP_Backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserAchievementSummaryDTO {
    private Long userId;
    private String fullName;
    private String avatarUrl;
    private int achievementCount;
    private long noSmokeDays;
    private double moneySaved;

    // Constructors
    public UserAchievementSummaryDTO() {}

    public UserAchievementSummaryDTO(Long userId, String fullName, String avatarUrl,
                                     int achievementCount, long noSmokeDays, double moneySaved) {
        this.userId = userId;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.achievementCount = achievementCount;
        this.noSmokeDays = noSmokeDays;
        this.moneySaved = moneySaved;
    }

    // Getters & Setters...
    // (Giữ nguyên như mẫu cũ, hoặc dùng Lombok cũng được)
}