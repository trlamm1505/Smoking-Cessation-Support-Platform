package com.example.SWP_Backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

/**
 * Notifications entity – đại diện cho thông báo hệ thống.
 * Dùng chung cho tất cả: member, coach, admin.
 * Cho phép gửi thông báo từ admin hoặc hệ thống tới user hoặc nhóm role.
 */
@Entity
@Table(name = "Notifications")
public class Notifications {

    /** Khóa chính tự tăng của notification */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    /** Tiêu đề thông báo (có hỗ trợ tiếng Việt) */
    @Column(nullable = false)
    @Nationalized
    private String title;

    /** Nội dung chi tiết thông báo (tiếng Việt) */
    @Column(nullable = false)
    @Nationalized
    private String content;

    /** Người gửi thông báo (admin) – liên kết tới bảng User */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SenderUserID", nullable = false)
    private User sender;

    /** Vai trò nhận: member, coach, admin, all */
    @Column(nullable = false, length = 50)
    private String targetRole;

    /** Thời gian gửi thông báo */
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ====== GETTER/SETTER, Constructors ====== //
    public Notifications() {}

    public Long getNotificationId() { return notificationId; }
    public void setNotificationId(Long notificationId) { this.notificationId = notificationId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
