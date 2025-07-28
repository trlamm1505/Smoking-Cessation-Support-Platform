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
 * Controller chịu trách nhiệm quản lý các kế hoạch cai thuốc của người dùng.
 * - Gồm chức năng: tạo mới, cập nhật, lấy kế hoạch đang active của user.
 * - Mọi request liên quan đến "cá nhân hóa hành trình cai thuốc" đều đi qua controller này.
 */
@RestController
@RequestMapping("/api/cessation-plans")
public class CessationPlanController {
    // Inject service xử lý nghiệp vụ kế hoạch cai thuốc
    private final CessationPlanService planService;

    @Autowired
    public CessationPlanController(CessationPlanService planService) {
        this.planService = planService;
    }

    /**
     * Tạo mới một kế hoạch cai thuốc cho user (thường gọi khi user vừa đăng ký hoặc muốn bắt đầu kế hoạch mới).
     * - Input: thông tin kế hoạch (reason, số điếu/ngày, note, ...)
     * - Output: trả về kế hoạch vừa tạo (bao gồm ID, trạng thái active, các trường nghiệp vụ khác)
     * - Endpoint: POST /api/cessation-plans
     */
    @PostMapping
    public ResponseEntity<CessationPlan> add(@RequestBody CessationPlanRequest req) {
        return ResponseEntity.ok(planService.addPlan(req));
    }

    /**
     * Cập nhật kế hoạch cai thuốc đã tồn tại.
     * - Input: ID plan cần sửa + thông tin cập nhật (reason, số điếu/ngày, note, trạng thái active...)
     * - Output: trả về kế hoạch đã được cập nhật.
     * - Endpoint: PUT /api/cessation-plans/{planId}
     *
     * Ví dụ call (REST Client/Postman):
     * PUT http://localhost:9090/api/cessation-plans/1
     * Content-Type: application/json
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
     * Lấy danh sách các kế hoạch đang active của một user (thường mỗi user chỉ có 1 plan active tại một thời điểm).
     * - Input: userId (ID người dùng)
     * - Output: trả về danh sách kế hoạch active (thường là 1, có thể mở rộng đa plan cho tương lai)
     * - Endpoint: GET /api/cessation-plans/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CessationPlan>> getActive(@PathVariable Long userId) {
        return ResponseEntity.ok(planService.getActivePlans(userId));
    }
}
