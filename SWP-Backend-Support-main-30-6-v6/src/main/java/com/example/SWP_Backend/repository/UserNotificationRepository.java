package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {
    List<UserNotification> findByUserUserIdOrderByNotificationCreatedAtDesc(Long userId);
    Optional<UserNotification> findByUserUserIdAndNotificationId(Long userId, Long notificationId);
    Long countByUserUserIdAndIsReadFalse(Long userId);
    void deleteByUserUserIdAndNotificationId(Long userId, Long notificationId);
}
