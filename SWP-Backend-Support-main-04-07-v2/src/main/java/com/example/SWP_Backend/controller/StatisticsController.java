package com.example.SWP_Backend.controller;


import com.example.SWP_Backend.dto.MonthlyRevenueDTO;
import com.example.SWP_Backend.dto.MonthlyUserDTO;
import com.example.SWP_Backend.entity.MembershipPackage;
import com.example.SWP_Backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {
    private final ReportService reportService;

    @GetMapping("/revenue/total")
    public BigDecimal totalRevenue() {
        return reportService.getTotalRevenue();
    }

    @GetMapping("/revenue/subscribers")
    public long totalSubscribers() {
        return reportService.getTotalSubscribers();
    }

    @GetMapping("/revenue/average-per-member")
    public BigDecimal averageRevenuePerMember() {
        return reportService.getAverageRevenuePerMember();
    }

    @GetMapping("/revenue/most-popular-package")
    public MembershipPackage mostPopularPackage() {
        return reportService.getMostPopularPackage();
    }

    @GetMapping("/revenue/monthly")
    public List<MonthlyRevenueDTO> revenueByMonth() {
        return reportService.getMonthlyRevenue();
    }

//    @GetMapping("/users/monthly")
//    public List<MonthlyUserDTO> userCountsByMonth() {
//        return reportService.getMonthlyUserCounts();
//    }

    //thêm
    // API đếm tất cả user (tổng cộng, gồm mọi loại)
    @GetMapping("/users/total")
    public long totalUsers() {
        return reportService.getTotalUsers();
    }

    // API thống kê số user guest/member đăng ký theo tháng
    @GetMapping("/users/guest-member-monthly")
    public List<MonthlyUserDTO> guestMemberUserCountsByMonth() {
        return reportService.getMonthlyGuestMemberUserCounts();
    }

}

