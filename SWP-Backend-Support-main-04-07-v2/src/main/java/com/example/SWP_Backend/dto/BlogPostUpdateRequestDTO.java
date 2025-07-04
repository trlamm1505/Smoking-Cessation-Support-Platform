package com.example.SWP_Backend.dto;

import lombok.Data;

/**
 * BlogPostUpdateRequestDTO – DTO cho việc chỉnh sửa bài viết.
 */
@Data
public class BlogPostUpdateRequestDTO {
    private String title;        // Tiêu đề
    private String content;      // Nội dung chính
    private String excerpt;      // Tóm tắt (optional)
    private String category;     // Chuyên mục
    private String tags;         // Tags
    private String featuredImageURL; // Ảnh nổi bật (optional)
    private String status;       // Trạng thái mới (draft, published, pending, rejected)
}
