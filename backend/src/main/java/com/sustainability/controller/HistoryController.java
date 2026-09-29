package com.sustainability.controller;

import com.sustainability.entity.AppUser;
import com.sustainability.repository.UserRepository;
import com.sustainability.service.HistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HistoryController {

    private final UserRepository userRepository;
    private final HistoryService historyService;

    public HistoryController(UserRepository userRepository, HistoryService historyService) {
        this.userRepository = userRepository;
        this.historyService = historyService;
    }

    @GetMapping("/history/")
    public ResponseEntity<Map<String, Object>> history(@AuthenticationPrincipal UserDetails ud) {
        AppUser user = userRepository.findByUsername(ud.getUsername()).orElseThrow();
        return ResponseEntity.ok(historyService.getHistory(user));
    }
}
