package com.example.SWP_Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "Coaches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CoachID")
    private Long coachId;
    // Khóa chính, tự tăng, định danh duy nhất cho Coach (độc lập với userId)

    @OneToOne
    @JoinColumn(name = "UserID", referencedColumnName = "UserID", unique = true, nullable = false)
    private User user;
    // Liên kết 1-1 tới entity User (userId là khóa ngoại)
    // Mỗi coach đều là một user, dùng để mapping role, đăng nhập, notification...

    @Column(name = "FullName", nullable = false)
    @Nationalized
    private String fullName;
    // Tên đầy đủ của huấn luyện viên

    @Column(name = "Specialization")
    @Nationalized
    private String specialization;
    // Chuyên môn/chuyên ngành tư vấn (ví dụ: cai nghiện thuốc lá, dinh dưỡng...)

    @Column(name = "Degree")
    @Nationalized
    private String degree;
    // Bằng cấp cao nhất/quan trọng (ví dụ: Thạc sĩ, Bác sĩ...)

    @Column(name = "PhoneNumber", length = 20)
    private String phoneNumber;
    // Số điện thoại

    @Column(name = "Gender", length = 10)
    @Nationalized
    private String gender;
    // Giới tính

    @Column(name = "Address")
    @Nationalized
    private String address;
    // Địa chỉ (nơi làm việc, liên lạc)

    @Column(name = "Experience")
    @Nationalized
    private String experience;
    // Kinh nghiệm làm việc/nghề nghiệp (số năm, vị trí...)

    @Column(name = "Rating")
    private Double rating;
    // Điểm đánh giá trung bình từ thành viên (từ feedback consultation)

    @Column(name = "Bio")
    @Nationalized
    private String bio;
    // Tóm tắt thông tin về bản thân (profile ngắn giới thiệu)

    @Column(name = "Availability")
    @Nationalized
    private String availability;
    // Thời gian sẵn sàng nhận tư vấn (có thể dùng cho logic đặt lịch, hiển thị cho member)

    @Column(name = "ProfilePictureURL")
    private String profilePictureUrl;
    // Link ảnh đại diện

    @Column(name = "IsActive", nullable = false)
    private boolean isActive = true;
    // Trạng thái coach: true = đang hoạt động, false = tạm khóa (ẩn khỏi danh sách đặt lịch)
}
