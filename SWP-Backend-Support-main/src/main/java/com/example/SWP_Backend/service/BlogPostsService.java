package com.example.SWP_Backend.service;

import com.example.SWP_Backend.entity.BlogPosts;
import com.example.SWP_Backend.repository.BlogPostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BlogPostsService {
    @Autowired
    private BlogPostsRepository blogPostsRepository;

    // Create
    public BlogPosts createBlogPost(BlogPosts blogPost) {
        return blogPostsRepository.save(blogPost);
    }

    // Read all
    public List<BlogPosts> getAllBlogPosts() {
        return blogPostsRepository.findAll();
    }

    // Read by ID
    public Optional<BlogPosts> getBlogPostById(Long id) {
        return blogPostsRepository.findById(id);
    }

    // Update
    public BlogPosts updateBlogPost(Long id, BlogPosts updatedBlogPost) {
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
            return blogPostsRepository.save(blogPost);
        }).orElseThrow(() -> new RuntimeException("BlogPost not found with id " + id));
    }

    // Delete
    public void deleteBlogPost(Long id) {
        blogPostsRepository.deleteById(id);
    }
}
