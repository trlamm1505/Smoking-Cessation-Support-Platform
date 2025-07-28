package com.example.SWP_Backend.dto;

import lombok.Data;

@Data
public class NotificationRequestDTO {
    private String title;
    private String content;
    private String type;
    private String targetRole;      // null nếu gửi cá nhân
    private Long recipientId;       // null nếu gửi broadcast
    private Long senderId;          // null nếu hệ thống tự gửi

    // Constructors, Getters, Setters
}
