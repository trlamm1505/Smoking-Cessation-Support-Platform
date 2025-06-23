package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.FeedbackDTO;
import com.example.SWP_Backend.entity.Feedback;
import com.example.SWP_Backend.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller cho API quản lý Feedback.
 */
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    /** Tạo mới feedback, trả về DTO. */
    @PostMapping
    public FeedbackDTO createFeedback(@RequestBody Feedback feedback) {
        return feedbackService.createFeedback(feedback);
    }

    /** Lấy toàn bộ feedback, trả về list DTO. */
    @GetMapping
    public List<FeedbackDTO> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    /** Lấy feedback theo ID, trả về DTO. */
    @GetMapping("/{id}")
    public FeedbackDTO getFeedbackById(@PathVariable Long id) {
        return feedbackService.getFeedbackById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id " + id));
    }

    /** Update feedback theo ID, trả về DTO mới. */
    @PutMapping("/{id}")
    public FeedbackDTO updateFeedback(@PathVariable Long id, @RequestBody Feedback feedback) {
        return feedbackService.updateFeedback(id, feedback);
    }

    /** Xóa feedback. */
    @DeleteMapping("/{id}")
    public void deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
    }
}
