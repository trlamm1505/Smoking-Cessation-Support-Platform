package com.example.SWP_Backend.dto;

import com.example.SWP_Backend.entity.Achievement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserAchievementStatusDTO {
    private Achievement achievement;
    private boolean achieved;
    private LocalDate achievedDate;

    public UserAchievementStatusDTO(Achievement achievement, boolean achieved, LocalDate achievedDate) {
        this.achievement = achievement;
        this.achieved = achieved;
        this.achievedDate = achievedDate;
    }
}


