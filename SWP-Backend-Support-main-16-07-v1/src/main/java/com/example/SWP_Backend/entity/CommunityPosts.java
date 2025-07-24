package com.example.SWP_Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

@Entity
@Table(name = "CommunityPosts")
@Getter
@Setter

public class CommunityPosts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AuthorUserID", nullable = false)
    private User author;

    @Column(nullable = false, length = 255)
    @Nationalized
    private String title;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(length = 255)
    private String featuredImageURL;

    @Column(nullable = false)
    private LocalDateTime publishDate = LocalDateTime.now();

    private LocalDateTime lastModifiedDate;

    // Huy hiệu: lưu dạng text, có thể nhiều badge, ngăn cách bởi dấu phẩy (ví dụ: "7days,saving,health,inspire")
    @Column(length = 255)
    private String badges;

    @Column(nullable = false)
    private Integer views = 0;

    @Column(nullable = false, length = 255)
    private String status = "published"; // hoặc "pending", "rejected", "draft" tùy business

    // ====== Getter/Setter/Constructors ======= //

    public CommunityPosts() {
    }

    // Full constructor
    public CommunityPosts(Long postId, User author, String title, String content, String featuredImageURL,
                          LocalDateTime publishDate, LocalDateTime lastModifiedDate, String badges, Integer views, String status) {
        this.postId = postId;
        this.author = author;
        this.title = title;
        this.content = content;
        this.featuredImageURL = featuredImageURL;
        this.publishDate = publishDate;
        this.lastModifiedDate = lastModifiedDate;
        this.badges = badges;
        this.views = views;
        this.status = status;
    }

    // Getters and setters...
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getFeaturedImageURL() { return featuredImageURL; }
    public void setFeaturedImageURL(String featuredImageURL) { this.featuredImageURL = featuredImageURL; }
    public LocalDateTime getPublishDate() { return publishDate; }
    public void setPublishDate(LocalDateTime publishDate) { this.publishDate = publishDate; }
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
    public String getBadges() { return badges; }
    public void setBadges(String badges) { this.badges = badges; }
    public Integer getViews() { return views; }
    public void setViews(Integer views) { this.views = views; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
