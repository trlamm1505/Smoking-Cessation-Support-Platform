package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.entity.UserBadge;
import com.example.SWP_Backend.service.BadgeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/badges")
public class BadgeController {

    // Inject BadgeService qua constructor
    private final BadgeService badgeService;

    public BadgeController(BadgeService badgeService) {
        this.badgeService = badgeService;
    }

    // Lấy danh sách badge của user
    @GetMapping("/{userId}")
    public List<UserBadge> getBadges(@PathVariable Integer userId) {
        return badgeService.getUserBadges(userId);
    }

    // Xét duyệt và trao badge mới cho user nếu đủ điều kiện, trả về danh sách badge đã nhận
    @PostMapping("/award/{userId}")
    public List<UserBadge> awardBadges(@PathVariable Integer userId) {
        return badgeService.awardBadgesIfEligible(userId);
    }
}
