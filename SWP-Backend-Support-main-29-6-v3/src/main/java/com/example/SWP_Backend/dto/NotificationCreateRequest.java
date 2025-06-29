package com.example.SWP_Backend.dto;

import lombok.Data;

/**
 * DTO để tạo mới thông báo (request từ FE).
 */
@Data
public class NotificationCreateRequest {
    /** Tiêu đề thông báo */
    private String title;
    /** Nội dung thông báo */
    private String message;
    /** Vai trò nhận thông báo (member/coach/admin/all) */
    private String targetRole;
    /** ID người gửi */
    private Long senderUserId;
}
