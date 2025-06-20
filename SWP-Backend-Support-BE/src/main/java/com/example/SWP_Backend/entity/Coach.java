package com.example.SWP_Backend.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.util.List;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Coaches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coach {


    // Khóa chính CoachID (tự tăng)

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CoachID")
    private Long coachId;


    /**
     * Quan hệ 1-1 với User (chỉ user nào có role là 'coach' thì sẽ có dòng profile này)
     * Coach profile chỉ là phần mở rộng thông tin cho user.
     */

    @OneToOne
    @JoinColumn(name = "UserID", referencedColumnName = "UserID", unique = true)
    private User user;


    // ========== Thông tin chuyên biệt cho Coach ==========

    @Column(name = "FullName", nullable = false)
    @Nationalized
    private String fullName; // Họ tên huấn luyện viên

    @Column(name = "Specialization")
    @Nationalized
    private String specialization; // Chuyên môn (ví dụ: cai thuốc, tâm lý...)

    @Column(name = "Degree")
    @Nationalized
    private String degree; // Bằng cấp

    @Column(name = "PhoneNumber", length = 20)
    private String phoneNumber; // Số điện thoại liên hệ

    @Column(name = "Gender", length = 10)
    private String gender; // Giới tính

    @Column(name = "Address")
    @Nationalized
    private String address; // Địa chỉ

    @Column(name = "Experience")
    @Nationalized
    private String experience; // Kinh nghiệm

    @Column(name = "Rating")
    private Double rating; // Đánh giá trung bình

    @Column(name = "Bio")
    @Nationalized
    private String bio; // Giới thiệu bản thân

    @Column(name = "Availability")
    @Nationalized
    private String availability; // Lịch làm việc hoặc trạng thái sẵn sàng

    @Column(name = "ProfilePictureURL")
    private String profilePictureUrl; // Ảnh đại diện

    @Column(name = "IsActive", nullable = false)
    private boolean isActive = true; // Trạng thái hoạt động

    /**
     * Nếu muốn truy xuất danh sách member do coach này quản lý:
     * (Chỉ cần nếu thường xuyên lấy danh sách member của coach)
     * Chỉ cần thêm trường này vào, JPA sẽ tự join theo mappedBy = "coach" ở User.
     */
    // @OneToMany(mappedBy = "coach")
    // private List<User> members;

    // Lombok đã generate getter/setter, constructor đầy đủ

    @Column(name = "FullName", nullable = false)
    @Nationalized
    private String fullName;

    @Column(name = "Specialization")
    @Nationalized
    private String specialization;

    @Column(name = "Bio")
    @Nationalized
    private String bio;

    @Column(name = "Availability")
    @Nationalized
    private String availability;

    @Column(name = "ProfilePictureURL")
    private String profilePictureUrl;

    @Column(name = "IsActive", nullable = false)
    private boolean isActive = true;


    public Long getCoachId() {
        return coachId;
    }

    public void setCoachId(Long coachId) {
        this.coachId = coachId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

}
