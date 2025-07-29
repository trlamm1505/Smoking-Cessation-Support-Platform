package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.ConsultationStatsDTO;
import com.example.SWP_Backend.dto.MonthlyConsultationDTO;
import com.example.SWP_Backend.repository.ConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Service xử lý logic thống kê cho lịch tư vấn (consultation).
 */
@Service
public class ConsultationStatisticsService {

    @Autowired
    private  ConsultationRepository consultationRepository;

    /**
     * Thống kê tổng hợp cho 1 coach:
     * - Số thành viên đã từng tư vấn với coach này
     * - Số buổi tư vấn đã hoàn thành
     * - Tổng số buổi tư vấn đã được đặt (mọi trạng thái)
     * - Tỉ lệ hoàn thành (completionRate)
     * - Số ngày hoạt động (tính từ buổi tư vấn đầu tiên tới hiện tại)
     */
    public ConsultationStatsDTO getStatisticsByCoachId(Long coachId) {
        // Lấy số lượng thành viên khác nhau (distinct member)
        Long totalMembers = consultationRepository.countDistinctMembersByCoachId(coachId);
        // Số buổi tư vấn đã hoàn thành (status = completed)
        Long completedSessions = consultationRepository.countCompletedConsultationsByCoachId(coachId);
        // Tổng số buổi tư vấn đã đặt
        Long totalSessions = consultationRepository.countTotalConsultationsByCoachId(coachId);
        // Ngày diễn ra tư vấn đầu tiên (sớm nhất)
        LocalDateTime firstConsultation = consultationRepository.findFirstConsultationDate(coachId);

        // Tính completionRate (số hoàn thành / tổng * 100)
        double completionRate = totalSessions != 0 ? (completedSessions * 100.0 / totalSessions) : 0;
        // Số ngày hoạt động từ buổi đầu tiên tới nay
        long activeDays = firstConsultation != null ?
                ChronoUnit.DAYS.between(firstConsultation.toLocalDate(), LocalDate.now()) : 0;

        // Trả về đối tượng DTO tổng hợp
        return new ConsultationStatsDTO(totalMembers, completedSessions, totalSessions, completionRate, activeDays);
    }

    /**
     * Thống kê số buổi tư vấn đã đặt của coach theo từng tháng (trong năm)
     * - Trả về list gồm năm, tháng, tổng số buổi
     */
    public List<MonthlyConsultationDTO> getMonthlyStatistics(Long coachId) {
        // Lấy dữ liệu raw từ repository (dạng Object[])
        List<Object[]> results = consultationRepository.countConsultationsByMonth(coachId);
        // Chuyển đổi sang DTO cho client
        return results.stream().map(r -> new MonthlyConsultationDTO(
                (Integer) r[0], // year
                (Integer) r[1], // month
                (Long) r[2]     // total
        )).toList();
    }
}
