package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.entity.PostComments;
import com.example.SWP_Backend.service.PostCommentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class PostCommentsController {

    @Autowired
    private PostCommentsService postCommentsService;

    // Create
    @PostMapping
    public PostComments createComment(@RequestBody PostComments comment) {
        return postCommentsService.createComment(comment);
    }

    // Read all
    @GetMapping
    public List<PostComments> getAllComments() {
        return postCommentsService.getAllComments();
    }

    // Read by ID
    @GetMapping("/{id}")
    public PostComments getCommentById(@PathVariable Long id) {
        return postCommentsService.getCommentById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id " + id));
    }

    // Update
    @PutMapping("/{id}")
    public PostComments updateComment(@PathVariable Long id, @RequestBody PostComments comment) {
        return postCommentsService.updateComment(id, comment);
    }

    // Delete
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        postCommentsService.deleteComment(id);
    }
}
