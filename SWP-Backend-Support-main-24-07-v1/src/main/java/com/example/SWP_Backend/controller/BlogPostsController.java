package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.BlogPostsCreateRequest;
import com.example.SWP_Backend.dto.BlogPostsDTO;
import com.example.SWP_Backend.entity.BlogPosts;
import com.example.SWP_Backend.entity.Coach;
import com.example.SWP_Backend.repository.CoachRepository;
import com.example.SWP_Backend.service.BlogPostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Controller cho API quản lý bài viết cộng đồng (BlogPosts).
 * Nhận vào CreateRequest (dữ liệu tạo/sửa), trả về DTO (dữ liệu nhẹ cho FE).
 */
@RestController
@RequestMapping("/api/blogposts")
public class BlogPostsController {

    @Autowired
    private BlogPostsService blogPostsService;

    @Autowired
    private CoachRepository coachRepository;

    /**
     * API tạo mới bài viết cộng đồng.
     * - Nhận BlogPostsCreateRequest từ FE, chỉ gồm trường cần thiết cho việc tạo post.
     * - Xác định author (Coach) từ authorId trong request.
     * - Tạo entity BlogPosts, map dữ liệu từ request.
     * - Thiết lập ngày đăng, số lượt xem ban đầu = 0.
     * - Gọi service để lưu post và trả về BlogPostsDTO cho FE.
     */
    @PostMapping
    public BlogPostsDTO createBlogPost(@RequestBody BlogPostsCreateRequest req) {
        // Tìm tác giả (Coach) theo authorId, nếu không có thì báo lỗi.
        Coach author = coachRepository.findById(req.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + req.getAuthorId()));

        // Khởi tạo entity BlogPosts mới và set các trường từ request.
        BlogPosts post = new BlogPosts();
        post.setAuthor(author);
        post.setTitle(req.getTitle());
        post.setSlug(req.getSlug());
        post.setContent(req.getContent());
        post.setExcerpt(req.getExcerpt());
        post.setCategory(req.getCategory());
        post.setTags(req.getTags());
        post.setFeaturedImageURL(req.getFeaturedImageURL());
        post.setStatus(req.getStatus());
        post.setPublishDate(LocalDateTime.now());
        post.setViews(0); // Mới tạo thì lượt xem luôn là 0

        // Gọi service xử lý lưu post và trả về DTO gọn cho FE.
        return blogPostsService.createBlogPost(post);
    }

    /**
     * API lấy danh sách tất cả bài viết.
     * - Trả về List<BlogPostsDTO> cho frontend.
     */
    @GetMapping
    public List<BlogPostsDTO> getAllBlogPosts() {
        return blogPostsService.getAllBlogPosts();
    }

    /**
     * API lấy chi tiết một bài viết theo ID.
     * - Trả về BlogPostsDTO, nếu không có thì throw lỗi.
     */
    @GetMapping("/{id}")
    public BlogPostsDTO getBlogPostById(@PathVariable Long id) {
        return blogPostsService.getBlogPostById(id)
                .orElseThrow(() -> new RuntimeException("BlogPost not found with id " + id));
    }

    /**
     * API cập nhật bài viết.
     * - Nhận BlogPostsCreateRequest từ FE, tìm lại tác giả.
     * - Tìm entity BlogPosts cần update, nếu không thấy thì throw lỗi.
     * - Cập nhật các trường của post từ request.
     * - Set lại ngày chỉnh sửa gần nhất (lastModifiedDate).
     * - Gọi service cập nhật, trả về BlogPostsDTO sau khi đã update.
     */
    @PutMapping("/{id}")
    public BlogPostsDTO updateBlogPost(@PathVariable Long id, @RequestBody BlogPostsCreateRequest req) {
        // Xác định tác giả từ authorId
        Coach author = coachRepository.findById(req.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + req.getAuthorId()));

        // Lấy entity post gốc, nếu không có thì báo lỗi.
        BlogPosts existingPost = blogPostsService.getEntityById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với id: " + id));

        // Cập nhật lại các trường nội dung.
        existingPost.setAuthor(author);
        existingPost.setTitle(req.getTitle());
        existingPost.setSlug(req.getSlug());
        existingPost.setContent(req.getContent());
        existingPost.setExcerpt(req.getExcerpt());
        existingPost.setCategory(req.getCategory());
        existingPost.setTags(req.getTags());
        existingPost.setFeaturedImageURL(req.getFeaturedImageURL());
        existingPost.setStatus(req.getStatus());
        existingPost.setLastModifiedDate(LocalDateTime.now());

        // Gọi service update và trả về DTO
        return blogPostsService.updateBlogPost(id, existingPost);
    }

    /**
     * API xóa bài viết theo id.
     * - Chỉ cần id, không trả về gì.
     */
    @DeleteMapping("/{id}")
    public void deleteBlogPost(@PathVariable Long id) {
        blogPostsService.deleteBlogPost(id);
    }
}
