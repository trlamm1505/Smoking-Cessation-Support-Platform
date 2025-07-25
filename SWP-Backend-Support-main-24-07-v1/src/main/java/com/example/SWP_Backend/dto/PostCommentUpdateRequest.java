// src/main/java/com/example/SWP_Backend/dto/PostCommentUpdateRequest.java
package com.example.SWP_Backend.dto;

import lombok.Data;

/**
 * DTO để cập nhật bình luận
 */
@Data
public class PostCommentUpdateRequest {
    private Long userId;
    private String content;
}
