package com.example.SWP_Backend.service;

import com.example.SWP_Backend.entity.CommunityPosts;
import com.example.SWP_Backend.entity.CommunityPostsLike;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.CommunityPostsLikeRepository;
import com.example.SWP_Backend.repository.CommunityPostsRepository;
import com.example.SWP_Backend.repository.UserRepository;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class CommunityPostsLikeService {

    @Autowired
    private CommunityPostsLikeRepository likeRepository;
    @Autowired
    private CommunityPostsRepository postRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;

    /** Thả tim bài đăng */
    public void likePost(Long postId, Long userId) {
        CommunityPosts post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (likeRepository.existsByUserAndPost(user, post)) {
            throw new RuntimeException("Already liked");
        }
        CommunityPostsLike like = new CommunityPostsLike();
        like.setPost(post);
        like.setUser(user);
        like.setLikedAt(LocalDateTime.now());
        likeRepository.save(like);

        // Gửi notification cho chủ post (trừ khi tự like bài mình)
        if (post.getAuthor() != null && !user.getUserId().equals(post.getAuthor().getUserId())) {
            NotificationRequestDTO noti = new NotificationRequestDTO();
            noti.setTitle("Bài viết của bạn được thả tim!");
            noti.setContent(user.getFullName() + " đã thả tim bài viết của bạn.");
            noti.setSenderId(user.getUserId());
            noti.setRecipientId(post.getAuthor().getUserId());
            noti.setType("post_like");
            notificationService.sendNotification(noti);
        }
    }

    /** Bỏ tim bài đăng */
    public void unlikePost(Long postId, Long userId) {
        CommunityPosts post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommunityPostsLike like = likeRepository.findByUserAndPost(user, post)
                .orElseThrow(() -> new RuntimeException("Not liked yet"));
        likeRepository.delete(like);
    }

    /** Đếm số lượt thả tim bài đăng */
    public long countLikes(Long postId) {
        CommunityPosts post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return likeRepository.countByPost(post);
    }

    /** Kiểm tra user đã like chưa */
    public boolean isLiked(Long postId, Long userId) {
        CommunityPosts post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return likeRepository.existsByUserAndPost(user, post);
    }

    /**
     * Trả về tổng số lượt thả tim (likeCount) cho một post.
     */
    public Long getLikeCountByPost(CommunityPosts post) {
        return likeRepository.countByPost(post);
    }

    /**
     * Kiểm tra user đã like bài post này chưa (dùng cho likedByCurrentUser).
     */
    public boolean isPostLikedByUser(CommunityPosts post, User user) {
        if (user == null) return false;
        return likeRepository.existsByUserAndPost(user, post);
    }
}
