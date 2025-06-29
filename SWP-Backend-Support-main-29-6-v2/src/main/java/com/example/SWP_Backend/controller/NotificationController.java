package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.NotificationCreateRequest;
import com.example.SWP_Backend.dto.NotificationDTO;
import com.example.SWP_Backend.entity.Notifications;
import com.example.SWP_Backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /** Tạo mới thông báo (admin) */
    @PostMapping
    public Notifications createNotification(@RequestBody NotificationCreateRequest req) {
        return notificationService.createNotification(req);
    }

    /** Lấy danh sách thông báo cho 1 role (member/coach/admin), trả về cả thông báo target all */
    @GetMapping("/role/{role}")
    public List<Notifications> getNotificationsByRole(@PathVariable String role) {
        return notificationService.getNotificationsForRole(role);
    }

    /** Lấy thông báo đã gửi bởi 1 user (admin) */
    @GetMapping("/sent/{senderId}")
    public List<Notifications> getSentNotifications(@PathVariable Long senderId) {
        return notificationService.getNotificationsBySender(senderId);
    }

    /** Lấy chi tiết một thông báo */
    @GetMapping("/{id}")
    public Notifications getNotification(@PathVariable Long id) {
        return notificationService.getById(id).orElse(null);
    }
}
