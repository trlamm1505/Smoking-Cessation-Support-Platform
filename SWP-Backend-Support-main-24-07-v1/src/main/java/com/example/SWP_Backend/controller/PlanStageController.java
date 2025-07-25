package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.DayPlanDTO;
import com.example.SWP_Backend.dto.SmokingInfoHistoryRequest;
import com.example.SWP_Backend.service.PlanStageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stages")
public class PlanStageController {

    private final PlanStageService planStageService;

    @Autowired
    public PlanStageController(PlanStageService planStageService) {
        this.planStageService = planStageService;
    }

    /**
     * API nhận thông tin lịch sử hút thuốc từ phía FE,
     * BE tự động tính mức độ nặng/nhẹ/trung bình dựa trên số năm và số điếu/ngày,
     * Sinh kế hoạch từng ngày cho user (bao gồm số điếu còn lại/ngày, hoạt động, mục tiêu,...).
     * - Kết quả trả về: {"mucDoKeHoach": ..., "plan": [...]}
     * Trong đó mỗi phần tử "plan" đều có trường "targetCigarettesPerDay" cho từng ngày.
     *
     * @param request DTO chứa số năm hút, số điếu/ngày, số ngày mục tiêu
     * @return Map gồm mức độ và danh sách kế hoạch từng ngày (mỗi ngày có số điếu còn lại cụ thể)
     */
    @PostMapping("/generate")
    public Map<String, Object> generateStages(@RequestBody SmokingInfoHistoryRequest request) throws IOException {
        // Lấy thông tin đầu vào từ request
        int years = request.getYears();
        int cigarettesPerDay = request.getCigarettesPerDay();
        int soNgay = request.getSoNgay();

        // 1. Tính mức độ kế hoạch ("Nhẹ", "Trung bình", "Nặng") dựa trên input
        String mucDoKeHoach = planStageService.tinhMucDo(years, cigarettesPerDay);

        // 2. Đọc file Excel kế hoạch, sinh list kế hoạch từng ngày,
        //    truyền cigarettesPerDay vào để service tính số điếu còn lại mỗi ngày
        List<DayPlanDTO> plan = planStageService.loadDaysForUser(
                "src/main/resources/ke_hoach_cai_thuoc_chi_tiet.xlsx",
                mucDoKeHoach,
                soNgay,
                cigarettesPerDay // Truyền vào để tính targetCigarettesPerDay cho từng ngày
        );

        // 3. Gộp kết quả trả về cho FE: chỉ gồm mucDoKeHoach và mảng plan (chuẩn yêu cầu nghiệp vụ)
        Map<String, Object> result = new HashMap<>();
        result.put("mucDoKeHoach", mucDoKeHoach); // Ví dụ: "Trung bình"
        result.put("plan", plan); // Mỗi phần tử plan đã có targetCigarettesPerDay riêng

        return result;
    }
}
