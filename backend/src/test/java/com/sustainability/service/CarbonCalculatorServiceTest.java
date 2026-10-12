package com.sustainability.service;

import com.sustainability.dto.CarbonRequest;
import com.sustainability.entity.AppUser;
import com.sustainability.entity.SustainabilityProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarbonCalculatorServiceTest {

    @Mock ProfileService profileService;
    @InjectMocks CarbonCalculatorService service;

    private AppUser user;
    private SustainabilityProfile profile;

    @BeforeEach
    void setUp() {
        user = new AppUser("testUser", "test@example.com", "hashed");
        profile = new SustainabilityProfile();
        profile.setUser(user);
        when(profileService.getOrCreateProfile(user)).thenReturn(profile);
        when(profileService.saveProfile(any())).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void calculate_returnsMapWithRequiredKeys() {
        Map<String, Object> result = service.calculate(buildRequest(), user);

        assertThat(result).containsKeys("score", "heading", "message", "suggestions",
                "show_breakdown", "consumption_breakdown");
    }

    @Test
    void calculate_scoreIsBetween0And100() {
        Map<String, Object> result = service.calculate(buildRequest(), user);
        double score = ((Number) result.get("score")).doubleValue();
        assertThat(score).isBetween(0.0, 100.0);
    }

    @Test
    void calculate_zeroEmissionsProducesHighScore() {
        CarbonRequest req = new CarbonRequest();
        req.setNumEmployees("100");
        req.setElec("0"); req.setGas("0");
        req.setVefeul("0"); req.setMachine("0");
        req.setFlightsShort("0"); req.setFlightsLong("0");
        req.setTransexp("0");
        req.setRenewablePct("100");
        req.setIndustry("it");

        Map<String, Object> result = service.calculate(req, user);
        double score = ((Number) result.get("score")).doubleValue();
        assertThat(score).isGreaterThan(80.0);
    }

    @Test
    void calculate_recyclingOffsetReducesTotalEmissions() {
        CarbonRequest withRecycling = buildRequest();
        withRecycling.setNewspaperOptionsRadios("yes");
        withRecycling.setAlumtinOptionsRadios("yes");

        CarbonRequest withoutRecycling = buildRequest();
        withoutRecycling.setNewspaperOptionsRadios("no");
        withoutRecycling.setAlumtinOptionsRadios("no");

        SustainabilityProfile p2 = new SustainabilityProfile();
        p2.setUser(user);
        when(profileService.getOrCreateProfile(user)).thenReturn(profile, p2);

        double scoreWith    = ((Number) service.calculate(withRecycling,    user).get("score")).doubleValue();
        double scoreWithout = ((Number) service.calculate(withoutRecycling, user).get("score")).doubleValue();
        assertThat(scoreWith).isGreaterThanOrEqualTo(scoreWithout);
    }

    @Test
    void calculate_savesProfileForUser() {
        service.calculate(buildRequest(), user);
        verify(profileService).saveProfile(profile);
    }

    @Test
    void calculate_breakdownContainsAllScopeEntries() {
        Map<String, Object> result = service.calculate(buildRequest(), user);
        @SuppressWarnings("unchecked")
        Map<String, Object> breakdown = (Map<String, Object>) result.get("consumption_breakdown");

        assertThat(breakdown).containsKeys(
                "Scope 1 – Gas", "Scope 1 – Vehicles", "Scope 1 – Machinery",
                "Scope 2 – Electricity", "Scope 3 – Flights", "Scope 3 – Commute");
    }

    private CarbonRequest buildRequest() {
        CarbonRequest req = new CarbonRequest();
        req.setNumEmployees("50");
        req.setElec("1000");
        req.setGas("20");
        req.setVefeul("50");
        req.setMachine("30");
        req.setFlightsShort("2");
        req.setFlightsLong("10");
        req.setTransexp("500");
        req.setRenewablePct("20");
        req.setIndustry("it");
        req.setNewspaperOptionsRadios("no");
        req.setAlumtinOptionsRadios("no");
        return req;
    }
}
