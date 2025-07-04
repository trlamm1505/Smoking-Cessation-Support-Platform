package com.example.SWP_Backend.service;

import com.example.SWP_Backend.entity.Coach;
import com.example.SWP_Backend.entity.User;
import com.example.SWP_Backend.repository.CoachRepository;
import com.example.SWP_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CoachService {

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy danh sách toàn bộ Coach
     */
    public List<Coach> getAllCoaches() {
        return coachRepository.findAll();
    }

    /**
     * Lấy Coach theo CoachID
     */
    public Optional<Coach> getCoachById(Long id) {
        return coachRepository.findById(id);
    }

    /**
     * Kiểm tra coach tồn tại theo coachId
     */
    public boolean existsById(Long id) {
        return coachRepository.existsById(id);
    }

    /**
     * Lưu Coach mới (hoặc update), đồng bộ coachId về User nếu là coach mới tạo.
     */
    public Coach saveCoach(Coach coach) {
        boolean isNew = (coach.getCoachId() == null);
        Coach savedCoach = coachRepository.save(coach);

        // --- ĐỒNG BỘ COACHID VỀ USER ---
        User user = savedCoach.getUser();
        if (user != null && (isNew || user.getCoachId() == null || !user.getCoachId().equals(savedCoach.getCoachId()))) {
            user.setCoachId(savedCoach.getCoachId());
            userRepository.save(user);
        }
        return savedCoach;
    }

    /**
     * Xóa Coach, đồng bộ coachId bên User về null.
     */
    public void deleteCoach(Long id) {
        Optional<Coach> coachOpt = coachRepository.findById(id);
        if (coachOpt.isPresent()) {
            Coach coach = coachOpt.get();
            User user = coach.getUser();
            if (user != null) {
                user.setCoachId(null);
                userRepository.save(user);
            }
            coachRepository.deleteById(id);
        }
    }

    /**
     * Lấy Coach theo UserID
     */
    public Coach getCoachByUserId(Long userId) {
        return coachRepository.findByUserUserId(userId);
    }
}
