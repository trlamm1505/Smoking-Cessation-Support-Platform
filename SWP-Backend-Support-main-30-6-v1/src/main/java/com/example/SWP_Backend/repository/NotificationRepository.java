package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.Notification;
import com.example.SWP_Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Lấy thông báo cho từng user (cá nhân)
    List<Notification> findByRecipientOrderByCreatedAtDesc(User user);

    // Lấy tất cả thông báo broadcast theo role
    List<Notification> findByTargetRoleOrderByCreatedAtDesc(String role);

    // Lấy thông báo chưa đọc cho user
    List<Notification> findByRecipientAndIsReadFalse(User user);

    // Lấy thông báo broadcast cho toàn bộ (targetRole = "all")
    List<Notification> findByTargetRole(String role);

    // Lấy thông báo chưa đọc cho user hoặc theo role
    List<Notification> findByRecipientAndIsReadFalseOrTargetRoleAndIsReadFalse(User user, String targetRole);

    // Thống kê số lượng thông báo chưa đọc
    Long countByRecipientAndIsReadFalse(User user);
}
