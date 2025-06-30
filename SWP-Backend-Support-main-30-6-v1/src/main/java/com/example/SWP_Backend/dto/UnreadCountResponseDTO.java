package com.example.SWP_Backend.dto;

import lombok.Data;

@Data
public class UnreadCountResponseDTO {
    private Long unreadCount;

    public UnreadCountResponseDTO(Long unreadCount) {
        this.unreadCount = unreadCount;
    }

    public Long getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(Long unreadCount) {
        this.unreadCount = unreadCount;
    }
}
