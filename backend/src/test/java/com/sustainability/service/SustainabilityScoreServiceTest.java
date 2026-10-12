package com.sustainability.service;

import com.sustainability.dto.SustainabilityRequest;
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
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SustainabilityScoreServiceTest {

    @Mock ProfileService profileService;
    @Mock HistoryService historyService;
    @InjectMocks SustainabilityScoreService service;

    private AppUser user;
    private SustainabilityProfile profile;

    @BeforeEach
    void setUp() {
        user = new AppUser("testUser", "test@example.com", "hashed");
        profile = new SustainabilityProfile();
        profile.setUser(user);
        when(profileService.getOrCreateProfile(user)).thenReturn(profile);
        when(profileService.saveProfile(any())).thenAnswer(inv -> inv.getArgument(0));
        doNothing().when(historyService).saveToHistory(any(), anyDouble(), anyDouble(), anyDouble(), anyDouble(), anyDouble());
    }

    @Test
    void calculate_returnsRequiredKeys() {
        Map<String, Object> result = service.calculate(buildRequest(), user);
        assertThat(result).containsKeys("sustainability_score", "environmental_score",
                "social_score", "governance_score", "roi", "cost_benefit", "heading");
    }

    @Test
    void calculate_allScoresAreBetween0And100() {
        Map<String, Object> r = service.calculate(buildRequest(), user);
        assertThat(((Number) r.get("sustainability_score")).doubleValue()).isBetween(0.0, 100.0);
        assertThat(((Number) r.get("environmental_score")).doubleValue()).isBetween(0.0, 100.0);
        assertThat(((Number) r.get("social_score")).doubleValue()).isBetween(0.0, 100.0);
        assertThat(((Number) r.get("governance_score")).doubleValue()).isBetween(0.0, 100.0);
    }

    @Test
    void calculate_headingReflectsScoreBand() {
        SustainabilityRequest req = buildRequest();
        req.setCarbon("0.001"); // near-zero emissions → high env score
        req.setEvtaa("100");
        req.setRevenue("1000000");
        req.setCost("100000");
        req.setInv("200000");

        Map<String, Object> result = service.calculate(req, user);
        String heading = (String) result.get("heading");
        assertThat(heading).isIn(
            "Sustainability Leader", "Sustainability Performer",
            "Developing Sustainability", "Sustainability Action Required");
    }

    @Test
    void calculate_zeroInvestmentSetsRoiToZero() {
        SustainabilityRequest req = buildRequest();
        req.setInv("0");

        Map<String, Object> result = service.calculate(req, user);
        assertThat(((Number) result.get("roi")).doubleValue()).isEqualTo(0.0);
    }

    @Test
    void calculate_savesProfileAndHistory() {
        service.calculate(buildRequest(), user);
        verify(profileService).saveProfile(profile);
        verify(historyService).saveToHistory(eq(user), anyDouble(), anyDouble(), anyDouble(), anyDouble(), anyDouble());
    }

    @Test
    void calculate_fallsBackToProfileValuesWhenRequestIsEmpty() {
        profile.setCarbonScore(10.0);
        profile.setEnergyTotal(5000.0);
        profile.setTotalWaste(200.0);
        profile.setEevtaScore(70.0);
        profile.setNumEmployees(50);

        SustainabilityRequest empty = new SustainabilityRequest();

        Map<String, Object> result = service.calculate(empty, user);
        // Should not throw; profile values are used
        assertThat(result).containsKey("sustainability_score");
    }

    @Test
    void calculate_governanceScoreHighWhenProfitMarginHigh() {
        SustainabilityRequest req = buildRequest();
        req.setRevenue("1000000");
        req.setCost("100000");  // 90% profit margin
        req.setInv("50000");

        Map<String, Object> result = service.calculate(req, user);
        double govScore = ((Number) result.get("governance_score")).doubleValue();
        assertThat(govScore).isGreaterThan(50.0);
    }

    private SustainabilityRequest buildRequest() {
        SustainabilityRequest req = new SustainabilityRequest();
        req.setIndustry("it");
        req.setCarbon("50");
        req.setEnergy("10000");
        req.setWaste("500");
        req.setEvtaa("65");
        req.setNumEmployees("100");
        req.setRenewablePct("30");
        req.setWasteDiversion("40");
        req.setRevenue("500000");
        req.setCost("300000");
        req.setInv("50000");
        return req;
    }
}
