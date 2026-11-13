package com.sustainability.controller;

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

    @GetMapping("/index/")
    public ResponseEntity<Map<String, Object>> index(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("sdg_data", SdgConstants.SDG_DATA);
        resp.put("username", userDetails.getUsername());
        return ResponseEntity.ok(resp);
    }
}
