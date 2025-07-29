package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.CessationPlanRequest;
import com.example.SWP_Backend.dto.CessationPlanUpdateRequest;
import com.example.SWP_Backend.entity.CessationPlan;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.CessationPlanRepository;
import com.example.SWP_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service triển khai các nghiệp vụ cho Kế hoạch cai nghiện.
 * Chịu trách nhiệm thực thi tạo mới, cập nhật, và lấy danh sách kế hoạch cho từng user.
 */
@Service
public class CessationPlanServiceImpl implements CessationPlanService {
    private final CessationPlanRepository planRepository;
    private final UserRepository userRepository;

    @Autowired
    public CessationPlanServiceImpl(CessationPlanRepository planRepository, UserRepository userRepository) {
        this.planRepository = planRepository;
        this.userRepository = userRepository;
    }

    /**
     * Tạo mới kế hoạch cai nghiện cho user.
     * - Nhận DTO từ controller
     * - Kiểm tra user tồn tại (nếu không có báo lỗi)
     * - Gán các trường từ request cho entity, set active true mặc định
     * - Lưu vào DB và trả về entity đã lưu (bao gồm ID)
     */
    @Override
    public CessationPlan addPlan(CessationPlanRequest req) {
        // Tìm user theo id, nếu không thấy thì ném ra exception
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Khởi tạo kế hoạch mới, set các trường thông tin từ request
        CessationPlan plan = new CessationPlan();
        plan.setUser(user);
        plan.setReasonToQuit(req.getReasonToQuit());
        plan.setStartDate(req.getStartDate());
        plan.setTargetQuitDate(req.getTargetQuitDate());
        plan.setCigarettesPerDay(req.getCigarettesPerDay());
        plan.setSmokingFrequency(req.getSmokingFrequency());
        plan.setCostPerPack(req.getCostPerPack());
        plan.setNotes(req.getNotes());
        plan.setCustomDetails(req.getCustomDetails());
        plan.setActive(true); // Mặc định kế hoạch mới là active

        // Lưu vào DB và trả về
        return planRepository.save(plan);
    }

    /**
     * Cập nhật thông tin một kế hoạch cai nghiện.
     * - Tìm kế hoạch theo id (không thấy thì báo lỗi)
     * - Cập nhật từng trường nếu request có gửi lên
     * - Lưu lại vào DB, trả về entity sau update
     */
    @Override
    public CessationPlan updatePlan(Long planId, CessationPlanUpdateRequest req) {
        CessationPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("CessationPlan not found"));

        // Cập nhật từng trường nếu có dữ liệu mới trong request
        if (req.getReasonToQuit() != null) plan.setReasonToQuit(req.getReasonToQuit());
        if (req.getStartDate() != null) plan.setStartDate(req.getStartDate());
        if (req.getTargetQuitDate() != null) plan.setTargetQuitDate(req.getTargetQuitDate());
        if (req.getCigarettesPerDay() != null) plan.setCigarettesPerDay(req.getCigarettesPerDay());
        if (req.getSmokingFrequency() != null) plan.setSmokingFrequency(req.getSmokingFrequency());
        if (req.getCostPerPack() != null) plan.setCostPerPack(req.getCostPerPack());
        if (req.getNotes() != null) plan.setNotes(req.getNotes());
        if (req.getCustomDetails() != null) plan.setCustomDetails(req.getCustomDetails());
        if (req.getIsActive() != null) plan.setActive(req.getIsActive());

        return planRepository.save(plan);
    }

    /**
     * Lấy danh sách kế hoạch còn hiệu lực (isActive=true) của 1 user.
     * - Tìm tất cả kế hoạch active của user theo userId.
     */
    @Override
    public List<CessationPlan> getActivePlans(Long userId) {
        return planRepository.findByUserUserIdAndIsActive(userId, true);
    }
}
