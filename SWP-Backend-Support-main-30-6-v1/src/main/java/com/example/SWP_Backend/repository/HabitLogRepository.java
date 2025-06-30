package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    Optional<HabitLog> findByUserIdAndLogDate(Long userId, LocalDate logDate);
    List<HabitLog> findByUserIdAndLogDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    List<HabitLog> findByUserIdOrderByLogDateDesc(Long userId);
    // THÊM method này để lấy log tăng dần theo ngày (dùng cho thành tích, badge, streak, ...)
    List<HabitLog> findByUserIdOrderByLogDateAsc(Long userId);
}
