package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.DayPlanDTO;
import com.example.SWP_Backend.service.PlanStageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/stages")
public class PlanStageController {

    private final PlanStageService planStageService;

    @Autowired
    public PlanStageController(PlanStageService planStageService) {
        this.planStageService = planStageService;
    }

    /**
     * API lấy từng ngày kế hoạch theo mức độ và số ngày người dùng chọn.
     */
    @GetMapping("/generate")
    public List<DayPlanDTO> generateStages(
            @RequestParam String mucDoKeHoach,
            @RequestParam int soNgay) throws IOException {
        return planStageService.loadDaysForUser(
                "src/main/resources/ke_hoach_cai_thuoc_chi_tiet.xlsx",
                mucDoKeHoach,
                soNgay
        );
    }
}
