package com.example.SWP_Backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@Setter

public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nationalized
    @Column(nullable = false)
    private String title;

    @Nationalized
    @Column(nullable = false)
    private String content;

    @Column(length = 100)
    private String type;

    @Column(name = "target_role", length = 50)
    private String targetRole; // "member", "coach", "admin", "all", null nếu gửi cá nhân

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id")
    private User recipient; // Có thể null nếu là broadcast theo role

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_user_id")
    private User sender; // Người gửi, có thể là hệ thống, admin, coach, null nếu hệ thống tự động

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    // Constructors
    public Notification() {}

    public Notification(String title, String content, String type, String targetRole, User recipient, User sender) {
        this.title = title;
        this.content = content;
        this.type = type;
        this.targetRole = targetRole;
        this.recipient = recipient;
        this.sender = sender;
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }

    // GETTER & SETTER ...

    // Nên sinh getter/setter tự động hoặc dùng Lombok để gọn hơn
}
