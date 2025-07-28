package com.example.SWP_Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "HabitLogs")
public class HabitLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY) // Thêm liên kết đến CessationPlan
    @JoinColumn(name = "plan_id") // Tên cột foreign key trong bảng HabitLogs
    private CessationPlan cessationPlan;

    @Column(nullable = false)
    private LocalDate logDate = LocalDate.now();

    @Column(nullable = false)
    private Boolean smokedToday; // true = có hút, false = không hút

    private Integer cigarettesSmoked;

    private Integer cravingsLevel;

    @Nationalized
    private String mood;

    @Nationalized
    private String notes;

    @Column(
            name = "money_saved",
            nullable = false,
            columnDefinition = "float default 0"
    )
    private double moneySaved = 0.0;

    // ... Getter/Setter giữ nguyên (Lombok @Data sẽ sinh hết rồi)
}
