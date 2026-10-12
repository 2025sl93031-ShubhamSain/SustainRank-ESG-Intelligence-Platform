package com.sustainability.controller;

import com.sustainability.entity.AppUser;
import com.sustainability.repository.UserRepository;
import com.sustainability.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final UserRepository userRepository;
    private final DashboardService dashboardService;

    public DashboardController(UserRepository userRepository, DashboardService dashboardService) {
        this.userRepository = userRepository;
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard/")
    public ResponseEntity<Map<String, Object>> dashboard(@AuthenticationPrincipal UserDetails ud) {
        AppUser user = userRepository.findByUsername(ud.getUsername()).orElseThrow();
        return ResponseEntity.ok(dashboardService.getDashboard(user));
    }
}
