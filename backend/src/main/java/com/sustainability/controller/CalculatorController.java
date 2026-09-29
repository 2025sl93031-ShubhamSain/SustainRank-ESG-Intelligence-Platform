package com.sustainability.controller;

import com.sustainability.dto.*;
import com.sustainability.entity.AppUser;
import com.sustainability.repository.UserRepository;
import com.sustainability.service.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class CalculatorController {

    private final UserRepository userRepository;
    private final CarbonCalculatorService carbonService;
    private final EnergyCalculatorService energyService;
    private final WasteCalculatorService wasteService;
    private final EevtaCalculatorService eevtaService;
    private final SustainabilityScoreService sustainabilityService;

    public CalculatorController(UserRepository userRepository,
                                 CarbonCalculatorService carbonService,
                                 EnergyCalculatorService energyService,
                                 WasteCalculatorService wasteService,
                                 EevtaCalculatorService eevtaService,
                                 SustainabilityScoreService sustainabilityService) {
        this.userRepository = userRepository;
        this.carbonService = carbonService;
        this.energyService = energyService;
        this.wasteService = wasteService;
        this.eevtaService = eevtaService;
        this.sustainabilityService = sustainabilityService;
    }

    private AppUser resolveUser(UserDetails ud) {
        return userRepository.findByUsername(ud.getUsername()).orElseThrow();
    }

    @PostMapping(value = "/carbon_calculator/",
        consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public ResponseEntity<Map<String, Object>> carbon(
        @RequestBody(required = false) CarbonRequest jsonReq,
        @ModelAttribute CarbonRequest formReq,
        @AuthenticationPrincipal UserDetails ud) {
        CarbonRequest req = jsonReq != null ? jsonReq : formReq;
        return ResponseEntity.ok(carbonService.calculate(req, resolveUser(ud)));
    }

    @PostMapping(value = "/energy_calculator/",
        consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public ResponseEntity<Map<String, Object>> energy(
        @RequestBody(required = false) EnergyRequest jsonReq,
        @ModelAttribute EnergyRequest formReq,
        @AuthenticationPrincipal UserDetails ud) {
        EnergyRequest req = jsonReq != null ? jsonReq : formReq;
        return ResponseEntity.ok(energyService.calculate(req, resolveUser(ud)));
    }

    @PostMapping(value = "/waste_calculator/",
        consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public ResponseEntity<Map<String, Object>> waste(
        @RequestBody(required = false) WasteRequest jsonReq,
        @ModelAttribute WasteRequest formReq,
        @AuthenticationPrincipal UserDetails ud) {
        WasteRequest req = jsonReq != null ? jsonReq : formReq;
        return ResponseEntity.ok(wasteService.calculate(req, resolveUser(ud)));
    }

    @PostMapping(value = "/calculate_eevta_score/",
        consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public ResponseEntity<Map<String, Object>> eevta(
        @RequestBody(required = false) EevtaRequest jsonReq,
        @ModelAttribute EevtaRequest formReq,
        @AuthenticationPrincipal UserDetails ud) {
        EevtaRequest req = jsonReq != null ? jsonReq : formReq;
        return ResponseEntity.ok(eevtaService.calculate(req, resolveUser(ud)));
    }

    @PostMapping(value = "/sustainability_calculator/",
        consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public ResponseEntity<Map<String, Object>> sustainability(
        @RequestBody(required = false) SustainabilityRequest jsonReq,
        @ModelAttribute SustainabilityRequest formReq,
        @AuthenticationPrincipal UserDetails ud) {
        SustainabilityRequest req = jsonReq != null ? jsonReq : formReq;
        return ResponseEntity.ok(sustainabilityService.calculate(req, resolveUser(ud)));
    }
}
