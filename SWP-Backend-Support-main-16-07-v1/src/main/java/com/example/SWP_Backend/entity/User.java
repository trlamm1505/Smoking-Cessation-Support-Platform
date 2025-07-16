package com.example.SWP_Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Users")

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Long userId; // Sửa thành Long

    @Column(name = "Username", nullable = false, unique = true, length = 255)
    @Nationalized
    private String username;

    @Column(name = "PasswordHash", nullable = true, length = 255)
    private String passwordHash;

    @Column(name = "Email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "FullName", length = 255)
    @Nationalized
    private String fullName;

    @Column(name = "RegistrationDate", nullable = false)
    private LocalDateTime registrationDate;

    @Column(name = "LastLoginDate")
    private LocalDateTime lastLoginDate;

    @Column(name = "ProfilePictureURL", length = 255)
    private String profilePictureUrl;

    @Column(name = "CurrentMembershipPackageID")
    private Integer currentMembershipPackageId;

    @Column(name = "SubscriptionEndDate")
    private LocalDate subscriptionEndDate;

    // --- Chỉ coach mới có giá trị này, member thì null ---
    @Column(name = "CoachID")
    private Long coachId;

    @Column(name = "Role", nullable = false, length = 255)
    private String role;

    @Column(name = "Enabled", nullable = false)
    private boolean enabled = false;

    @Column(name = "PhoneNumber", length = 20)
    private String phoneNumber;

    @Column(name = "Hometown", length = 255)
    @Nationalized
    private String hometown;

    @Column(name = "Occupation", length = 255)
    @Nationalized
    private String occupation;

    @Column(name = "Age")
    private Integer age;

    @Column(name = "Address", length = 255)
    @Nationalized
    private String address;

    @Column(name = "Gender", length = 20)
    @Nationalized
    private String gender;


    public User(Long userId) {
        this.userId = userId;
    }

    public User(Long userId, String username, String passwordHash, String email, String fullName, LocalDateTime registrationDate, LocalDateTime lastLoginDate, String profilePictureUrl, Integer currentMembershipPackageId, LocalDate subscriptionEndDate, Long coachId, String role, boolean enabled, String phoneNumber, String hometown, String occupation, Integer age, String address, String gender) {
        this.userId = userId;
        this.username = username;
        this.passwordHash = passwordHash;
        this.email = email;
        this.fullName = fullName;
        this.registrationDate = registrationDate;
        this.lastLoginDate = lastLoginDate;
        this.profilePictureUrl = profilePictureUrl;
        this.currentMembershipPackageId = currentMembershipPackageId;
        this.subscriptionEndDate = subscriptionEndDate;
        this.coachId = coachId;
        this.role = role;
        this.enabled = enabled;
        this.phoneNumber = phoneNumber;
        this.hometown = hometown;
        this.occupation = occupation;
        this.age = age;
        this.address = address;
        this.gender = gender;
    }

    public User() {}

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public LocalDateTime getLastLoginDate() {
        return lastLoginDate;
    }

    public void setLastLoginDate(LocalDateTime lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public Integer getCurrentMembershipPackageId() {
        return currentMembershipPackageId;
    }

    public void setCurrentMembershipPackageId(Integer currentMembershipPackageId) {
        this.currentMembershipPackageId = currentMembershipPackageId;
    }

    public LocalDate getSubscriptionEndDate() {
        return subscriptionEndDate;
    }

    public void setSubscriptionEndDate(LocalDate subscriptionEndDate) {
        this.subscriptionEndDate = subscriptionEndDate;
    }

    public Long getCoachId() {
        return coachId;
    }

    public void setCoachId(Long coachId) {
        this.coachId = coachId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getHometown() {
        return hometown;
    }

    public void setHometown(String hometown) {
        this.hometown = hometown;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    @PrePersist
    protected void onCreate() {
        if (registrationDate == null) {
            registrationDate = LocalDateTime.now();
        }
        if (role == null || role.trim().isEmpty()) {
            role = "guest";
        }
        if (username == null || username.trim().isEmpty()) {
            username = email;
        }
    }
}
