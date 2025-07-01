package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.CommunityPosts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityPostsRepository extends JpaRepository<CommunityPosts, Long> {
    // Lấy tất cả bài đã được duyệt và chưa bị xóa
    List<CommunityPosts> findByStatus(String status);

    // Lấy tất cả bài chưa bị ẩn/xóa (nếu muốn cả pending + published)
    List<CommunityPosts> findByStatusNot(String status);

    // Lấy published và sắp xếp theo ngày đăng
    List<CommunityPosts> findByStatusOrderByPublishDateDesc(String status);
}
