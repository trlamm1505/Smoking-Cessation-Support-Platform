package com.example.SWP_Backend.service;

import com.example.SWP_Backend.dto.AchievementStatusDTO;
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
    @Autowired private UserRepository userRepo; // Để lấy thông tin user và role

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

                // --- Thành tích tiết kiệm tiền ---
                // [DÙNG THỰC TẾ] – unlock khi BẤT KỲ 1 NGÀY nào tiết kiệm vượt mốc
                case "SAVE_MONEY_100K":
                    achievedDate = findFirstDateMoneySaved(logs, 100_000);
                    achieved = (achievedDate != null);
                    break;
                case "SAVE_MONEY_500K":
                    achievedDate = findFirstDateMoneySaved(logs, 500_000);
                    achieved = (achievedDate != null);
                    break;
                case "SAVE_MONEY_1M":
                    achievedDate = findFirstDateMoneySaved(logs, 1_000_000);
                    achieved = (achievedDate != null);
                    break;
                case "SAVE_MONEY_2M":
                    achievedDate = findFirstDateMoneySaved(logs, 2_000_000);
                    achieved = (achievedDate != null);
                    break;
                case "SAVE_MONEY_5M":
                    achievedDate = findFirstDateMoneySaved(logs, 5_000_000);
                    achieved = (achievedDate != null);
                    break;

                /*
                 ===== [THAM KHẢO – KHÔNG DÙNG] – Cộng dồn nhiều ngày mới đạt =====
                 // Nếu muốn unlock thành tích khi tổng cộng dồn nhiều ngày mới đạt, thay thế đoạn trên bằng đoạn này:
                case "SAVE_MONEY_100K":
                    achievedDate = findFirstDateTotalMoney(logs, 100_000);
                    achieved = (achievedDate != null);
                    break;
                case "SAVE_MONEY_500K":
                    achievedDate = findFirstDateTotalMoney(logs, 500_000);
                    achieved = (achievedDate != null);
                    break;
                // ... các mốc khác tương tự ...
                ===================================================================
                */
                default:
                    break;
            }

            if (achieved && achievedDate != null) {
                UserAchievement ua = new UserAchievement();
                ua.setUser(user); // Có thể truyền user luôn (không cần tạo new User(userId))
                ua.setAchievement(ach);
                ua.setAchievedDate(achievedDate);
                userAchievementRepo.save(ua);

                // // Nếu sau này có Badge, gắn thêm code cấp badge ở đây
                // badgeService.grantBadgeIfNeeded(userId, ach.getCode(), achievedDate);
            }
        }
    }

    /**
     * Tìm ngày đầu tiên user đạt chuỗi N ngày liên tiếp không hút thuốc.
     * Nếu không có chuỗi nào đủ dài thì trả null.
     */
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

    /**
     * [DÙNG THỰC TẾ] Tìm ngày đầu tiên có số tiền tiết kiệm >= targetMoney trong 1 ngày.
     * Unlock thành tích nếu chỉ cần 1 ngày vượt mốc (như user nhập 1 ngày lớn là đạt).
     * (Dành cho kiểu moneySaved là double, không cần check null)
     */
    private LocalDate findFirstDateMoneySaved(List<HabitLog> logs, double targetMoney) {
        return logs.stream()
                .filter(log -> log.getMoneySaved() >= targetMoney)
                .map(HabitLog::getLogDate)
                .findFirst()
                .orElse(null);
    }

    /**
     * [THAM KHẢO – KHÔNG DÙNG] Tìm ngày đầu tiên tổng tiền tiết kiệm tích lũy vượt targetMoney (cộng dồn nhiều ngày).
     * Nếu muốn đổi rule sang kiểu “cộng dồn nhiều ngày mới đạt”, dùng hàm này thay hàm trên.
     * (Dành cho kiểu moneySaved là double, không cần check null)
     */
    private LocalDate findFirstDateTotalMoney(List<HabitLog> logs, double targetMoney) {
        double sum = 0;
        for (HabitLog log : logs) {
            sum += log.getMoneySaved(); // double mặc định 0.0 nếu không nhập
            if (sum >= targetMoney) return log.getLogDate();
        }
        return null;
    }

    // ================== API bổ sung ==================

    /**
     * Lấy toàn bộ achievements theo type (dành cho FE lọc hiển thị).
     */
    public List<Achievement> getAchievementsByType(String type) {
        return achievementRepo.findByType(type);
    }

    /**
     * Lấy trạng thái thành tích (đã đạt/chưa, ngày đạt) của 1 user theo type.
     * Nếu user không phải "member", trả về tất cả thành tích với trạng thái chưa đạt.
     */
    public List<AchievementStatusDTO> getAchievementStatusForUserByType(Long userId, String type) {
        User user = userRepo.findById(userId).orElse(null);
        List<Achievement> achievements = achievementRepo.findByType(type);

        if (user == null || !"member".equalsIgnoreCase(user.getRole())) {
            // Nếu không phải member thì trả về all false (chưa đạt)
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

    /**
     * Lấy trạng thái tất cả thành tích (đã đạt/chưa, ngày đạt) của 1 user (mọi loại).
     * Nếu không phải member, trả về all false.
     */
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
