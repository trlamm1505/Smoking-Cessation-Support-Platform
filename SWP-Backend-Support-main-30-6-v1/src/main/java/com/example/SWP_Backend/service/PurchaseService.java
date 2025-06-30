package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.NotificationRequestDTO;
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

/**
 * Service xử lý mua/gia hạn gói thành viên.
 */
@Service
public class PurchaseService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MembershipPackageRepository packageRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    // === BỔ SUNG NOTIFICATION SERVICE ===
    @Autowired
    private NotificationService notificationService;

    /**
     * Xử lý mua/gia hạn gói thành viên cho user.
     * - Nếu user còn hạn, gói mới bắt đầu sau ngày hết hạn cũ (nối tiếp, cộng dồn ngày).
     * - Nếu user đã hết hạn hoặc chưa từng mua, gói mới bắt đầu từ hôm nay.
     * - Luôn cập nhật user thành member nếu đang là guest, chỉ update hạn & role nếu gói mới bắt đầu ngay.
     */
    public Payment purchasePackage(PurchaseRequest request) {
        // 1. Lấy user & package từ database
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MembershipPackage membershipPackage = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        // Không cho phép admin/coach mua gói
        if ("admin".equalsIgnoreCase(user.getRole()) || "coach".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Admin and Coach are not allowed to purchase membership packages.");
        }

        LocalDate today = LocalDate.now();
        LocalDate startDate;
        // Nếu user còn hạn thì gói mới nối tiếp sau ngày hết hạn cũ, còn lại thì từ hôm nay
        if (user.getSubscriptionEndDate() != null && !user.getSubscriptionEndDate().isBefore(today)) {
            startDate = user.getSubscriptionEndDate().plusDays(1);
        } else {
            startDate = today;
        }
        LocalDate endDate = startDate.plusDays(membershipPackage.getDurationDays() - 1);
        LocalDate renewalDate = endDate.plusDays(1);

        // 3. Tạo bản ghi payment mới
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPackageInfo(membershipPackage);
        payment.setAmount(membershipPackage.getPrice());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionID(UUID.randomUUID().toString());
        payment.setStatus("completed");
        payment.setStartDate(startDate);
        payment.setEndDate(endDate);
        payment.setRenewalDate(renewalDate);

        paymentRepository.save(payment);

        // 4. Sau khi mua/gia hạn xong, cập nhật lại role & hạn thành viên dựa trên tất cả các payment còn hiệu lực
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

        // ======= TÍCH HỢP GỬI THÔNG BÁO =======

        // Gửi noti cho USER về việc mua/gia hạn thành công
        NotificationRequestDTO userNoti = new NotificationRequestDTO();
        userNoti.setTitle("Bạn đã mua/gia hạn gói thành viên thành công");
        userNoti.setContent("Chúc mừng! Bạn đã đăng ký gói \"" + membershipPackage.getPackageName() +
                "\". Hạn sử dụng đến: " + maxEndDate + ".");
        userNoti.setSenderId(3L); // Admin gửi (thay bằng id admin thật nếu cần)
        userNoti.setRecipientId(user.getUserId());
        userNoti.setType("package_update");
        notificationService.sendNotification(userNoti);

        // Gửi noti cho ADMIN biết có member mới/gia hạn
        NotificationRequestDTO adminNoti = new NotificationRequestDTO();
        adminNoti.setTitle("Thành viên mới/gia hạn gói");
        adminNoti.setContent("Người dùng " + user.getFullName() + " (" + user.getEmail() + ") vừa đăng ký/gia hạn gói \"" +
                membershipPackage.getPackageName() + "\" đến ngày " + maxEndDate + ".");
        adminNoti.setSenderId(3L); // Admin gửi
        adminNoti.setTargetRole("admin"); // Gửi cho tất cả admin
        adminNoti.setType("package_update");
        notificationService.sendNotification(adminNoti);

        return payment;
    }
}
