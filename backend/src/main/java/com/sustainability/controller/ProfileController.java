package com.sustainability.controller;

import com.sustainability.dto.ChangePasswordRequest;
import com.sustainability.dto.ProfileRequest;
import com.sustainability.entity.AppUser;
import com.sustainability.repository.UserRepository;
import com.sustainability.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProfileController {

    private final UserRepository userRepository;
    private final ProfileService profileService;

    public ProfileController(UserRepository userRepository, ProfileService profileService) {
        this.userRepository = userRepository;
        this.profileService = profileService;
    }

    @GetMapping("/profile/")
    public ResponseEntity<Map<String, Object>> getProfile(@AuthenticationPrincipal UserDetails ud) {
        AppUser user = userRepository.findByUsername(ud.getUsername()).orElseThrow();
        return ResponseEntity.ok(profileService.getCompanyProfile(user));
    }

    @PutMapping("/profile/")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody ProfileRequest req) {
        AppUser user = userRepository.findByUsername(ud.getUsername()).orElseThrow();
        return ResponseEntity.ok(profileService.updateCompanyProfile(user, req));
    }

    @PostMapping("/profile/change-password/")
    public ResponseEntity<Map<String, Object>> changePassword(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody ChangePasswordRequest req) {
        AppUser user = userRepository.findByUsername(ud.getUsername()).orElseThrow();
        Map<String, Object> result = profileService.changePassword(user, req);
        boolean success = Boolean.TRUE.equals(result.get("success"));
        return ResponseEntity.status(success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(result);
    }
}

