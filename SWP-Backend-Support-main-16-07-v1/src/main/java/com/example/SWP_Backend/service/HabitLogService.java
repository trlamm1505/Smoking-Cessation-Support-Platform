package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.QuitStatsByPlanDTO;
import com.example.SWP_Backend.entity.CessationPlan;
import com.example.SWP_Backend.entity.HabitLog;
import com.example.SWP_Backend.repository.CessationPlanRepository;
import com.example.SWP_Backend.repository.HabitLogRepository;
import com.example.SWP_Backend.repository.HabitLogResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HabitLogService {

    private final HabitLogRepository habitLogRepository;
    private final CessationPlanRepository cessationPlanRepository;
    private final AchievementService achievementService;

    @Autowired
    public HabitLogService(
            HabitLogRepository habitLogRepository,
            CessationPlanRepository cessationPlanRepository,
            AchievementService achievementService
    ) {
        this.habitLogRepository = habitLogRepository;
        this.cessationPlanRepository = cessationPlanRepository;
        this.achievementService = achievementService;
    }

    /**
     * Ghi nhận hoặc cập nhật thói quen ngày hôm nay cho user.
     * Luôn gán CessationPlan active hiện tại cho HabitLog.
     * Đồng thời kiểm tra & cập nhật thành tích ngay sau khi log xong.
     */
    public HabitLog logHabit(HabitLog habitLog) {
        // Nếu client không gửi ngày thì lấy ngày hôm nay
        if (habitLog.getLogDate() == null) {
            habitLog.setLogDate(LocalDate.now());
        }
        // Tự động set smokedToday theo số điếu hút
        if (habitLog.getCigarettesSmoked() == null || habitLog.getCigarettesSmoked() == 0) {
            habitLog.setSmokedToday(false);
        } else {
            habitLog.setSmokedToday(true);
        }

        // Nếu chưa có plan gán, tự động lấy plan active của user (bắt buộc phải có)
        if (habitLog.getCessationPlan() == null) {
            Optional<CessationPlan> planOpt = cessationPlanRepository.findFirstByUserUserIdAndIsActiveTrue(habitLog.getUserId());
            planOpt.ifPresent(habitLog::setCessationPlan);
        }

        // Tìm log cũ theo userId + ngày
        Optional<HabitLog> existing = habitLogRepository.findByUserIdAndLogDate(habitLog.getUserId(), habitLog.getLogDate());
        HabitLog saved;
        if (existing.isPresent()) {
            HabitLog existingLog = existing.get();
            // Cập nhật các trường
            existingLog.setSmokedToday(habitLog.getSmokedToday());
            existingLog.setCigarettesSmoked(habitLog.getCigarettesSmoked());
            existingLog.setCravingsLevel(habitLog.getCravingsLevel());
            existingLog.setMood(habitLog.getMood());
            existingLog.setNotes(habitLog.getNotes());
            existingLog.setMoneySaved(habitLog.getMoneySaved());
            // Cập nhật plan nếu có sự thay đổi (user đổi plan)
            existingLog.setCessationPlan(habitLog.getCessationPlan());
            saved = habitLogRepository.save(existingLog);
        } else {
            saved = habitLogRepository.save(habitLog);
        }

        // Sau khi lưu log, kiểm tra & gán thành tích cho user
        if (achievementService != null) {
            achievementService.checkAndAwardAchievements(habitLog.getUserId());
        }

        return saved;
    }

    // Lấy log theo ngày
    public HabitLog getHabitLog(Long userId, LocalDate logDate) {
        return habitLogRepository.findByUserIdAndLogDate(userId, logDate).orElse(null);
    }

    // Lấy toàn bộ log của user
    public List<HabitLogResponse> getAllLogsForUser(Long userId) {
        List<HabitLog> logs = habitLogRepository.findByUserIdOrderByLogDateDesc(userId);
        return logs.stream().map(log -> {
            HabitLogResponse dto = new HabitLogResponse();
            dto.setId(log.getId());
            dto.setUserId(log.getUserId());
            dto.setLogDate(log.getLogDate());
            dto.setSmokedToday(log.getSmokedToday());
            dto.setCigarettesSmoked(log.getCigarettesSmoked());
            dto.setCravingsLevel(log.getCravingsLevel());
            dto.setMood(log.getMood());
            dto.setNotes(log.getNotes());
            dto.setMoneySaved(log.getMoneySaved());
            dto.setCessationPlanId(log.getCessationPlan() != null ? log.getCessationPlan().getPlanID() : null);
            return dto;
        }).collect(Collectors.toList());
    }

    // Lấy log trong khoảng ngày
    public List<HabitLog> getLogsForUserInRange(Long userId, LocalDate start, LocalDate end) {
        return habitLogRepository.findByUserIdAndLogDateBetween(userId, start, end);
    }

    /**
     * Thống kê theo từng plan: tổng số ngày không hút, tổng tiền tiết kiệm cộng dồn từng ngày.
     */
    public List<QuitStatsByPlanDTO> getQuitStatsByPlan(Long userId) {
        // Lấy tất cả plan của user
        List<CessationPlan> plans = cessationPlanRepository.findAll()
                .stream()
                .filter(p -> p.getUser() != null && p.getUser().getUserId().equals(userId))
                .collect(Collectors.toList());

        // Lấy tất cả HabitLog của user, có liên kết plan
        List<HabitLog> logs = habitLogRepository.findByUserIdOrderByLogDateAsc(userId);

        List<QuitStatsByPlanDTO> stats = new ArrayList<>();
        for (CessationPlan plan : plans) {
            // Lấy logs thuộc về plan này, sắp xếp theo ngày tăng dần để cộng dồn cho chính xác
            List<HabitLog> logsOfPlan = logs.stream()
                    .filter(l -> l.getCessationPlan() != null
                            && l.getCessationPlan().getPlanID().equals(plan.getPlanID()))
                    .collect(Collectors.toList());

            long noSmokeDays = logsOfPlan.stream()
                    .filter(l -> Boolean.FALSE.equals(l.getSmokedToday()))
                    .count();

            // Lấy giá 1 điếu
            double pricePerCigarette = 0;
            int cigarettesPerPack = 20; // Mặc định nếu chưa có field
            if (plan.getCostPerPack() != null) {
                pricePerCigarette = plan.getCostPerPack().doubleValue() / cigarettesPerPack;
            }

            // ==== Tổng tiền tiết kiệm cộng dồn từng ngày ====
            double totalMoneySaved = 0;
            List<String> autoCalculatedNotes = new ArrayList<>(); // Nếu muốn ghi chú lại ngày tự động tính

            for (HabitLog log : logsOfPlan) {
                if (log.getMoneySaved() > 0) {
                    // Số tiền tiết kiệm user nhập hôm đó (cộng dồn)
                    totalMoneySaved += log.getMoneySaved();
                } else {
                    // Nếu FE không nhập, backend tự động tính số tiền tiết kiệm dựa trên số điếu giảm được
                    int cigsOld = plan.getCigarettesPerDay() != null ? plan.getCigarettesPerDay() : 0;
                    int cigsToday = log.getCigarettesSmoked() != null ? log.getCigarettesSmoked() : 0;
                    double saved = (cigsOld - cigsToday) * pricePerCigarette;
                    if (saved > 0) {
                        totalMoneySaved += saved;
                        // Ghi chú các ngày auto tính (dùng để log/debug hoặc trả về FE nếu muốn)
                        String autoNote = String.format(
                                "Ngày %s: Tự động tính tiết kiệm = (cũ %d - nay %d) × %.0f = %.0fđ",
                                log.getLogDate(), cigsOld, cigsToday, pricePerCigarette, saved
                        );
                        autoCalculatedNotes.add(autoNote);
                    }
                }
            }
            // Nếu muốn log ra console cho dev kiểm tra:
            if (!autoCalculatedNotes.isEmpty()) {
                System.out.println("Các ngày tự động tính tiền tiết kiệm cho Plan #" + plan.getPlanID());
                autoCalculatedNotes.forEach(System.out::println);
            }

            stats.add(new QuitStatsByPlanDTO(
                    plan.getPlanID(),
                    "Plan #" + plan.getPlanID(), // hoặc plan.getNotes() nếu bạn có tên plan
                    plan.getCostPerPack(),
                    plan.getCigarettesPerDay(),
                    noSmokeDays,
                    totalMoneySaved
            ));
        }
        return stats;
    }

    /**
     * Thống kê tiến trình cai thuốc theo plan active hiện tại của user.
     */
    public QuitStatsByPlanDTO getActivePlanStats(Long userId) {
        // Tìm plan active
        Optional<CessationPlan> planOpt = cessationPlanRepository.findAll()
                .stream()
                .filter(p -> p.getUser() != null && p.getUser().getUserId().equals(userId) && p.isActive())
                .findFirst();

        if (planOpt.isEmpty()) return null; // hoặc throw exception tùy bạn

        CessationPlan plan = planOpt.get();

        // Lấy log của plan này (sắp xếp ngày tăng dần)
        List<HabitLog> logsOfPlan = habitLogRepository.findByUserIdOrderByLogDateAsc(userId)
                .stream()
                .filter(l -> l.getCessationPlan() != null
                        && l.getCessationPlan().getPlanID().equals(plan.getPlanID()))
                .collect(Collectors.toList());

        long noSmokeDays = logsOfPlan.stream()
                .filter(l -> Boolean.FALSE.equals(l.getSmokedToday()))
                .count();

        double pricePerCigarette = 0;
        int cigarettesPerPack = 20;
        if (plan.getCostPerPack() != null) {
            pricePerCigarette = plan.getCostPerPack().doubleValue() / cigarettesPerPack;
        }

        // ==== Tổng tiền tiết kiệm cộng dồn từng ngày ====
        double totalMoneySaved = 0;
        for (HabitLog log : logsOfPlan) {
            if (log.getMoneySaved() > 0) {
                totalMoneySaved += log.getMoneySaved();
            } else {
                int cigsOld = plan.getCigarettesPerDay() != null ? plan.getCigarettesPerDay() : 0;
                int cigsToday = log.getCigarettesSmoked() != null ? log.getCigarettesSmoked() : 0;
                double saved = (cigsOld - cigsToday) * pricePerCigarette;
                if (saved > 0) {
                    totalMoneySaved += saved;
                }
            }
        }

        return new QuitStatsByPlanDTO(
                plan.getPlanID(),
                "Plan #" + plan.getPlanID(),
                plan.getCostPerPack(),
                plan.getCigarettesPerDay(),
                noSmokeDays,
                totalMoneySaved
        );
    }
}
