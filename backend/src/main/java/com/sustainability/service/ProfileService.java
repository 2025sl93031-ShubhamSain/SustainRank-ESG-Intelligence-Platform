package com.sustainability.service;

import com.sustainability.dto.ChangePasswordRequest;
import com.sustainability.dto.ProfileRequest;
import com.sustainability.entity.AppUser;
import com.sustainability.entity.SustainabilityProfile;
import com.sustainability.repository.SustainabilityProfileRepository;
import com.sustainability.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ProfileService {

    private final SustainabilityProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(SustainabilityProfileRepository profileRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public SustainabilityProfile getOrCreateProfile(AppUser user) {
        return profileRepository.findByUser(user).orElseGet(() -> {
            SustainabilityProfile p = new SustainabilityProfile();
            p.setUser(user);
            p.setCompanyName(user.getUsername());
            return profileRepository.save(p);
        });
    }

    public SustainabilityProfile saveProfile(SustainabilityProfile profile) {
        return profileRepository.save(profile);
    }

    public Map<String, Object> getCompanyProfile(AppUser user) {
        SustainabilityProfile p = getOrCreateProfile(user);
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("companyName", p.getCompanyName());
        data.put("industry", p.getIndustry());
        data.put("numEmployees", p.getNumEmployees());
        data.put("username", user.getUsername());
        data.put("email", user.getEmail());
        return data;
    }

    public Map<String, Object> updateCompanyProfile(AppUser user, ProfileRequest req) {
        SustainabilityProfile p = getOrCreateProfile(user);
        if (req.getCompanyName() != null && !req.getCompanyName().isBlank())
            p.setCompanyName(req.getCompanyName());
        if (req.getIndustry() != null && !req.getIndustry().isBlank())
            p.setIndustry(req.getIndustry());
        if (req.getNumEmployees() > 0)
            p.setNumEmployees(req.getNumEmployees());
        profileRepository.save(p);
        return getCompanyProfile(user);
    }

    public Map<String, Object> changePassword(AppUser user, ChangePasswordRequest req) {
        Map<String, Object> err = new LinkedHashMap<>();

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            err.put("success", false);
            err.put("error", "Current password is incorrect.");
            return err;
        }
        if (req.getNewPassword() == null || req.getNewPassword().length() < 8) {
            err.put("success", false);
            err.put("error", "New password must be at least 8 characters.");
            return err;
        }
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            err.put("success", false);
            err.put("error", "Passwords do not match.");
            return err;
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("success", true);
        return resp;
    }
}
