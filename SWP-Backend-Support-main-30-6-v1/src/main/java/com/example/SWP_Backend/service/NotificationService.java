package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.NotificationMapper;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.dto.NotificationResponseDTO;
import com.example.SWP_Backend.dto.UnreadCountResponseDTO;
import com.example.SWP_Backend.entity.Notification;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.NotificationRepository;
import com.example.SWP_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service xử lý logic notification, dùng cho các API của NotificationController.
 * Bao gồm: gửi thông báo, lấy thông báo cho user (cá nhân + broadcast), đánh dấu đã đọc, đếm chưa đọc, xóa, v.v.
 */
@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Gửi 1 thông báo (cá nhân hoặc broadcast role).
     * Nếu recipientId != null thì gửi cho user cụ thể. Nếu targetRole != null thì gửi broadcast.
     */
    public NotificationResponseDTO sendNotification(NotificationRequestDTO dto) {
        Notification notification = new Notification();
        notification.setTitle(dto.getTitle());
        notification.setContent(dto.getContent());
        notification.setType(dto.getType());
        notification.setTargetRole(dto.getTargetRole());
        notification.setRead(false);

        // Gửi cá nhân
        if (dto.getRecipientId() != null) {
            User recipient = userRepository.findById(dto.getRecipientId()).orElse(null);
            notification.setRecipient(recipient);
        } else {
            notification.setRecipient(null);
        }

        // Người gửi (có thể là hệ thống)
        if (dto.getSenderId() != null) {
            User sender = userRepository.findById(dto.getSenderId()).orElse(null);
            notification.setSender(sender);
        } else {
            notification.setSender(null);
        }

        Notification saved = notificationRepository.save(notification);
        return NotificationMapper.toDTO(saved);
    }

    /**
     * Lấy toàn bộ thông báo cho user (cá nhân + broadcast theo role).
     * Phù hợp khi cần truyền role cụ thể (member, coach, admin...).
     */
    public List<NotificationResponseDTO> getAllForUser(Long userId, String userRole) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return Collections.emptyList();
        User user = userOpt.get();

        List<Notification> personal = notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
        List<Notification> broadcastRole = notificationRepository.findByTargetRoleOrderByCreatedAtDesc(userRole);
        List<Notification> broadcastAll = notificationRepository.findByTargetRoleOrderByCreatedAtDesc("all");

        Set<Long> seenIds = new HashSet<>();
        List<Notification> merged = new ArrayList<>();
        for (Notification n : personal) if (seenIds.add(n.getId())) merged.add(n);
        for (Notification n : broadcastRole) if (seenIds.add(n.getId())) merged.add(n);
        for (Notification n : broadcastAll) if (seenIds.add(n.getId())) merged.add(n);

        merged.sort(Comparator.comparing(Notification::getCreatedAt).reversed());
        return merged.stream().map(NotificationMapper::toDTO).collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết notification theo user (chỉ trả về nếu đúng người nhận hoặc broadcast hợp lệ).
     */
    public NotificationResponseDTO getByIdForUser(Long notificationId, Long userId) {
        Optional<Notification> notiOpt = notificationRepository.findById(notificationId);
        if (notiOpt.isEmpty()) return null;
        Notification n = notiOpt.get();
        // Kiểm tra quyền
        if (n.getRecipient() != null && !n.getRecipient().getUserId().equals(userId)) return null;
        return NotificationMapper.toDTO(n);
    }

    /**
     * Đánh dấu 1 notification là đã đọc (chỉ cho phép chủ nhận).
     */
    public boolean markAsRead(Long notificationId, Long userId) {
        Optional<Notification> notiOpt = notificationRepository.findById(notificationId);
        if (notiOpt.isEmpty()) return false;
        Notification notification = notiOpt.get();
        if (notification.getRecipient() != null && !notification.getRecipient().getUserId().equals(userId)) {
            return false;
        }
        notification.setRead(true);
        notificationRepository.save(notification);
        return true;
    }

    /**
     * Đánh dấu tất cả notification cá nhân là đã đọc cho user.
     * (Broadcast nếu muốn trạng thái đã đọc riêng từng user thì cần bảng trung gian.)
     */
    public boolean markAllAsRead(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return false;
        User user = userOpt.get();
        List<Notification> personal = notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
        for (Notification n : personal) {
            if (!n.isRead()) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        }
        return true;
    }

    /**
     * Đếm số notification cá nhân chưa đọc.
     */
    public UnreadCountResponseDTO countUnread(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return new UnreadCountResponseDTO(0L);
        Long count = notificationRepository.countByRecipientAndIsReadFalse(user);
        return new UnreadCountResponseDTO(count);
    }

    /**
     * Xóa notification cá nhân của user (không xóa broadcast).
     */
    public boolean deleteForUser(Long notificationId, Long userId) {
        Optional<Notification> notiOpt = notificationRepository.findById(notificationId);
        if (notiOpt.isEmpty()) return false;
        Notification n = notiOpt.get();
        if (n.getRecipient() == null || !n.getRecipient().getUserId().equals(userId)) {
            return false;
        }
        notificationRepository.delete(n);
        return true;
    }

    /**
     * Lấy toàn bộ notification cá nhân của user (không lấy broadcast).
     */
    public List<NotificationResponseDTO> getAllPersonalForUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return Collections.emptyList();
        User user = userOpt.get();
        List<Notification> personal = notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
        return personal.stream().map(NotificationMapper::toDTO).collect(Collectors.toList());
    }

    /**
     * Lấy tất cả notification cho user (cá nhân + broadcast cho role hiện tại).
     * Đây là API thường dùng nhất, KHÔNG cần truyền role.
     */
    public List<NotificationResponseDTO> getInboxForUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return Collections.emptyList();
        User user = userOpt.get();

        List<Notification> personal = notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
        String currentRole = user.getRole();
        List<Notification> broadcastRole = notificationRepository.findByTargetRoleOrderByCreatedAtDesc(currentRole);
        List<Notification> broadcastAll = notificationRepository.findByTargetRoleOrderByCreatedAtDesc("all");

        Set<Long> seenIds = new HashSet<>();
        List<Notification> all = new ArrayList<>();
        for (Notification n : personal) if (seenIds.add(n.getId())) all.add(n);
        for (Notification n : broadcastRole) if (seenIds.add(n.getId())) all.add(n);
        for (Notification n : broadcastAll) if (seenIds.add(n.getId())) all.add(n);

        all.sort(Comparator.comparing(Notification::getCreatedAt).reversed());
        return all.stream().map(NotificationMapper::toDTO).collect(Collectors.toList());
    }
}
