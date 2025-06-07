package com.minhtriet.appswp.controller;

import com.minhtriet.appswp.entity.User;
import com.minhtriet.appswp.repository.UserRepository;
import com.minhtriet.appswp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý user (chỉ ADMIN mới được thao tác).
 * KHÔNG dùng cho đăng nhập/đăng ký (xem AuthAPI)
 */
@RestController
public class UserAPI {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // ============= CRUD CƠ BẢN =============

    /**
     * Lấy danh sách toàn bộ user
     * GET: /api/user
     */
    @GetMapping("/api/user")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Lấy thông tin user theo ID
     * GET: /api/user/{id}
     */
    @GetMapping("/api/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) return ResponseEntity.ok(user);
        return ResponseEntity.notFound().build();
    }

    /**
     * Tạo user mới (chỉ admin). User thường nên dùng AuthAPI /register
     * POST: /api/user
     */
    @PostMapping("/api/user")
    public ResponseEntity<?> createNewUser(@Valid @RequestBody User user) {
        // Kiểm tra email đã tồn tại
        if (userService.isEmailExists(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email đã được sử dụng");
        }
        User newUser = userService.createNewUser(user);
        return ResponseEntity.ok(newUser);
    }

    /**
     * Cập nhật thông tin user theo id
     * PUT: /api/user/{id}
     */
    @PutMapping("/api/user/{id}")
    public ResponseEntity<User> updateUserById(@PathVariable Long id, @Valid @RequestBody User user) {
        User updated = userService.updateUserById(id, user);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    /**
     * Xóa user theo id (chỉ admin)
     * DELETE: /api/user/{id}
     */
    @DeleteMapping("/api/user/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
        boolean deleted = userService.deleteUserById(id);
        if (deleted) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }

    // ========== TRA CỨU ĐẶC BIỆT ===========

    /**
     * Lấy user theo username
     * GET: /api/user/username/{username}
     */
    @GetMapping("/api/user/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        if (user != null) return ResponseEntity.ok(user);
        return ResponseEntity.notFound().build();
    }

    /**
     * Lấy user theo email
     * GET: /api/user/email/{email}
     */
    @GetMapping("/api/user/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        if (user != null) return ResponseEntity.ok(user);
        return ResponseEntity.notFound().build();
    }

    /**
     * Lấy danh sách user theo role (member, coach, admin...)
     * GET: /api/user/role/{role}
     */
    @GetMapping("/api/user/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        List<User> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    /**
     * Lấy tất cả user có coachId != null (user đã được gán coach)
     * GET: /api/user/with-coach
     */
    @GetMapping("/api/user/with-coach")
    public ResponseEntity<List<User>> getUsersWithCoach() {
        List<User> users = userService.getUsersWithCoach();
        return ResponseEntity.ok(users);
    }

    /**
     * Lấy user theo coachId (tất cả user do coach quản lý)
     * GET: /api/user/coach/{coachId}
     */
    @GetMapping("/api/user/coach/{coachId}")
    public ResponseEntity<List<User>> getUsersByCoachId(@PathVariable Long coachId) {
        List<User> users = userService.getUsersByCoachId(coachId);
        return ResponseEntity.ok(users);
    }

    // Kết thúc các endpoint quản lý user cho admin
}
