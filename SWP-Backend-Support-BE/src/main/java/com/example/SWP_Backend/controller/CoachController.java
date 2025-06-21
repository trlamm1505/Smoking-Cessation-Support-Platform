package com.example.SWP_Backend.controller;


import com.example.SWP_Backend.dto.AdminCreateCoachRequest;
import com.example.SWP_Backend.dto.CreateCoachRequest;
import com.example.SWP_Backend.entity.Coach;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.service.CoachService;
import com.example.SWP_Backend.repository.UserRepository;


import com.example.SWP_Backend.entity.Coach;
import com.example.SWP_Backend.service.CoachService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    @Autowired
    private CoachService coachService;


    @Autowired
    private UserRepository userRepository;

    // Lấy toàn bộ coach (có thể tạo DTO cho response nếu muốn đẹp hơn)

    @GetMapping("/all")
    public ResponseEntity<List<Coach>> getAllCoaches() {
        return ResponseEntity.ok(coachService.getAllCoaches());
    }


    // Lấy coach theo id

    @GetMapping("/{id}")
    public ResponseEntity<?> getCoachById(@PathVariable Long id) {
        Optional<Coach> coach = coachService.getCoachById(id);
        return coach.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    // Tạo mới coach bằng DTO, FE chỉ gửi userId và các trường khác
    @PostMapping("/create")
    public ResponseEntity<?> createCoach(@RequestBody CreateCoachRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy user có userId: " + request.getUserId());
        }
        Coach coach = new Coach();
        coach.setUser(user);
        coach.setFullName(request.getFullName());
        coach.setSpecialization(request.getSpecialization());
        coach.setDegree(request.getDegree());
        coach.setPhoneNumber(request.getPhoneNumber());
        coach.setGender(request.getGender());
        coach.setAddress(request.getAddress());
        coach.setExperience(request.getExperience());
        coach.setRating(request.getRating());
        coach.setBio(request.getBio());
        coach.setAvailability(request.getAvailability());
        coach.setProfilePictureUrl(request.getProfilePictureUrl());
        coach.setActive(request.isActive());

    @PostMapping("/create")
    public ResponseEntity<Coach> createCoach(@RequestBody Coach coach) {

        Coach savedCoach = coachService.saveCoach(coach);
        return ResponseEntity.ok(savedCoach);
    }


    // Cập nhật coach - NÊN dùng DTO cho update coach nếu cần kiểm soát field chặt chẽ
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCoach(@PathVariable Long id, @RequestBody CreateCoachRequest request) {
        Optional<Coach> existingCoachOpt = coachService.getCoachById(id);
        if (existingCoachOpt.isEmpty()) return ResponseEntity.notFound().build();

        Coach existingCoach = existingCoachOpt.get();

        // Update các trường từ request
        existingCoach.setFullName(request.getFullName());
        existingCoach.setSpecialization(request.getSpecialization());
        existingCoach.setDegree(request.getDegree());
        existingCoach.setPhoneNumber(request.getPhoneNumber());
        existingCoach.setGender(request.getGender());
        existingCoach.setAddress(request.getAddress());
        existingCoach.setExperience(request.getExperience());
        existingCoach.setRating(request.getRating());
        existingCoach.setBio(request.getBio());
        existingCoach.setAvailability(request.getAvailability());
        existingCoach.setProfilePictureUrl(request.getProfilePictureUrl());
        existingCoach.setActive(request.isActive());

        // Nếu muốn cho phép đổi user của coach (hiếm khi cần, có thể bỏ dòng dưới)
        if (request.getUserId() != null && !request.getUserId().equals(existingCoach.getUser().getUserId())) {
            User newUser = userRepository.findById(request.getUserId()).orElse(null);
            if (newUser != null) existingCoach.setUser(newUser);
        }

        Coach updated = coachService.saveCoach(existingCoach);
        return ResponseEntity.ok(updated);
    }

    // Xóa coach

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCoach(@PathVariable Long id, @RequestBody Coach updatedCoach) {
        Optional<Coach> existingCoach = coachService.getCoachById(id);
        if (existingCoach.isEmpty()) return ResponseEntity.notFound().build();

        updatedCoach.setCoachId(id);
        return ResponseEntity.ok(coachService.saveCoach(updatedCoach));
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCoach(@PathVariable Long id) {
        if (!coachService.existsById(id)) return ResponseEntity.notFound().build();
        coachService.deleteCoach(id);
        return ResponseEntity.ok().build();
    }



    @PostMapping("/admin-create")
    public ResponseEntity<?> adminCreateCoach(@RequestBody AdminCreateCoachRequest req) {
        // Kiểm tra trùng email
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Email đã tồn tại!");
        }

        // 1. Tạo user account
        User user = new User();
        user.setEmail(req.getEmail());
        user.setUsername(req.getEmail());
        user.setPasswordHash(req.getPassword()); // Hãy hash password trong thực tế!
        user.setFullName(req.getFullName());
        user.setRole("coach");
        user.setEnabled(true);
        userRepository.save(user);

        // 2. Tạo Coach profile
        Coach coach = new Coach();
        coach.setUser(user);
        coach.setFullName(req.getFullName());
        coach.setSpecialization(req.getSpecialization());
        coach.setDegree(req.getDegree());
        coach.setPhoneNumber(req.getPhoneNumber());
        coach.setGender(req.getGender());
        coach.setAddress(req.getAddress());
        coach.setExperience(req.getExperience());
        coach.setRating(req.getRating());
        coach.setBio(req.getBio());
        coach.setAvailability(req.getAvailability());
        coach.setProfilePictureUrl(req.getProfilePictureUrl());
        coach.setActive(req.isActive());
        Coach savedCoach = coachService.saveCoach(coach);

        // Có thể gửi email tài khoản cho coach tại đây

        return ResponseEntity.ok(savedCoach);
    }
}

}

