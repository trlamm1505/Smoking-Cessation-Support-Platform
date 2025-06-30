package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.MarkAsReadRequestDTO;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.dto.NotificationResponseDTO;
import com.example.SWP_Backend.dto.UnreadCountResponseDTO;
import com.example.SWP_Backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * RESTful API quản lý notification (thông báo) cho người dùng, admin, coach.
 *
 * Các API chính:
 * - Gửi noti (POST /send)
 * - Lấy inbox cá nhân + broadcast (GET /inbox/{userId})
 * - Lấy tất cả noti (theo role, GET /user/{userId}?role=...)
 * - Lấy toàn bộ noti cá nhân (GET /all/user/{userId})
 * - Lấy chi tiết 1 noti (GET /{notificationId}/user/{userId})
 * - Đánh dấu đã đọc (POST /mark-read), đánh dấu tất cả (POST /mark-all-read/{userId})
 * - Đếm số chưa đọc (GET /unread-count/{userId})
 * - Xóa noti cá nhân (DELETE /{notificationId}/user/{userId})
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Gửi thông báo mới (cá nhân hoặc broadcast).
     * Body mẫu (JSON):
     * {
     *   "title": "Tiêu đề",
     *   "content": "Nội dung",
     *   "type": "blog" | "comment" | "achievement" | ...,
     *   "recipientId": 1,        // Nếu gửi cá nhân
     *   "targetRole": "member",  // Nếu broadcast cho role
     *   "senderId": 3
     * }
     */
    @PostMapping("/send")
    public NotificationResponseDTO sendNotification(@RequestBody NotificationRequestDTO dto) {
        return notificationService.sendNotification(dto);
    }

    /**
     * Lấy tất cả notification (cá nhân + broadcast role) cho user, truyền role hiện tại.
     * GET /api/notifications/user/{userId}?role=member
     */
    @GetMapping("/user/{userId}")
    public List<NotificationResponseDTO> getAllForUser(
            @PathVariable Long userId,
            @RequestParam String role) {
        return notificationService.getAllForUser(userId, role);
    }

    /**
     * Lấy toàn bộ notification cá nhân user từng nhận (không lấy broadcast).
     * GET /api/notifications/all/user/{userId}
     */
    @GetMapping("/all/user/{userId}")
    public List<NotificationResponseDTO> getAllPersonalForUser(@PathVariable Long userId) {
        return notificationService.getAllPersonalForUser(userId);
    }

    /**
     * Lấy chi tiết 1 notification theo user (cá nhân hoặc broadcast).
     * GET /api/notifications/{notificationId}/user/{userId}
     */
    @GetMapping("/{notificationId}/user/{userId}")
    public NotificationResponseDTO getByIdForUser(
            @PathVariable Long notificationId,
            @PathVariable Long userId) {
        return notificationService.getByIdForUser(notificationId, userId);
    }

    /**
     * Đánh dấu 1 notification là đã đọc (POST /mark-read).
     * Body:
     * {
     *   "notificationId": 99,
     *   "userId": 12
     * }
     */
    @PostMapping("/mark-read")
    public boolean markAsRead(@RequestBody MarkAsReadRequestDTO dto) {
        return notificationService.markAsRead(dto.getNotificationId(), dto.getUserId());
    }

    /**
     * Đánh dấu tất cả notification cá nhân của user là đã đọc.
     * POST /api/notifications/mark-all-read/{userId}
     */
    @PostMapping("/mark-all-read/{userId}")
    public boolean markAllAsRead(@PathVariable Long userId) {
        return notificationService.markAllAsRead(userId);
    }

    /**
     * Đếm số notification chưa đọc (cá nhân) của user.
     * GET /api/notifications/unread-count/{userId}
     */
    @GetMapping("/unread-count/{userId}")
    public UnreadCountResponseDTO countUnread(@PathVariable Long userId) {
        return notificationService.countUnread(userId);
    }

    /**
     * Xóa notification cá nhân khỏi hộp thư user.
     * DELETE /api/notifications/{notificationId}/user/{userId}
     */
    @DeleteMapping("/{notificationId}/user/{userId}")
    public boolean deleteForUser(@PathVariable Long notificationId, @PathVariable Long userId) {
        return notificationService.deleteForUser(notificationId, userId);
    }

    /**
     * Lấy tất cả notification (cá nhân + broadcast role + broadcast all) của user (KHÔNG cần truyền role).
     * ĐÂY LÀ API CHÍNH ĐỂ SHOW INBOX.
     * GET /api/notifications/inbox/{userId}
     */
    @GetMapping("/inbox/{userId}")
    public List<NotificationResponseDTO> getInboxForUser(@PathVariable Long userId) {
        return notificationService.getInboxForUser(userId);
    }
}
