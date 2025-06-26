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
     * Nếu user còn hạn, gói mới sẽ được cộng dồn (nối tiếp sau hạn cũ).
     * Nếu user đã hết hạn hoặc chưa từng mua, gói mới sẽ active ngay hôm nay.
     * Luôn cập nhật user thành member nếu đang là guest.
     */
    public Payment purchasePackage(PurchaseRequest request) {
        // 1. Tìm user và gói cần mua
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        MembershipPackage membershipPackage = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        // 2. Xác định ngày bắt đầu và kết thúc gói mới (CHUẨN cộng dồn)
        LocalDate today = LocalDate.now();
        LocalDate startDate;
        // Lưu ý: isBefore(today) <=> nhỏ hơn hôm nay, còn >= hôm nay là còn hạn
        if (user.getSubscriptionEndDate() != null && !user.getSubscriptionEndDate().isBefore(today)) {
            // Còn hạn (subscriptionEndDate >= hôm nay): gói mới bắt đầu sau ngày hết hạn cũ
            startDate = user.getSubscriptionEndDate().plusDays(1);
        } else {
            // Đã hết hạn hoặc chưa từng mua: gói mới bắt đầu từ hôm nay
            startDate = today;
        }
        // Gói 30 ngày: endDate = startDate + 29 (vì startDate tính là ngày đầu tiên dùng)
        LocalDate endDate = startDate.plusDays(membershipPackage.getDurationDays() - 1);
        LocalDate renewalDate = endDate.plusDays(1);

        // 3. Tạo payment mới
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPackageInfo(membershipPackage);
        payment.setAmount(membershipPackage.getPrice());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionID(UUID.randomUUID().toString());
        payment.setStatus("completed"); // Xác nhận đã thanh toán thành công
        payment.setStartDate(startDate);
        payment.setEndDate(endDate);
        payment.setRenewalDate(renewalDate);

        // 4. Nếu gói mới active ngay (startDate <= hôm nay), update user (role, hạn, id gói)
        // Nếu gói này là nối tiếp (startDate > hôm nay), chưa update user vội (user sẽ thành member khi tới ngày start)
        if (!startDate.isAfter(today)) {
            user.setCurrentMembershipPackageId(Math.toIntExact(membershipPackage.getPackageID()));
            user.setSubscriptionEndDate(endDate);
            if (!"member".equals(user.getRole())) {
                user.setRole("member"); // Đảm bảo là member ngay khi gói có hiệu lực
            }
            userRepository.save(user);
        }
        // Nếu là gói nối tiếp, chỉ lưu payment, KHÔNG update user – sẽ update khi đến ngày start (do job hoặc khi user login/API check gói hiện tại)

        // 5. Lưu payment vào database và trả về
        return paymentRepository.save(payment);
    }

}
