package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.PostCommentCreateRequest;
import com.example.SWP_Backend.dto.PostCommentDTO;
import com.example.SWP_Backend.dto.PostCommentUpdateRequest;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.entity.CommunityPosts;
import com.example.SWP_Backend.entity.PostComments;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.CommunityPostsRepository;
import com.example.SWP_Backend.repository.PostCommentsRepository;
import com.example.SWP_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service xử lý bình luận bài viết cộng đồng (CommunityPosts).
 * Đã tối ưu: auto-duyệt comment, nhưng giữ lại hàm duyệt phòng hờ cho admin.
 * Tích hợp logic gửi notification khi có comment mới hoặc reply, khi report comment.
 */
@Service
public class PostCommentService {

    @Autowired
    private PostCommentsRepository postCommentsRepository;
    @Autowired
    private CommunityPostsRepository communityPostsRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;

    /**
     * Tạo mới bình luận cho bài viết cộng đồng.
     * Mặc định comment auto-duyệt (isApproved = true). Nếu muốn quản trị duyệt tay thì set false.
     */
    public PostCommentDTO createComment(PostCommentCreateRequest req) {
        // Tìm bài viết cộng đồng để gán bình luận vào
        CommunityPosts post = communityPostsRepository.findById(req.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        // Tìm user bình luận
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        PostComments comment = new PostComments();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(req.getContent());
        comment.setIsApproved(true); // Auto-duyệt
        comment.setCommentDate(LocalDateTime.now());
        comment.setUpvotes(0);
        comment.setDownvotes(0);
        comment.setDeleted(false);
        comment.setReportCount(0);

        // Nếu có parentCommentId thì đây là reply comment, ngược lại là comment gốc
        if (req.getParentCommentId() != null) {
            PostComments parent = postCommentsRepository.findById(req.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParentComment(parent);
        }

        PostComments saved = postCommentsRepository.save(comment);

        // --- Gửi Notification ---
        // 1. Gửi cho chủ bài viết nếu không phải tự mình bình luận
        if (post.getAuthor() != null && !user.getUserId().equals(post.getAuthor().getUserId())) {
            NotificationRequestDTO noti = new NotificationRequestDTO();
            noti.setTitle("Bài viết của bạn có bình luận mới");
            noti.setContent(user.getFullName() + " đã bình luận: \"" + comment.getContent() + "\"");
            noti.setSenderId(user.getUserId());
            noti.setRecipientId(post.getAuthor().getUserId());
            noti.setType("comment");
            notificationService.sendNotification(noti);
        }
        // 2. Nếu là reply, gửi cho chủ comment cha (nếu khác user)
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

    /**
     * Lấy tất cả bình luận đã duyệt của một bài viết (thực tế luôn trả về tất cả, do auto-duyệt, vẫn giữ cho phòng hờ).
     * Chỉ trả về comment chưa bị xóa mềm (isDeleted = false).
     */
    public List<PostCommentDTO> getApprovedCommentsByPost(Long postId) {
        // Lấy tất cả comment của bài viết, có thể filter theo isApproved nếu cần duyệt tay
        List<PostComments> comments = postCommentsRepository.findByPostPostIdOrderByCommentDateAsc(postId)
                .stream().filter(c -> !Boolean.TRUE.equals(c.getDeleted()))
                .collect(Collectors.toList());
        // Nếu bạn muốn filter thêm: .filter(c -> c.getIsApproved())
        return comments.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Lấy tất cả bình luận của một user (bao gồm cả đã duyệt, chưa duyệt).
     */
    public List<PostCommentDTO> getCommentsByUser(Long userId) {
        List<PostComments> comments = postCommentsRepository.findByUserUserId(userId)
                .stream().filter(c -> !Boolean.TRUE.equals(c.getDeleted()))
                .collect(Collectors.toList());
        return comments.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Duyệt comment: giữ lại để phòng trường hợp sau này muốn admin duyệt.
     * Thực tế nếu auto-duyệt thì không gọi hàm này.
     */
    public PostCommentDTO approveComment(Long commentId) {
        PostComments c = postCommentsRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        c.setIsApproved(true);
        PostComments updated = postCommentsRepository.save(c);
        return toDTO(updated);
    }

    /**
     * Chuyển entity sang DTO (giúp tách biệt dữ liệu trả về cho FE).
     */
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

    /**
     * Xóa mềm comment (chỉ chủ comment hoặc admin mới xóa được).
     */
    public void softDeleteComment(Long commentId, Long userId) {
        PostComments comment = postCommentsRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getUser().getUserId().equals(userId) /* && !isAdmin(userId) */) {
            throw new RuntimeException("No permission");
        }
        comment.setDeleted(true);
        postCommentsRepository.save(comment);
    }

    /**
     * Cập nhật nội dung bình luận (chỉ chủ comment mới được sửa).
     */
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

    /**
     * Report comment: tăng reportCount, gửi notification cho admin (role = "admin").
     */
    public void reportComment(Long commentId, Long userId) {
        PostComments comment = postCommentsRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setReportCount(comment.getReportCount() + 1);
        postCommentsRepository.save(comment);

        // Gửi notification cho admin
        NotificationRequestDTO noti = new NotificationRequestDTO();
        noti.setTitle("Có bình luận bị báo cáo vi phạm");
        noti.setContent("Bình luận ID " + commentId + " đã bị báo cáo bởi user ID " + userId);
        noti.setSenderId(userId);
        noti.setTargetRole("admin");
        noti.setType("comment_report");
        notificationService.sendNotification(noti);
    }

    /**
     * Đếm số bình luận (chưa xóa) của một bài viết cộng đồng.
     * (Chỉ tính comment chưa xóa mềm - isDeleted = false)
     */
    public long countCommentsByPost(Long postId) {
        // Sử dụng repository filter luôn isDeleted = false cho hiệu quả
        return postCommentsRepository.countByPostPostIdAndIsDeletedFalse(postId);
    }


}
