package com.example.SWP_Backend.service;

import com.example.SWP_Backend.entity.Feedback;
import com.example.SWP_Backend.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    // Create
    public Feedback createFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    // Read all
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    // Read by ID
    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    // Update
    public Feedback updateFeedback(Long id, Feedback updatedFeedback) {
        return feedbackRepository.findById(id).map(feedback -> {
            feedback.setTargetType(updatedFeedback.getTargetType());
            feedback.setTargetId(updatedFeedback.getTargetId());
            feedback.setRating(updatedFeedback.getRating());
            feedback.setComment(updatedFeedback.getComment());
            feedback.setTitle(updatedFeedback.getTitle());
            feedback.setRespon(updatedFeedback.getRespon());
            feedback.setStatus(updatedFeedback.getStatus());
            // Có thể cập nhật các trường khác nếu muốn
            return feedbackRepository.save(feedback);
        }).orElseThrow(() -> new RuntimeException("Feedback not found with id " + id));
    }

    // Delete
    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }
}
