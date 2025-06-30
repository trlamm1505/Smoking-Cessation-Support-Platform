package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.BlogPosts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostsRepository extends JpaRepository<BlogPosts, Long> {

    /** Tìm bài viết theo slug (URL friendly) */
    Optional<BlogPosts> findBySlug(String slug);

    /** Tìm tất cả bài viết theo trạng thái (draft/published/pending/rejected) */
    List<BlogPosts> findByStatus(String status);

    /** Tìm tất cả bài viết theo category (chuyên mục) */
    List<BlogPosts> findByCategory(String category);

    /** Tìm bài viết của 1 coach nhất định */
    List<BlogPosts> findByAuthorCoachId(Long coachId);

    /** Tìm bài viết có tiêu đề chứa từ khóa (ignore case) */
    List<BlogPosts> findByTitleContainingIgnoreCase(String keyword);

    /** Đếm số bài viết theo trạng thái (thống kê nhanh) */
    long countByStatus(String status);
}
