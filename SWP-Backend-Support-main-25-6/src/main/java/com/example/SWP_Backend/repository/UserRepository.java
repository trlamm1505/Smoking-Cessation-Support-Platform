package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    List<User> findByRole(String role);

    // Thêm/giữ method này để lấy toàn bộ user là coach (coachId != null)
    List<User> findByCoachIdIsNotNull();

    // Lấy user theo coachId (nếu muốn truy xuất trực tiếp user là coach)
    User findByCoachId(Long coachId);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // Không còn các method liên quan đến Coach object nữa!
}
