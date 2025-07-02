package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.CommunityPostsLike;
import com.example.SWP_Backend.entity.CommunityPosts;
import com.example.SWP_Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommunityPostsLikeRepository extends JpaRepository<CommunityPostsLike, Long> {
    boolean existsByUserAndPost(User user, CommunityPosts post);
    Optional<CommunityPostsLike> findByUserAndPost(User user, CommunityPosts post);
    long countByPost(CommunityPosts post);
}
