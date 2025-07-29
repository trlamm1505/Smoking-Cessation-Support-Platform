package com.example.SWP_Backend.dto;

import lombok.Data;

@Data
public class PostCommentEditRequest {
    private Long userId;
    private String content;
}
