package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.MarkAsReadRequestDTO;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.dto.UserNotificationResponseDTO;
import com.example.SWP_Backend.dto.UnreadCountResponseDTO;
import com.example.SWP_Backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * RESTful API notification dùng UserNotification để lưu trạng thái đã đọc từng user.
 * FE chỉ cần call /inbox/{userId} là lấy hết cả cá nhân & broadcast, biết trạng thái đã đọc/chưa đọc.
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Gửi notification cá nhân hoặc broadcast.
     */
    @PostMapping("/send")
    public void sendNotification(@RequestBody NotificationRequestDTO dto) {
        notificationService.sendNotification(dto);
    }

    /**
     * Lấy inbox notification (cá nhân + broadcast) của user, kèm trạng thái đã đọc.
     * GET /api/notifications/inbox/{userId}
     */
    @GetMapping("/inbox/{userId}")
    public List<UserNotificationResponseDTO> getInboxForUser(@PathVariable Long userId) {
        return notificationService.getInboxForUser(userId);
    }

    /**
     * Lấy toàn bộ notification cá nhân mà user đã nhận (không lấy broadcast).
     * GET /api/notifications/user/{userId}/all
     */
    @GetMapping("/user/{userId}/all")
    public List<UserNotificationResponseDTO> getAllPersonalForUser(@PathVariable Long userId) {
        return notificationService.getAllPersonalForUser(userId);
    }

    /**
     * Lấy chi tiết 1 notification cho user.
     * GET /api/notifications/{notificationId}/user/{userId}
     */
    @GetMapping("/{notificationId}/user/{userId}")
    public UserNotificationResponseDTO getByIdForUser(@PathVariable Long notificationId, @PathVariable Long userId) {
        return notificationService.getByIdForUser(notificationId, userId);
    }

    /**
     * Đánh dấu đã đọc 1 notification cho user.
     * POST /api/notifications/mark-read
     */
    @PostMapping("/mark-read")
    public boolean markAsRead(@RequestBody MarkAsReadRequestDTO dto) {
        return notificationService.markAsRead(dto.getNotificationId(), dto.getUserId());
    }

    /**
     * Đánh dấu tất cả đã đọc cho user.
     * POST /api/notifications/mark-all-read/{userId}
     */
    @PostMapping("/mark-all-read/{userId}")
    public boolean markAllAsRead(@PathVariable Long userId) {
        return notificationService.markAllAsRead(userId);
    }

    /**
     * Đếm số chưa đọc (cá nhân + broadcast) cho user.
     * GET /api/notifications/unread-count/{userId}
     */
    @GetMapping("/unread-count/{userId}")
    public UnreadCountResponseDTO countUnread(@PathVariable Long userId) {
        return notificationService.countUnread(userId);
    }

    /**
     * Xóa notification khỏi inbox của user (không xóa khỏi hệ thống).
     * DELETE /api/notifications/{notificationId}/user/{userId}
     */
    @DeleteMapping("/{notificationId}/user/{userId}")
    public boolean deleteForUser(@PathVariable Long notificationId, @PathVariable Long userId) {
        return notificationService.deleteForUser(notificationId, userId);
    }
}
