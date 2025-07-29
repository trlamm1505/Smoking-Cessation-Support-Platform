package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.CessationPlanRequest;
import com.example.SWP_Backend.dto.CessationPlanUpdateRequest;
import com.example.SWP_Backend.entity.CessationPlan;

import java.util.List;

/**
 * Interface định nghĩa các nghiệp vụ xử lý cho Kế hoạch cai nghiện (CessationPlan).
 * - Chỉ khai báo method, chưa có code thực thi (phần thực thi ở Impl)
 * - Được gọi bởi Controller khi người dùng thao tác với kế hoạch
 */
public interface CessationPlanService {
    /**
     * Tạo mới 1 kế hoạch cai nghiện cho user (khi user lập kế hoạch hành động)
     * @param req: DTO chứa thông tin kế hoạch gửi lên từ FE (lý do bỏ thuốc, số điếu/ngày, ...)
     * @return entity kế hoạch đã lưu vào DB (bao gồm id tự tăng)
     */
    CessationPlan addPlan(CessationPlanRequest req);

    /**
     * Lấy danh sách tất cả kế hoạch còn hiệu lực (active) của 1 user
     * @param userId: id người dùng
     * @return List<CessationPlan> các plan đang active của user
     */
    List<CessationPlan> getActivePlans(Long userId);

    /**
     * Cập nhật thông tin kế hoạch (người dùng có thể chỉnh sửa lý do, mục tiêu, v.v.)
     * @param planId: id của kế hoạch cần sửa
     * @param req: DTO chứa trường cần cập nhật
     * @return CessationPlan đã cập nhật
     */
    CessationPlan updatePlan(Long planId, CessationPlanUpdateRequest req);
}
