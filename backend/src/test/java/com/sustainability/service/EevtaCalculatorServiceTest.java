package com.sustainability.service;

import com.sustainability.dto.EevtaRequest;
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
class EevtaCalculatorServiceTest {

    @Mock ProfileService profileService;
    @InjectMocks EevtaCalculatorService service;

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
    void calculate_perfectInputsScoreHigh() {
        EevtaRequest req = new EevtaRequest();
        req.setTotalStudents("100");
        req.setTechVocStudents("100");    // 100% training
        req.setDistanceLearning("100");   // 100% remote access
        req.setScholarshipStudents("100");// 100% benefits
        req.setFinancialAid("100");       // 100% welfare
        req.setGradRate("100");           // 100% retention
        req.setEmploymentRate("100");     // 100% promotion
        req.setFemaleEnrolment("50");     // perfect gender balance
        req.setDisabilityAccess("yes");

        double score = ((Number) service.calculate(req, user).get("score")).doubleValue();
        assertThat(score).isGreaterThanOrEqualTo(90.0);
    }

    @Test
    void calculate_disabilityInclusionBonus() {
        EevtaRequest withBonus    = buildRequest(); withBonus.setDisabilityAccess("yes");
        EevtaRequest withoutBonus = buildRequest(); withoutBonus.setDisabilityAccess("no");

        SustainabilityProfile p2 = new SustainabilityProfile(); p2.setUser(user);
        when(profileService.getOrCreateProfile(user)).thenReturn(profile, p2);

        double scoreWith    = ((Number) service.calculate(withBonus,    user).get("score")).doubleValue();
        double scoreWithout = ((Number) service.calculate(withoutBonus, user).get("score")).doubleValue();
        assertThat(scoreWith).isGreaterThan(scoreWithout);
    }

    @Test
    void calculate_genderImbalanceLowersScore() {
        EevtaRequest balanced   = buildRequest(); balanced.setFemaleEnrolment("50");
        EevtaRequest imbalanced = buildRequest(); imbalanced.setFemaleEnrolment("0");

        SustainabilityProfile p2 = new SustainabilityProfile(); p2.setUser(user);
        when(profileService.getOrCreateProfile(user)).thenReturn(profile, p2);

        double scoreBalanced   = ((Number) service.calculate(balanced,   user).get("score")).doubleValue();
        double scoreImbalanced = ((Number) service.calculate(imbalanced, user).get("score")).doubleValue();
        assertThat(scoreBalanced).isGreaterThan(scoreImbalanced);
    }

    @Test
    void calculate_savesProfileWithEevtaScore() {
        service.calculate(buildRequest(), user);
        verify(profileService).saveProfile(argThat(p -> p.getEevtaScore() > 0));
    }

    @Test
    void calculate_breakdownHasSixEntries() {
        Map<String, Object> result = service.calculate(buildRequest(), user);
        @SuppressWarnings("unchecked")
        Map<String, Object> bd = (Map<String, Object>) result.get("consumption_breakdown");
        assertThat(bd).hasSize(6);
    }

    private EevtaRequest buildRequest() {
        EevtaRequest req = new EevtaRequest();
        req.setTotalStudents("100");
        req.setTechVocStudents("30");
        req.setDistanceLearning("10");
        req.setScholarshipStudents("40");
        req.setFinancialAid("25");
        req.setGradRate("85");
        req.setEmploymentRate("25");
        req.setFemaleEnrolment("45");
        req.setDisabilityAccess("no");
        return req;
    }
}
