package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.PaymentDetailDTO;
import com.example.SWP_Backend.entity.MembershipPackage;
import com.example.SWP_Backend.entity.Payment;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.MembershipPackageRepository;
import com.example.SWP_Backend.repository.PaymentRepository;
import com.example.SWP_Backend.repository.UserRepository;
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



    @PostMapping("/test-save-payment")
    public ResponseEntity<PaymentDetailDTO> testSavePayment(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        Long packageId = body.get("packageId");
        if (userId == null || packageId == null)
            return ResponseEntity.badRequest().build();

        Optional<User> userOpt = userRepository.findById(userId);
        Optional<MembershipPackage> packageOpt = packageRepository.findById(packageId);
        if (userOpt.isEmpty() || packageOpt.isEmpty())
            return ResponseEntity.badRequest().build();

        User user = userOpt.get();
        MembershipPackage membershipPackage = packageOpt.get();

        // Tính ngày cho trường hợp mua mới hoặc gia hạn
        LocalDate now = LocalDate.now();
        LocalDate startDate;
        // Nếu còn hạn, thì ngày bắt đầu là sau ngày hết hạn cũ (gia hạn nối tiếp)
        if (user.getSubscriptionEndDate() != null && user.getSubscriptionEndDate().isAfter(now)) {
            startDate = user.getSubscriptionEndDate().plusDays(1);
        } else {
            startDate = now;
        }
        LocalDate endDate = startDate.plusDays(membershipPackage.getDurationDays());
        LocalDate renewalDate = endDate.plusDays(1);

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPackageInfo(membershipPackage);
        payment.setAmount(membershipPackage.getPrice());
        payment.setPaymentMethod("MANUAL_TEST"); // Chỉ để phân biệt, khi xài thật chuyển thành VNPAY
        payment.setTransactionID(UUID.randomUUID().toString());
        payment.setStatus("completed");
        payment.setStartDate(startDate);
        payment.setEndDate(endDate);
        payment.setRenewalDate(renewalDate);

        // Lưu payment
        paymentRepository.save(payment);

        // Update User: chuyển thành member, cập nhật hạn, package mới
        user.setRole("member");
        user.setCurrentMembershipPackageId(Math.toIntExact(membershipPackage.getPackageID()));
        user.setSubscriptionEndDate(endDate);
        userRepository.save(user);

        // Trả về chi tiết
        return ResponseEntity.ok(toDto(payment));
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

//    // PUT update payment (admin chỉnh sửa status, amount, ngày)
//    @PutMapping("/{id}")
//    public ResponseEntity<PaymentDetailDTO> updatePayment(
//            @PathVariable Long id,
//            @RequestBody PaymentDetailDTO dto
//    ) {
//        return paymentRepository.findById(id)
//                .map(payment -> {
//                    // Chỉ cho sửa một số trường!
//                    payment.setStatus(dto.getStatus());
//                    payment.setAmount(dto.getAmount());
//                    payment.setStartDate(dto.getStartDate());
//                    payment.setEndDate(dto.getEndDate());
//                    payment.setRenewalDate(dto.getRenewalDate());
//                    paymentRepository.save(payment);
//                    return ResponseEntity.ok(toDto(payment));
//                })
//                .orElse(ResponseEntity.notFound().build());
//    }

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
/*
@PostMapping("/create-vnpay-payment/{userId}/{packageId}")
public ResponseEntity<Map<String, String>> createVnPayPayment(
        @PathVariable Long userId,
        @PathVariable Long packageId,
        HttpServletRequest request
) {
    // Lấy thông tin gói, nếu không tồn tại thì báo lỗi
    MembershipPackage membershipPackage = packageRepository.findById(packageId)
            .orElseThrow(() -> new RuntimeException("Gói không tồn tại!"));
    double fee = membershipPackage.getPrice();

    // Gắn thêm order info vào request để callback dễ lấy dữ liệu (dùng vnp_OrderInfo, hoặc vnp_TxnRef là mã giao dịch ngẫu nhiên)
    String paymentUrl = vnPayService.createPaymentUrlWithOrderInfo(fee, request, userId, packageId);

    Map<String, String> map = new HashMap<>();
    map.put("url", paymentUrl);
    return ResponseEntity.ok(map);
}

// Callback nhận thông báo thanh toán từ VnPay (gọi khi user thanh toán thành công/thất bại)
@GetMapping("/vnpay-callback")
public void vnPayCallback(HttpServletRequest request, HttpServletResponse response) throws Exception {
    // --- DEBUG LOG ---
    System.out.println("=== Callback nhận được ===");
    request.getParameterMap().forEach((k,v) -> System.out.println(k + ": " + Arrays.toString(v)));
    // ------------------

    String status = request.getParameter("vnp_ResponseCode"); // "00" là thành công
    String vnpOrderInfo = request.getParameter("vnp_OrderInfo"); // userId|packageId
    String vnpTxnRef = request.getParameter("vnp_TxnRef");
    String vnpAmount = request.getParameter("vnp_Amount"); // số tiền (đơn vị: 100 vnđ)
    String transactionNo = request.getParameter("vnp_TransactionNo"); // Mã giao dịch bên VnPay

    // --- Phân tách userId, packageId từ vnpOrderInfo ---
    Long userId = null;
    Long packageId = null;
    if (vnpOrderInfo != null && vnpOrderInfo.contains("|")) {
        String[] parts = vnpOrderInfo.split("\\|");
        userId = Long.parseLong(parts[0]);
        packageId = Long.parseLong(parts[1]);
    }
    System.out.println("Save payment for user " + userId + ", package " + packageId);
    System.out.println("OrderInfo nhận được: " + vnpOrderInfo);

    // --- Xử lý thanh toán thành công ---
    if ("00".equals(status) && userId != null && packageId != null) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<MembershipPackage> packageOpt = packageRepository.findById(packageId);
        if (userOpt.isPresent() && packageOpt.isPresent()) {
            User user = userOpt.get();
            MembershipPackage membershipPackage = packageOpt.get();

            // === Tính toán ngày hiệu lực (nối tiếp nếu còn hạn, bắt đầu hôm nay nếu hết hạn) ===
            LocalDate now = LocalDate.now();
            LocalDate startDate;
            if (user.getSubscriptionEndDate() != null && user.getSubscriptionEndDate().isAfter(now)) {
                // Gói cũ còn hạn: gói mới bắt đầu sau khi gói cũ hết hạn
                startDate = user.getSubscriptionEndDate().plusDays(1);
            } else {
                // Gói đã hết hạn hoặc chưa từng có gói: bắt đầu từ hôm nay
                startDate = now;
            }
            LocalDate endDate = startDate.plusDays(membershipPackage.getDurationDays());
            LocalDate renewalDate = endDate.plusDays(1);

            // --- Tạo bản ghi payment mới ---
            Payment payment = new Payment();
            payment.setUser(user);
            payment.setPackageInfo(membershipPackage);
            payment.setAmount(membershipPackage.getPrice());
            payment.setPaymentMethod("VNPAY");
            payment.setTransactionID(transactionNo); // Hoặc dùng vnpTxnRef
            payment.setStatus("completed");
            payment.setStartDate(startDate);
            payment.setEndDate(endDate);
            payment.setRenewalDate(renewalDate);
            paymentRepository.save(payment);

            // --- CHỈ update User nếu gói này active NGAY (startDate <= hôm nay) ---
            if (!startDate.isAfter(now)) {
                user.setRole("member");
                user.setCurrentMembershipPackageId(Math.toIntExact(membershipPackage.getPackageID()));
                user.setSubscriptionEndDate(endDate);
                userRepository.save(user);
            }
            // Nếu gói mới là nối tiếp, user vẫn giữ gói cũ đến ngày active (không update user ngay)
        }
    }

    // --- Redirect về FE để báo trạng thái thanh toán ---
    String redirectUrl = String.format(
            "%s/payment-status?vnp_ResponseCode=%s",
            "http://localhost:5173", // FE domain của bạn, thay đổi khi deploy thật
            status
    );
    response.sendRedirect(redirectUrl);
}
*/

}
