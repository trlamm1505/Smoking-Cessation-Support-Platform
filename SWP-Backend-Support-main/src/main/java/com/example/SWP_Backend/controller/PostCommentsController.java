package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.PostCommentsDTO;
import com.example.SWP_Backend.entity.PostComments;
import com.example.SWP_Backend.service.PostCommentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller cho API quản lý bình luận bài viết (PostComments).
 */
@RestController
@RequestMapping("/api/comments")
public class PostCommentsController {

    @Autowired
    private PostCommentsService postCommentsService;

    /** Tạo mới comment, nhận entity, trả về DTO. */
    @PostMapping
    public PostCommentsDTO createComment(@RequestBody PostComments comment) {
        return postCommentsService.createComment(comment);
    }

    /** Lấy toàn bộ comment, trả về list DTO. */
    @GetMapping
    public List<PostCommentsDTO> getAllComments() {
        return postCommentsService.getAllComments();
    }

    /** Lấy comment theo ID, trả về DTO. */
    @GetMapping("/{id}")
    public PostCommentsDTO getCommentById(@PathVariable Long id) {
        return postCommentsService.getCommentById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id " + id));
    }

    /** Update comment theo ID, trả về DTO mới. */
    @PutMapping("/{id}")
    public PostCommentsDTO updateComment(@PathVariable Long id, @RequestBody PostComments comment) {
        return postCommentsService.updateComment(id, comment);
    }

    /** Xóa comment. */
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        postCommentsService.deleteComment(id);
    }
}
