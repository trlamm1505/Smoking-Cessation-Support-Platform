package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.PostCommentCreateRequest;
import com.example.SWP_Backend.dto.PostCommentDTO;
import com.example.SWP_Backend.dto.PostCommentUpdateRequest;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.entity.BlogPosts;
import com.example.SWP_Backend.entity.PostComments;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.BlogPostsRepository;
import com.example.SWP_Backend.repository.PostCommentsRepository;
import com.example.SWP_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service xử lý bình luận BlogPosts.
 */
@Service
public class PostCommentService {

    @Autowired
    private PostCommentsRepository postCommentsRepository;
    @Autowired
    private BlogPostsRepository blogPostsRepository;
    @Autowired
    private UserRepository userRepository;

    // ===== BỔ SUNG NOTIFICATION =====
    @Autowired
    private NotificationService notificationService;

    /** Tạo mới bình luận và trả về DTO */
    public PostCommentDTO createComment(PostCommentCreateRequest req) {
        BlogPosts post = blogPostsRepository.findById(req.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        PostComments comment = new PostComments();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(req.getContent());
        comment.setIsApproved(true); // auto-duyệt, muốn duyệt tay thì set false
        comment.setCommentDate(LocalDateTime.now());
        comment.setUpvotes(0);
        comment.setDownvotes(0);

        // Xử lý parent comment (nếu có)
        if (req.getParentCommentId() != null) {
            PostComments parent = postCommentsRepository.findById(req.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParentComment(parent);
        } else {
            comment.setParentComment(null);
        }

        PostComments saved = postCommentsRepository.save(comment);

        // ===== GỬI THÔNG BÁO =====

        // 1. Gửi thông báo khi có bình luận mới cho chủ bài viết (nếu không phải tự mình bình luận bài mình)
        if (post.getAuthor() != null && post.getAuthor().getUser() != null
                && !user.getUserId().equals(post.getAuthor().getUser().getUserId())) {
            NotificationRequestDTO noti = new NotificationRequestDTO();
            noti.setTitle("Bài viết của bạn có bình luận mới");
            noti.setContent(user.getFullName() + " đã bình luận: \"" + comment.getContent() + "\"");
            noti.setSenderId(user.getUserId());
            noti.setRecipientId(post.getAuthor().getUser().getUserId());
            noti.setType("comment");
            notificationService.sendNotification(noti);
        }

        // 2. Nếu là trả lời comment, gửi cho chủ comment cha (nếu không phải mình)
        if (comment.getParentComment() != null) {
            User parentOwner = comment.getParentComment().getUser();
            if (parentOwner != null && !parentOwner.getUserId().equals(user.getUserId())) {
                NotificationRequestDTO notiReply = new NotificationRequestDTO();
                notiReply.setTitle("Có phản hồi cho bình luận của bạn");
                notiReply.setContent(user.getFullName() + " đã trả lời bình luận của bạn: \"" + comment.getContent() + "\"");
                notiReply.setSenderId(user.getUserId());
                notiReply.setRecipientId(parentOwner.getUserId());
                notiReply.setType("comment_reply");
                notificationService.sendNotification(notiReply);
            }
        }

        return toDTO(saved);
    }

    /** Khi có bài viết mới trong cộng đồng, gửi thông báo tới tất cả member */
    public void notifyNewCommunityPost(BlogPosts post) {
        // Dùng khi một bài viết cộng đồng mới được tạo
        NotificationRequestDTO noti = new NotificationRequestDTO();
        noti.setTitle("Cộng đồng có bài viết mới!");
        noti.setContent("Bài viết mới: " + post.getTitle());
        noti.setSenderId(post.getAuthor() != null && post.getAuthor().getUser() != null
                ? post.getAuthor().getUser().getUserId() : null);
        noti.setTargetRole("member");
        noti.setType("community_post");
        notificationService.sendNotification(noti);
    }

    /** Lấy bình luận theo post, chỉ lấy đã duyệt */
    public List<PostCommentDTO> getApprovedCommentsByPost(Long postId) {
        List<PostComments> comments = postCommentsRepository.findByPostPostIdAndIsApprovedTrueOrderByCommentDateAsc(postId);
        return comments.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /** Lấy tất cả bình luận của user */
    public List<PostCommentDTO> getCommentsByUser(Long userId) {
        List<PostComments> comments = postCommentsRepository.findByUserUserId(userId);
        return comments.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /** Duyệt bình luận (admin) */
    public PostCommentDTO approveComment(Long commentId) {
        PostComments c = postCommentsRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        c.setIsApproved(true);
        PostComments updated = postCommentsRepository.save(c);
        return toDTO(updated);
    }

    /** Helper chuyển entity -> DTO */
    public PostCommentDTO toDTO(PostComments c) {
        PostCommentDTO dto = new PostCommentDTO();
        dto.setCommentId(c.getCommentId());
        dto.setPostId(c.getPost().getPostId());
        dto.setUserId(c.getUser().getUserId());
        dto.setUserName(c.getUser().getFullName());
        dto.setParentCommentId(c.getParentComment() != null ? c.getParentComment().getCommentId() : null);
        dto.setContent(c.getContent());
        dto.setCommentDate(c.getCommentDate());
        dto.setIsApproved(c.getIsApproved());
        dto.setUpvotes(c.getUpvotes());
        dto.setDownvotes(c.getDownvotes());
        return dto;
    }

    public void softDeleteComment(Long commentId, Long userId) {
        PostComments comment = postCommentsRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getUser().getUserId().equals(userId) /* && !isAdmin(userId) */) {
            throw new RuntimeException("No permission");
        }
        comment.setDeleted(true);
        postCommentsRepository.save(comment);
    }

    public PostCommentDTO updateComment(Long commentId, PostCommentUpdateRequest req) {
        PostComments comment = postCommentsRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getUser().getUserId().equals(req.getUserId())) {
            throw new RuntimeException("You are not the author of this comment");
        }
        comment.setContent(req.getContent());
        comment.setLastEditedAt(LocalDateTime.now());
        postCommentsRepository.save(comment);
        return toDTO(comment);
    }

    public void reportComment(Long commentId, Long userId) {
        PostComments comment = postCommentsRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setReportCount(comment.getReportCount() + 1);
        postCommentsRepository.save(comment);

        // ===== GỬI THÔNG BÁO CHO ADMIN =====
        NotificationRequestDTO noti = new NotificationRequestDTO();
        noti.setTitle("Có bình luận bị báo cáo vi phạm");
        noti.setContent("Bình luận ID " + commentId + " đã bị báo cáo bởi user ID " + userId);
        noti.setSenderId(userId);
        noti.setTargetRole("admin");
        noti.setType("comment_report");
        notificationService.sendNotification(noti);
    }
}
