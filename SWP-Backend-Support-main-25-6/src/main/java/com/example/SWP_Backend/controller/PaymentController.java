package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.PaymentDetailDTO;
import com.example.SWP_Backend.entity.Payment;
import com.example.SWP_Backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    // Map Payment entity -> DTO
    private PaymentDetailDTO toDto(Payment payment) {
        PaymentDetailDTO dto = new PaymentDetailDTO();
        dto.setPaymentId(payment.getPaymentID());
        dto.setUserEmail(payment.getUser() != null ? payment.getUser().getEmail() : null);
        dto.setUserFullName(payment.getUser() != null ? payment.getUser().getFullName() : null);
        dto.setPackageId(payment.getPackageInfo() != null ? payment.getPackageInfo().getPackageID() : null);
        dto.setPackageName(payment.getPackageInfo() != null ? payment.getPackageInfo().getPackageName() : null);
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setTransactionId(payment.getTransactionID());
        dto.setStatus(payment.getStatus());
        dto.setStartDate(payment.getStartDate());
        dto.setEndDate(payment.getEndDate());
        dto.setRenewalDate(payment.getRenewalDate());
        return dto;
    }

    // GET all payments (có thể filter thêm theo userId nếu cần)
    @GetMapping
    public List<PaymentDetailDTO> getAllPayments(
            @RequestParam(name = "userId", required = false) Long userId
    ) {
        List<Payment> payments = (userId == null)
                ? paymentRepository.findAll()
                : paymentRepository.findByUser_UserId(userId);
        return payments.stream().map(this::toDto).collect(Collectors.toList());
    }

    // GET payment by id
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDetailDTO> getPaymentById(@PathVariable Long id) {
        return paymentRepository.findById(id)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT update payment (admin chỉnh sửa status, amount, ngày)
    @PutMapping("/{id}")
    public ResponseEntity<PaymentDetailDTO> updatePayment(
            @PathVariable Long id,
            @RequestBody PaymentDetailDTO dto
    ) {
        return paymentRepository.findById(id)
                .map(payment -> {
                    // Chỉ cho sửa một số trường!
                    payment.setStatus(dto.getStatus());
                    payment.setAmount(dto.getAmount());
                    payment.setStartDate(dto.getStartDate());
                    payment.setEndDate(dto.getEndDate());
                    payment.setRenewalDate(dto.getRenewalDate());
                    paymentRepository.save(payment);
                    return ResponseEntity.ok(toDto(payment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE payment (admin xóa)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        if (!paymentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        paymentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
