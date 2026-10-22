package com.sustainability.ai;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiServiceTest {

    @Mock  AiProvider provider;
    @InjectMocks AiService service;

    @Test
    void getRecommendations_returnsProviderResults() {
        when(provider.getRecommendations(any()))
                .thenReturn(List.of("Reduce emissions.", "Switch to renewables."));

        List<String> result = service.getRecommendations(new AiRecommendationRequest());

        assertThat(result).containsExactly("Reduce emissions.", "Switch to renewables.");
    }

    @Test
    void getRecommendations_returnsEmptyWhenProviderReturnsNull() {
        when(provider.getRecommendations(any())).thenReturn(null);

        List<String> result = service.getRecommendations(new AiRecommendationRequest());

        assertThat(result).isEmpty();
    }

    @Test
    void getRecommendations_returnsEmptyWhenProviderReturnsEmptyList() {
        when(provider.getRecommendations(any())).thenReturn(List.of());

        List<String> result = service.getRecommendations(new AiRecommendationRequest());

        assertThat(result).isEmpty();
    }

    @Test
    void getRecommendations_returnsEmptyAndDoesNotThrowWhenProviderThrows() {
        when(provider.getRecommendations(any()))
                .thenThrow(new RuntimeException("Network timeout"));

        List<String> result = service.getRecommendations(new AiRecommendationRequest());

        assertThat(result).isEmpty();
    }

    @Test
    void getRecommendations_callsProviderExactlyOnce() {
        when(provider.getRecommendations(any())).thenReturn(List.of("rec"));

        service.getRecommendations(new AiRecommendationRequest());

        verify(provider, times(1)).getRecommendations(any());
    }

    @Test
    void getRecommendations_passesRequestThroughToProvider() {
        AiRecommendationRequest req = new AiRecommendationRequest();
        req.setType("carbon");
        req.setScore(72.0);
        when(provider.getRecommendations(req)).thenReturn(List.of("rec"));

        service.getRecommendations(req);

        verify(provider).getRecommendations(req);
    }
}
