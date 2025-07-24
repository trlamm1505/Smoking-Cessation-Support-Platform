package com.example.SWP_Backend.dto;

import com.example.SWP_Backend.dto.NotificationResponseDTO;
import java.time.LocalDateTime;

/**
 * DTO trả về notification cùng trạng thái đã đọc/chưa đọc
 */
public class UserNotificationResponseDTO {
    private NotificationResponseDTO notification;
    private boolean isRead;
    private LocalDateTime readAt;

    // Getter/setter
    public NotificationResponseDTO getNotification() { return notification; }
    public void setNotification(NotificationResponseDTO notification) { this.notification = notification; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
}
