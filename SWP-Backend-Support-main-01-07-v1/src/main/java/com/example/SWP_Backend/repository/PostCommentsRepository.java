package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.PostComments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentsRepository extends JpaRepository<PostComments, Long> {

    // Lấy tất cả bình luận theo bài viết, sắp xếp theo ngày tạo tăng dần
    List<PostComments> findByPostPostIdOrderByCommentDateAsc(Long postId);

    // Lấy tất cả bình luận đã duyệt của 1 bài viết
    //List<PostComments> findByPostPostIdAndIsApprovedTrueOrderByCommentDateAsc(Long postId);

    // Lấy tất cả bình luận của một user
    List<PostComments> findByUserUserId(Long userId);

    // Lấy các bình luận cần duyệt (isApproved = false)
    //List<PostComments> findByIsApprovedFalse();

    // Đếm số bình luận cho 1 bài viết
    long countByPostPostId(Long postId);

    // PostCommentsRepository.java
    long countByPostPostIdAndIsDeletedFalse(Long postId);

}
