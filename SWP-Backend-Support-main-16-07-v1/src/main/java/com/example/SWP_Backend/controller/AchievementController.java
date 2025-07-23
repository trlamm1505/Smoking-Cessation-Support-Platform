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
     */
    @GetMapping("/status/{userId}")
    public List<UserAchievementStatusDTO> getStatus(@PathVariable Long userId) {
        List<Achievement> all = achievementRepo.findAll();
        List<UserAchievement> achieved = userAchievementRepo.findByUserUserId(userId);

        List<UserAchievementStatusDTO> result = new ArrayList<>();
        for (Achievement a : all) {
            Optional<UserAchievement> ua = achieved.stream()
                    .filter(u -> u.getAchievement().getId().equals(a.getId()))
                    .findFirst();
            result.add(new UserAchievementStatusDTO(
                    a,
                    ua.isPresent(),
                    ua.map(UserAchievement::getAchievedDate).orElse(null)
            ));
        }
        return result;
    }

    // API lấy danh sách tổng hợp thành tích từng user (top cộng đồng)
    @GetMapping("/user-summary")
    public ResponseEntity<List<UserAchievementSummaryDTO>> getUserAchievementSummaries() {
        List<User> users = userRepository.findAll()
                .stream()
                .filter(u -> "member".equalsIgnoreCase(u.getRole()))
                .toList();

        List<UserAchievementSummaryDTO> result = new ArrayList<>();

        for (User user : users) {
            Long userId = user.getUserId();
            String fullName = user.getFullName();
            String avatarUrl = user.getProfilePictureUrl();

            int achievementCount = userAchievementRepo.countByUserUserId(userId);

            long noSmokeDays = habitLogRepo.findByUserIdOrderByLogDateDesc(userId)
                    .stream().filter(log -> Boolean.FALSE.equals(log.getSmokedToday())).count();

            double moneySaved = habitLogRepo.findByUserIdOrderByLogDateDesc(userId)
                    .stream().mapToDouble(HabitLog::getMoneySaved).sum();

            result.add(new UserAchievementSummaryDTO(
                    userId, fullName, avatarUrl,
                    achievementCount, noSmokeDays, moneySaved
            ));
        }
        return ResponseEntity.ok(result);
    }
    @GetMapping("/user-summary/{userId}")
    public ResponseEntity<UserAchievementSummaryDTO> getUserAchievementSummary(@PathVariable Long userId) {
        // Lấy user từ repo (nếu không tồn tại trả 404)
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !"member".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.notFound().build(); // Hoặc trả về thông báo "Chỉ member mới có thành tích"
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


    // GET tất cả achievements theo type
    // Controller


    // GET: tất cả achievements theo type
    @GetMapping("/type/{type}")
    public List<Achievement> getAchievementsByType(@PathVariable String type) {
        return achievementService.getAchievementsByType(type);
    }

    // GET: trạng thái achievements theo type của user
    @GetMapping("/status/{userId}/type/{type}")
    public List<AchievementStatusDTO> getStatusByType(
            @PathVariable Long userId,
            @PathVariable String type) {
        return achievementService.getAchievementStatusForUserByType(userId, type);
    }

    // GET: Tất cả achievements CHƯA đạt của user (chỉ member mới có, coach/admin trả về tất cả achievements với achieved = false)
    @GetMapping("/not-achieved/{userId}")
    public List<AchievementStatusDTO> getNotAchievedAchievements(@PathVariable Long userId) {
        // Lấy trạng thái tất cả thành tích của user (nếu không phải member sẽ trả về all false)
        List<AchievementStatusDTO> all = achievementService.getAchievementStatusForUser(userId);
        // Lọc những cái chưa đạt (achieved = false)
        return all.stream()
                .filter(dto -> !dto.isAchieved())
                .collect(Collectors.toList());
    }

    // GET: Tất cả achievements ĐÃ đạt của user (chỉ member mới có, coach/admin trả về rỗng)
    @GetMapping("/achieved/{userId}")
    public List<AchievementStatusDTO> getAchievedAchievements(@PathVariable Long userId) {
        // Lấy trạng thái tất cả thành tích của user (nếu không phải member sẽ trả về all false)
        List<AchievementStatusDTO> all = achievementService.getAchievementStatusForUser(userId);
        // Lọc những cái đã đạt (achieved = true)
        return all.stream()
                .filter(AchievementStatusDTO::isAchieved)
                .collect(Collectors.toList());
    }

}
