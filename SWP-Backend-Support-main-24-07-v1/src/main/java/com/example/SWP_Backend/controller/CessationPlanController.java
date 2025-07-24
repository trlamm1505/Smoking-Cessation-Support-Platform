package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.CessationPlanRequest;
import com.example.SWP_Backend.dto.CessationPlanUpdateRequest;
import com.example.SWP_Backend.entity.CessationPlan;
import com.example.SWP_Backend.service.CessationPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cessation-plans")
public class CessationPlanController {
    // Inject CessationPlanService để xử lý logic cho plan
    private final CessationPlanService planService;

    // Constructor injection để dễ test/mock
    @Autowired
    public CessationPlanController(CessationPlanService planService) {
        this.planService = planService;
    }

    /**
     * API tạo mới kế hoạch cai nghiện cho user.
     * - Nhận dữ liệu từ FE dạng CessationPlanRequest (lý do, số điếu/ngày, ghi chú,...)
     * - Trả về CessationPlan vừa tạo.
     */
    @PostMapping
    public ResponseEntity<CessationPlan> add(@RequestBody CessationPlanRequest req) {
        return ResponseEntity.ok(planService.addPlan(req));
    }

    /**
     * API cập nhật kế hoạch cai nghiện.
     * - Truyền planId qua path, body là CessationPlanUpdateRequest (chỉ update các trường được phép).
     * - Trả về CessationPlan sau khi đã cập nhật.
     */
    @PutMapping("/{planId}")
    public ResponseEntity<CessationPlan> update(
            @PathVariable Long planId,
            @RequestBody CessationPlanUpdateRequest req
    ) {
        return ResponseEntity.ok(planService.updatePlan(planId, req));
    }
    /*
    Ví dụ gọi:
    PUT http://localhost:9090/api/cessation-plans/1
    Content-Type: application/json

    {
      "reasonToQuit": "Vì sức khỏe",
      "cigarettesPerDay": 10,
      "notes": "Cố gắng giảm dần",
      "isActive": false
    }
    */

    /**
     * API lấy danh sách kế hoạch cai nghiện còn hiệu lực (isActive) của user.
     * - Truyền userId qua path.
     * - Trả về danh sách các CessationPlan đang còn hiệu lực cho user đó.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CessationPlan>> getActive(@PathVariable Long userId) {
        return ResponseEntity.ok(planService.getActivePlans(userId));
    }
}
