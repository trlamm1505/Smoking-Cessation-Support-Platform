package com.example.SWP_Backend.dto;

import lombok.Data;

/**
 * BlogPostCreateRequestDTO – DTO cho việc tạo mới bài viết từ FE gửi lên.
 */
@Data
public class BlogPostCreateRequestDTO {
    private Long authorId;       // CoachID đăng bài
    private String title;        // Tiêu đề
    private String content;      // Nội dung chính
    private String excerpt;      // Tóm tắt (optional)
    private String category;     // Chuyên mục
    private String tags;         // Tags (dạng text)
    private String featuredImageURL; // Ảnh nổi bật (optional)
}
