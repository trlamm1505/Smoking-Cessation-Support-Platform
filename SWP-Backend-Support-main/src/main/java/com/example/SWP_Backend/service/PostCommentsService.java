package com.example.SWP_Backend.service;

import com.example.SWP_Backend.entity.PostComments;
import com.example.SWP_Backend.repository.PostCommentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostCommentsService {
    @Autowired
    private PostCommentsRepository postCommentsRepository;

    // Create
    public PostComments createComment(PostComments comment) {
        return postCommentsRepository.save(comment);
    }

    // Read all
    public List<PostComments> getAllComments() {
        return postCommentsRepository.findAll();
    }

    // Read by ID
    public Optional<PostComments> getCommentById(Long id) {
        return postCommentsRepository.findById(id);
    }

    // Update
    public PostComments updateComment(Long id, PostComments updatedComment) {
        return postCommentsRepository.findById(id).map(comment -> {
            comment.setContent(updatedComment.getContent());
            comment.setIsApproved(updatedComment.getIsApproved());
            comment.setUpvotes(updatedComment.getUpvotes());
            comment.setDownvotes(updatedComment.getDownvotes());
            // Nếu muốn sửa Parent hoặc Post/User thì cần kiểm tra logic
            return postCommentsRepository.save(comment);
        }).orElseThrow(() -> new RuntimeException("Comment not found with id " + id));
    }

    // Delete
    public void deleteComment(Long id) {
        postCommentsRepository.deleteById(id);
    }
}
