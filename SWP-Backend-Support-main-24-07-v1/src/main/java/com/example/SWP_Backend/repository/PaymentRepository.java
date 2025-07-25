package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.dto.MonthlyRevenueDTO;
import com.example.SWP_Backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser_UserId(Long userId);
    Payment findTopByUser_UserIdOrderByEndDateDesc(Long userId);
    // Payment findTopByUser_UserIdAndStatusOrderByEndDateDesc(Long userId, String status);


    // Lấy payment đang active của user (nếu có)
    Payment findTopByUser_UserIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqualOrderByEndDateDesc(
            Long userId, String status, LocalDate startDate, LocalDate endDate
    );

    // Lấy payment gần nhất của user (để hiện lịch sử hoặc gói vừa hết hạn)
    Payment findTopByUser_UserIdAndStatusOrderByEndDateDesc(Long userId, String status);

    @Query("SELECT COALESCE(SUM(p.amount),0) FROM Payment p WHERE p.status='completed'")
    double getTotalRevenue();
    //===========================================ĐÂY LÀ PHẦN CẦN COPY================================================
//    @Query("SELECT COUNT(DISTINCT p.user.userId) FROM Payment p WHERE p.status='completed'")
//    long countDistinctSubscribers();
    @Query("""
    SELECT COUNT(DISTINCT p.user.userId)
    FROM Payment p
    JOIN p.user u
    WHERE p.status = 'completed'
      AND u.role = 'member'
      AND u.enabled = true
""")
    long countDistinctSubscribers();
//=================================================================================================================

    @Query("""
        SELECT new com.example.SWP_Backend.dto.MonthlyRevenueDTO(
            YEAR(p.paymentDate), MONTH(p.paymentDate), SUM(p.amount)
        )
        FROM Payment p
        WHERE p.status='completed'
        GROUP BY YEAR(p.paymentDate), MONTH(p.paymentDate)
        ORDER BY YEAR(p.paymentDate), MONTH(p.paymentDate)
    """)
    List<MonthlyRevenueDTO> getMonthlyRevenue();

    @Query("""
        SELECT p.packageInfo.packageID
        FROM Payment p
        WHERE p.status='completed'
        GROUP BY p.packageInfo.packageID
        ORDER BY COUNT(p) DESC
    """)
    List<Long> findMostPopularPackageId(org.springframework.data.domain.Pageable pageable);


    List<Payment> findAllByUserUserId(Long userId);



}
