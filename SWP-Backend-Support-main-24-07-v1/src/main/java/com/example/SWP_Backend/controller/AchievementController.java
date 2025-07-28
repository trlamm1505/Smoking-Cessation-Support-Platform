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

    // Inject các repository và service cần thiết để thao tác dữ liệu thành tích và user
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
     * API lấy danh sách tất cả thành tích trong hệ thống,
     * kèm trạng thái user đã đạt hay chưa và ngày đạt (nếu có).
     * - Dùng để hiển thị tiến trình thành tích cho user trên UI.
     * - Trả về list UserAchievementStatusDTO (mỗi item chứa achievement, đã đạt hay chưa, ngày đạt).
     */
    @GetMapping("/status/{userId}")
    public List<UserAchievementStatusDTO> getStatus(@PathVariable Long userId) {
        // 1. Lấy toàn bộ achievements trong DB
        List<Achievement> all = achievementRepo.findAll();
        // 2. Lấy những achievement user đã đạt (bảng UserAchievement)
        List<UserAchievement> achieved = userAchievementRepo.findByUserUserId(userId);

        List<UserAchievementStatusDTO> result = new ArrayList<>();
        for (Achievement a : all) {
            // 3. Kiểm tra achievement này user đã đạt chưa
            Optional<UserAchievement> ua = achieved.stream()
                    .filter(u -> u.getAchievement().getId().equals(a.getId()))
                    .findFirst();
            // 4. Tạo DTO trả về (có ngày đạt nếu đã đạt)
            result.add(new UserAchievementStatusDTO(
                    a,
                    ua.isPresent(),
                    ua.map(UserAchievement::getAchievedDate).orElse(null)
            ));
        }
        return result;
    }

    /**
     * API tổng hợp thành tích cho tất cả user dạng bảng xếp hạng cộng đồng.
     * - Dùng cho trang leaderboard.
     * - Mỗi UserAchievementSummaryDTO gồm: id, tên, avatar, số thành tích, số ngày không hút thuốc, tổng tiền tiết kiệm.
     * - Chỉ member mới được tính (coach/admin không cần thống kê).
     */
    @GetMapping("/user-summary")
    public ResponseEntity<List<UserAchievementSummaryDTO>> getUserAchievementSummaries() {
        // 1. Lọc ra toàn bộ user có vai trò 'member'
        List<User> users = userRepository.findAll()
                .stream()
                .filter(u -> "member".equalsIgnoreCase(u.getRole()))
                .toList();

        List<UserAchievementSummaryDTO> result = new ArrayList<>();

        for (User user : users) {
            Long userId = user.getUserId();
            String fullName = user.getFullName();
            String avatarUrl = user.getProfilePictureUrl();

            // 2. Đếm số achievement đã đạt của user này
            int achievementCount = userAchievementRepo.countByUserUserId(userId);

            // 3. Đếm số ngày user đã không hút thuốc
            long noSmokeDays = habitLogRepo.findByUserIdOrderByLogDateDesc(userId)
                    .stream()
                    .filter(log -> Boolean.FALSE.equals(log.getSmokedToday()))
                    .count();

            // 4. Tính tổng số tiền user tiết kiệm được nhờ bỏ thuốc
            double moneySaved = habitLogRepo.findByUserIdOrderByLogDateDesc(userId)
                    .stream()
                    .mapToDouble(HabitLog::getMoneySaved)
                    .sum();

            // 5. Đưa vào list trả về
            result.add(new UserAchievementSummaryDTO(
                    userId, fullName, avatarUrl,
                    achievementCount, noSmokeDays, moneySaved
            ));
        }
        return ResponseEntity.ok(result);
    }

    /**
     * API trả về tổng hợp thành tích cho 1 user cụ thể.
     * - Giống user-summary nhưng chỉ cho 1 user.
     * - Chỉ trả về nếu user là member (không phải member trả về not found).
     */
    @GetMapping("/user-summary/{userId}")
    public ResponseEntity<UserAchievementSummaryDTO> getUserAchievementSummary(@PathVariable Long userId) {
        // 1. Lấy user từ DB
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !"member".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.notFound().build(); // Chỉ member mới có thống kê thành tích
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

    /**
     * API lấy tất cả achievements theo loại (type).
     * - Ví dụ: /type/daily, /type/milestone,...
     * - Dùng để phân loại thành tích trên UI.
     */
    @GetMapping("/type/{type}")
    public List<Achievement> getAchievementsByType(@PathVariable String type) {
        // Giao tiếp xuống service để lọc theo type
        return achievementService.getAchievementsByType(type);
    }

    /**
     * API lấy trạng thái đã đạt/chưa đạt của các achievement thuộc một loại (type) cụ thể cho user.
     * - Ví dụ: trạng thái các daily achievement của user A.
     */
    @GetMapping("/status/{userId}/type/{type}")
    public List<AchievementStatusDTO> getStatusByType(
            @PathVariable Long userId,
            @PathVariable String type) {
        // Dùng service để lấy trạng thái chi tiết theo loại
        return achievementService.getAchievementStatusForUserByType(userId, type);
    }

    /**
     * API trả về các achievement mà user CHƯA đạt được.
     * - Nếu là member: trả về chính xác những achievement chưa đạt.
     * - Nếu là coach/admin: trả về danh sách tất cả achievement với trạng thái chưa đạt (all false).
     * - Dùng để nhắc nhở, hiển thị động lực cho user.
     */
    @GetMapping("/not-achieved/{userId}")
    public List<AchievementStatusDTO> getNotAchievedAchievements(@PathVariable Long userId) {
        // Lấy trạng thái achievement (service sẽ tự xử lý đúng role)
        List<AchievementStatusDTO> all = achievementService.getAchievementStatusForUser(userId);
        // Lọc ra những achievement chưa đạt
        return all.stream()
                .filter(dto -> !dto.isAchieved())
                .collect(Collectors.toList());
    }

    /**
     * API trả về các achievement mà user ĐÃ đạt được.
     * - Nếu là member: trả về chính xác.
     * - Nếu là coach/admin: trả về rỗng.
     * - Dùng cho trang thành tích, bảng tổng kết cá nhân.
     */
    @GetMapping("/achieved/{userId}")
    public List<AchievementStatusDTO> getAchievedAchievements(@PathVariable Long userId) {
        // Lấy trạng thái achievement (service sẽ tự xử lý đúng role)
        List<AchievementStatusDTO> all = achievementService.getAchievementStatusForUser(userId);
        // Lọc ra những achievement đã đạt
        return all.stream()
                .filter(AchievementStatusDTO::isAchieved)
                .collect(Collectors.toList());
    }
}
