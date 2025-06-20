package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.User;

import com.example.SWP_Backend.entity.Coach;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {


    // Đăng nhập
    User findByUsername(String username);
    User findByEmail(String email);

    // Phân quyền
    List<User> findByRole(String role);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // --- BỎ hoặc COMMENT các hàm dưới vì entity User không còn coachId primitive ---
    // List<User> findByCoachIdIsNotNull();
    // List<User> findByCoachId(Long coachId);

    // --- CHỈ DÙNG các hàm mapping với Coach object ---
    List<User> findByCoach(Coach coach);           // Lấy user theo coach object
    List<User> findByCoachIsNotNull();             // Lấy user có coach (object Coach != null)

    // Linh hoạt đăng nhập (username hoặc email)
    User findByUsernameOrEmail(String username, String email);

    // Tìm user theo username - QUAN TRỌNG cho đăng nhập
    User findByUsername(String username);

    // Tìm user theo email - QUAN TRỌNG cho đăng nhập/đăng ký
    User findByEmail(String email);

    // Lấy users theo role - để phân quyền
    List<User> findByRole(String role);

    // Kiểm tra username đã tồn tại - QUAN TRỌNG cho đăng ký
    boolean existsByUsername(String username);

    // Kiểm tra email đã tồn tại - QUAN TRỌNG cho đăng ký
    boolean existsByEmail(String email);

    // Lấy users có coach (coachId không null)
    List<User> findByCoachIdIsNotNull();

    // Lấy users theo coach ID cụ thể
    List<User> findByCoachId(Long coachId);

    // THÊM MỚI: Tìm theo username và email (cho đăng nhập linh hoạt)
    User findByUsernameOrEmail(String username, String email);

    // THÊM MỚI: Lấy users đang active (có thể thêm field isActive sau)
    // List<User> findByIsActiveTrue();
