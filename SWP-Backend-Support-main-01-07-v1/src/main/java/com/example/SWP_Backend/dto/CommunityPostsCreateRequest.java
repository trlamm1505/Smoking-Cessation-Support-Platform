package com.example.SWP_Backend.dto;

public class CommunityPostsCreateRequest {
    private Long authorId;
    private String title;
    private String content;
    private String featuredImageURL; // Có thể null
    private String badges;  // FE truyền các badge dạng: "7days,saving,health,inspire"
    private String status;  // FE có thể truyền "published", "draft", "pending", "rejected"

    // Getters and setters
    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getFeaturedImageURL() { return featuredImageURL; }
    public void setFeaturedImageURL(String featuredImageURL) { this.featuredImageURL = featuredImageURL; }
    public String getBadges() { return badges; }
    public void setBadges(String badges) { this.badges = badges; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
