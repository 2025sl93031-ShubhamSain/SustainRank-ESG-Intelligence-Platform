package com.sustainability.service;

import com.sustainability.dto.LoginRequest;
import com.sustainability.dto.RegisterRequest;
import com.sustainability.entity.AppUser;
import com.sustainability.repository.UserRepository;
import com.sustainability.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProfileService profileService;

    public AuthService(AuthenticationManager authManager, JwtUtil jwtUtil,
                       UserRepository userRepository, PasswordEncoder passwordEncoder,
                       ProfileService profileService) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.profileService = profileService;
    }

    public Map<String, Object> login(LoginRequest req) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.username(), req.password())
        );
        String token = jwtUtil.generateToken(req.username());
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("success", true);
        resp.put("username", req.username());
        resp.put("token", token);
        return resp;
    }

    @Transactional
    public Map<String, Object> register(RegisterRequest req) {
        Map<String, Object> err = new LinkedHashMap<>();

        if (req.company_name() == null || req.username() == null || req.email() == null
            || req.password1() == null || req.password2() == null
            || req.company_name().isBlank() || req.username().isBlank()
            || req.email().isBlank() || req.password1().isBlank()) {
            err.put("success", false);
            err.put("error", "All fields are required.");
            return err;
        }
        if (!req.password1().equals(req.password2())) {
            err.put("success", false);
            err.put("error", "Passwords don't match.");
            return err;
        }
        if (userRepository.existsByUsername(req.username())) {
            err.put("success", false);
            err.put("error", "Username already exists.");
            return err;
        }
        if (userRepository.existsByEmail(req.email())) {
            err.put("success", false);
            err.put("error", "Email is already registered.");
            return err;
        }

        AppUser user = new AppUser(req.username(), req.email(), passwordEncoder.encode(req.password1()));
        userRepository.save(user);

        var profile = profileService.getOrCreateProfile(user);
        profile.setCompanyName(req.company_name());
        profileService.saveProfile(profile);

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("success", true);
        return resp;
    }
}
