package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.BlogPostsDTO;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.entity.BlogPosts;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.BlogPostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
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

        // Gửi cho member
        NotificationRequestDTO notiMember = new NotificationRequestDTO();
        notiMember.setTitle("Bài viết mới trên Blog!");
        notiMember.setContent("Coach vừa đăng bài mới: " + saved.getTitle());
        notiMember.setSenderId(blogPost.getAuthor() != null && blogPost.getAuthor().getUser() != null
                ? blogPost.getAuthor().getUser().getUserId()
                : null);
        notiMember.setTargetRole("member");
        notiMember.setType("blog");
        notificationService.sendNotification(notiMember);

        // Gửi cho guest (nếu cần)
        NotificationRequestDTO notiGuest = new NotificationRequestDTO();
        notiGuest.setTitle("Bài viết mới trên Blog!");
        notiGuest.setContent("Coach vừa đăng bài mới: " + saved.getTitle());
        notiGuest.setSenderId(blogPost.getAuthor() != null && blogPost.getAuthor().getUser() != null
                ? blogPost.getAuthor().getUser().getUserId()
                : null);
        notiGuest.setTargetRole("guest");
        notiGuest.setType("blog");
        notificationService.sendNotification(notiGuest);

        // Gửi cho các coach khác (trừ coach đăng bài)
        Long authorUserId = (blogPost.getAuthor() != null && blogPost.getAuthor().getUser() != null)
                ? blogPost.getAuthor().getUser().getUserId()
                : null;
        List<User> allCoachUsers = userService.findAllByRole("coach");
        for (User coach : allCoachUsers) {
            if (authorUserId != null && Objects.equals(coach.getUserId(), authorUserId)) continue;
            NotificationRequestDTO notiCoach = new NotificationRequestDTO();
            notiCoach.setTitle("Bài viết mới trên Blog từ đồng nghiệp!");
            notiCoach.setContent("Coach " + blogPost.getAuthor().getFullName() + " vừa đăng bài: " + saved.getTitle());
            notiCoach.setSenderId(authorUserId);
            notiCoach.setRecipientId(coach.getUserId());
            notiCoach.setType("blog");
            notificationService.sendNotification(notiCoach);
        }

        // Gửi cho tất cả admin
        List<User> allAdminUsers = userService.findAllByRole("admin");
        for (User admin : allAdminUsers) {
            NotificationRequestDTO notiAdmin = new NotificationRequestDTO();
            notiAdmin.setTitle("Bài viết mới trên Blog!");
            notiAdmin.setContent("Coach " + blogPost.getAuthor().getFullName() + " vừa đăng bài: " + saved.getTitle());
            notiAdmin.setSenderId(authorUserId);
            notiAdmin.setRecipientId(admin.getUserId());
            notiAdmin.setType("blog");
            notificationService.sendNotification(notiAdmin);
        }

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
