package com.sustainability.service;

import com.sustainability.entity.AppUser;
import com.sustainability.entity.SustainabilityProfile;
import com.sustainability.repository.SustainabilityProfileRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ProfileService {

    private final SustainabilityProfileRepository profileRepository;

    public ProfileService(SustainabilityProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
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

    public Map<String, Object> getResultPage(AppUser user) {
        SustainabilityProfile p = getOrCreateProfile(user);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("carbon_value", p.getCarbonScore());
        result.put("energy_value", p.getEnergyTotal());
        result.put("waste_value", p.getTotalWaste());
        result.put("evtaa_value", p.getEevtaScore());
        return result;
    }
}
