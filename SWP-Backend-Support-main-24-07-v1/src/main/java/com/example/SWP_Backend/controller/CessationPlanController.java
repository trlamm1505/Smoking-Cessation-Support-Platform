package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.CessationPlanRequest;
import com.example.SWP_Backend.dto.CessationPlanUpdateRequest;
import com.example.SWP_Backend.entity.CessationPlan;
import com.example.SWP_Backend.service.CessationPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý các API thao tác với kế hoạch cai nghiện (CessationPlan)
 * Bao gồm: tạo mới, cập nhật, lấy danh sách kế hoạch của 1 user
 */
@RestController
@RequestMapping("/api/cessation-plans")
public class CessationPlanController {
    // Service xử lý nghiệp vụ Plan
    private final CessationPlanService planService;

    @Autowired
    public CessationPlanController(CessationPlanService planService) {
        this.planService = planService;
    }

    /**
     * API tạo mới 1 kế hoạch cai nghiện cho user
     * @param req: Dữ liệu đầu vào (CessationPlanRequest DTO)
     * @return kế hoạch vừa được lưu trong DB
     *
     * Flow:
     *  - User nhập lý do, số lượng thuốc/ngày, thời gian bắt đầu, ghi chú...
     *  - Request gửi lên, service lưu vào DB (cột isActive mặc định true cho plan mới)
     *  - Trả về plan mới tạo cho FE hiển thị (vd: sau khi user vừa lập plan xong sẽ thấy detail của plan)
     */
    @PostMapping
    public ResponseEntity<CessationPlan> add(@RequestBody CessationPlanRequest req) {
        return ResponseEntity.ok(planService.addPlan(req));
    }

    /**
     * API cập nhật kế hoạch cai nghiện đã có (theo ID)
     * @param planId: ID plan cần sửa
     * @param req: Dữ liệu cập nhật (CessationPlanUpdateRequest)
     * @return kế hoạch đã cập nhật
     *
     * Flow:
     *  - User chỉnh sửa lý do, mục tiêu, ghi chú, trạng thái isActive...
     *  - Nếu user ngưng plan (isActive=false), hệ thống sẽ lưu lại và user có thể tạo plan mới sau này.
     *  - Service cập nhật bản ghi trong DB, trả về plan đã sửa cho FE hiển thị
     *
     * Ví dụ JSON (trên Postman):
     * {
     *   "reasonToQuit": "Vì sức khỏe",
     *   "cigarettesPerDay": 10,
     *   "notes": "Cố gắng giảm dần",
     *   "isActive": false
     * }
     */
    @PutMapping("/{planId}")
    public ResponseEntity<CessationPlan> update(
            @PathVariable Long planId,
            @RequestBody CessationPlanUpdateRequest req
    ) {
        return ResponseEntity.ok(planService.updatePlan(planId, req));
    }

    /**
     * API lấy danh sách các kế hoạch cai nghiện đang active của 1 user
     * (Thông thường: mỗi user chỉ có 1 plan active, nhưng để đảm bảo mở rộng trả về list)
     * @param userId: ID người dùng
     * @return List<CessationPlan> các plan đang active của user
     *
     * Flow:
     *  - FE gọi API này để lấy kế hoạch hiện tại của user khi vào trang "Kế hoạch của tôi"
     *  - Service sẽ lọc theo userId và trạng thái isActive=true để lấy plan mới nhất
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CessationPlan>> getActive(@PathVariable Long userId) {
        return ResponseEntity.ok(planService.getActivePlans(userId));
    }
}
