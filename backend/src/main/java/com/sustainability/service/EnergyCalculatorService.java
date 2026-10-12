package com.sustainability.service;

import com.sustainability.dto.EnergyRequest;
import com.sustainability.entity.AppUser;
import com.sustainability.repository.SustainabilityProfileRepository;
import com.sustainability.util.CalcUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.sustainability.util.CalcUtils.*;

@Service
public class EnergyCalculatorService {

    private final ProfileService profileService;
    private final SustainabilityProfileRepository profileRepository;

    public EnergyCalculatorService(ProfileService profileService,
                                   SustainabilityProfileRepository profileRepository) {
        this.profileService = profileService;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public Map<String, Object> calculate(EnergyRequest req, AppUser user) {
        double electricityKwh = parseDouble(req.getMonthlyElectricity(), 0);
        double vehicleLitres  = parseDouble(req.getVehicleFuel(), 0);
        String fuelType       = req.getFuelType() != null ? req.getFuelType() : "petrol";
        double heatingFuel    = parseDouble(req.getHeatingFuel(), 0);
        double waterM3        = parseDouble(req.getWaterConsumption(), 0);
        double renewablePct   = parseDouble(req.getRenewablePct(), 0);
        int numEmployees      = Math.max(1, parseInt(req.getNumEmployees(), 1));
        String industry       = req.getIndustry() != null ? req.getIndustry() : "general";

        Map<String, Double> fuelFactors = Map.of("petrol",8.9,"diesel",10.7,"lpg",7.4,"other",9.5);
        double fuelKwh  = vehicleLitres * fuelFactors.getOrDefault(fuelType, 9.5);
        double heatKwh  = heatingFuel * 7.4;
        double waterKwh = waterM3 * 0.55;
        double totalKwh = electricityKwh + fuelKwh + heatKwh + waterKwh;

        double renewableKwh  = electricityKwh * (renewablePct / 100);
        double energyIntensity = totalKwh / numEmployees;

        String sector    = sectorKey(industry);
        double benchmark = SECTOR_ENERGY.get(sector);
        Double industryAvgRaw = profileRepository.findAvgEnergyTotal();
        double industryAvg = industryAvgRaw != null ? industryAvgRaw : benchmark;

        double intensityScore  = percentileScore(energyIntensity, benchmark, true);
        double renewableBonus  = clamp(renewablePct);
        double energyScore     = round(clamp(intensityScore * 0.70 + renewableBonus * 0.30), 1);

        // Save
        var profile = profileService.getOrCreateProfile(user);
        profile.setEnergyTotal(round(totalKwh, 2));
        profile.setElectricityKwh(electricityKwh);
        profile.setRenewablePct(renewablePct);
        profile.setEnergyIntensity(round(energyIntensity, 2));
        profile.setNumEmployees(numEmployees);
        profileService.saveProfile(profile);

        // Breakdown
        Map<String, Object> breakdown = new LinkedHashMap<>();
        breakdown.put("Electricity",        Map.of("id","elec",  "value",(long)Math.round(electricityKwh), "unit","kWh/mo"));
        breakdown.put("Renewable (credit)", Map.of("id","ren",   "value",(long)Math.round(renewableKwh),   "unit","kWh/mo"));
        breakdown.put("Vehicle Fuel",       Map.of("id","veh",   "value",(long)Math.round(fuelKwh),        "unit","kWh equiv."));
        breakdown.put("Heating",            Map.of("id","heat",  "value",(long)Math.round(heatKwh),        "unit","kWh equiv."));
        breakdown.put("Water",              Map.of("id","water", "value",(long)Math.round(waterKwh),       "unit","kWh equiv."));
        breakdown.put("Industry Average",   Map.of("id","ind",   "value",(long)Math.round(industryAvg),    "unit","kWh/mo"));

        Map<String, Object> ctx = new LinkedHashMap<>();
        ctx.put("score", energyScore);
        ctx.put("heading", "Energy Consumption Assessment");
        ctx.put("sub_heading", "ISO 50001 energy intensity methodology — " + capitalize(sector) + " benchmark: " + benchmark + " kWh/employee/month");
        ctx.put("message", "Your total energy use is " + String.format("%,d", (long)Math.round(totalKwh)) + " kWh/month ("
            + Math.round(energyIntensity) + " kWh/employee). Sector benchmark: " + (int)benchmark + " kWh/employee. Renewables cover " + Math.round(renewablePct) + "% of electricity.");
        ctx.put("categories", categories());
        ctx.put("show_breakdown", true);
        ctx.put("consumption_breakdown", breakdown);
        ctx.put("suggestions", energySuggestions(energyIntensity, benchmark, renewablePct));
        return ctx;
    }

    private List<String> energySuggestions(double intensity, double benchmark, double renPct) {
        List<String> tips = new ArrayList<>();
        if (intensity > benchmark * 1.5)
            tips.add("Your energy intensity is 50%+ above benchmark — an urgent energy audit is recommended. Target 20% reduction in 12 months.");
        if (intensity > benchmark)
            tips.add("You use " + (int)((intensity/benchmark-1)*100) + "% more energy per employee than sector peers. Identify your top three energy-consuming systems for targeted improvements.");
        if (renPct < 20)
            tips.add("Renewables cover less than 20% of your electricity. Procuring a Power Purchase Agreement (PPA) for solar is now cost-competitive with grid rates in India.");
        if (renPct < 50)
            tips.add("Increasing renewable share above 50% would boost your energy score significantly and reduce both costs and Scope 2 carbon emissions.");
        tips.add("Install sub-metering to identify the largest energy consumers and set department-level targets.");
        tips.add("ISO 50001 certification provides a structured framework for continual energy performance improvement.");
        return tips.subList(0, Math.min(5, tips.size()));
    }

    private Map<String, Object> categories() {
        Map<String, Object> cats = new LinkedHashMap<>();
        cats.put("Excellent", Map.of("range", List.of(80,100), "color","success"));
        cats.put("Good",      Map.of("range", List.of(60,79),  "color","info"));
        cats.put("Average",   Map.of("range", List.of(40,59),  "color","warning"));
        cats.put("Poor",      Map.of("range", List.of(0,39),   "color","danger"));
        return cats;
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}
