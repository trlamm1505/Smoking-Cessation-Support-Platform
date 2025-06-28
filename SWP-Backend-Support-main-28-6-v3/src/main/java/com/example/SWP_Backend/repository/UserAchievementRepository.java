package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    List<UserAchievement> findByUserUserId(Long userId);
    boolean existsByUserUserIdAndAchievementCode(Long userId, String code);
    Optional<UserAchievement> findByUserUserIdAndAchievementCode(Long userId, String code);
    int countByUserUserId(Long userId);

}
