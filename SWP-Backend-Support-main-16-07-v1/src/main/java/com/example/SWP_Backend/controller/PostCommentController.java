package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.PostCommentCreateRequest;
import com.example.SWP_Backend.dto.PostCommentDTO;
import com.example.SWP_Backend.dto.PostCommentUpdateRequest;
import com.example.SWP_Backend.service.PostCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller cho bình luận bài viết cộng đồng.
 * Đầy đủ API tạo, lấy theo post/user, xóa mềm, sửa, duyệt phòng hờ, report.
 */
@RestController
@RequestMapping("/api/post-comments")
public class PostCommentController {

    @Autowired
    private PostCommentService postCommentService;

    /** Tạo mới bình luận */
    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody PostCommentCreateRequest req) {
        try {
            PostCommentDTO dto = postCommentService.createComment(req);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** Lấy tất cả comment của 1 bài viết (chỉ trả về comment chưa bị xóa) */
    @GetMapping("/post/{postId}")
    public List<PostCommentDTO> getCommentsByPost(@PathVariable Long postId) {
        return postCommentService.getApprovedCommentsByPost(postId);
    }

    /** Lấy tất cả comment của 1 user */
    @GetMapping("/user/{userId}")
    public List<PostCommentDTO> getCommentsByUser(@PathVariable Long userId) {
        return postCommentService.getCommentsByUser(userId);
    }

    /** Admin duyệt comment (phòng hờ, nếu có nhu cầu quản trị chặt hơn) */
    @PutMapping("/{commentId}/approve")
    public ResponseEntity<?> approveComment(@PathVariable Long commentId) {
        try {
            PostCommentDTO dto = postCommentService.approveComment(commentId);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** Xóa mềm comment (chỉ chủ comment hoặc admin mới xóa được) */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, @RequestParam Long userId) {
        postCommentService.softDeleteComment(commentId, userId);
        return ResponseEntity.ok("Deleted");
    }

    /** Sửa comment (chỉ chủ comment mới được sửa) */
    @PutMapping("/{commentId}")
    public PostCommentDTO updateComment(
            @PathVariable Long commentId,
            @RequestBody PostCommentUpdateRequest req
    ) {
        return postCommentService.updateComment(commentId, req);
    }

    /** Báo cáo comment vi phạm */
    @PostMapping("/{commentId}/report")
    public ResponseEntity<?> reportComment(
            @PathVariable Long commentId,
            @RequestParam Long userId) {
        postCommentService.reportComment(commentId, userId);
        return ResponseEntity.ok("Reported");
    }

    /**
     * API: Đếm số bình luận của một bài viết cộng đồng (chỉ tính comment chưa xóa).
     * GET /api/post-comments/count/{postId}
     */
    @GetMapping("/count/{postId}")
    public long countComments(@PathVariable Long postId) {
        return postCommentService.countCommentsByPost(postId);
    }

}
