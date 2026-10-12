package com.sustainability.controller;

import com.sustainability.dto.LoginRequest;
import com.sustainability.dto.RegisterRequest;
import com.sustainability.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/csrf/")
    public ResponseEntity<Map<String, Object>> csrf() {
        return ResponseEntity.ok(Map.of("csrfToken", "not-needed"));
    }

    @GetMapping("/me/")
    public ResponseEntity<Map<String, Object>> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("authenticated", false));
        }
        return ResponseEntity.ok(Map.of("authenticated", true, "username", userDetails.getUsername()));
    }

    @PostMapping(value = "/login/",
        consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public ResponseEntity<Map<String, Object>> login(@RequestBody(required = false) LoginRequest jsonReq,
                                                      @ModelAttribute LoginRequest formReq) {
        LoginRequest req = jsonReq != null ? jsonReq : formReq;
        try {
            Map<String, Object> result = authService.login(req);
            return ResponseEntity.ok(result);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "error", "Invalid username or password."));
        }
    }

    @PostMapping(value = "/register/",
        consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public ResponseEntity<Map<String, Object>> register(@RequestBody(required = false) RegisterRequest jsonReq,
                                                         @ModelAttribute RegisterRequest formReq) {
        RegisterRequest req = jsonReq != null ? jsonReq : formReq;
        Map<String, Object> result = authService.register(req);
        boolean success = Boolean.TRUE.equals(result.get("success"));
        return ResponseEntity.status(success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(result);
    }

    @PostMapping("/logout/")
    public ResponseEntity<Map<String, Object>> logout() {
        return ResponseEntity.ok(Map.of("success", true));
    }
}
