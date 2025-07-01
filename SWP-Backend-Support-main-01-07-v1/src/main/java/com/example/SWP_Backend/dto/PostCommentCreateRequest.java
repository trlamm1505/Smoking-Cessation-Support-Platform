package com.example.SWP_Backend.dto;

import lombok.Data;

/**
 * DTO để tạo mới bình luận (request từ FE).
 */
@Data
public class PostCommentCreateRequest {
    /** Mã bài viết */
    private Long postId;
    /** Mã user (người gửi bình luận) */
    private Long userId;
    /** ID bình luận cha (nếu là reply, có thể null) */
    private Long parentCommentId;
    /** Nội dung bình luận */
    private String content;
}
