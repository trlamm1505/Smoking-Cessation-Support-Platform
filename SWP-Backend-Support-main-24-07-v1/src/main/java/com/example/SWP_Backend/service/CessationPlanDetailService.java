package com.example.SWP_Backend.service;

import com.example.SWP_Backend.entity.CessationPlanDetail;

import java.util.List;

/**
 * Service interface cho nghiệp vụ chi tiết từng ngày của Kế hoạch cai nghiện.
 * Định nghĩa các phương thức thao tác với dữ liệu chi tiết ngày của từng plan.
 */
public interface CessationPlanDetailService {
    /**
     * Lưu danh sách các bản ghi chi tiết ngày của một kế hoạch cai nghiện.
     * (Dùng khi import dữ liệu từ file Excel hoặc tạo nhiều ngày cùng lúc.)
     * @param details Danh sách đối tượng CessationPlanDetail cần lưu
     * @return Danh sách chi tiết đã lưu trong DB (có id)
     */
    List<CessationPlanDetail> saveAll(List<CessationPlanDetail> details);

    /**
     * Lấy toàn bộ danh sách ngày (chi tiết từng ngày) của một kế hoạch cai nghiện theo planId.
     * @param planId id của kế hoạch cai nghiện
     * @return List các đối tượng CessationPlanDetail thuộc plan đó
     */
    List<CessationPlanDetail> getDetailsByPlanId(Long planId);
}
