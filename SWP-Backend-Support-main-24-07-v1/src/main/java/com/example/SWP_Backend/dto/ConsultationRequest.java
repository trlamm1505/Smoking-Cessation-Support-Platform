package com.example.SWP_Backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConsultationRequest {
    // ID của người dùng (member) yêu cầu đặt lịch tư vấn
    private Long userId;

    // ID của coach mà member muốn đặt lịch tư vấn
    private Long coachId;

    // Thời gian mong muốn hẹn tư vấn giữa member và coach
    private LocalDateTime scheduledTime; // thời gian hẹn tư vấn

    // Ghi chú bổ sung của member gửi kèm khi đặt lịch (tùy chọn)
    private String notes;

    // Hàm khởi tạo đầy đủ tham số
    public ConsultationRequest(Long userId, Long coachId, LocalDateTime scheduledTime, String notes) {
        this.userId = userId;
        this.coachId = coachId;
        this.scheduledTime = scheduledTime;
        this.notes = notes;
    }

    // Getter & Setter cho tất cả thuộc tính – dùng để truyền/nhận dữ liệu giữa client và backend

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCoachId() {
        return coachId;
    }

    public void setCoachId(Long coachId) {
        this.coachId = coachId;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    // Lưu ý: Đây là DTO nhận dữ liệu JSON từ client (gửi lên khi member đặt lịch tư vấn)
    // và truyền sang Service/Controller phía backend để xử lý.
}
