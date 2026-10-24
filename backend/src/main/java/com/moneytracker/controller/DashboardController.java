package com.moneytracker.controller;

import com.moneytracker.dto.DashboardSummaryResponse;
import com.moneytracker.entity.User;
import com.moneytracker.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dashboardService.getDashboardSummary(user));
    }
}

