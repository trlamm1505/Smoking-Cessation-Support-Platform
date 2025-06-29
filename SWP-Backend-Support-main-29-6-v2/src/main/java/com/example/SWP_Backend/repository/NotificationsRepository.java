package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationsRepository extends JpaRepository<Notifications, Long> {

    /** Lấy tất cả thông báo gửi cho 1 vai trò (member/coach/admin/all), mới nhất trước */
    List<Notifications> findByTargetRoleOrderByCreatedAtDesc(String role);

    /** Lấy tất cả thông báo gửi cho tất cả (all), mới nhất trước */
    List<Notifications> findByTargetRoleInOrderByCreatedAtDesc(List<String> roles);

    /** Lấy tất cả thông báo được gửi bởi 1 admin */
    List<Notifications> findBySenderUserIdOrderByCreatedAtDesc(Long senderId);
}
