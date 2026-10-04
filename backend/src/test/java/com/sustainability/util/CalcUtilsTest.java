package com.sustainability.util;

import org.junit.jupiter.api.Test;

import static com.sustainability.util.CalcUtils.*;
import static org.assertj.core.api.Assertions.*;

class CalcUtilsTest {

    // ── parseDouble ──────────────────────────────────────────────────────────

    @Test
    void parseDouble_nullReturnsDefault() {
        assertThat(parseDouble(null, 5.0)).isEqualTo(5.0);
    }

    @Test
    void parseDouble_blankStringReturnsDefault() {
        assertThat(parseDouble("  ", 3.0)).isEqualTo(3.0);
    }

    @Test
    void parseDouble_validStringParsed() {
        assertThat(parseDouble("42.5", 0)).isEqualTo(42.5);
    }

    @Test
    void parseDouble_invalidStringReturnsDefault() {
        assertThat(parseDouble("abc", 1.0)).isEqualTo(1.0);
    }

    // ── parseInt ─────────────────────────────────────────────────────────────

    @Test
    void parseInt_nullReturnsDefault() {
        assertThat(parseInt(null, 10)).isEqualTo(10);
    }

    @Test
    void parseInt_validDecimalTruncates() {
        assertThat(parseInt("7.9", 0)).isEqualTo(7);
    }

    @Test
    void parseInt_invalidStringReturnsDefault() {
        assertThat(parseInt("xyz", 2)).isEqualTo(2);
    }

    // ── round ────────────────────────────────────────────────────────────────

    @Test
    void round_twoDecimalsRoundsCorrectly() {
        assertThat(round(3.14159, 2)).isEqualTo(3.14);
    }

    @Test
    void round_zeroDecimalsRoundsToInteger() {
        assertThat(round(2.6, 0)).isEqualTo(3.0);
    }

    // ── clamp ────────────────────────────────────────────────────────────────

    @Test
    void clamp_belowZeroClampsToZero() {
        assertThat(clamp(-5.0)).isEqualTo(0.0);
    }

    @Test
    void clamp_above100ClampsTo100() {
        assertThat(clamp(150.0)).isEqualTo(100.0);
    }

    @Test
    void clamp_withinRangePassesThrough() {
        assertThat(clamp(50.0)).isEqualTo(50.0);
    }

    @Test
    void clamp_withBoundsRespectsBounds() {
        assertThat(clamp(30.0, 0, 25)).isEqualTo(25.0);
        assertThat(clamp(-1.0, 0, 25)).isEqualTo(0.0);
    }

    // ── percentileScore ──────────────────────────────────────────────────────

    @Test
    void percentileScore_atBenchmarkLowerIsBetter_returnsAround50() {
        double score = percentileScore(5.0, 5.0, true);
        assertThat(score).isCloseTo(50.0, withinPercentage(1));
    }

    @Test
    void percentileScore_wellBelowBenchmarkLowerIsBetter_returnsHighScore() {
        double score = percentileScore(1.0, 10.0, true);
        assertThat(score).isGreaterThan(80.0);
    }

    @Test
    void percentileScore_wellAboveBenchmarkLowerIsBetter_returnsLowScore() {
        double score = percentileScore(20.0, 5.0, true);
        assertThat(score).isLessThan(20.0);
    }

    @Test
    void percentileScore_atBenchmarkHigherIsBetter_returnsAround50() {
        double score = percentileScore(38.0, 38.0, false);
        assertThat(score).isCloseTo(50.0, withinPercentage(1));
    }

    @Test
    void percentileScore_zeroBenchmark_returns50() {
        assertThat(percentileScore(10.0, 0.0, true)).isEqualTo(50.0);
    }

    // ── sectorKey ────────────────────────────────────────────────────────────

    @Test
    void sectorKey_knownSectorMatches() {
        assertThat(sectorKey("IT Services")).isEqualTo("it");
        assertThat(sectorKey("Manufacturing Co.")).isEqualTo("manufacturing");
        assertThat(sectorKey("Healthcare")).isEqualTo("healthcare");
    }

    @Test
    void sectorKey_unknownSectorFallsBackToGeneral() {
        assertThat(sectorKey("Agriculture")).isEqualTo("general");
    }

    @Test
    void sectorKey_nullFallsBackToGeneral() {
        assertThat(sectorKey(null)).isEqualTo("general");
    }
}
