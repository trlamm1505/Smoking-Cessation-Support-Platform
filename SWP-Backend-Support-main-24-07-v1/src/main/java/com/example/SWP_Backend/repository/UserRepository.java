package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.dto.MonthlyUserDTO;
import com.example.SWP_Backend.entity.Coach;
import com.example.SWP_Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface UserRepository extends JpaRepository<User, Long> {

    // =============== Đăng nhập cơ bản ===============
    User findByUsername(String username); // Tìm user theo username (sử dụng khi đăng nhập)
    User findByEmail(String email);       // Tìm user theo email (sử dụng khi đăng nhập, xác thực OTP, lấy lại mật khẩu...)

    // =============== Lấy danh sách user theo vai trò (role) ===============
    List<User> findByRole(String role); // Lấy tất cả user thuộc một vai trò cụ thể (guest/member/coach/admin)

    // =============== Kiểm tra sự tồn tại username/email (dùng validate khi đăng ký, cập nhật tài khoản) ===============
    boolean existsByUsername(String username); // Kiểm tra username đã tồn tại chưa
    boolean existsByEmail(String email);       // Kiểm tra email đã tồn tại chưa

    // --- BỎ hoặc COMMENT các hàm dưới vì entity User không còn coachId primitive ---
    // List<User> findByCoachIdIsNotNull(); // Cũ - không còn dùng
    // List<User> findByCoachId(Long coachId); // Cũ - không còn dùng

    // --- CHỈ DÙNG các hàm mapping với Coach object ---
    // List<User> findByCoach(Coach coach);           // Lấy user theo coach object (chỉ dùng khi mapping với entity Coach chuẩn)
    // List<User> findByCoachIsNotNull();             // Lấy user có coach (object Coach != null)

    // =============== Đăng nhập linh hoạt: nhập username hoặc email đều được ===============
    User findByUsernameOrEmail(String username, String email); // Hỗ trợ đăng nhập linh hoạt (username/email)

    // =============== Tìm user theo tên gần đúng, không phân biệt hoa thường ===============
    List<User> findByFullNameContainingIgnoreCase(String fullName); // Tìm user theo họ tên gần đúng, dùng cho tìm kiếm nâng cao

    // =============== Thống kê số lượng user đăng ký từng tháng (mọi role) ===============
    @Query("""
        SELECT new com.example.SWP_Backend.dto.MonthlyUserDTO(
            YEAR(u.registrationDate), MONTH(u.registrationDate), COUNT(u)
        )
        FROM User u
        GROUP BY YEAR(u.registrationDate), MONTH(u.registrationDate)
        ORDER BY YEAR(u.registrationDate), MONTH(u.registrationDate)
    """)
    List<MonthlyUserDTO> getMonthlyUserCounts(); // Lấy số lượng user đăng ký mỗi tháng (phục vụ dashboard Admin)

    // =============== Thống kê số lượng user đăng ký theo tháng (chỉ member/guest) ===============
    @Query("""
    SELECT new com.example.SWP_Backend.dto.MonthlyUserDTO(
        YEAR(u.registrationDate), MONTH(u.registrationDate), COUNT(u)
    )
    FROM User u
    WHERE u.role = 'member' OR u.role = 'guest'
    GROUP BY YEAR(u.registrationDate), MONTH(u.registrationDate)
    ORDER BY YEAR(u.registrationDate), MONTH(u.registrationDate)
""")
    List<MonthlyUserDTO> getMonthlyGuestMemberUserCounts(); // Chỉ thống kê user dạng member/guest (không tính coach/admin)

    // =============== Tìm user là coach dựa vào coachId (tìm user object từ bảng Coach) ===============
    @Query("SELECT c.user FROM Coach c WHERE c.coachId = :coachId")
    Optional<User> findCoachUserByCoachId(@Param("coachId") Long coachId); // Dùng cho mapping nâng cao giữa Coach/User

    //=============================================================================//

    // =============== Lấy tất cả user đang hoạt động (enabled=true) ===============
    List<User> findAllByEnabledTrue(); // Dùng cho các thao tác nghiệp vụ chỉ lấy user chưa bị xóa mềm

    // =============== Tìm user đang hoạt động theo ID ===============
    User findByUserIdAndEnabledTrue(Long userId); // Lấy user theo id và enabled=true (dùng cho profile, edit, v.v.)

    // =============== Tìm user đang hoạt động theo username/email ===============
    User findByUsernameAndEnabledTrue(String username); // Dùng cho các thao tác xác thực, đổi thông tin
    User findByEmailAndEnabledTrue(String email);

    // =============== Tìm danh sách user theo vai trò và enabled=true ===============
    List<User> findByRoleAndEnabledTrue(String role); // Lấy user đang hoạt động theo vai trò (phục vụ phân quyền)

    // =============== Kiểm tra username/email đã tồn tại với enabled = true (tránh trùng khi cập nhật) ===============
    boolean existsByUsernameAndEnabledTrue(String username); // Check username còn hoạt động
    boolean existsByEmailAndEnabledTrue(String email);       // Check email còn hoạt động

    // =============== Lấy tất cả user đã bị xóa mềm (enabled=false) ===============
    List<User> findAllByEnabledFalse(); // Dùng cho Admin khôi phục hoặc thống kê user bị xóa

}

