package com.moneytracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "money-tracker-api");
        status.put("timestamp", LocalDateTime.now());

        try (Connection conn = dataSource.getConnection()) {
            status.put("database", "CONNECTED");
            status.put("databaseCatalog", conn.getCatalog());
        } catch (Exception e) {
            status.put("database", "DISCONNECTED: " + e.getMessage());
        }

        return ResponseEntity.ok(status);
    }
}

