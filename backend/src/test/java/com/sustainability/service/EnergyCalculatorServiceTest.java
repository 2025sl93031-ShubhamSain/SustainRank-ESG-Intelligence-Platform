package com.sustainability.service;

import com.sustainability.dto.EnergyRequest;
import com.sustainability.entity.AppUser;
import com.sustainability.entity.SustainabilityProfile;
import com.sustainability.repository.SustainabilityProfileRepository;
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
class EnergyCalculatorServiceTest {

    @Mock ProfileService profileService;
    @Mock SustainabilityProfileRepository profileRepository;
    @InjectMocks EnergyCalculatorService service;

    private AppUser user;
    private SustainabilityProfile profile;

    @BeforeEach
    void setUp() {
        user = new AppUser("testUser", "test@example.com", "hashed");
        profile = new SustainabilityProfile();
        profile.setUser(user);
        when(profileService.getOrCreateProfile(user)).thenReturn(profile);
        when(profileService.saveProfile(any())).thenAnswer(inv -> inv.getArgument(0));
        when(profileRepository.findAvgEnergyTotal()).thenReturn(null);
    }

    @Test
    void calculate_returnsMapWithRequiredKeys() {
        Map<String, Object> result = service.calculate(buildRequest(), user);
        assertThat(result).containsKeys("score", "heading", "message", "suggestions",
                "show_breakdown", "consumption_breakdown");
    }

    @Test
    void calculate_scoreIsBetween0And100() {
        double score = ((Number) service.calculate(buildRequest(), user).get("score")).doubleValue();
        assertThat(score).isBetween(0.0, 100.0);
    }

    @Test
    void calculate_highRenewableBoostsScore() {
        EnergyRequest low  = buildRequest(); low.setRenewablePct("0");
        EnergyRequest high = buildRequest(); high.setRenewablePct("100");

        SustainabilityProfile p2 = new SustainabilityProfile(); p2.setUser(user);
        when(profileService.getOrCreateProfile(user)).thenReturn(profile, p2);

        double scoreLow  = ((Number) service.calculate(low,  user).get("score")).doubleValue();
        double scoreHigh = ((Number) service.calculate(high, user).get("score")).doubleValue();
        assertThat(scoreHigh).isGreaterThan(scoreLow);
    }

    @Test
    void calculate_fuelTypeAffectsEnergyTotal() {
        EnergyRequest petrol = buildRequest(); petrol.setFuelType("petrol"); petrol.setVehicleFuel("100");
        EnergyRequest diesel = buildRequest(); diesel.setFuelType("diesel"); diesel.setVehicleFuel("100");

        SustainabilityProfile p2 = new SustainabilityProfile(); p2.setUser(user);
        when(profileService.getOrCreateProfile(user)).thenReturn(profile, p2);

        Map<String, Object> resPetrol = service.calculate(petrol, user);
        Map<String, Object> resDiesel = service.calculate(diesel, user);

        @SuppressWarnings("unchecked")
        double petrolKwh = ((Number)((Map<String,Object>)((Map<String,Object>)resPetrol
                .get("consumption_breakdown")).get("Vehicle Fuel")).get("value")).doubleValue();
        @SuppressWarnings("unchecked")
        double dieselKwh = ((Number)((Map<String,Object>)((Map<String,Object>)resDiesel
                .get("consumption_breakdown")).get("Vehicle Fuel")).get("value")).doubleValue();

        assertThat(dieselKwh).isGreaterThan(petrolKwh);
    }

    @Test
    void calculate_savesProfile() {
        service.calculate(buildRequest(), user);
        verify(profileService).saveProfile(profile);
    }

    @Test
    void calculate_industryAvgFallsBackToBenchmarkWhenNull() {
        when(profileRepository.findAvgEnergyTotal()).thenReturn(null);
        Map<String, Object> result = service.calculate(buildRequest(), user);
        @SuppressWarnings("unchecked")
        long industryAvg = ((Number)((Map<String,Object>)((Map<String,Object>)result
                .get("consumption_breakdown")).get("Industry Average")).get("value")).longValue();
        // benchmark for "it" is 200 kWh/employee — single employee → 200 kWh
        assertThat(industryAvg).isEqualTo(200L);
    }

    private EnergyRequest buildRequest() {
        EnergyRequest req = new EnergyRequest();
        req.setMonthlyElectricity("500");
        req.setVehicleFuel("40");
        req.setFuelType("petrol");
        req.setHeatingFuel("10");
        req.setWaterConsumption("5");
        req.setRenewablePct("30");
        req.setNumEmployees("1");
        req.setIndustry("it");
        return req;
    }
}
