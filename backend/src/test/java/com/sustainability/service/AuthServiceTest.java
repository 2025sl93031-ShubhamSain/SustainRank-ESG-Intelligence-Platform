package com.sustainability.service;

import com.sustainability.dto.LoginRequest;
import com.sustainability.dto.RegisterRequest;
import com.sustainability.entity.AppUser;
import com.sustainability.entity.SustainabilityProfile;
import com.sustainability.repository.UserRepository;
import com.sustainability.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock AuthenticationManager authManager;
    @Mock JwtUtil jwtUtil;
    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock ProfileService profileService;
    @InjectMocks AuthService authService;

    private SustainabilityProfile profile;

    @BeforeEach
    void setUp() {
        profile = new SustainabilityProfile();
    }

    // ── login ────────────────────────────────────────────────────────────────

    @Test
    void login_validCredentials_returnsSuccessWithToken() {
        when(jwtUtil.generateToken("alice")).thenReturn("jwt-token");

        Map<String, Object> result = authService.login(new LoginRequest("alice", "secret"));

        assertThat(result).containsEntry("success", true)
                          .containsEntry("username", "alice")
                          .containsEntry("token", "jwt-token");
    }

    @Test
    void login_badCredentials_throws() {
        doThrow(new BadCredentialsException("bad"))
            .when(authManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThatThrownBy(() -> authService.login(new LoginRequest("alice", "wrong")))
            .isInstanceOf(BadCredentialsException.class);
    }

    // ── register ─────────────────────────────────────────────────────────────

    @Test
    void register_validRequest_returnsSuccess() {
        when(userRepository.existsByUsername("newUser")).thenReturn(false);
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("pass123")).thenReturn("hashed");
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(profileService.getOrCreateProfile(any())).thenReturn(profile);
        when(profileService.saveProfile(any())).thenAnswer(inv -> inv.getArgument(0));

        Map<String, Object> result = authService.register(reg("Acme Corp", "newUser", "new@test.com", "pass123", "pass123"));

        assertThat(result).containsEntry("success", true);
    }

    @Test
    void register_missingField_returnsError() {
        Map<String, Object> result = authService.register(reg("Acme Corp", "", "new@test.com", "pass123", "pass123"));

        assertThat(result).containsEntry("success", false)
                          .containsKey("error");
    }

    @Test
    void register_passwordMismatch_returnsError() {
        Map<String, Object> result = authService.register(reg("Acme Corp", "user1", "u@test.com", "abc", "xyz"));

        assertThat(result).containsEntry("success", false)
                          .containsEntry("error", "Passwords don't match.");
    }

    @Test
    void register_duplicateUsername_returnsError() {
        when(userRepository.existsByUsername("taken")).thenReturn(true);

        Map<String, Object> result = authService.register(reg("Corp", "taken", "new@test.com", "pass", "pass"));

        assertThat(result).containsEntry("success", false)
                          .containsEntry("error", "Username already exists.");
    }

    @Test
    void register_duplicateEmail_returnsError() {
        when(userRepository.existsByUsername("user2")).thenReturn(false);
        when(userRepository.existsByEmail("dup@test.com")).thenReturn(true);

        Map<String, Object> result = authService.register(reg("Corp", "user2", "dup@test.com", "pass", "pass"));

        assertThat(result).containsEntry("success", false)
                          .containsEntry("error", "Email is already registered.");
    }

    @Test
    void register_successfullySavesUser() {
        when(userRepository.existsByUsername("u3")).thenReturn(false);
        when(userRepository.existsByEmail("u3@test.com")).thenReturn(false);
        when(passwordEncoder.encode("pw")).thenReturn("hashed");
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(profileService.getOrCreateProfile(any())).thenReturn(profile);
        when(profileService.saveProfile(any())).thenAnswer(inv -> inv.getArgument(0));

        authService.register(reg("Co", "u3", "u3@test.com", "pw", "pw"));

        verify(userRepository).save(argThat(u ->
            "u3".equals(((AppUser) u).getUsername()) && "hashed".equals(((AppUser) u).getPassword())));
    }

    private RegisterRequest reg(String company, String username, String email, String pw1, String pw2) {
        RegisterRequest r = new RegisterRequest();
        r.setCompany_name(company); r.setUsername(username);
        r.setEmail(email); r.setPassword1(pw1); r.setPassword2(pw2);
        return r;
    }
}
