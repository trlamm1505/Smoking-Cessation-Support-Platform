package com.example.SWP_Backend.repository;

import com.example.SWP_Backend.entity.CessationPlanDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository thao tác với bảng CessationPlanDetail (chi tiết từng ngày trong kế hoạch hỗ trợ cai nghiện).
 * Kế thừa JpaRepository nên được tự động tạo các hàm CRUD cơ bản.
 */
public interface CessationPlanDetailRepository extends JpaRepository<CessationPlanDetail, Long> {
    /**
     * Tìm tất cả chi tiết kế hoạch theo PlanID (mỗi ngày có 1 bản ghi).
     * @param planId ID của kế hoạch hỗ trợ cai nghiện (CessationPlan)
     * @return List<CessationPlanDetail> - danh sách chi tiết từng ngày cho plan này
     *
     * (JPA sẽ tự sinh SQL: SELECT * FROM CessationPlanDetail WHERE plan_planID = :planId)
     */
    List<CessationPlanDetail> findByPlan_PlanID(Long planId);
}
