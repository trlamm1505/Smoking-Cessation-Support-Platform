package com.example.SWP_Backend.config;

import com.example.SWP_Backend.entity.Achievement;
import com.example.SWP_Backend.repository.AchievementRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

@Component
public class AchievementSeeder implements CommandLineRunner {
    @Autowired
    private AchievementRepository repo;
    @Override
    public void run(String... args) {
        if (repo.count() == 0) {
            // Thành tích không hút thuốc
            repo.save(new Achievement(null, "NO_SMOKE_1_DAY",   "24 Giờ Đầu Tiên",     "Không hút thuốc trong 24h đầu tiên",      null, "no_smoke"));
            repo.save(new Achievement(null, "NO_SMOKE_3_DAY",   "3 Ngày Kiên Trì",     "Không hút thuốc trong 3 ngày liên tiếp",  null, "no_smoke"));
            repo.save(new Achievement(null, "NO_SMOKE_5_DAY",   "5 Ngày Quyết Tâm",    "Không hút thuốc trong 5 ngày liên tục",   null, "no_smoke"));
            repo.save(new Achievement(null, "NO_SMOKE_7_DAY",   "Tuần Đầu Thành Công", "Không hút thuốc trong 7 ngày liên tục",   null, "no_smoke"));
            repo.save(new Achievement(null, "NO_SMOKE_10_DAY",  "10 Ngày Kiên Trì",    "Không hút thuốc trong 10 ngày liên tục",  null, "no_smoke"));
            repo.save(new Achievement(null, "NO_SMOKE_14_DAY",  "2 Tuần Bền Bỉ",       "Không hút thuốc trong 14 ngày",           null, "no_smoke"));
            repo.save(new Achievement(null, "NO_SMOKE_20_DAY",  "20 Ngày Bền Bỉ",      "Không hút thuốc trong 20 ngày liên tục",  null, "no_smoke"));
            repo.save(new Achievement(null, "NO_SMOKE_30_DAY",  "1 Tháng Không Khói",  "Không hút thuốc trong 30 ngày liên tục",  null, "no_smoke"));
            repo.save(new Achievement(null, "NO_SMOKE_90_DAY",  "90 Ngày Vượt Qua",    "Không hút thuốc trong 90 ngày",           null, "no_smoke"));
            repo.save(new Achievement(null, "NO_SMOKE_180_DAY", "Nửa Năm Kiên Định",   "Không hút thuốc trong 180 ngày",          null, "no_smoke"));
            repo.save(new Achievement(null, "NO_SMOKE_365_DAY", "1 Năm Thành Công",    "Không hút thuốc trong 1 năm",             null, "no_smoke"));

            // Thành tích tiết kiệm tiền (giữ nguyên)
            repo.save(new Achievement(null, "SAVE_MONEY_100K",  "Tiết Kiệm 100K",      "Tiết kiệm được 100.000 VND",              null, "save_money"));
            repo.save(new Achievement(null, "SAVE_MONEY_500K",  "Tiết Kiệm 500K",      "Tiết kiệm được 500.000 VND",              null, "save_money"));
            repo.save(new Achievement(null, "SAVE_MONEY_1M",    "Tiết Kiệm 1 Triệu",   "Tiết kiệm được 1.000.000 VND",            null, "save_money"));
            repo.save(new Achievement(null, "SAVE_MONEY_2M",    "Tiết Kiệm 2 Triệu",   "Tiết kiệm được 2.000.000 VND",            null, "save_money"));
            repo.save(new Achievement(null, "SAVE_MONEY_5M",    "Tiết Kiệm 5 Triệu",   "Tiết kiệm được 5.000.000 VND",            null, "save_money"));
        }
    }

}