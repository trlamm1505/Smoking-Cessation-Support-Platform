package com.example.SWP_Backend.service;

import com.example.SWP_Backend.entity.MembershipPackage;
import com.example.SWP_Backend.repository.MembershipPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MembershipPackageService {
    @Autowired MembershipPackageRepository repo;

    public List<MembershipPackage> getAllPackages() {
        return repo.findAll();
    }
    public Optional<MembershipPackage> getPackageById(Long id) {
        return repo.findById(id);
    }
    public MembershipPackage createPackage(MembershipPackage pkg) {
        return repo.save(pkg);
    }
    public MembershipPackage updatePackage(Long id, MembershipPackage pkg) {
        MembershipPackage existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        existing.setPackageName(pkg.getPackageName());
        existing.setPrice(pkg.getPrice());
        existing.setDurationDays(pkg.getDurationDays());
        existing.setDescription(pkg.getDescription());
        existing.setActive(pkg.isActive());
        return repo.save(existing);
    }
    public void deletePackage(Long id) {
        repo.deleteById(id);
    }
}
