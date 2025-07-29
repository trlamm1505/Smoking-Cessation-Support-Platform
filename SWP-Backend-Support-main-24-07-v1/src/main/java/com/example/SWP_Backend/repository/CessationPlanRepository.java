package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.CessationPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CessationPlanRepository extends JpaRepository<CessationPlan, Long> {
    // =========================
    // Lưu ý: Kế thừa JpaRepository cho phép CRUD đầy đủ với bảng CessationPlan
    // =========================

    /**
     * Tìm tất cả các kế hoạch hỗ trợ cai nghiện của 1 user theo trạng thái hoạt động.
     * @param userId   ID của user (người dùng)
     * @param isActive trạng thái active (true = đang dùng, false = đã ngừng hoặc lịch sử)
     * @return List các CessationPlan thỏa mãn
     */
    List<CessationPlan> findByUserUserIdAndIsActive(Long userId, boolean isActive);

    /**
     * Lấy kế hoạch đang hoạt động (isActive = true) đầu tiên của 1 user.
     * Dùng cho các màn hình chỉ hiển thị kế hoạch hiện tại.
     * @param userId ID của user
     * @return Optional<CessationPlan>
     */
    Optional<CessationPlan> findFirstByUserUserIdAndIsActiveTrue(Long userId);

    // =========================
    // Các hàm findBy... dùng JPA Query Method, tự động sinh SQL dựa vào tên hàm,
    // không cần viết query SQL thủ công.
    // =========================
}
