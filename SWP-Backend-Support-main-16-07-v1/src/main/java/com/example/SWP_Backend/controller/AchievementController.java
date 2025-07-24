package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.dto.AchievementStatusDTO;
import com.example.SWP_Backend.dto.UserAchievementStatusDTO;
import com.example.SWP_Backend.dto.UserAchievementSummaryDTO;
import com.example.SWP_Backend.entity.Achievement;
import com.example.SWP_Backend.entity.HabitLog;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.entity.UserAchievement;
import com.example.SWP_Backend.repository.AchievementRepository;
import com.example.SWP_Backend.repository.HabitLogRepository;
import com.example.SWP_Backend.repository.UserAchievementRepository;
import com.example.SWP_Backend.repository.UserRepository;
import com.example.SWP_Backend.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/achievements")
public class AchievementController {

    @Autowired
    private AchievementRepository achievementRepo;

    @Autowired
    private UserAchievementRepository userAchievementRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HabitLogRepository habitLogRepo;

    @Autowired
    private AchievementService achievementService;

    /**
     * API lấy tất cả thành tích, đánh dấu những cái user đã đạt và ngày đạt.
     * Trả về list thành tích kèm trạng thái user đã đạt chưa và ngày đạt (nếu có).
     */
    @GetMapping("/status/{userId}")
    public List<UserAchievementStatusDTO> getStatus(@PathVariable Long userId) {
        List<Achievement> all = achievementRepo.findAll(); // Lấy tất cả achievements trong hệ thống
        List<UserAchievement> achieved = userAchievementRepo.findByUserUserId(userId); // Lấy các achievement user này đã đạt

        List<UserAchievementStatusDTO> result = new ArrayList<>();
        for (Achievement a : all) {
            // Kiểm tra achievement này user đã đạt chưa
            Optional<UserAchievement> ua = achieved.stream()
                    .filter(u -> u.getAchievement().getId().equals(a.getId()))
                    .findFirst();
            result.add(new UserAchievementStatusDTO(
                    a,
                    ua.isPresent(), // true nếu đã đạt, false nếu chưa
                    ua.map(UserAchievement::getAchievedDate).orElse(null) // lấy ngày đạt nếu có
            ));
        }
        return result; // Trả về list trạng thái từng achievement cho user
    }

    /**
     * API lấy danh sách tổng hợp thành tích từng user (top cộng đồng)
     * Trả về cho FE danh sách user (member) gồm: số thành tích đạt, số ngày không hút, tổng tiền tiết kiệm.
     */
    @GetMapping("/user-summary")
    public ResponseEntity<List<UserAchievementSummaryDTO>> getUserAchievementSummaries() {
        List<User> users = userRepository.findAll()
                .stream()
                .filter(u -> "member".equalsIgnoreCase(u.getRole()))
                .toList(); // Chỉ lấy user có role là 'member'

        List<UserAchievementSummaryDTO> result = new ArrayList<>();

        for (User user : users) {
            Long userId = user.getUserId();
            String fullName = user.getFullName();
            String avatarUrl = user.getProfilePictureUrl();

            int achievementCount = userAchievementRepo.countByUserUserId(userId); // Đếm số achievements đã đạt của user

            // Đếm số ngày không hút thuốc (HabitLog.smokedToday = false)
            long noSmokeDays = habitLogRepo.findByUserIdOrderByLogDateDesc(userId)
                    .stream().filter(log -> Boolean.FALSE.equals(log.getSmokedToday())).count();

            // Tổng số tiền tiết kiệm được (sum các HabitLog.moneySaved)
            double moneySaved = habitLogRepo.findByUserIdOrderByLogDateDesc(userId)
                    .stream().mapToDouble(HabitLog::getMoneySaved).sum();

            result.add(new UserAchievementSummaryDTO(
                    userId, fullName, avatarUrl,
                    achievementCount, noSmokeDays, moneySaved
            ));
        }
        return ResponseEntity.ok(result);
    }

    /**
     * API lấy tổng hợp thành tích của 1 user
     * Trả về cho FE thông tin 1 member: tổng thành tích, ngày không hút, tiền tiết kiệm.
     */
    @GetMapping("/user-summary/{userId}")
    public ResponseEntity<UserAchievementSummaryDTO> getUserAchievementSummary(@PathVariable Long userId) {
        // Lấy user từ repo (nếu không tồn tại hoặc không phải member thì trả về 404)
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !"member".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.notFound().build(); // Chỉ member mới có thành tích
        }

        String fullName = user.getFullName();
        String avatarUrl = user.getProfilePictureUrl();

        int achievementCount = userAchievementRepo.countByUserUserId(userId);

        long noSmokeDays = habitLogRepo.findByUserIdOrderByLogDateDesc(userId)
                .stream().filter(log -> Boolean.FALSE.equals(log.getSmokedToday())).count();

        double moneySaved = habitLogRepo.findByUserIdOrderByLogDateDesc(userId)
                .stream().mapToDouble(HabitLog::getMoneySaved).sum();

        UserAchievementSummaryDTO dto = new UserAchievementSummaryDTO(
                userId, fullName, avatarUrl,
                achievementCount, noSmokeDays, moneySaved
        );
        return ResponseEntity.ok(dto);
    }

    // GET tất cả achievements theo type (vd: daily, milestone...)
    @GetMapping("/type/{type}")
    public List<Achievement> getAchievementsByType(@PathVariable String type) {
        return achievementService.getAchievementsByType(type); // Dùng service để lấy theo type
    }

    // GET trạng thái achievements theo type của user (đã đạt/chưa đạt)
    @GetMapping("/status/{userId}/type/{type}")
    public List<AchievementStatusDTO> getStatusByType(
            @PathVariable Long userId,
            @PathVariable String type) {
        return achievementService.getAchievementStatusForUserByType(userId, type);
    }

    // GET tất cả achievements CHƯA đạt của user
    // Nếu không phải member, trả về tất cả achievements với achieved = false
    @GetMapping("/not-achieved/{userId}")
    public List<AchievementStatusDTO> getNotAchievedAchievements(@PathVariable Long userId) {
        // Lấy trạng thái tất cả achievements của user
        List<AchievementStatusDTO> all = achievementService.getAchievementStatusForUser(userId);
        // Lọc ra những cái chưa đạt (achieved = false)
        return all.stream()
                .filter(dto -> !dto.isAchieved())
                .collect(Collectors.toList());
    }

    // GET tất cả achievements ĐÃ đạt của user
    // Nếu không phải member, trả về rỗng
    @GetMapping("/achieved/{userId}")
    public List<AchievementStatusDTO> getAchievedAchievements(@PathVariable Long userId) {
        // Lấy trạng thái tất cả achievements của user
        List<AchievementStatusDTO> all = achievementService.getAchievementStatusForUser(userId);
        // Lọc ra những cái đã đạt (achieved = true)
        return all.stream()
                .filter(AchievementStatusDTO::isAchieved)
                .collect(Collectors.toList());
    }

}
