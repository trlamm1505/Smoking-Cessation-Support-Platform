package com.example.SWP_Backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO trả về thông báo (Notifications) cho FE.
 */
@Data
public class NotificationDTO {
    /** Mã thông báo */
    private Long notificationId;
    /** Tiêu đề thông báo */
    private String title;
    /** Nội dung thông báo */
    private String message;
    /** Vai trò nhận thông báo (member/coach/admin/all) */
    private String targetRole;
    /** ID người gửi (thường là admin) */
    private Long senderUserId;
    /** Tên người gửi */
    private String senderUserName;
    /** Ngày tạo */
    private LocalDateTime createdAt;
    /** Ngày đã đọc (nếu có logic đánh dấu đã đọc) */
    private LocalDateTime readAt;
}
