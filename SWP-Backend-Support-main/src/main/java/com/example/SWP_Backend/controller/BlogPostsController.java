package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.entity.BlogPosts;
import com.example.SWP_Backend.service.BlogPostsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogposts")
public class BlogPostsController {

    @Autowired
    private BlogPostsService blogPostsService;

    // Create
    @PostMapping
    public BlogPosts createBlogPost(@RequestBody BlogPosts blogPost) {
        return blogPostsService.createBlogPost(blogPost);
    }

    // Read all
    @GetMapping
    public List<BlogPosts> getAllBlogPosts() {
        return blogPostsService.getAllBlogPosts();
    }

    // Read by ID
    @GetMapping("/{id}")
    public BlogPosts getBlogPostById(@PathVariable Long id) {
        return blogPostsService.getBlogPostById(id)
                .orElseThrow(() -> new RuntimeException("BlogPost not found with id " + id));
    }

    // Update
    @PutMapping("/{id}")
    public BlogPosts updateBlogPost(@PathVariable Long id, @RequestBody BlogPosts blogPost) {
        return blogPostsService.updateBlogPost(id, blogPost);
    }

    // Delete
    @DeleteMapping("/{id}")
    public void deleteBlogPost(@PathVariable Long id) {
        blogPostsService.deleteBlogPost(id);
    }
}
