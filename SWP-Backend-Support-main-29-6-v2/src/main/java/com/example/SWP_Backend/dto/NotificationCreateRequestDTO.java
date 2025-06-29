package com.example.SWP_Backend.dto;

import lombok.Data;

/**
 * DTO cho request tạo mới thông báo
 */
@Data
public class NotificationCreateRequestDTO {
    /** Mã người nhận (userId) */
    private Long recipientId;
    /** Tiêu đề thông báo */
    private String title;
    /** Nội dung thông báo */
    private String content;
}
