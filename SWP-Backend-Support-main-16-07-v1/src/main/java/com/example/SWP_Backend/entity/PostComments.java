package com.example.SWP_Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;
import java.util.List;

/**
 * PostComments entity – đại diện cho một bình luận trong bài viết cộng đồng (CommunityPosts).
 * Hỗ trợ bình luận lồng nhau (reply comment), xóa mềm, duyệt admin, vote, báo cáo vi phạm.
 */
@Getter
@Setter

@AllArgsConstructor
@Entity
@Table(name = "PostComments")
public class PostComments {

    /** Khóa chính tự tăng của bình luận */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    /** Bài viết cộng đồng mà bình luận này thuộc về */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PostID", nullable = false)
    private CommunityPosts post;

    /** User đã bình luận */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    /** Comment cha (trường hợp reply), có thể null */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentCommentID")
    private PostComments parentComment;

    /** Danh sách các reply (comments con) – hỗ trợ truy vấn lồng nhau */
    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostComments> replies;

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

    /** Đánh dấu bình luận đã bị xóa mềm (không hiện lên FE) */
    @Column(nullable = false)
    private Boolean isDeleted = false;

    /** Thời điểm sửa cuối, có thể null nếu chưa từng sửa */
    @Column
    private LocalDateTime lastEditedAt;

    /** Số lần bị report vi phạm */
    @Column(nullable = false)
    private Integer reportCount = 0;

    // ====== Constructors ======
    public PostComments() {}

    // ====== Getter/Setter nếu cần bổ sung ngoài Lombok ======

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }
}
