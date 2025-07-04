package com.example.SWP_Backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO trả về thông tin bình luận (PostComments) cho FE.
 */
@Data
public class PostCommentDTO {
    /** Mã bình luận */
    private Long commentId;
    /** Mã bài viết chứa bình luận */
    private Long postId;
    /** Mã user đã bình luận */
    private Long userId;
    /** Tên user đã bình luận */
    private String userName;
    /** ID của bình luận cha (nếu là reply, có thể null) */
    private Long parentCommentId;
    /** Nội dung bình luận */
    private String content;
    /** Thời gian bình luận */
    private LocalDateTime commentDate;
    /** Đã duyệt chưa */
    private Boolean isApproved;
    /** Số upvote */
    private Integer upvotes;
    /** Số downvote */
    private Integer downvotes;
}
