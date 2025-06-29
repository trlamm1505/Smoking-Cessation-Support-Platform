package com.example.SWP_Backend.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO cho Notifications – trả về dữ liệu thông báo cho FE
 */
@Data
@Getter
@Setter
public class NotificationResponseDTO {
    /** Mã thông báo */
    private Long notificationId;
    /** Mã người nhận (userId) */
    private Long recipientId;
    /** Tiêu đề thông báo */
    private String title;
    /** Nội dung thông báo */
    private String content;
    /** Trạng thái đã đọc hay chưa */
    private Boolean isRead;
    /** Ngày gửi thông báo (chuỗi định dạng) */
    private String createdAt;
}
