package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.HabitLogRequest;
import com.example.SWP_Backend.dto.QuitStatsByPlanDTO;
import com.example.SWP_Backend.entity.HabitLog;
import com.example.SWP_Backend.repository.HabitLogResponse;
import com.example.SWP_Backend.service.HabitLogService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/habit-logs")
public class HabitLogController {
    private final HabitLogService habitLogService;

    public HabitLogController(HabitLogService habitLogService) {
        this.habitLogService = habitLogService;
    }

    /**
     * Tạo mới hoặc cập nhật ghi nhận thói quen cho user.
     * Chỉ cần truyền userId, các thông tin khác; service sẽ tự động gán plan active.
     */
    @PostMapping
    public HabitLog logHabit(@RequestBody HabitLogRequest dto) {
        HabitLog log = new HabitLog();
        log.setUserId(dto.getUserId());
        log.setLogDate(dto.getLogDate());
        log.setSmokedToday(dto.getSmokedToday());
        log.setCigarettesSmoked(dto.getCigarettesSmoked());
        log.setCravingsLevel(dto.getCravingsLevel());
        log.setMood(dto.getMood());
        log.setNotes(dto.getNotes());
        log.setMoneySaved(dto.getMoneySaved());
        // KHÔNG cần gán cessationPlan, Service sẽ tự động tìm/gán như đã code ở trên!
        return habitLogService.logHabit(log);
    }

    /**
     * Lấy toàn bộ lịch sử log của user.
     */
    @GetMapping("/all/{userId}")
    public List<HabitLogResponse> getAllLogsForUser(@PathVariable Long userId) {
        return habitLogService.getAllLogsForUser(userId);
    }


    /**
     * Lấy log của user ngày hôm nay.
     */
    @GetMapping("/{userId}")
    public HabitLog getHabitLogForUser(@PathVariable Long userId) {
        return habitLogService.getHabitLog(userId, LocalDate.now());
    }

    /**
     * Lấy các log của user trong khoảng ngày.
     */
    @GetMapping("/range/{userId}")
    public List<HabitLog> getLogsForUserInRange(
            @PathVariable Long userId,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return habitLogService.getLogsForUserInRange(userId, start, end);
    }


    /**
     * API trả về thống kê từng plan của user: số ngày không hút, tổng tiền tiết kiệm cho mỗi plan.
     */
    @GetMapping("/stats/plan/{userId}")
    public List<QuitStatsByPlanDTO> getStatsByPlan(@PathVariable Long userId) {
        return habitLogService.getQuitStatsByPlan(userId);
    }

    // Lấy ra cái thông tin kết quả tiến trình cai thuốc
    @GetMapping("/stats/active/{userId}")
    public QuitStatsByPlanDTO getStatsByActivePlan(@PathVariable Long userId) {
        return habitLogService.getActivePlanStats(userId);
    }

}
