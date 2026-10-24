package com.moneytracker.controller;

import com.moneytracker.dto.CategoryRequest;
import com.moneytracker.dto.CategoryResponse;
import com.moneytracker.entity.TransactionType;
import com.moneytracker.entity.User;
import com.moneytracker.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) TransactionType type) {
        return ResponseEntity.ok(categoryService.getCategories(user, type));
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.createCategory(user, request));
    }
}

