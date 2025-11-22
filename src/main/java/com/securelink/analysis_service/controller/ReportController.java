package com.securelink.analysis_service.controller;

import com.securelink.analysis_service.model.Report;
import com.securelink.analysis_service.service.ReportService;
import com.securelink.analysis_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ReportController {

    private final ReportService reportService;
    private final JwtUtil jwtUtil;
    private final com.securelink.analysis_service.repository.UserRepository userRepository;

    @Autowired
    public ReportController(ReportService reportService, JwtUtil jwtUtil, com.securelink.analysis_service.repository.UserRepository userRepository) {
        this.reportService = reportService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Report>> getMyReports(@RequestHeader(value = "Authorization", required = false) String authorization) {
        String email = jwtUtil.extractEmail(authorization);
        if (email == null) return ResponseEntity.status(401).build();
        Long userId = userRepository.findByEmail(email).map(u -> u.getId()).orElse(null);
        if (userId == null) return ResponseEntity.status(401).build();
        List<Report> list = reportService.findByUserId(userId);
        return ResponseEntity.ok(list);
    }
}
