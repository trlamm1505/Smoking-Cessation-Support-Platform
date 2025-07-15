package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.entity.MembershipPackage;
import com.example.SWP_Backend.entity.Payment;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.MembershipPackageRepository;
import com.example.SWP_Backend.repository.PaymentRepository;
import com.example.SWP_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class PurchaseService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MembershipPackageRepository packageRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private NotificationService notificationService;

    private static final Long ADMIN_ID = 3L;

    /**
     * Xử lý callback thanh toán thành công từ VNPay
     */
    public Payment handleVnPayPayment(Long userId, Long packageId, String transactionId, double amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        MembershipPackage membershipPackage = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        if ("admin".equalsIgnoreCase(user.getRole()) || "coach".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Admin and Coach are not allowed to purchase membership packages.");
        }

        // Optional: Check amount matches package (avoid cheat)
        if (amount < membershipPackage.getPrice()) {
            throw new RuntimeException("Thanh toán không hợp lệ, số tiền không đúng gói.");
        }

        LocalDate today = LocalDate.now();
        LocalDate startDate = (user.getSubscriptionEndDate() != null && !user.getSubscriptionEndDate().isBefore(today))
                ? user.getSubscriptionEndDate().plusDays(1)
                : today;
        LocalDate endDate = startDate.plusDays(membershipPackage.getDurationDays() - 1);
        LocalDate renewalDate = endDate.plusDays(1);

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPackageInfo(membershipPackage);
        payment.setAmount(amount);
        payment.setPaymentMethod("VNPAY");
        payment.setTransactionID(transactionId);
        payment.setStatus("completed");
        payment.setStartDate(startDate);
        payment.setEndDate(endDate);
        payment.setRenewalDate(renewalDate);

        paymentRepository.save(payment);

        // Cập nhật user theo hạn cuối của tất cả payment còn hiệu lực
        LocalDate maxEndDate = paymentRepository.findAllByUserUserId(user.getUserId())
                .stream()
                .filter(p -> !"failed".equalsIgnoreCase(p.getStatus()) && p.getEndDate() != null && !p.getEndDate().isBefore(today))
                .map(Payment::getEndDate)
                .max(LocalDate::compareTo)
                .orElse(null);

        if (maxEndDate != null) {
            user.setCurrentMembershipPackageId(Math.toIntExact(membershipPackage.getPackageID()));
            user.setSubscriptionEndDate(maxEndDate);
            user.setRole("member");
        } else {
            user.setCurrentMembershipPackageId(null);
            user.setSubscriptionEndDate(null);
            user.setRole("guest");
        }
        userRepository.save(user);

        // Format ngày đẹp hơn trong thông báo
        String maxEndDateStr = maxEndDate != null
                ? maxEndDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                : "N/A";

        // Gửi thông báo cho USER
        NotificationRequestDTO userNoti = new NotificationRequestDTO();
        userNoti.setTitle("Bạn đã mua/gia hạn gói thành viên thành công");
        userNoti.setContent("Chúc mừng! Bạn đã đăng ký gói \"" + membershipPackage.getPackageName()
                + "\". Hạn sử dụng đến: " + maxEndDateStr + ".");
        userNoti.setSenderId(ADMIN_ID);
        userNoti.setRecipientId(user.getUserId());
        userNoti.setType("package_update");
        notificationService.sendNotification(userNoti);

        // Gửi thông báo cho ADMIN
        NotificationRequestDTO adminNoti = new NotificationRequestDTO();
        adminNoti.setTitle("Thành viên mới/gia hạn gói");
        adminNoti.setContent("Người dùng " + user.getFullName() + " (" + user.getEmail() + ") vừa đăng ký/gia hạn gói \""
                + membershipPackage.getPackageName() + "\" đến ngày " + maxEndDateStr + ".");
        adminNoti.setSenderId(ADMIN_ID);
        adminNoti.setTargetRole("admin");
        adminNoti.setType("package_update");
        notificationService.sendNotification(adminNoti);

        return payment;
    }

    // ... có thể giữ lại purchasePackage cho phương thức mua thủ công nếu muốn ...
}
