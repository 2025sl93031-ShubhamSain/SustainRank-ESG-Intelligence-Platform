package com.sustainability.report;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping(value = "/analyse", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyse(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "No file uploaded."));
        }

        String ct = file.getContentType();
        if (ct == null || !ct.equals("application/pdf")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "Only PDF files are supported."));
        }

        if (file.getSize() > 20 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "File size must be under 20 MB."));
        }

        try {
            ReportAnalysisResult result = reportService.analyseReport(file, userDetails.getUsername());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Failed to analyse report: " + e.getMessage()));
        }
    }
}
