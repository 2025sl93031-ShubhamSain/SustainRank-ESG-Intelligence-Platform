package com.sustainability.service;

import com.sustainability.dto.ChangePasswordRequest;
import com.sustainability.dto.ProfileRequest;
import com.sustainability.entity.AppUser;
import com.sustainability.entity.SustainabilityProfile;
import com.sustainability.repository.SustainabilityProfileRepository;
import com.sustainability.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock SustainabilityProfileRepository profileRepository;
    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks ProfileService profileService;

    private AppUser user;
    private SustainabilityProfile profile;

    @BeforeEach
    void setUp() {
        user = new AppUser("alice", "alice@test.com", "hashed");
        profile = new SustainabilityProfile();
        profile.setUser(user);
        profile.setCompanyName("Acme");
        profile.setIndustry("Technology");
        profile.setNumEmployees(100);
    }

    // ── getOrCreateProfile ───────────────────────────────────────────────────

    @Test
    void getOrCreateProfile_existingProfile_returnsIt() {
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));

        SustainabilityProfile result = profileService.getOrCreateProfile(user);

        assertThat(result).isSameAs(profile);
        verify(profileRepository, never()).save(any());
    }

    @Test
    void getOrCreateProfile_noProfile_createsAndSaves() {
        when(profileRepository.findByUser(user)).thenReturn(Optional.empty());
        when(profileRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        SustainabilityProfile result = profileService.getOrCreateProfile(user);

        assertThat(result.getCompanyName()).isEqualTo("alice");
        verify(profileRepository).save(any());
    }

    // ── getCompanyProfile ────────────────────────────────────────────────────

    @Test
    void getCompanyProfile_returnsAllFields() {
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));

        Map<String, Object> data = profileService.getCompanyProfile(user);

        assertThat(data).containsEntry("companyName", "Acme")
                        .containsEntry("industry", "Technology")
                        .containsEntry("numEmployees", 100)
                        .containsEntry("username", "alice")
                        .containsEntry("email", "alice@test.com");
    }

    // ── updateCompanyProfile ─────────────────────────────────────────────────

    @Test
    void updateCompanyProfile_validRequest_updatesAllFields() {
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));
        when(profileRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ProfileRequest req = profileRequest("NewCorp", "Manufacturing", 250);
        Map<String, Object> result = profileService.updateCompanyProfile(user, req);

        assertThat(result).containsEntry("companyName", "NewCorp")
                          .containsEntry("industry", "Manufacturing")
                          .containsEntry("numEmployees", 250);
        verify(profileRepository, atLeastOnce()).save(profile);
    }

    @Test
    void updateCompanyProfile_blankCompanyName_keepsOldValue() {
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));
        when(profileRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ProfileRequest req = profileRequest("", "Manufacturing", 200);
        profileService.updateCompanyProfile(user, req);

        assertThat(profile.getCompanyName()).isEqualTo("Acme");
    }

    @Test
    void updateCompanyProfile_zeroEmployees_keepsOldValue() {
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));
        when(profileRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ProfileRequest req = profileRequest("NewCorp", "Energy", 0);
        profileService.updateCompanyProfile(user, req);

        assertThat(profile.getNumEmployees()).isEqualTo(100);
    }

    @Test
    void updateCompanyProfile_saveIsCalledOnce() {
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));
        when(profileRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        profileService.updateCompanyProfile(user, profileRequest("X", "Energy", 5));

        verify(profileRepository, atLeastOnce()).save(profile);
    }

    // ── changePassword ───────────────────────────────────────────────────────

    @Test
    void changePassword_validRequest_returnsSuccess() {
        when(passwordEncoder.matches("oldPass", "hashed")).thenReturn(true);
        when(passwordEncoder.encode("newPass123")).thenReturn("newHashed");
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Map<String, Object> result = profileService.changePassword(user, pwReq("oldPass", "newPass123", "newPass123"));

        assertThat(result).containsEntry("success", true);
        assertThat(user.getPassword()).isEqualTo("newHashed");
        verify(userRepository).save(user);
    }

    @Test
    void changePassword_wrongCurrentPassword_returnsError() {
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        Map<String, Object> result = profileService.changePassword(user, pwReq("wrong", "newPass123", "newPass123"));

        assertThat(result).containsEntry("success", false)
                          .containsEntry("error", "Current password is incorrect.");
        verify(userRepository, never()).save(any());
    }

    @Test
    void changePassword_newPasswordTooShort_returnsError() {
        when(passwordEncoder.matches("oldPass", "hashed")).thenReturn(true);

        Map<String, Object> result = profileService.changePassword(user, pwReq("oldPass", "short", "short"));

        assertThat(result).containsEntry("success", false)
                          .containsEntry("error", "New password must be at least 8 characters.");
        verify(userRepository, never()).save(any());
    }

    @Test
    void changePassword_confirmMismatch_returnsError() {
        when(passwordEncoder.matches("oldPass", "hashed")).thenReturn(true);

        Map<String, Object> result = profileService.changePassword(user, pwReq("oldPass", "newPass123", "different1"));

        assertThat(result).containsEntry("success", false)
                          .containsEntry("error", "Passwords do not match.");
        verify(userRepository, never()).save(any());
    }

    @Test
    void changePassword_nullNewPassword_returnsError() {
        when(passwordEncoder.matches("oldPass", "hashed")).thenReturn(true);

        Map<String, Object> result = profileService.changePassword(user, pwReq("oldPass", null, null));

        assertThat(result).containsEntry("success", false);
        verify(userRepository, never()).save(any());
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private ProfileRequest profileRequest(String name, String industry, int employees) {
        ProfileRequest r = new ProfileRequest();
        r.setCompanyName(name);
        r.setIndustry(industry);
        r.setNumEmployees(employees);
        return r;
    }

    private ChangePasswordRequest pwReq(String current, String newPw, String confirm) {
        ChangePasswordRequest r = new ChangePasswordRequest();
        r.setCurrentPassword(current);
        r.setNewPassword(newPw);
        r.setConfirmPassword(confirm);
        return r;
    }
}
