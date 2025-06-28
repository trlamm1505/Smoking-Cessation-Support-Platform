package com.example.SWP_Backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter

public class PaymentDetailDTO {
    private Long paymentId;
    private String userEmail;
    private String userFullName;
    private Long packageId;
    private String packageName;
    private Double amount;
    private String paymentMethod;
    private String transactionId;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate renewalDate;
    // ... các trường khác cần cho FE
    // Getter/Setter
}