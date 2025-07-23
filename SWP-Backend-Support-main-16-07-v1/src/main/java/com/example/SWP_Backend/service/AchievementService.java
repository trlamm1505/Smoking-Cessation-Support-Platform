package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.AchievementStatusDTO;
import com.example.SWP_Backend.dto.NotificationRequestDTO;
import com.example.SWP_Backend.entity.*;
import com.example.SWP_Backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AchievementService {
    @Autowired private AchievementRepository achievementRepo;
    @Autowired private UserAchievementRepository userAchievementRepo;
    @Autowired private HabitLogRepository habitLogRepo;
    @Autowired private UserRepository userRepo;

    // ======== TÍCH HỢP NOTIFICATION ========
    @Autowired private NotificationService notificationService;
    // =======================================

    /**
     * Kiểm tra và tự động gán thành tích cho user dựa trên lịch sử HabitLog.
     * Gọi hàm này sau mỗi lần logHabit thành công.
     * CHỈ tính cho user có role = "member". Các role khác (coach, admin) sẽ không được xét thành tích.
     */
    public void checkAndAwardAchievements(Long userId) {
        // Kiểm tra role user, chỉ member mới tính thành tích
        User user = userRepo.findById(userId).orElse(null);
        if (user == null || !"member".equalsIgnoreCase(user.getRole())) {
            // Nếu không phải member thì bỏ qua
            return;
        }

        List<Achievement> allAchievements = achievementRepo.findAll();
        List<HabitLog> logs = habitLogRepo.findByUserIdOrderByLogDateAsc(userId);
        List<UserAchievement> userAchievements = userAchievementRepo.findByUserUserId(userId);

        for (Achievement ach : allAchievements) {
            // Nếu user đã có thành tích này, bỏ qua
            boolean alreadyAchieved = userAchievements.stream()
                    .anyMatch(u -> u.getAchievement().getId().equals(ach.getId()));
            if (alreadyAchieved) continue;

            boolean achieved = false;
            LocalDate achievedDate = null;

            switch (ach.getCode()) {
                // --- Thành tích không hút thuốc ---
                case "NO_SMOKE_1_DAY":
                    achieved = logs.stream().anyMatch(l -> Boolean.FALSE.equals(l.getSmokedToday()));
                    if (achieved)
                        achievedDate = logs.stream()
                                .filter(l -> Boolean.FALSE.equals(l.getSmokedToday()))
                                .map(HabitLog::getLogDate).findFirst().orElse(null);
                    break;
                case "NO_SMOKE_3_DAY":
                    achievedDate = findConsecutiveNoSmokeDay(logs, 3);
                    achieved = (achievedDate != null);
                    break;
                case "NO_SMOKE_7_DAY":
                    achievedDate = findConsecutiveNoSmokeDay(logs, 7);
                    achieved = (achievedDate != null);
                    break;
                case "NO_SMOKE_14_DAY":
                    achievedDate = findConsecutiveNoSmokeDay(logs, 14);
                    achieved = (achievedDate != null);
                    break;
                case "NO_SMOKE_30_DAY":
                    achievedDate = findConsecutiveNoSmokeDay(logs, 30);
                    achieved = (achievedDate != null);
                    break;
                case "NO_SMOKE_90_DAY":
                    achievedDate = findConsecutiveNoSmokeDay(logs, 90);
                    achieved = (achievedDate != null);
                    break;
                case "NO_SMOKE_180_DAY":
                    achievedDate = findConsecutiveNoSmokeDay(logs, 180);
                    achieved = (achievedDate != null);
                    break;
                case "NO_SMOKE_365_DAY":
                    achievedDate = findConsecutiveNoSmokeDay(logs, 365);
                    achieved = (achievedDate != null);
                    break;

                // --- Thành tích tiết kiệm tiền (cộng dồn) ---
                case "SAVE_MONEY_100K":
                    achievedDate = findFirstDateTotalMoney(logs, 100_000);
                    achieved = (achievedDate != null);
                    break;
                case "SAVE_MONEY_500K":
                    achievedDate = findFirstDateTotalMoney(logs, 500_000);
                    achieved = (achievedDate != null);
                    break;
                case "SAVE_MONEY_1M":
                    achievedDate = findFirstDateTotalMoney(logs, 1_000_000);
                    achieved = (achievedDate != null);
                    break;
                case "SAVE_MONEY_2M":
                    achievedDate = findFirstDateTotalMoney(logs, 2_000_000);
                    achieved = (achievedDate != null);
                    break;
                case "SAVE_MONEY_5M":
                    achievedDate = findFirstDateTotalMoney(logs, 5_000_000);
                    achieved = (achievedDate != null);
                    break;

                default:
                    break;
            }

            if (achieved && achievedDate != null) {
                UserAchievement ua = new UserAchievement();
                ua.setUser(user);
                ua.setAchievement(ach);
                ua.setAchievedDate(achievedDate);
                userAchievementRepo.save(ua);

                // ====== GỬI THÔNG BÁO THÀNH TÍCH ======
                NotificationRequestDTO noti = new NotificationRequestDTO();
                noti.setTitle("Chúc mừng bạn đạt thành tích mới!");
                noti.setContent("Bạn vừa đạt thành tích: " + ach.getName());
                noti.setRecipientId(user.getUserId());
                noti.setType("achievement");
                notificationService.sendNotification(noti);
                // =======================================
            }
        }
    }

    // ... các hàm phụ, API getAchievements giữ nguyên (không cần sửa) ...
    private LocalDate findConsecutiveNoSmokeDay(List<HabitLog> logs, int days) {
        int count = 0;
        for (int i = 0; i < logs.size(); i++) {
            if (Boolean.FALSE.equals(logs.get(i).getSmokedToday())) {
                count++;
                if (count == days) return logs.get(i - days + 1).getLogDate();
            } else {
                count = 0;
            }
        }
        return null;
    }

    // Đã loại bỏ findFirstDateMoneySaved (không dùng nữa)

    // Hàm cộng dồn tiền tiết kiệm đạt mốc
    private LocalDate findFirstDateTotalMoney(List<HabitLog> logs, double targetMoney) {
        double sum = 0;
        for (HabitLog log : logs) {
            sum += log.getMoneySaved();
            if (sum >= targetMoney) return log.getLogDate();
        }
        return null;
    }

    // ================== API bổ sung ==================

    public List<Achievement> getAchievementsByType(String type) {
        return achievementRepo.findByType(type);
    }

    public List<AchievementStatusDTO> getAchievementStatusForUserByType(Long userId, String type) {
        User user = userRepo.findById(userId).orElse(null);
        List<Achievement> achievements = achievementRepo.findByType(type);

        if (user == null || !"member".equalsIgnoreCase(user.getRole())) {
            return achievements.stream()
                    .map(a -> new AchievementStatusDTO(a, false, null))
                    .collect(Collectors.toList());
        }

        List<UserAchievement> userAchievements = userAchievementRepo.findByUserUserId(userId);

        return achievements.stream().map(a -> {
            Optional<UserAchievement> match = userAchievements.stream()
                    .filter(ua -> ua.getAchievement().getId().equals(a.getId()))
                    .findFirst();
            boolean achieved = match.isPresent();
            return new AchievementStatusDTO(
                    a,
                    achieved,
                    achieved ? match.get().getAchievedDate() : null
            );
        }).collect(Collectors.toList());
    }

    public List<AchievementStatusDTO> getAchievementStatusForUser(Long userId) {
        User user = userRepo.findById(userId).orElse(null);
        List<Achievement> achievements = achievementRepo.findAll();

        if (user == null || !"member".equalsIgnoreCase(user.getRole())) {
            return achievements.stream()
                    .map(a -> new AchievementStatusDTO(a, false, null))
                    .collect(Collectors.toList());
        }

        List<UserAchievement> userAchievements = userAchievementRepo.findByUserUserId(userId);

        return achievements.stream().map(a -> {
            Optional<UserAchievement> match = userAchievements.stream()
                    .filter(ua -> ua.getAchievement().getId().equals(a.getId()))
                    .findFirst();
            boolean achieved = match.isPresent();
            return new AchievementStatusDTO(
                    a,
                    achieved,
                    achieved ? match.get().getAchievedDate() : null
            );
        }).collect(Collectors.toList());
    }
}
