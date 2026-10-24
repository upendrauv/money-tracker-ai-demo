package com.moneytracker.controller;

import com.moneytracker.dto.BudgetProgressDto;
import com.moneytracker.dto.BudgetRequest;
import com.moneytracker.dto.BudgetResponse;
import com.moneytracker.entity.User;
import com.moneytracker.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<BudgetProgressDto>> getBudgets(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        int targetMonth = month != null ? month : LocalDate.now().getMonthValue();
        int targetYear = year != null ? year : LocalDate.now().getYear();

        return ResponseEntity.ok(budgetService.getBudgetsForMonth(user, targetMonth, targetYear));
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> setBudget(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.setBudget(user, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBudget(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        budgetService.deleteBudget(id, user);
        return ResponseEntity.ok(Map.of("message", "Budget deleted successfully"));
    }
}

