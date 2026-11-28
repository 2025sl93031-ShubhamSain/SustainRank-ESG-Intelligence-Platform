package com.sustainability.service;

import com.sustainability.entity.AppUser;
import com.sustainability.entity.CalculationHistory;
import com.sustainability.repository.CalculationHistoryRepository;
import com.sustainability.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeaderboardServiceTest {

    @Mock UserRepository userRepository;
    @Mock CalculationHistoryRepository historyRepository;
    @InjectMocks LeaderboardService leaderboardService;

    private AppUser user(String name) {
        return new AppUser(name, name + "@test.com", "hashed");
    }

    private CalculationHistory entry(AppUser user, double score) {
        CalculationHistory entry = new CalculationHistory();
        entry.setUser(user);
        entry.setSustainabilityScore(score);
        return entry;
    }

    @Test
    void emptyWhenNoUsers() {
        when(userRepository.findAll()).thenReturn(List.of());

        assertThat(leaderboardService.getLeaderboard()).isEmpty();
        verifyNoInteractions(historyRepository);
    }

    @Test
    void skipsUsersWithoutHistory() {
        AppUser withHistory = user("active");
        AppUser withoutHistory = user("idle");
        when(userRepository.findAll()).thenReturn(List.of(withHistory, withoutHistory));
        when(historyRepository.findByUserOrderByCreatedAtDesc(withHistory))
                .thenReturn(List.of(entry(withHistory, 70.0)));
        when(historyRepository.findByUserOrderByCreatedAtDesc(withoutHistory))
                .thenReturn(List.of());

        List<Map<String, Object>> rows = leaderboardService.getLeaderboard();

        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).get("username")).isEqualTo("active");
        assertThat(rows.get(0).get("rank")).isEqualTo(1);
    }

    @Test
    void ranksByScoreDescending() {
        AppUser low = user("low");
        AppUser high = user("high");
        AppUser mid = user("mid");
        when(userRepository.findAll()).thenReturn(List.of(low, high, mid));
        when(historyRepository.findByUserOrderByCreatedAtDesc(low))
                .thenReturn(List.of(entry(low, 40.0)));
        when(historyRepository.findByUserOrderByCreatedAtDesc(high))
                .thenReturn(List.of(entry(high, 90.0)));
        when(historyRepository.findByUserOrderByCreatedAtDesc(mid))
                .thenReturn(List.of(entry(mid, 65.0)));

        List<Map<String, Object>> rows = leaderboardService.getLeaderboard();

        assertThat(rows).extracting(row -> row.get("username"))
                .containsExactly("high", "mid", "low");
        assertThat(rows).extracting(row -> row.get("rank"))
                .containsExactly(1, 2, 3);
    }

    @Test
    void equalScoresKeepInputOrder() {
        AppUser first = user("first");
        AppUser second = user("second");
        when(userRepository.findAll()).thenReturn(List.of(first, second));
        when(historyRepository.findByUserOrderByCreatedAtDesc(first))
                .thenReturn(List.of(entry(first, 80.0)));
        when(historyRepository.findByUserOrderByCreatedAtDesc(second))
                .thenReturn(List.of(entry(second, 80.0)));

        List<Map<String, Object>> rows = leaderboardService.getLeaderboard();

        assertThat(rows).extracting(row -> row.get("username"))
                .containsExactly("first", "second");
        assertThat(rows).extracting(row -> row.get("rank"))
                .containsExactly(1, 2);
    }

    @Test
    void singleCompanyGetsRankOneAndNeutralTrend() {
        AppUser solo = user("solo");
        when(userRepository.findAll()).thenReturn(List.of(solo));
        when(historyRepository.findByUserOrderByCreatedAtDesc(solo))
                .thenReturn(List.of(entry(solo, 55.5)));

        List<Map<String, Object>> rows = leaderboardService.getLeaderboard();

        assertThat(rows).hasSize(1);
        Map<String, Object> row = rows.get(0);
        assertThat(row.get("rank")).isEqualTo(1);
        assertThat(row.get("sustainability_score")).isEqualTo(55.5);
        assertThat(row.get("trend")).isEqualTo("neutral");
        assertThat(row.get("trend_score")).isEqualTo(0.0);
    }

    @Test
    void trendComparesLatestWithPreviousEntry() {
        AppUser rising = user("rising");
        AppUser falling = user("falling");
        when(userRepository.findAll()).thenReturn(List.of(rising, falling));
        // Repository returns newest first, so index 1 is the previous entry.
        when(historyRepository.findByUserOrderByCreatedAtDesc(rising))
                .thenReturn(List.of(
                        entry(rising, 70.0),
                        entry(rising, 60.0)));
        when(historyRepository.findByUserOrderByCreatedAtDesc(falling))
                .thenReturn(List.of(
                        entry(falling, 50.0),
                        entry(falling, 62.0)));

        List<Map<String, Object>> rows = leaderboardService.getLeaderboard();

        Map<String, Object> risingRow = rows.get(0);
        Map<String, Object> fallingRow = rows.get(1);
        assertThat(risingRow.get("trend")).isEqualTo("up");
        assertThat(risingRow.get("trend_score")).isEqualTo(10.0);
        assertThat(fallingRow.get("trend")).isEqualTo("down");
        assertThat(fallingRow.get("trend_score")).isEqualTo(-12.0);
    }
}
