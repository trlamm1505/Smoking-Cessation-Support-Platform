package com.example.SWP_Backend.dto;

import com.example.SWP_Backend.dto.NotificationResponseDTO;
import com.example.SWP_Backend.entity.Notification;

public class NotificationMapper {
    public static NotificationResponseDTO toDTO(Notification notification) {
        if (notification == null) return null;
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setContent(notification.getContent());
        dto.setType(notification.getType());
        dto.setTargetRole(notification.getTargetRole());
        // Sửa getId() => getUserId()
        dto.setRecipientId(notification.getRecipient() != null ? notification.getRecipient().getUserId() : null);
        dto.setRecipientName(notification.getRecipient() != null ? notification.getRecipient().getFullName() : null);
        dto.setSenderId(notification.getSender() != null ? notification.getSender().getUserId() : null);
        dto.setSenderName(notification.getSender() != null ? notification.getSender().getFullName() : null);
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setRead(notification.isRead());
        return dto;
    }
}
