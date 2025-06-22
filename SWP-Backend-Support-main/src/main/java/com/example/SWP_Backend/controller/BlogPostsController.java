package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.BlogPostsDTO;
import com.example.SWP_Backend.entity.BlogPosts;
import com.example.SWP_Backend.service.BlogPostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller cho API quản lý bài viết cộng đồng (BlogPosts).
 */
@RestController
@RequestMapping("/api/blogposts")
public class BlogPostsController {

    @Autowired
    private BlogPostsService blogPostsService;

    /** Tạo mới bài viết, trả về DTO. */
    @PostMapping
    public BlogPostsDTO createBlogPost(@RequestBody BlogPosts blogPost) {
        return blogPostsService.createBlogPost(blogPost);
    }

    /** Lấy toàn bộ bài viết, trả về list DTO. */
    @GetMapping
    public List<BlogPostsDTO> getAllBlogPosts() {
        return blogPostsService.getAllBlogPosts();
    }

    /** Lấy bài viết theo ID, trả về DTO. */
    @GetMapping("/{id}")
    public BlogPostsDTO getBlogPostById(@PathVariable Long id) {
        return blogPostsService.getBlogPostById(id)
                .orElseThrow(() -> new RuntimeException("BlogPost not found with id " + id));
    }

    /** Update bài viết theo ID, trả về DTO mới. */
    @PutMapping("/{id}")
    public BlogPostsDTO updateBlogPost(@PathVariable Long id, @RequestBody BlogPosts blogPost) {
        return blogPostsService.updateBlogPost(id, blogPost);
    }

    /** Xóa bài viết. */
    @DeleteMapping("/{id}")
    public void deleteBlogPost(@PathVariable Long id) {
        blogPostsService.deleteBlogPost(id);
    }
}
