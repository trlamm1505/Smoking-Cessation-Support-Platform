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

    // Đăng nhập
    User findByUsername(String username);
    User findByEmail(String email);

    // Phân quyền
    List<User> findByRole(String role);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // --- BỎ hoặc COMMENT các hàm dưới vì entity User không còn coachId primitive ---
//List<User> findByCoachIdIsNotNull();
    // List<User> findByCoachId(Long coachId);

    // --- CHỈ DÙNG các hàm mapping với Coach object ---
   // List<User> findByCoach(Coach coach);           // Lấy user theo coach object
  //  List<User> findByCoachIsNotNull();             // Lấy user có coach (object Coach != null)

    // Linh hoạt đăng nhập (username hoặc email)
    User findByUsernameOrEmail(String username, String email);

    // UserRepository
    List<User> findByFullNameContainingIgnoreCase(String fullName);

    @Query("""
        SELECT new com.example.SWP_Backend.dto.MonthlyUserDTO(
            YEAR(u.registrationDate), MONTH(u.registrationDate), COUNT(u)
        )
        FROM User u
        GROUP BY YEAR(u.registrationDate), MONTH(u.registrationDate)
        ORDER BY YEAR(u.registrationDate), MONTH(u.registrationDate)
    """)
    List<MonthlyUserDTO> getMonthlyUserCounts();

   //thêm
   // Đếm số user đăng ký theo tháng/năm chỉ tính guest & member
   @Query("""
    SELECT new com.example.SWP_Backend.dto.MonthlyUserDTO(
        YEAR(u.registrationDate), MONTH(u.registrationDate), COUNT(u)
    )
    FROM User u
    WHERE u.role = 'member' OR u.role = 'guest'
    GROUP BY YEAR(u.registrationDate), MONTH(u.registrationDate)
    ORDER BY YEAR(u.registrationDate), MONTH(u.registrationDate)
""")
   List<MonthlyUserDTO> getMonthlyGuestMemberUserCounts();

    @Query("SELECT c.user FROM Coach c WHERE c.coachId = :coachId")
    Optional<User> findCoachUserByCoachId(@Param("coachId") Long coachId);

    //=============================================================================//


    // Lấy tất cả user đang hoạt động
    List<User> findAllByEnabledTrue();

    // Tìm user đang hoạt động theo ID
    User findByUserIdAndEnabledTrue(Long userId);

    // Tìm user đang hoạt động theo username
    User findByUsernameAndEnabledTrue(String username);

    // Tìm user đang hoạt động theo email
    User findByEmailAndEnabledTrue(String email);

    // Tìm danh sách user theo role và đang hoạt động
    List<User> findByRoleAndEnabledTrue(String role);

    // Kiểm tra username/email đã tồn tại chưa, chỉ cho enabled = true
    boolean existsByUsernameAndEnabledTrue(String username);
    boolean existsByEmailAndEnabledTrue(String email);



    //không hoạt động

    List<User> findAllByEnabledFalse();

}