package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.PaymentDetailDTO;
import com.example.SWP_Backend.entity.MembershipPackage;
import com.example.SWP_Backend.entity.Payment;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.MembershipPackageRepository;
import com.example.SWP_Backend.repository.PaymentRepository;
import com.example.SWP_Backend.repository.UserRepository;
import com.example.SWP_Backend.service.PurchaseService;
import com.example.SWP_Backend.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Payment Controller: quản lý thanh toán và quản lý gói thành viên cho user.
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MembershipPackageRepository packageRepository;

    @Autowired
    private PurchaseService purchaseService;


    // ===================== TEST API: Lưu Payment thủ công không cần FE, không cần VnPay =====================
    /**
     * API TEST cho admin/dev: tạo/lưu payment thủ công để kiểm thử mà không cần FE & VnPay (dễ test).
     * POST /api/payments/test-save-payment
     * Body: { "userId": 5, "packageId": 1 }
     * Trả về chi tiết payment vừa được lưu.
     */


    /**
     * API: Lấy gói thành viên hiện tại của user (giao diện "Gói hiện tại" bên FE chỉ cần gọi API này).
     * GET /api/payments/current-package/{userId}
     */
    @GetMapping("/current-package/{userId}")
    public ResponseEntity<PaymentDetailDTO> getCurrentActivePackage(@PathVariable Long userId) {
        LocalDate today = LocalDate.now();
        Payment active = paymentRepository
                .findTopByUser_UserIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqualOrderByEndDateDesc(
                        userId, "completed", today, today);

        Optional<User> userOpt = userRepository.findById(userId);
        if (active != null) {
            // Đảm bảo role là member nếu đang có gói active
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (!"member".equals(user.getRole())) {
                    user.setRole("member");
                    user.setCurrentMembershipPackageId(Math.toIntExact(active.getPackageInfo().getPackageID()));
                    user.setSubscriptionEndDate(active.getEndDate());
                    userRepository.save(user);
                }
            }
            return ResponseEntity.ok(toDto(active));
        } else {
            // Không còn gói active: chuyển về guest nếu cần
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (!"guest".equals(user.getRole())) {
                    user.setRole("guest");
                    user.setCurrentMembershipPackageId(null);
                    user.setSubscriptionEndDate(null);
                    userRepository.save(user);
                }
            }
            // Trả về gói gần nhất (nếu có)
            Payment latest = paymentRepository.findTopByUser_UserIdAndStatusOrderByEndDateDesc(userId, "completed");
            if (latest != null) {
                return ResponseEntity.ok(toDto(latest));
            }
            return ResponseEntity.notFound().build();
        }
    }


    // ===================== END TEST API =====================

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


    // DELETE payment (admin xóa)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        if (!paymentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        paymentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ====================== VNPay - Tạm Ẩn Để Chờ FE Làm Xong =====================
/**
 * Chỉ bật các API này khi FE làm xong phần tích hợp VNPAY!
 * Nếu chưa có FE, có thể comment lại hai endpoint này, dùng test-save-payment để kiểm thử thay thế.
 */

// API gọi tạo link thanh toán VnPay (thật)

@PostMapping("/create-vnpay-payment")
public ResponseEntity<Map<String, String>> createVnPayPayment(
        @RequestParam Long userId,
        @RequestParam Long packageId,
        HttpServletRequest request
) {
    MembershipPackage membershipPackage = packageRepository.findById(packageId)
            .orElseThrow(() -> new RuntimeException("Gói không tồn tại!"));

    double fee = membershipPackage.getPrice();

    String paymentUrl = vnPayService.createPaymentUrlWithOrderInfo(fee, request, userId, packageId);

    Map<String, String> map = new HashMap<>();
    map.put("url", paymentUrl);
    return ResponseEntity.ok(map);
}


// Callback nhận thông báo thanh toán từ VnPay (gọi khi user thanh toán thành công/thất bại)
@GetMapping("/vnpay-callback")
public void vnPayCallback(HttpServletRequest request, HttpServletResponse response) throws Exception {
    String status = request.getParameter("vnp_ResponseCode"); // "00" là thành công
    String vnpOrderInfo = request.getParameter("vnp_OrderInfo"); // userId|packageId
    String transactionNo = request.getParameter("vnp_TransactionNo");
    String vnpAmount = request.getParameter("vnp_Amount");

    Long userId = null, packageId = null;
    if (vnpOrderInfo != null && vnpOrderInfo.contains("|")) {
        String[] parts = vnpOrderInfo.split("\\|");
        userId = Long.parseLong(parts[0]);
        packageId = Long.parseLong(parts[1]);
    }

    // Chỉ xử lý nếu thanh toán thành công và đủ tham số
    if ("00".equals(status) && userId != null && packageId != null) {
        double amount = Double.parseDouble(vnpAmount) / 100.0; // VNPay trả về *100
        try {
            // Sử dụng service mới cho đầy đủ logic: tạo payment, cập nhật user, gửi notification...
            purchaseService.handleVnPayPayment(userId, packageId, transactionNo, amount);
        } catch (Exception e) {
            e.printStackTrace();
            // Nếu muốn, có thể log thêm, gửi noti lỗi...
        }
    }

    // Redirect về FE như cũ (dù thành công/thất bại)
    String redirectUrl = "http://localhost:5173/payment-status?vnp_ResponseCode=" + status;
    response.sendRedirect(redirectUrl);
}


}
