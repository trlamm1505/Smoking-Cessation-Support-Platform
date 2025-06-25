package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

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

}
