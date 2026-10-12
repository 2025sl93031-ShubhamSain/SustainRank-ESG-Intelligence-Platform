package com.sustainability.controller;

import com.sustainability.entity.AppUser;
import com.sustainability.repository.UserRepository;
import com.sustainability.service.ProfileService;
import com.sustainability.util.SdgConstants;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class IndexController {

    private final UserRepository userRepository;
    private final ProfileService profileService;

    public IndexController(UserRepository userRepository, ProfileService profileService) {
        this.userRepository = userRepository;
        this.profileService = profileService;
    }

    @GetMapping("/index/")
    public ResponseEntity<Map<String, Object>> index(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("sdg_data", SdgConstants.SDG_DATA);
        resp.put("username", userDetails.getUsername());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/page/{pageName}/")
    public ResponseEntity<Map<String, Object>> dynamicPage(@PathVariable String pageName,
                                                            @AuthenticationPrincipal UserDetails userDetails) {
        AppUser user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        if ("result-page".equals(pageName)) {
            return ResponseEntity.ok(profileService.getResultPage(user));
        }
        return ResponseEntity.notFound().build();
    }
}
