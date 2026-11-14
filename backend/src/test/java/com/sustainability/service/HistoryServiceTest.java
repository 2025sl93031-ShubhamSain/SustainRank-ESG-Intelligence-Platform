package com.sustainability.service;

import com.sustainability.entity.AppUser;
import com.sustainability.entity.CalculationHistory;
import com.sustainability.repository.CalculationHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HistoryServiceTest {

    @Mock CalculationHistoryRepository historyRepository;
    @Mock ProfileService profileService;
    @InjectMocks HistoryService historyService;

    private AppUser owner;
    private CalculationHistory record;

    @BeforeEach
    void setUp() {
        owner = new AppUser("alice", "alice@test.com", "hashed");
        record = new CalculationHistory();
        record.setUser(owner);
    }

    // ── deleteById ────────────────────────────────────────────────────────────

    @Test
    void deleteById_ownerDeletes_callsRepositoryDelete() {
        when(historyRepository.findById(1L)).thenReturn(Optional.of(record));

        historyService.deleteById(1L, "alice");

        verify(historyRepository).deleteById(1L);
    }

    @Test
    void deleteById_recordNotFound_throws404() {
        when(historyRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> historyService.deleteById(99L, "alice"))
            .isInstanceOf(ResponseStatusException.class)
            .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND));

        verify(historyRepository, never()).deleteById(any());
    }

    @Test
    void deleteById_differentUser_throws403() {
        when(historyRepository.findById(1L)).thenReturn(Optional.of(record));

        assertThatThrownBy(() -> historyService.deleteById(1L, "bob"))
            .isInstanceOf(ResponseStatusException.class)
            .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode())
                .isEqualTo(HttpStatus.FORBIDDEN));

        verify(historyRepository, never()).deleteById(any());
    }
}
