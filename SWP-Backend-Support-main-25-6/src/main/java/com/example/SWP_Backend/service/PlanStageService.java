package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.DayPlanDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PlanStageService {

    /// Sau đây là phần tính mức độ
    public static String tinhMucDo(int years, int cigarettesPerDay) {
        double packYear = (cigarettesPerDay / 20.0) * years;
        if (packYear < 5) return "Nhẹ";
        else if (packYear < 20) return "Trung bình";
        else return "Nặng";
    }

    /**
     * Đọc từng dòng từ file Excel và trả về từng ngày (DayPlanDTO).
     * Có log debug để kiểm tra từng bước khi đọc file.
     * @param filePath        Đường dẫn file Excel
     * @param mucDoKeHoach    Mức độ kế hoạch ("Nhẹ", "Nặng", ...)
     * @param soNgayToiDa     Tổng số ngày mục tiêu của user (10, 20, 30)
     * @return                Danh sách kế hoạch từng ngày cho user
     * @throws IOException    Nếu file không đọc được
     */
    public List<DayPlanDTO> loadDaysForUser(String filePath, String mucDoKeHoach, int soNgayToiDa) throws IOException {
        List<Row> filteredRows = new ArrayList<>();
        try (FileInputStream fis = new FileInputStream(filePath); Workbook wb = new XSSFWorkbook(fis)) {
            Sheet sheet = wb.getSheetAt(0);

            // Bước 1: lọc ra các dòng đúng mucDoKeHoach & soNgay
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String mucDo = getString(row.getCell(0)).trim();
                int soNgay = parseSoNgay(getString(row.getCell(1)).trim());
                if (!mucDo.equalsIgnoreCase(mucDoKeHoach) || soNgay != soNgayToiDa) continue;
                filteredRows.add(row);
            }

            // Bước 2: đếm tổng số ngày của mỗi giai đoạn (stageOrder)
            Map<Integer, Integer> stageOrderToCount = new HashMap<>();
            for (Row row : filteredRows) {
                Cell giaiDoanCell = row.getCell(3);
                int giaiDoan = (giaiDoanCell != null && giaiDoanCell.getCellType() == CellType.NUMERIC)
                        ? (int) giaiDoanCell.getNumericCellValue() : -1;
                if (giaiDoan > 0) {
                    stageOrderToCount.put(giaiDoan, stageOrderToCount.getOrDefault(giaiDoan, 0) + 1);
                }
            }

            // Bước 3: build DayPlanDTO cho từng dòng đã lọc
            List<DayPlanDTO> days = new ArrayList<>();
            for (Row row : filteredRows) {
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

                Cell giaiDoanCell = row.getCell(3);
                int giaiDoan = (giaiDoanCell != null && giaiDoanCell.getCellType() == CellType.NUMERIC)
                        ? (int) giaiDoanCell.getNumericCellValue() : -1;
                if (giaiDoan <= 0) continue;

                String mucTieu = getString(row.getCell(4)).trim();
                List<String> hoatDong = new ArrayList<>();
                for (int col = 5; col <= 9; col++) {
                    String val = getString(row.getCell(col)).trim();
                    if (!val.isEmpty()) hoatDong.add(val);
                }

                int soNgayTrongGiaiDoan = stageOrderToCount.getOrDefault(giaiDoan, 0);

                DayPlanDTO dayDTO = new DayPlanDTO();
                dayDTO.setMucDoKeHoach(mucDoKeHoach);
                dayDTO.setSo_ngay_trong_giai_doan(soNgayTrongGiaiDoan);
                dayDTO.setDay(day);
                dayDTO.setStageOrder(giaiDoan);
                dayDTO.setStageName("Giai đoạn " + giaiDoan);
                dayDTO.setGoal(mucTieu);
                dayDTO.setActivities(hoatDong);
                days.add(dayDTO);
            }
            return days;
        }
    }


    /**
     * Parse số ngày từ chuỗi kiểu "10 ngày", "20 ngày"...
     * Trả về tổng số (nếu là "10 ngày, 5 ngày" thì trả về 15).
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
     * Đọc giá trị cell an toàn, tránh lỗi null pointer.
     */
    private String getString(Cell cell) {
        return cell == null ? "" : cell.toString().trim();
    }
}
