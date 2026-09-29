package com.sustainability.util;

import java.util.LinkedHashMap;
import java.util.Map;

public final class SdgConstants {

    private SdgConstants() {}

    public static final Map<Integer, Map<String, String>> SDG_DATA = new LinkedHashMap<>();

    static {
        add(1,  "No Poverty",                             "End poverty in all its forms everywhere.",                                              "https://www.google.com/search?q=SDG+1+No+Poverty");
        add(2,  "Zero Hunger",                            "End hunger, achieve food security and improved nutrition.",                             "https://www.google.com/search?q=SDG+2+Zero+Hunger");
        add(3,  "Good Health and Well-being",             "Ensure healthy lives and promote well-being for all.",                                  "https://www.google.com/search?q=SDG+3+Good+Health+and+Well-being");
        add(4,  "Quality Education",                      "Ensure inclusive and equitable quality education.",                                     "https://www.google.com/search?q=SDG+4+Quality+Education");
        add(5,  "Gender Equality",                        "Achieve gender equality and empower all women and girls.",                              "https://www.google.com/search?q=SDG+5+Gender+Equality");
        add(6,  "Clean Water and Sanitation",             "Ensure availability and sustainable management of water.",                              "https://www.google.com/search?q=SDG+6+Clean+Water+and+Sanitation");
        add(7,  "Affordable and Clean Energy",            "Ensure access to affordable, reliable, and modern energy.",                            "https://www.google.com/search?q=SDG+7+Affordable+and+Clean+Energy");
        add(8,  "Decent Work and Economic Growth",        "Promote sustained, inclusive, and sustainable economic growth.",                       "https://www.google.com/search?q=SDG+8+Decent+Work+and+Economic+Growth");
        add(9,  "Industry, Innovation, and Infrastructure","Build resilient infrastructure and promote industrialization.",                        "https://www.google.com/search?q=SDG+9+Industry+Innovation+and+Infrastructure");
        add(10, "Reduced Inequality",                     "Reduce inequality within and among countries.",                                        "https://www.google.com/search?q=SDG+10+Reduced+Inequality");
        add(11, "Sustainable Cities and Communities",     "Make cities inclusive, safe, resilient, and sustainable.",                             "https://www.google.com/search?q=SDG+11+Sustainable+Cities+and+Communities");
        add(12, "Responsible Consumption and Production", "Ensure sustainable consumption and production patterns.",                              "https://www.google.com/search?q=SDG+12+Responsible+Consumption+and+Production");
        add(13, "Climate Action",                         "Take urgent action to combat climate change and its impacts.",                         "https://www.google.com/search?q=SDG+13+Climate+Action");
        add(14, "Life Below Water",                       "Conserve and sustainably use the oceans, seas, and marine resources.",                 "https://www.google.com/search?q=SDG+14+Life+Below+Water");
        add(15, "Life on Land",                           "Protect, restore, and promote sustainable use of terrestrial ecosystems.",             "https://www.google.com/search?q=SDG+15+Life+on+Land");
        add(16, "Peace, Justice, and Strong Institutions","Promote peaceful and inclusive societies.",                                            "https://www.google.com/search?q=SDG+16+Peace+Justice+and+Strong+Institutions");
        add(17, "Partnerships for the Goals",             "Strengthen implementation and revitalize global partnerships.",                        "https://www.google.com/search?q=SDG+17+Partnerships+for+the+Goals");
    }

    private static void add(int num, String title, String description, String link) {
        Map<String, String> entry = new LinkedHashMap<>();
        entry.put("title", title);
        entry.put("description", description);
        entry.put("link", link);
        SDG_DATA.put(num, entry);
    }
}
