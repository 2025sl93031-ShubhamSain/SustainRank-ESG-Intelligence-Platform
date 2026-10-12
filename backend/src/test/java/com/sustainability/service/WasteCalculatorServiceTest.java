package com.sustainability.service;

import com.sustainability.dto.WasteRequest;
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
class WasteCalculatorServiceTest {

    @Mock ProfileService profileService;
    @InjectMocks WasteCalculatorService service;

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
    void calculate_returnsRequiredKeys() {
        Map<String, Object> result = service.calculate(buildRequest("50", "30", "5", "5", "60", "20"), user);
        assertThat(result).containsKeys("score", "heading", "message", "suggestions",
                "show_waste_breakdown", "waste_breakdown");
    }

    @Test
    void calculate_scoreIsBetween0And100() {
        double score = ((Number) service.calculate(
                buildRequest("100", "50", "10", "5", "120", "30"), user).get("score")).doubleValue();
        assertThat(score).isBetween(0.0, 100.0);
    }

    @Test
    void calculate_fullDiversionScoresHigh() {
        WasteRequest req = buildRequest("100", "0", "0", "0", "100", "0");
        req.setIndustry("retail"); // benchmark 50 %

        double score = ((Number) service.calculate(req, user).get("score")).doubleValue();
        assertThat(score).isGreaterThan(60.0);
    }

    @Test
    void calculate_zeroDiversionScoresLow() {
        WasteRequest req = buildRequest("100", "0", "0", "0", "0", "0");
        double score = ((Number) service.calculate(req, user).get("score")).doubleValue();
        assertThat(score).isLessThan(40.0);
    }

    @Test
    void calculate_highHazardousWasteAppliesPenalty() {
        // same total, same diversion — but lots of hazardous
        WasteRequest safe  = buildRequest("100", "0", "0", "0",   "60", "0");
        WasteRequest risky = buildRequest("0",   "0", "0", "100", "60", "0");

        SustainabilityProfile p2 = new SustainabilityProfile(); p2.setUser(user);
        when(profileService.getOrCreateProfile(user)).thenReturn(profile, p2);

        double scoreSafe  = ((Number) service.calculate(safe,  user).get("score")).doubleValue();
        double scoreRisky = ((Number) service.calculate(risky, user).get("score")).doubleValue();
        assertThat(scoreRisky).isLessThanOrEqualTo(scoreSafe);
    }

    @Test
    void calculate_diversionCannotExceedTotalWaste() {
        // recycled > total — should clamp diversion to 100 %
        WasteRequest req = buildRequest("50", "0", "0", "0", "999", "0");
        Map<String, Object> result = service.calculate(req, user);
        String message = (String) result.get("message");
        // diversion pct should be 100 %
        assertThat(message).contains("100.0%");
    }

    @Test
    void calculate_savesProfile() {
        service.calculate(buildRequest("50", "30", "5", "5", "60", "20"), user);
        verify(profileService).saveProfile(profile);
    }

    @Test
    void calculate_breakdownContainsAllCategories() {
        Map<String, Object> result = service.calculate(buildRequest("50", "30", "5", "5", "60", "20"), user);
        @SuppressWarnings("unchecked")
        Map<String, Object> bd = (Map<String, Object>) result.get("waste_breakdown");
        assertThat(bd).containsKeys("Solid Waste", "Organic Waste", "E-Waste",
                "Hazardous Waste", "Total Generated", "Recycled", "Composted", "Landfilled");
    }

    /** swaste, owaste, ewaste, hwaste, recycled, composted */
    private WasteRequest buildRequest(String sw, String ow, String ew, String hw, String rec, String comp) {
        WasteRequest r = new WasteRequest();
        r.setSwaste(sw); r.setOwaste(ow); r.setEwaste(ew); r.setHwaste(hw);
        r.setRcycwaste(rec); r.setComposted(comp);
        r.setIndustry("general");
        return r;
    }
}
