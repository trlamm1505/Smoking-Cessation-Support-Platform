package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.CommunityPostsDTO;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.entity.CommunityPosts;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.CommunityPostsRepository;
import com.example.SWP_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service quản lý CommunityPosts – đã tích hợp trả về số lượt like và trạng thái đã like.
 */
@Service
public class CommunityPostsService {

    @Autowired
    private CommunityPostsRepository communityPostsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommunityPostsLikeService communityPostsLikeService;

    @Autowired
    private NotificationService notificationService;

    public Optional<CommunityPosts> getEntityById(Long id) {
        return communityPostsRepository.findById(id);
    }

    // --- Tạo mới bài viết ---
    public CommunityPostsDTO createCommunityPost(CommunityPosts post) {
        CommunityPosts saved = communityPostsRepository.save(post);

        // Gửi notification cho tất cả user (hoặc vai trò cụ thể)
        NotificationRequestDTO noti = new NotificationRequestDTO();
        noti.setTitle("Bài viết mới trong cộng đồng!");
        noti.setContent(saved.getAuthor().getFullName() + " vừa chia sẻ: " + saved.getTitle());
        noti.setSenderId(saved.getAuthor().getUserId());
        noti.setTargetRole("all");
        noti.setType("community");
        notificationService.sendNotification(noti);

        return toDTO(saved, null); // Tạo bài mới chưa cần truyền userId
    }

    // --- Lấy tất cả bài (dùng cho admin, hoặc public nếu cần) ---
    public List<CommunityPostsDTO> getAllCommunityPosts(Long currentUserId) {
        return communityPostsRepository.findAll()
                .stream()
                .map(post -> toDTO(post, currentUserId))
                .collect(Collectors.toList());
    }

    // --- Lấy bài theo ID ---
    public Optional<CommunityPostsDTO> getCommunityPostById(Long id, Long currentUserId) {
        return communityPostsRepository.findById(id)
                .map(post -> toDTO(post, currentUserId));
    }

    // --- Update bài viết ---
    public CommunityPostsDTO updateCommunityPost(Long id, CommunityPosts updated) {
        return communityPostsRepository.findById(id).map(post -> {
            post.setTitle(updated.getTitle());
            post.setContent(updated.getContent());
            post.setFeaturedImageURL(updated.getFeaturedImageURL());
            post.setBadges(updated.getBadges());
            post.setStatus(updated.getStatus());
            post.setLastModifiedDate(updated.getLastModifiedDate());
            CommunityPosts saved = communityPostsRepository.save(post);
            return toDTO(saved, null);
        }).orElseThrow(() -> new RuntimeException("CommunityPost not found with id " + id));
    }

    // --- Lấy tất cả bài đã duyệt (published) ---
    public List<CommunityPostsDTO> getAllPublishedPosts(Long currentUserId) {
        return communityPostsRepository.findByStatusOrderByPublishDateDesc("published")
                .stream()
                .map(post -> toDTO(post, currentUserId))
                .collect(Collectors.toList());
    }

    // --- Lấy tất cả bài chưa bị xóa (cho admin) ---
    public List<CommunityPostsDTO> getAllVisiblePostsForAdmin(Long currentUserId) {
        return communityPostsRepository.findByStatusNot("deleted")
                .stream()
                .map(post -> toDTO(post, currentUserId))
                .collect(Collectors.toList());
    }

    // --- Xóa bài ---
    public void deleteCommunityPost(Long id) {
        communityPostsRepository.deleteById(id);
    }

    // --- Cập nhật trạng thái bài ---
    public CommunityPostsDTO updateStatus(Long id, String status) {
        return communityPostsRepository.findById(id).map(post -> {
            post.setStatus(status);
            post.setLastModifiedDate(LocalDateTime.now());
            CommunityPosts saved = communityPostsRepository.save(post);
            return toDTO(saved, null);
        }).orElseThrow(() -> new RuntimeException("CommunityPost not found with id " + id));
    }

    // --- Convert Entity -> DTO, bổ sung likeCount & likedByCurrentUser ---
    public CommunityPostsDTO toDTO(CommunityPosts post, Long currentUserId) {
        CommunityPostsDTO dto = new CommunityPostsDTO();
        dto.setPostId(post.getPostId());
        dto.setAuthorId(post.getAuthor() != null ? post.getAuthor().getUserId() : null);
        dto.setAuthorName(post.getAuthor() != null ? post.getAuthor().getFullName() : null);
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setFeaturedImageURL(post.getFeaturedImageURL());
        dto.setPublishDate(post.getPublishDate() != null ? post.getPublishDate().toString() : null);
        dto.setBadges(post.getBadges());
        dto.setViews(post.getViews());
        dto.setStatus(post.getStatus());

        // --- Số lượt like ---
        dto.setLikeCount(communityPostsLikeService.getLikeCountByPost(post));

        // --- Trạng thái đã like ---
        if (currentUserId != null) {
            User user = userRepository.findById(currentUserId).orElse(null);
            dto.setLikedByCurrentUser(communityPostsLikeService.isPostLikedByUser(post, user));
        } else {
            dto.setLikedByCurrentUser(false); // Nếu không truyền userId (FE chưa login)
        }
        return dto;
    }

    // --- Để giữ compatibility với các method cũ không truyền userId ---
    public CommunityPostsDTO toDTO(CommunityPosts post) {
        return toDTO(post, null);
    }
}
