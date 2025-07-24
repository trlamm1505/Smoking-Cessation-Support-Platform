package com.example.SWP_Backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class NotificationResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String type;
    private String targetRole;
    private Long recipientId;
    private String recipientName;   // Cho client hiển thị (tuỳ chọn)
    private Long senderId;
    private String senderName;      // Cho client hiển thị (tuỳ chọn)
    private LocalDateTime createdAt;
    private boolean isRead;

    // Constructors, Getters, Setters
}
