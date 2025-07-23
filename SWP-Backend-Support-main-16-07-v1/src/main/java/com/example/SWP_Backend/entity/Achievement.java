package com.example.SWP_Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Achievements")
public class Achievement implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @Nationalized
    private String code; // "NO_SMOKE_1_DAY", "MONEY_100K", ...

    @Column(nullable = false)
    @Nationalized
    private String name;

    @Nationalized
    private String description;
    private String iconUrl; // (icon/ảnh minh họa nếu có)
    @Nationalized
    private String type;    // "success", "money", "health", "challenge"
}
