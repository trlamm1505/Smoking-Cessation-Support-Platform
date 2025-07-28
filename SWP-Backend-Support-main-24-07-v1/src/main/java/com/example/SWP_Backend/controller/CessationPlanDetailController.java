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
 * Controller chịu trách nhiệm quản lý chi tiết các ngày trong một kế hoạch cai thuốc.
 * - Cho phép import danh sách hoạt động/ngày từ file Excel vào hệ thống (dành cho admin hoặc người thiết kế plan).
 * - Lấy danh sách chi tiết các ngày thuộc một plan để hiển thị cho user/coach.
 */
@RestController
@RequestMapping("/api/plan-details")
public class CessationPlanDetailController {

    private final CessationPlanDetailService detailService;
    private final CessationPlanRepository planRepository;

    /**
     * Inject Service và Repository phục vụ thao tác lưu, lấy dữ liệu chi tiết ngày.
     */
    public CessationPlanDetailController(CessationPlanDetailService detailService,
                                         CessationPlanRepository planRepository) {
        this.detailService = detailService;
        this.planRepository = planRepository;
    }

    /**
     * Import danh sách chi tiết từng ngày, từng hoạt động của một plan từ file Excel.
     * - Thường dùng cho admin, giúp tạo nhanh kế hoạch chuẩn hoặc plan mẫu, tiết kiệm thao tác nhập liệu thủ công.
     * - Đọc từng dòng từ file Excel, mapping dữ liệu từng ngày (goal, 5 activity) vào entity CessationPlanDetail.
     * - Lưu toàn bộ danh sách detail vào DB.
     *
     * Endpoint: POST /api/plan-details/import/{planId}
     * Request: Đính kèm file Excel qua form-data, param tên 'file'.
     *
     * Lưu ý: Đọc sheet đầu tiên, bỏ qua dòng header, mapping đúng vị trí cột cho từng trường trong CessationPlanDetail.
     */
    @PostMapping("/import/{planId}")
    public List<CessationPlanDetail> importExcel(
            @PathVariable Long planId,
            @RequestParam("file") MultipartFile file) throws Exception {

        // Lấy plan cần import detail (nếu không có thì báo lỗi)
        CessationPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));

        List<CessationPlanDetail> details = new ArrayList<>();
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0); // Lấy sheet đầu tiên
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Bỏ qua header

                // Mapping dữ liệu từ file Excel vào entity CessationPlanDetail
                CessationPlanDetail detail = new CessationPlanDetail();
                detail.setPlan(plan); // Liên kết với plan cha
                detail.setDay((int) row.getCell(2).getNumericCellValue()); // Cột số thứ tự ngày (cột index 2)
                detail.setGoal(row.getCell(4).getStringCellValue());
                detail.setActivity1(row.getCell(5).getStringCellValue());
                detail.setActivity2(row.getCell(6).getStringCellValue());
                detail.setActivity3(row.getCell(7).getStringCellValue());
                detail.setActivity4(row.getCell(8).getStringCellValue());
                detail.setActivity5(row.getCell(9).getStringCellValue());
                details.add(detail);
            }
        }
        // Lưu toàn bộ danh sách detail vừa import vào DB
        return detailService.saveAll(details);
    }

    /**
     * Lấy danh sách chi tiết các ngày (goal + 5 activity) của một plan cụ thể.
     * - Dùng để FE render UI cho user (hiển thị từng ngày, từng nhiệm vụ phải hoàn thành...)
     * - Dùng cho coach/admin xem nội dung chi tiết của plan.
     *
     * Endpoint: GET /api/plan-details/{planId}
     * Response: List<CessationPlanDetail> của plan tương ứng.
     */
    @GetMapping("/{planId}")
    public List<CessationPlanDetail> getDetailsByPlanId(@PathVariable Long planId) {
        return detailService.getDetailsByPlanId(planId);
    }
}
