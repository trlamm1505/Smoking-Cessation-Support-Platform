package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.PostCommentCreateRequest;
import com.example.SWP_Backend.dto.PostCommentDTO;
import com.example.SWP_Backend.dto.PostCommentEditRequest;
import com.example.SWP_Backend.dto.PostCommentUpdateRequest;
import com.example.SWP_Backend.entity.PostComments;
import com.example.SWP_Backend.service.PostCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST cho bình luận bài viết cộng đồng/blog.
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

    /** Lấy bình luận của 1 bài viết (chỉ trả về đã duyệt) */
    @GetMapping("/post/{postId}")
    public List<PostCommentDTO> getCommentsByPost(@PathVariable Long postId) {
        return postCommentService.getApprovedCommentsByPost(postId);
    }

    /** Lấy bình luận của 1 user */
    @GetMapping("/user/{userId}")
    public List<PostCommentDTO> getCommentsByUser(@PathVariable Long userId) {
        return postCommentService.getCommentsByUser(userId);
    }

    /** Duyệt bình luận (admin) */
    @PutMapping("/{commentId}/approve")
    public ResponseEntity<?> approveComment(@PathVariable Long commentId) {
        try {
            PostCommentDTO dto = postCommentService.approveComment(commentId);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, @RequestParam Long userId) {
        postCommentService.softDeleteComment(commentId, userId);
        return ResponseEntity.ok("Deleted");
    }

    @PutMapping("/{commentId}")
    public PostCommentDTO updateComment(
            @PathVariable Long commentId,
            @RequestBody PostCommentUpdateRequest req
    ) {
        return postCommentService.updateComment(commentId, req);
    }



    @PostMapping("/{commentId}/report")
    public ResponseEntity<?> reportComment(
            @PathVariable Long commentId,
            @RequestParam Long userId) {
        postCommentService.reportComment(commentId, userId);
        return ResponseEntity.ok("Reported");
    }

}
