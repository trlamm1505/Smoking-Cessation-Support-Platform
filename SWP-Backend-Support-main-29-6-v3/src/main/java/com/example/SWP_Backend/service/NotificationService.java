package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.NotificationCreateRequest;
import com.example.SWP_Backend.entity.Notifications;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.NotificationsRepository;
import com.example.SWP_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Service xử lý logic cho Notifications.
 */
@Service
public class NotificationService {

    @Autowired
    private NotificationsRepository notificationsRepository;

    @Autowired
    private UserRepository userRepository;

    /** Gửi thông báo mới */
    public Notifications createNotification(NotificationCreateRequest request) {
        User sender = userRepository.findById(request.getSenderUserId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Notifications n = new Notifications();
        n.setTitle(request.getTitle());
        n.setContent(request.getMessage());
        n.setTargetRole(request.getTargetRole());
        n.setSender(sender);
        n.setCreatedAt(java.time.LocalDateTime.now());
        return notificationsRepository.save(n);
    }

    /** Lấy tất cả thông báo gửi cho role nhất định (vd: member, coach, admin) hoặc cho tất cả (all) */
    public List<Notifications> getNotificationsForRole(String role) {
        // Lấy thông báo gửi cho riêng role và thông báo gửi cho all
        List<String> roles = Arrays.asList(role, "all");
        return notificationsRepository.findByTargetRoleInOrderByCreatedAtDesc(roles);
    }

    /** Lấy tất cả thông báo đã gửi bởi 1 user (thường là admin) */
    public List<Notifications> getNotificationsBySender(Long senderId) {
        return notificationsRepository.findBySenderUserIdOrderByCreatedAtDesc(senderId);
    }

    /** Lấy chi tiết 1 thông báo */
    public Optional<Notifications> getById(Long id) {
        return notificationsRepository.findById(id);
    }
}
