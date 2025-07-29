package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.NotificationMapper;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.dto.NotificationResponseDTO;
import com.example.SWP_Backend.dto.UnreadCountResponseDTO;
import com.example.SWP_Backend.dto.UserNotificationResponseDTO;
import com.example.SWP_Backend.entity.Notification;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.entity.UserNotification;
import com.example.SWP_Backend.repository.NotificationRepository;
import com.example.SWP_Backend.repository.UserNotificationRepository;
import com.example.SWP_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service notification – đã chuẩn hóa sử dụng bảng trung gian UserNotification để lưu trạng thái đã đọc cho cả broadcast và cá nhân.
 * Chức năng chính: gửi thông báo, lấy inbox, đánh dấu đã đọc, xóa, đếm chưa đọc.
 */
@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    /**
     * Gửi notification: nếu recipientId thì gửi cá nhân, nếu targetRole thì broadcast tới role,
     * nếu targetRole = "all" thì gửi broadcast cho tất cả.
     * - Mỗi thông báo sẽ tạo bản ghi notification gốc + từng bản ghi userNotification cho từng user.
     */
    public NotificationResponseDTO sendNotification(NotificationRequestDTO dto) {
        // Tạo bản ghi notification gốc (chưa gắn user cụ thể)
        Notification notification = new Notification();
        notification.setTitle(dto.getTitle());
        notification.setContent(dto.getContent());
        notification.setType(dto.getType());
        notification.setTargetRole(dto.getTargetRole());

        // Gắn sender nếu có
        if (dto.getSenderId() != null) {
            User sender = userRepository.findById(dto.getSenderId()).orElse(null);
            notification.setSender(sender);
        } else {
            notification.setSender(null);
        }

        Notification saved = notificationRepository.save(notification);

        // 1. Gửi cá nhân: recipientId != null
        if (dto.getRecipientId() != null) {
            User recipient = userRepository.findById(dto.getRecipientId()).orElse(null);
            if (recipient != null) {
                UserNotification userNoti = new UserNotification();
                userNoti.setUser(recipient);
                userNoti.setNotification(saved);
                userNoti.setRead(false);
                userNotificationRepository.save(userNoti);
            }
        }
        // 2. Broadcast: gửi tới toàn bộ user của 1 role cụ thể (vd: admin, coach, guest,...)
        else if (dto.getTargetRole() != null) {
            List<User> targetUsers = userRepository.findByRole(dto.getTargetRole());
            for (User u : targetUsers) {
                UserNotification userNoti = new UserNotification();
                userNoti.setUser(u);
                userNoti.setNotification(saved);
                userNoti.setRead(false);
                userNotificationRepository.save(userNoti);
            }
        }
        // 3. Broadcast all: targetRole = "all"
        else if ("all".equalsIgnoreCase(dto.getTargetRole())) {
            List<User> allUsers = userRepository.findAll();
            for (User u : allUsers) {
                UserNotification userNoti = new UserNotification();
                userNoti.setUser(u);
                userNoti.setNotification(saved);
                userNoti.setRead(false);
                userNotificationRepository.save(userNoti);
            }
        }

        // Trả về DTO notification cho frontend
        return NotificationMapper.toDTO(saved);
    }

    /**
     * Lấy toàn bộ notification của user (bao gồm broadcast + cá nhân),
     * trả về kèm trạng thái đã đọc/chưa đọc và thời điểm đọc.
     */
    public List<UserNotificationResponseDTO> getInboxForUser(Long userId) {
        // Lấy danh sách userNotification liên quan tới user (mới nhất trước)
        List<UserNotification> userNotis = userNotificationRepository.findByUserUserIdOrderByNotificationCreatedAtDesc(userId);
        return userNotis.stream().map(un -> {
            UserNotificationResponseDTO dto = new UserNotificationResponseDTO();
            dto.setNotification(NotificationMapper.toDTO(un.getNotification()));
            dto.setRead(un.isRead());
            dto.setReadAt(un.getReadAt());
            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết 1 notification cho user (xem nội dung, trạng thái đọc).
     */
    public UserNotificationResponseDTO getByIdForUser(Long notificationId, Long userId) {
        Optional<UserNotification> unOpt = userNotificationRepository.findByUserUserIdAndNotificationId(userId, notificationId);
        if (unOpt.isEmpty()) return null;
        UserNotification un = unOpt.get();
        UserNotificationResponseDTO dto = new UserNotificationResponseDTO();
        dto.setNotification(NotificationMapper.toDTO(un.getNotification()));
        dto.setRead(un.isRead());
        dto.setReadAt(un.getReadAt());
        return dto;
    }

    /**
     * Đánh dấu đã đọc cho 1 notification cụ thể (cập nhật trường read, readAt).
     */
    public boolean markAsRead(Long notificationId, Long userId) {
        Optional<UserNotification> unOpt = userNotificationRepository.findByUserUserIdAndNotificationId(userId, notificationId);
        if (unOpt.isEmpty()) return false;
        UserNotification un = unOpt.get();
        if (!un.isRead()) {
            un.setRead(true);
            un.setReadAt(LocalDateTime.now());
            userNotificationRepository.save(un);
        }
        return true;
    }

    /**
     * Đánh dấu tất cả notification của user là đã đọc.
     */
    public boolean markAllAsRead(Long userId) {
        List<UserNotification> userNotis = userNotificationRepository.findByUserUserIdOrderByNotificationCreatedAtDesc(userId);
        for (UserNotification un : userNotis) {
            if (!un.isRead()) {
                un.setRead(true);
                un.setReadAt(LocalDateTime.now());
                userNotificationRepository.save(un);
            }
        }
        return true;
    }

    /**
     * Đếm số lượng thông báo chưa đọc của user (phục vụ badge noti giao diện).
     */
    public UnreadCountResponseDTO countUnread(Long userId) {
        Long count = userNotificationRepository.countByUserUserIdAndIsReadFalse(userId);
        return new UnreadCountResponseDTO(count);
    }

    /**
     * Xóa notification khỏi inbox của user (KHÔNG xóa notification gốc).
     * Chỉ xóa bản ghi userNotification.
     */
    public boolean deleteForUser(Long notificationId, Long userId) {
        userNotificationRepository.deleteByUserUserIdAndNotificationId(userId, notificationId);
        return true;
    }

    /**
     * Lấy tất cả thông báo cá nhân đã gửi cho user này (KHÔNG gồm broadcast).
     * Kèm trạng thái đã đọc/chưa đọc.
     */
    public List<UserNotificationResponseDTO> getAllPersonalForUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return Collections.emptyList();
        User user = userOpt.get();

        // Lấy tất cả notification chỉ gửi cho 1 user (cột recipient)
        List<Notification> personalList = notificationRepository.findByRecipientOrderByCreatedAtDesc(user);

        // Map sang DTO, trạng thái read lấy từ entity Notification (nếu dùng UserNotification phụ thì chỉnh lại)
        return personalList.stream()
                .map(notification -> {
                    UserNotificationResponseDTO dto = new UserNotificationResponseDTO();
                    dto.setNotification(NotificationMapper.toDTO(notification));
                    dto.setRead(notification.isRead());
                    // Nếu không có cột readAt trong entity Notification thì để null
                    dto.setReadAt(null); // Hoặc set thời điểm đọc nếu có
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
