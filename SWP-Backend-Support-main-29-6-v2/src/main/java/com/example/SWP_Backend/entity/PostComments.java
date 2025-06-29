package com.example.SWP_Backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

/**
 * PostComments entity – đại diện cho một bình luận trong bài viết cộng đồng/blog.
 * Dùng cho mọi user (member, coach, admin), hỗ trợ reply comment (comment lồng nhau).
 */
@Getter
@Setter
@Entity
@Table(name = "PostComments")
public class PostComments {

    /** Khóa chính tự tăng của bình luận */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    /** Bài viết mà bình luận này thuộc về */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PostID", nullable = false)
    private BlogPosts post;

    /** User đã bình luận */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    /** Comment cha (trường hợp reply), có thể null */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentCommentID")
    private PostComments parentComment;

    /** Nội dung bình luận (tiếng Việt), bắt buộc */
    @Column(nullable = false)
    @Nationalized
    private String content;

    /** Ngày tạo bình luận */
    @Column(nullable = false)
    private LocalDateTime commentDate = LocalDateTime.now();

    /** Trạng thái duyệt: true nếu đã được admin duyệt (hoặc auto duyệt) */
    @Column(nullable = false)
    private Boolean isApproved = true;

    /** Số lượt upvote */
    @Column(nullable = false)
    private Integer upvotes = 0;

    /** Số lượt downvote */
    @Column(nullable = false)
    private Integer downvotes = 0;

    @Column(nullable = false)
    private Boolean isDeleted = false; // true nếu đã bị xóa

    @Column
    private LocalDateTime lastEditedAt; // thời điểm sửa cuối, có thể null nếu chưa từng sửa

    @Column(nullable = false)
    private Integer reportCount = 0;


    // ====== GETTER/SETTER, Constructors ====== //
    public PostComments() {}

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    public LocalDateTime getLastEditedAt() {
        return lastEditedAt;
    }

    public void setLastEditedAt(LocalDateTime lastEditedAt) {
        this.lastEditedAt = lastEditedAt;
    }

    public Long getCommentId() { return commentId; }
    public void setCommentId(Long commentId) { this.commentId = commentId; }

    public BlogPosts getPost() { return post; }
    public void setPost(BlogPosts post) { this.post = post; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public PostComments getParentComment() { return parentComment; }
    public void setParentComment(PostComments parentComment) { this.parentComment = parentComment; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCommentDate() { return commentDate; }
    public void setCommentDate(LocalDateTime commentDate) { this.commentDate = commentDate; }

    public Boolean getIsApproved() { return isApproved; }
    public void setIsApproved(Boolean isApproved) { this.isApproved = isApproved; }

    public Integer getUpvotes() { return upvotes; }
    public void setUpvotes(Integer upvotes) { this.upvotes = upvotes; }

    public Integer getDownvotes() { return downvotes; }
    public void setDownvotes(Integer downvotes) { this.downvotes = downvotes; }
}
