package com.example.SWP_Backend.dto;

import lombok.Data;

@Data
public class MarkAsReadRequestDTO {
    private Long notificationId;
    private Long userId;

    // Constructors, Getters, Setters
}
