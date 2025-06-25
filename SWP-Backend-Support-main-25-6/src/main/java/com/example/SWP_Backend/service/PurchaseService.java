package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.PurchaseRequest;
import com.example.SWP_Backend.entity.MembershipPackage;
import com.example.SWP_Backend.entity.Payment;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.MembershipPackageRepository;
import com.example.SWP_Backend.repository.PaymentRepository;
import com.example.SWP_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class PurchaseService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MembershipPackageRepository packageRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Xử lý mua/gia hạn gói thành viên cho user.
     * Nếu user còn hạn, gói mới sẽ bắt đầu sau ngày hết hạn cũ (nối tiếp).
     * Nếu user đã hết hạn hoặc chưa từng mua, gói bắt đầu từ hôm nay.
     * Luôn cập nhật user thành member nếu đang là guest.
     */
    public Payment purchasePackage(PurchaseRequest request) {
        // 1. Tìm user và gói cần mua
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        MembershipPackage membershipPackage = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        // 2. Xác định ngày bắt đầu, nối tiếp nếu user còn hạn
        LocalDate now = LocalDate.now();
        LocalDate startDate;
        if (user.getSubscriptionEndDate() != null && user.getSubscriptionEndDate().isAfter(now)) {
            // Gói cũ còn hạn: bắt đầu sau khi gói cũ hết hạn
            startDate = user.getSubscriptionEndDate().plusDays(1);
        } else {
            // Gói đã hết hạn hoặc chưa từng có gói: bắt đầu từ hôm nay
            startDate = now;
        }
        // 3. Ngày kết thúc, ngày renewal
        LocalDate endDate = startDate.plusDays(membershipPackage.getDurationDays());
        LocalDate renewalDate = endDate.plusDays(1);

        // 4. Tạo payment mới
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPackageInfo(membershipPackage);
        payment.setAmount(membershipPackage.getPrice());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionID(UUID.randomUUID().toString());
        payment.setStatus("completed"); // Xác nhận đã hoàn tất
        payment.setStartDate(startDate);
        payment.setEndDate(endDate);
        payment.setRenewalDate(renewalDate);

        // 5. Cập nhật trạng thái user
        user.setCurrentMembershipPackageId(Math.toIntExact(membershipPackage.getPackageID()));
        user.setSubscriptionEndDate(endDate);
        if (!"member".equals(user.getRole())) {
            user.setRole("member"); // Đảm bảo là member ngay khi mua thành công
        }
        userRepository.save(user);

        // 6. Lưu payment vào database
        return paymentRepository.save(payment);
    }
}
