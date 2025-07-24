package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.ChangePasswordRequest;
import com.example.SWP_Backend.dto.UpdateProfileRequest;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.UserRepository;
import com.example.SWP_Backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller quản lý user (chỉ ADMIN mới được thao tác).
 * KHÔNG dùng cho đăng nhập/đăng ký (xem AuthAPI)
 */
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // ============= CRUD CƠ BẢN =============

    /** Lấy danh sách toàn bộ user, đồng thời kiểm tra hết hạn gói để cập nhật role nếu cần */
    @GetMapping("/api/user")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        // Kiểm tra và update role cho từng user nếu gói hết hạn (member --> guest)
        users.forEach(userService::updateUserRoleIfExpired);
        return ResponseEntity.ok(users);
    }

    /** Lấy thông tin user theo ID, luôn kiểm tra hết hạn để role chuẩn */
    @GetMapping("/api/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            userService.updateUserRoleIfExpired(user); // Kiểm tra và cập nhật role nếu hết hạn
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    /** Tạo user mới (chỉ admin). User thường nên dùng AuthAPI /register. */
    @PostMapping("/api/user")
    public ResponseEntity<?> createNewUser(@Valid @RequestBody User user) {
        if (userService.isEmailExists(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email đã được sử dụng");
        }
        // Đăng ký mới luôn là guest, không phải member
        user.setRole("guest");
        User newUser = userService.createNewUser(user);
        return ResponseEntity.ok(newUser);
    }

    /** Cập nhật thông tin user theo id */
    @PutMapping("/api/user/{id}")
    public ResponseEntity<User> updateUserById(@PathVariable Long id, @Valid @RequestBody User user) {
        User updated = userService.updateUserById(id, user);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    /** Xóa user theo id (chỉ admin) */
//    @DeleteMapping("/api/user/{id}")
//    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
//        boolean deleted = userService.deleteUserById(id);
//        if (deleted) return ResponseEntity.noContent().build();
//        return ResponseEntity.notFound().build();
//    }

    // ========== TRA CỨU ĐẶC BIỆT ===========

    /** Lấy user theo username */
    @GetMapping("/api/user/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        if (user != null) {
            userService.updateUserRoleIfExpired(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    /** Lấy user theo email */
    @GetMapping("/api/user/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        if (user != null) {
            userService.updateUserRoleIfExpired(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    /** Lấy danh sách user theo role (member, coach, admin...) */
    @GetMapping("/api/user/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        List<User> users = userService.getUsersByRole(role);
        // Nếu là member thì kiểm tra role (giúp cập nhật trạng thái đúng)
        if ("member".equalsIgnoreCase(role)) {
            users.forEach(userService::updateUserRoleIfExpired);
        }
        return ResponseEntity.ok(users);
    }

    /** LẤY DANH SÁCH TOÀN BỘ COACH (role = coach) */
//    @GetMapping("/api/user/coaches")
//    public ResponseEntity<List<User>> getAllCoachUsers() {
//        List<User> coaches = userService.getAllCoachUsers();
//        return ResponseEntity.ok(coaches);
//    }

    /** Lấy user là coach theo coachId (profile coach, không phải member của coach) */
//    @GetMapping("/api/user/coach/{coachId}")
//    public ResponseEntity<User> getUserByCoachId(@PathVariable Long coachId) {
//        User coach = userService.getUserByCoachId(coachId);
//        if (coach != null) return ResponseEntity.ok(coach);
//        return ResponseEntity.notFound().build();
//    }

    /** API cho user tự cập nhật thông tin cá nhân */
    @PostMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request) {
        boolean success = userService.updateUserProfile(
                request.getUserId(),
                request.getFullName(),
                request.getProfilePictureUrl(),
                request.getCoachId(),   // chỉ có tác dụng với coach, member sẽ bỏ qua trường này
                request.getCurrentMembershipPackageId(),
                request.getPhoneNumber(),
                request.getHometown(),
                request.getOccupation(),
                request.getAge(),
                request.getAddress(),
                request.getGender()
        );

        if (success) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Cập nhật thông tin cá nhân thành công."
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Không tìm thấy người dùng."
            ));
        }
    }

    /** API đổi mật khẩu cho user */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Mật khẩu mới và xác nhận không khớp!"
            ));
        }

        boolean ok = userService.updatePassword(
                request.getUserId(),
                request.getCurrentPassword(),
                request.getNewPassword()
        );
        if (ok) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đổi mật khẩu thành công!"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Mật khẩu hiện tại không đúng!"
            ));
        }
    }

    // ===== API TEST ROLE HẾT HẠN (dùng để test thủ công trên Postman) =====
    /**
     * Endpoint này giúp admin test thủ công: kiểm tra và cập nhật role của 1 user nếu gói đã hết hạn (đổi member -> guest).
     * Sau này bạn muốn test, chỉ cần gọi: POST /api/user/check-role-expired/{userId}
     */
    @PostMapping("/api/user/check-role-expired/{userId}")
    public ResponseEntity<?> checkRoleExpired(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        if (user != null) {
            userService.updateUserRoleIfExpired(user);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã kiểm tra & cập nhật role user nếu hết hạn."
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Không tìm thấy user!"
            ));
        }
    }

    // Kết thúc các endpoint quản lý user cho admin

    // Lấy toàn bộ user còn hoạt động
    @GetMapping("/api/user/active")
    public ResponseEntity<List<User>> getAllActiveUsers() {
        List<User> users = userService.getAllActiveUsers();
        return ResponseEntity.ok(users);
    }

    // Xóa mềm user
    @DeleteMapping("/api/user/soft/{id}")
    public ResponseEntity<Void> softDeleteUserById(@PathVariable Long id) {
        boolean deleted = userService.softDeleteUserById(id);
        if (deleted) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }

    // Lấy user đang hoạt động (enabled = true) theo id
    @GetMapping("/api/user/active/{id}")
    public ResponseEntity<User> getActiveUserById(@PathVariable Long id) {
        User user = userService.getActiveUserById(id);
        if (user != null) {
            userService.updateUserRoleIfExpired(user); // Nếu cần kiểm tra gói
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    // Lấy danh sách toàn bộ user đã bị xóa (enabled = false)
    @GetMapping("/api/user/deleted")
    public ResponseEntity<List<User>> getAllDeletedUsers() {
        List<User> users = userService.getAllDeletedUsers();
        return ResponseEntity.ok(users);
    }


}
