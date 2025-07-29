package com.example.SWP_Backend.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ConsultationDetailDTO {
    // ID của cuộc tư vấn, primary key của Consultation
    private Long consultationId;

    // ID của thành viên (user) đặt lịch tư vấn
    private Long userId;
    // Tên đăng nhập của thành viên đặt lịch
    private String username; // Member đặt lịch
    // Họ tên đầy đủ của member
    private String userFullName;
    // Số điện thoại của member
    private String userPhoneNumber;
    // Email của member
    private String userEmail;
    // Thời gian kết thúc cuộc tư vấn (có thể mặc định scheduledTime + 2h)
    private LocalDateTime endTime;  // thời gian kết thúc (scheduledTime + 2h)

    // ID của huấn luyện viên tư vấn
    private Long coachId;
    // Họ tên đầy đủ của coach
    private String coachName;    // tên Coach (Coach.fullName hoặc Coach.user.fullName)
    // Username của coach (nếu có)
    private String coachUsername; // username Coach
    // Chuyên ngành/Chuyên môn của coach
    private String coachSpecialization;

    // Thời gian được hẹn bắt đầu tư vấn
    private LocalDateTime scheduledTime;
    // Trạng thái hiện tại của cuộc tư vấn: pending/approved/rejected/completed/cancelled...
    private String status;
    // Ghi chú thêm của member khi đặt lịch
    private String notes;
    // Link phòng tư vấn online (Google Meet hoặc Agora channel)
    private String meetingLink;

    // Feedback phản hồi của member cho cuộc tư vấn này (nếu có)
    private String feedback;
    // Đánh giá số sao cho cuộc tư vấn
    private Integer feedbackRating;

    // // Lưu ý: class này chỉ là DTO để truyền dữ liệu từ backend về frontend
    // // Không chứa logic nghiệp vụ, chỉ lưu trữ dữ liệu tạm thời trả ra từ Service
}
