package com.example.SWP_Backend.dto;

import com.example.SWP_Backend.entity.Achievement;
import lombok.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class AchievementStatusDTO {
    private Achievement achievement;
    private boolean achieved;
    private LocalDate achievedDate;
}
