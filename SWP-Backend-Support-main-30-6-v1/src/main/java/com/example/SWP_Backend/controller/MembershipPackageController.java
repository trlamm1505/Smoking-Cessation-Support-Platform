package com.example.SWP_Backend.controller;

import com.example.SWP_Backend.entity.MembershipPackage;
import com.example.SWP_Backend.service.MembershipPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
public class MembershipPackageController {

    @Autowired
    private MembershipPackageService service;

    // GET all
    @GetMapping
    public List<MembershipPackage> getAllPackages() {
        return service.getAllPackages();
    }

    // GET one
    @GetMapping("/{id}")
    public ResponseEntity<MembershipPackage> getPackageById(@PathVariable Long id) {
        return service.getPackageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE
    @PostMapping
    public MembershipPackage createPackage(@RequestBody MembershipPackage pkg) {
        return service.createPackage(pkg);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<MembershipPackage> updatePackage(@PathVariable Long id, @RequestBody MembershipPackage pkg) {
        return ResponseEntity.ok(service.updatePackage(id, pkg));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePackage(@PathVariable Long id) {
        service.deletePackage(id);
        return ResponseEntity.ok().build();
    }
}
