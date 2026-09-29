package com.sustainability.util;

import java.util.Map;

public final class CalcUtils {

    private CalcUtils() {}

    // ── Emission factors ────────────────────────────────────────────────────
    public static final double GRID_EF_INDIA    = 0.82;   // kgCO2e/kWh
    public static final double GAS_EF           = 2.204;  // kgCO2e/m³
    public static final double PETROL_EF        = 2.31;   // kgCO2e/litre
    public static final double DIESEL_EF        = 2.68;   // kgCO2e/litre
    public static final double LPG_EF           = 1.51;   // kgCO2e/litre
    public static final double SHORT_FLIGHT_EF  = 0.255;  // tCO2e/passenger
    public static final double LONG_FLIGHT_EF   = 0.195;  // tCO2e/passenger-hour
    public static final double TRAIN_EF         = 0.041;  // kgCO2e/passenger-km

    // ── Sector benchmarks ───────────────────────────────────────────────────
    public static final Map<String, Double> SECTOR_CARBON = Map.of(
        "education",      2.0,
        "it",             1.8,
        "healthcare",     3.5,
        "manufacturing", 12.0,
        "retail",         2.5,
        "hospitality",    4.0,
        "finance",        1.5,
        "general",        5.0
    );

    public static final Map<String, Double> SECTOR_ENERGY = Map.of(
        "education",     150.0,
        "it",            200.0,
        "healthcare",    400.0,
        "manufacturing", 800.0,
        "retail",        250.0,
        "hospitality",   500.0,
        "finance",       180.0,
        "general",       300.0
    );

    public static final Map<String, Double> SECTOR_WASTE = Map.of(
        "education",    35.0,
        "it",           40.0,
        "healthcare",   25.0,
        "manufacturing",45.0,
        "retail",       50.0,
        "hospitality",  30.0,
        "finance",      42.0,
        "general",      38.0
    );

    // ── Helpers ─────────────────────────────────────────────────────────────

    public static String sectorKey(String industry) {
        if (industry == null) return "general";
        String s = industry.toLowerCase();
        for (String key : SECTOR_CARBON.keySet()) {
            if (s.contains(key)) return key;
        }
        return "general";
    }

    public static double clamp(double value) {
        return Math.max(0.0, Math.min(100.0, value));
    }

    public static double clamp(double value, double lo, double hi) {
        return Math.max(lo, Math.min(hi, value));
    }

    public static double percentileScore(double value, double benchmark, boolean lowerIsBetter) {
        if (benchmark <= 0) return 50.0;
        double ratio = value / benchmark;
        double score = lowerIsBetter
            ? 100.0 * Math.exp(-0.693 * ratio)
            : 100.0 * (1.0 - Math.exp(-0.693 * ratio));
        return clamp(score);
    }

    public static double parseDouble(Object val, double defaultVal) {
        if (val == null) return defaultVal;
        try {
            String s = val.toString().trim();
            if (s.isEmpty()) return defaultVal;
            return Double.parseDouble(s);
        } catch (NumberFormatException e) {
            return defaultVal;
        }
    }

    public static int parseInt(Object val, int defaultVal) {
        if (val == null) return defaultVal;
        try {
            String s = val.toString().trim();
            if (s.isEmpty()) return defaultVal;
            return (int) Double.parseDouble(s);
        } catch (NumberFormatException e) {
            return defaultVal;
        }
    }

    public static double round(double val, int decimals) {
        double factor = Math.pow(10, decimals);
        return Math.round(val * factor) / factor;
    }
}
