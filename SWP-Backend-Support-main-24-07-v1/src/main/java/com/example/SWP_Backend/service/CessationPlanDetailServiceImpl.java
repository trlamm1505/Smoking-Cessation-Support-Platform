package com.example.SWP_Backend.service;

import com.example.SWP_Backend.entity.CessationPlanDetail;
import com.example.SWP_Backend.repository.CessationPlanDetailRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Triển khai logic cho nghiệp vụ thao tác dữ liệu chi tiết ngày của Kế hoạch cai nghiện.
 * Dùng để lưu và lấy danh sách các chi tiết từng ngày của một plan.
 */
@Service
public class CessationPlanDetailServiceImpl implements CessationPlanDetailService {

    // Repository thao tác với bảng CessationPlanDetail (chi tiết ngày)
    private final CessationPlanDetailRepository repository;

    // Inject repository qua constructor
    public CessationPlanDetailServiceImpl(CessationPlanDetailRepository repository) {
        this.repository = repository;
    }

    /**
     * Lưu danh sách chi tiết từng ngày của một kế hoạch vào DB.
     * Thường dùng khi import file Excel lên.
     * @param details Danh sách detail cần lưu (chưa có id)
     * @return Danh sách đã lưu (có id do DB sinh ra)
     */
    @Override
    public List<CessationPlanDetail> saveAll(List<CessationPlanDetail> details) {
        return repository.saveAll(details);
    }

    /**
     * Lấy toàn bộ danh sách chi tiết ngày thuộc một plan (theo planId)
     * @param planId id của plan cần lấy detail
     * @return Danh sách các detail thuộc plan đó
     */
    @Override
    public List<CessationPlanDetail> getDetailsByPlanId(Long planId) {
        // Tên hàm findByPlan_PlanID tuân theo chuẩn JPA truy vấn theo quan hệ khóa ngoại
        return repository.findByPlan_PlanID(planId);
    }
}
