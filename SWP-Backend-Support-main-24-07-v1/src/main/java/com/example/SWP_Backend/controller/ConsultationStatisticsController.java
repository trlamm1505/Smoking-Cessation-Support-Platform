package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.ConsultationStatsDTO;
import com.example.SWP_Backend.dto.MonthlyConsultationDTO;
import com.example.SWP_Backend.service.ConsultationStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý các API thống kê liên quan đến lịch tư vấn.
 * - Thống kê tổng quát (summary) về tư vấn của coach
 * - Thống kê số buổi tư vấn theo tháng của coach
 */
@RestController
@RequestMapping("/api/statistics/consultations")
public class ConsultationStatisticsController {

    @Autowired
    private ConsultationStatisticsService statisticsService;

    /**
     * API: GET /api/statistics/consultations/summary/{coachId}
     * Lấy tổng quan về các chỉ số lịch tư vấn của một coach
     * Ví dụ: tổng số lịch, số lịch thành công, số buổi đã kết thúc, tỉ lệ hủy, ...
     * @param coachId ID của huấn luyện viên
     * @return ConsultationStatsDTO chứa các số liệu thống kê
     */
    @GetMapping("/summary/{coachId}")
    public ResponseEntity<ConsultationStatsDTO> getSummary(@PathVariable Long coachId) {
        // Gọi service lấy dữ liệu thống kê tổng hợp cho coach
        return ResponseEntity.ok(statisticsService.getStatisticsByCoachId(coachId));
    }

    /**
     * API: GET /api/statistics/consultations/monthly/{coachId}
     * Lấy thống kê số buổi tư vấn theo từng tháng của coach (phục vụ vẽ biểu đồ cột)
     * @param coachId ID của coach
     * @return List<MonthlyConsultationDTO> mỗi phần tử là số buổi/tháng
     */
    @GetMapping("/monthly/{coachId}")
    public ResponseEntity<List<MonthlyConsultationDTO>> getMonthly(@PathVariable Long coachId) {
        // Gọi service lấy số liệu lịch tư vấn từng tháng của coach
        return ResponseEntity.ok(statisticsService.getMonthlyStatistics(coachId));
    }
}
