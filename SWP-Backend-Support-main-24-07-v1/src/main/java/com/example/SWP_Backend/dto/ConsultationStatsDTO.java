package com.example.SWP_Backend.dto;

/**
 * ConsultationStatsDTO: Data Transfer Object dùng để trả về thống kê tổng quan cho coach.
 * Thường dùng ở các dashboard hoặc báo cáo tổng hợp.
 *
 * Bao gồm các trường chính:
 * - totalMembers: Tổng số thành viên đã tư vấn với coach này (unique).
 * - completedSessions: Tổng số buổi tư vấn đã hoàn thành (status = 'completed').
 * - totalSessions: Tổng số buổi tư vấn đã diễn ra (mọi trạng thái).
 * - completionRate: Tỷ lệ hoàn thành (%) = completedSessions / totalSessions * 100.
 * - activeDays: Số ngày hoạt động kể từ buổi tư vấn đầu tiên.
 */
public class ConsultationStatsDTO {
    private Long totalMembers;          // Tổng số member từng tư vấn với coach này
    private Long completedSessions;     // Số buổi tư vấn đã hoàn thành (status = completed)
    private Long totalSessions;         // Tổng số buổi tư vấn (mọi trạng thái)
    private double completionRate;      // Tỷ lệ hoàn thành các buổi tư vấn (%)
    private long activeDays;            // Số ngày hoạt động kể từ buổi đầu tiên

    // Constructor dùng để khởi tạo đầy đủ các chỉ số
    public ConsultationStatsDTO(Long totalMembers, Long completedSessions, Long totalSessions, double completionRate, long activeDays) {
        this.totalMembers = totalMembers;
        this.completedSessions = completedSessions;
        this.totalSessions = totalSessions;
        this.completionRate = completionRate;
        this.activeDays = activeDays;
    }

    // Getter & Setter cho từng trường (dùng khi convert sang JSON trả về FE)
    public Long getTotalMembers() {
        return totalMembers;
    }

    public void setTotalMembers(Long totalMembers) {
        this.totalMembers = totalMembers;
    }

    public Long getCompletedSessions() {
        return completedSessions;
    }

    public void setCompletedSessions(Long completedSessions) {
        this.completedSessions = completedSessions;
    }

    public Long getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(Long totalSessions) {
        this.totalSessions = totalSessions;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public long getActiveDays() {
        return activeDays;
    }

    public void setActiveDays(long activeDays) {
        this.activeDays = activeDays;
    }
}
