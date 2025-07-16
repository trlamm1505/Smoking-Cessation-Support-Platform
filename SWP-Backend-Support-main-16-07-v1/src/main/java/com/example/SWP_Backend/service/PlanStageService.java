package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.DayPlanDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PlanStageService {

    /**
     * Hàm phụ: Tính số điếu còn lại sau khi giảm X% (làm tròn xuống).
     * Lưu ý: goalPercent phải là phần trăm dạng số nguyên (ví dụ: 30, 50, 80)
     */
    public int calculateReducedCigarettesPerDay(int cigarettesPerDay, int goalPercent) {
        // Sử dụng 100.0 để đảm bảo chia thực, tránh lỗi chia nguyên (int)
        double result = cigarettesPerDay * (1 - goalPercent / 100.0);
        return (int) Math.round(result);
    }

    /**
     * Xác định mức độ ("Nhẹ", "Trung bình", "Nặng") dựa trên số năm và số điếu/ngày.
     */
    public static String tinhMucDo(int years, int cigarettesPerDay) {
        double packYear = (cigarettesPerDay / 20.0) * years;
        if (packYear < 5) return "Nhẹ";
        else if (packYear < 20) return "Trung bình";
        else return "Nặng";
    }

    /**
     * Đọc dữ liệu từng ngày từ file Excel, trả về danh sách DayPlanDTO.
     * - Tính targetCigarettesPerDay dựa trên từng mục tiêu (cột "Mục tiêu") của mỗi dòng.
     * - Nếu "Giảm X% số điếu thuốc ban đầu" thì parse X, áp dụng công thức.
     * - Nếu "Cai hoàn toàn" thì set 0.
     *
     * @param filePath Đường dẫn file Excel
     * @param mucDoKeHoach Mức độ: "Nhẹ", "Trung bình", "Nặng"
     * @param soNgayToiDa Tổng số ngày user chọn (10, 20, 30)
     * @param cigarettesPerDay Số điếu ban đầu mỗi ngày user nhập
     * @return List kế hoạch từng ngày
     * @throws IOException nếu đọc file lỗi
     */
    public List<DayPlanDTO> loadDaysForUser(String filePath, String mucDoKeHoach, int soNgayToiDa, int cigarettesPerDay) throws IOException {
        List<Row> filteredRows = new ArrayList<>();
        // Mở file Excel và lấy sheet đầu tiên
        try (FileInputStream fis = new FileInputStream(filePath); Workbook wb = new XSSFWorkbook(fis)) {
            Sheet sheet = wb.getSheetAt(0);

            // Bước 1: Lọc ra các dòng đúng mức độ và tổng số ngày
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String mucDo = getString(row.getCell(0)).trim();
                int soNgay = parseSoNgay(getString(row.getCell(1)).trim());
                if (!mucDo.equalsIgnoreCase(mucDoKeHoach) || soNgay != soNgayToiDa) continue;
                filteredRows.add(row);
            }

            // Bước 2: Đếm tổng số ngày trong từng giai đoạn (dựa vào trường stageOrder)
            Map<Integer, Integer> stageOrderToCount = new HashMap<>();
            for (Row row : filteredRows) {
                Cell giaiDoanCell = row.getCell(3);
                int giaiDoan = (giaiDoanCell != null && giaiDoanCell.getCellType() == CellType.NUMERIC)
                        ? (int) giaiDoanCell.getNumericCellValue() : -1;
                if (giaiDoan > 0) {
                    stageOrderToCount.put(giaiDoan, stageOrderToCount.getOrDefault(giaiDoan, 0) + 1);
                }
            }

            // Bước 3: Build từng DayPlanDTO và tính targetCigarettesPerDay
            List<DayPlanDTO> days = new ArrayList<>();
            for (Row row : filteredRows) {
                // Parse số thứ tự ngày
                int day = 0;
                Cell dayCell = row.getCell(2);
                if (dayCell != null) {
                    if (dayCell.getCellType() == CellType.NUMERIC) {
                        day = (int) dayCell.getNumericCellValue();
                    } else {
                        try {
                            day = (int) Double.parseDouble(dayCell.toString().trim());
                        } catch (Exception e) { continue; }
                    }
                } else { continue; }

                // Parse thứ tự giai đoạn
                Cell giaiDoanCell = row.getCell(3);
                int giaiDoan = (giaiDoanCell != null && giaiDoanCell.getCellType() == CellType.NUMERIC)
                        ? (int) giaiDoanCell.getNumericCellValue() : -1;
                if (giaiDoan <= 0) continue;

                // Parse mục tiêu (cột "Mục tiêu") để tính số điếu còn lại
                String mucTieu = getString(row.getCell(4)).trim();
                Integer cigarettesLeft = null;

                if (mucTieu.toLowerCase().contains("giảm") && mucTieu.contains("%")) {
                    // Ví dụ: "Giảm 80% số điếu thuốc ban đầu"
                    Pattern p = Pattern.compile("(\\d+)%");
                    Matcher m = p.matcher(mucTieu);
                    if (m.find()) {
                        int percent = Integer.parseInt(m.group(1));
                        // Công thức CHUẨN: lấy đúng số điếu ban đầu user nhập, nhân với (1 - %giảm)
                        cigarettesLeft = (int) Math.round(cigarettesPerDay * (1 - percent / 100.0));
                    }
                } else if (mucTieu.toLowerCase().contains("cai hoàn toàn")) {
                    // Nếu mục tiêu là "Cai hoàn toàn" thì = 0 điếu
                    cigarettesLeft = 0;
                } else {
                    // Nếu mục tiêu không ghi rõ phần trăm, để null hoặc set bằng số điếu ban đầu
                    cigarettesLeft = cigarettesPerDay;
                }

                // Parse danh sách hoạt động (từ cột 5 → 9)
                List<String> hoatDong = new ArrayList<>();
                for (int col = 5; col <= 9; col++) {
                    String val = getString(row.getCell(col)).trim();
                    if (!val.isEmpty()) hoatDong.add(val);
                }

                int soNgayTrongGiaiDoan = stageOrderToCount.getOrDefault(giaiDoan, 0);

                // Build DayPlanDTO, gán đầy đủ thông tin và số điếu còn lại mỗi ngày
                DayPlanDTO dayDTO = new DayPlanDTO();
                dayDTO.setMucDoKeHoach(mucDoKeHoach);
                dayDTO.setSo_ngay_trong_giai_doan(soNgayTrongGiaiDoan);
                dayDTO.setDay(day);
                dayDTO.setStageOrder(giaiDoan);
                dayDTO.setStageName("Giai đoạn " + giaiDoan);
                dayDTO.setGoal(mucTieu);
                dayDTO.setActivities(hoatDong);
                dayDTO.setTargetCigarettesPerDay(cigarettesLeft);
                days.add(dayDTO);
            }
            return days;
        }
    }

    /**
     * Parse tổng số ngày từ chuỗi (ví dụ "10 ngày, 5 ngày" → 15)
     */
    private int parseSoNgay(String raw) {
        if (raw == null || raw.trim().isEmpty()) {
            return 0;
        }
        int total = 0;
        String[] parts = raw.split(",");
        for (String part : parts) {
            String numStr = part.replaceAll("[^\\d]", "");
            if (!numStr.isEmpty()) {
                total += Integer.parseInt(numStr);
            }
        }
        return total;
    }

    /**
     * Đọc giá trị cell an toàn (tránh null pointer)
     */
    private String getString(Cell cell) {
        return cell == null ? "" : cell.toString().trim();
    }
}
