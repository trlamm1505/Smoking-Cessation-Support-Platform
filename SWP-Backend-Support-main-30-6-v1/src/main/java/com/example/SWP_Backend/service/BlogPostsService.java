package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.BlogPostsDTO;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.entity.BlogPosts;
import com.example.SWP_Backend.repository.BlogPostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service xử lý logic cho BlogPosts, chuyển đổi entity sang DTO để trả về cho FE.
 */
@Service
public class BlogPostsService {
    @Autowired
    private BlogPostsRepository blogPostsRepository;

    // ====== BỔ SUNG NOTIFICATION ======
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService; // Để lấy user theo role "member" và "guest" nếu muốn

    // Trả về entity BlogPosts gốc, dùng cho update
    public Optional<BlogPosts> getEntityById(Long id) {
        return blogPostsRepository.findById(id);
    }

    /**
     * Tạo mới một bài viết, nhận entity BlogPosts, trả về DTO sau khi lưu.
     * Sau khi tạo, gửi thông báo tới toàn bộ user có role "member", "guest"
     */
    public BlogPostsDTO createBlogPost(BlogPosts blogPost) {
        BlogPosts saved = blogPostsRepository.save(blogPost);

        // ======== THÔNG BÁO TOÀN BỘ USER (member, guest) ========

        // Thông báo cho member
        NotificationRequestDTO notiMember = new NotificationRequestDTO();
        notiMember.setTitle("Bài viết mới trên Blog!");
        notiMember.setContent("Coach vừa đăng bài mới: " + saved.getTitle());
        notiMember.setSenderId(blogPost.getAuthor() != null && blogPost.getAuthor().getUser() != null
                ? blogPost.getAuthor().getUser().getUserId()
                : null); // Nếu có userId của tác giả coach, truyền vào
        notiMember.setTargetRole("member");
        notiMember.setType("blog");
        notificationService.sendNotification(notiMember);

        // Nếu muốn gửi cho guest:
        NotificationRequestDTO notiGuest = new NotificationRequestDTO();
        notiGuest.setTitle("Bài viết mới trên Blog!");
        notiGuest.setContent("Coach vừa đăng bài mới: " + saved.getTitle());
        notiGuest.setSenderId(blogPost.getAuthor() != null && blogPost.getAuthor().getUser() != null
                ? blogPost.getAuthor().getUser().getUserId()
                : null);
        notiGuest.setTargetRole("guest");
        notiGuest.setType("blog");
        notificationService.sendNotification(notiGuest);

        // (Nếu muốn broadcast cho tất cả, có thể dùng targetRole = "all" thay vì 2 lần như trên)
        // Nếu chỉ muốn member, bạn bỏ đoạn guest đi là xong.

        return toDTO(saved);
    }

    /**
     * Lấy tất cả bài viết (danh sách DTO).
     */
    public List<BlogPostsDTO> getAllBlogPosts() {
        List<BlogPosts> posts = blogPostsRepository.findAll();
        return posts.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Lấy bài viết theo ID (DTO).
     */
    public Optional<BlogPostsDTO> getBlogPostById(Long id) {
        return blogPostsRepository.findById(id).map(this::toDTO);
    }

    /**
     * Update bài viết, trả về DTO đã update.
     */
    public BlogPostsDTO updateBlogPost(Long id, BlogPosts updatedBlogPost) {
        return blogPostsRepository.findById(id).map(blogPost -> {
            blogPost.setTitle(updatedBlogPost.getTitle());
            blogPost.setSlug(updatedBlogPost.getSlug());
            blogPost.setContent(updatedBlogPost.getContent());
            blogPost.setExcerpt(updatedBlogPost.getExcerpt());
            blogPost.setCategory(updatedBlogPost.getCategory());
            blogPost.setTags(updatedBlogPost.getTags());
            blogPost.setViews(updatedBlogPost.getViews());
            blogPost.setStatus(updatedBlogPost.getStatus());
            blogPost.setFeaturedImageURL(updatedBlogPost.getFeaturedImageURL());
            blogPost.setLastModifiedDate(updatedBlogPost.getLastModifiedDate());
            BlogPosts saved = blogPostsRepository.save(blogPost);
            return toDTO(saved);
        }).orElseThrow(() -> new RuntimeException("BlogPost not found with id " + id));
    }

    /**
     * Xóa bài viết theo id.
     */
    public void deleteBlogPost(Long id) {
        blogPostsRepository.deleteById(id);
        // Nếu muốn gửi notification "Bài viết đã bị xoá" thì bổ sung tại đây
    }

    /**
     * Hàm chuyển đổi entity BlogPosts sang DTO.
     */
    public BlogPostsDTO toDTO(BlogPosts post) {
        BlogPostsDTO dto = new BlogPostsDTO();
        dto.setPostId(post.getPostId());
        dto.setAuthorId(post.getAuthor() != null ? post.getAuthor().getCoachId() : null);
        dto.setAuthorName(post.getAuthor() != null ? post.getAuthor().getFullName() : null);
        dto.setTitle(post.getTitle());
        dto.setSlug(post.getSlug());
        dto.setExcerpt(post.getExcerpt());
        dto.setPublishDate(post.getPublishDate() != null ? post.getPublishDate().toString() : null);
        dto.setCategory(post.getCategory());
        dto.setStatus(post.getStatus());
        dto.setViews(post.getViews());
        dto.setFeaturedImageURL(post.getFeaturedImageURL());
        return dto;
    }
}
