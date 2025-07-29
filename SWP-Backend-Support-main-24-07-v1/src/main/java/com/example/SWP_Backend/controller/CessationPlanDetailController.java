package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.entity.CessationPlan;
import com.example.SWP_Backend.entity.CessationPlanDetail;
import com.example.SWP_Backend.repository.CessationPlanRepository;
import com.example.SWP_Backend.service.CessationPlanDetailService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Controller quản lý các API thao tác với chi tiết kế hoạch cai nghiện (CessationPlanDetail)
 * - Import chi tiết từ file Excel cho 1 plan (admin/coach soạn lịch, import lên server)
 * - Lấy danh sách chi tiết ngày cho từng kế hoạch (FE hiển thị lịch trình từng ngày cho user)
 */
@RestController
@RequestMapping("/api/plan-details")
public class CessationPlanDetailController {

    // Service xử lý nghiệp vụ Plan Detail (CRUD, lưu DB)
    private final CessationPlanDetailService detailService;

    // Repository thao tác với bảng kế hoạch chính (để gán detail vào đúng plan)
    private final CessationPlanRepository planRepository;

    public CessationPlanDetailController(CessationPlanDetailService detailService,
                                         CessationPlanRepository planRepository) {
        this.detailService = detailService;
        this.planRepository = planRepository;
    }

    /**
     * API IMPORT FILE EXCEL chứa lịch trình chi tiết từng ngày cho 1 kế hoạch (theo planId)
     * @param planId: ID của plan cần import lịch trình (do coach/admin tạo ra plan trước)
     * @param file: file Excel gửi lên từ client (Multipart)
     * @return List<CessationPlanDetail> đã lưu vào DB
     *
     * Flow:
     *  - Coach/admin soạn lịch trình trên Excel (mỗi dòng: ngày, mục tiêu, hoạt động 1...5)
     *  - FE gửi file Excel, API đọc từng dòng ghi vào bảng CessationPlanDetail, gán đúng planId
     *  - Bỏ qua dòng đầu (header), bắt đầu đọc từ dòng dữ liệu
     *  - Mapping: cột 2 (day), cột 4 (goal), cột 5-9 (5 hoạt động)
     *  - Sau khi import thành công, DB có dữ liệu từng ngày của plan (dùng cho user xem lịch trình hoặc hệ thống giao nhiệm vụ từng ngày)
     */
    @PostMapping("/import/{planId}")
    public List<CessationPlanDetail> importExcel(
            @PathVariable Long planId,
            @RequestParam("file") MultipartFile file) throws Exception {

        // Lấy plan chính từ DB, nếu không có báo lỗi
        CessationPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));

        List<CessationPlanDetail> details = new ArrayList<>();
        // Đọc file Excel gửi lên
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0); // Lấy sheet đầu tiên (thường chỉ có 1 sheet)
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Bỏ qua dòng tiêu đề

                // Mapping dữ liệu từng dòng vào entity
                CessationPlanDetail detail = new CessationPlanDetail();
                detail.setPlan(plan); // Gán foreign key về kế hoạch cha
                detail.setDay((int) row.getCell(2).getNumericCellValue()); // cột 2: Ngày
                detail.setGoal(row.getCell(4).getStringCellValue());       // cột 4: Mục tiêu
                detail.setActivity1(row.getCell(5).getStringCellValue());  // cột 5: Hoạt động 1
                detail.setActivity2(row.getCell(6).getStringCellValue());
                detail.setActivity3(row.getCell(7).getStringCellValue());
                detail.setActivity4(row.getCell(8).getStringCellValue());
                detail.setActivity5(row.getCell(9).getStringCellValue());
                details.add(detail);
            }
        }
        // Lưu toàn bộ lịch trình từng ngày vào DB
        return detailService.saveAll(details);
    }

    /**
     * API lấy danh sách tất cả các ngày (detail) của 1 plan (cho user xem chi tiết lịch trình từng ngày)
     * @param planId: ID kế hoạch
     * @return List<CessationPlanDetail> tất cả các ngày và nhiệm vụ của plan
     *
     * Flow:
     *  - FE gọi API này khi user xem chi tiết kế hoạch hoặc chuyển sang calendar
     *  - Service trả về tất cả detail theo planId, mỗi detail gồm: ngày, mục tiêu, 5 hoạt động
     */
    @GetMapping("/{planId}")
    public List<CessationPlanDetail> getDetailsByPlanId(@PathVariable Long planId) {
        return detailService.getDetailsByPlanId(planId);
    }
}
