package com.example.SWP_Backend.dto;

/**
 * DTO cho CommunityPosts, trả về FE đầy đủ thông tin gồm lượt thích và trạng thái đã thích.
 */
public class CommunityPostsDTO {
    private Long postId;
    private Long authorId;
    private String authorName;
    private String title;
    private String content;
    private String featuredImageURL;
    private String publishDate;
    private String badges;  // Ví dụ: "7days,saving,health,inspire"
    private Integer views;
    private String status;

    // === Thêm 2 trường dưới đây ===
    private Long likeCount;             // Tổng lượt thả tim bài này
    private Boolean likedByCurrentUser; // User hiện tại đã like chưa (nếu cần)

    // Getters and setters
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }
    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getFeaturedImageURL() { return featuredImageURL; }
    public void setFeaturedImageURL(String featuredImageURL) { this.featuredImageURL = featuredImageURL; }
    public String getPublishDate() { return publishDate; }
    public void setPublishDate(String publishDate) { this.publishDate = publishDate; }
    public String getBadges() { return badges; }
    public void setBadges(String badges) { this.badges = badges; }
    public Integer getViews() { return views; }
    public void setViews(Integer views) { this.views = views; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getLikeCount() { return likeCount; }
    public void setLikeCount(Long likeCount) { this.likeCount = likeCount; }

    public Boolean getLikedByCurrentUser() { return likedByCurrentUser; }
    public void setLikedByCurrentUser(Boolean likedByCurrentUser) { this.likedByCurrentUser = likedByCurrentUser; }
}
