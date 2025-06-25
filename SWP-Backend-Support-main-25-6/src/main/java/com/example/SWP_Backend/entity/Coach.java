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
    private Long coachId; // Long, tự tăng độc lập với userId

    @OneToOne
    @JoinColumn(name = "UserID", referencedColumnName = "UserID", unique = true, nullable = false)
    private User user;

    @Column(name = "FullName", nullable = false)
    @Nationalized
    private String fullName;

    @Column(name = "Specialization")
    @Nationalized
    private String specialization;

    @Column(name = "Degree")
    @Nationalized
    private String degree;

    @Column(name = "PhoneNumber", length = 20)
    private String phoneNumber;

    @Column(name = "Gender", length = 10)
    @Nationalized
    private String gender;

    @Column(name = "Address")
    @Nationalized
    private String address;

    @Column(name = "Experience")
    @Nationalized
    private String experience;

    @Column(name = "Rating")
    private Double rating;

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
}
