package com.moneytracker.dto;

import com.moneytracker.entity.Budget;

import java.math.BigDecimal;

public class BudgetResponse {
    private Long id;
    private CategoryResponse category;
    private BigDecimal amount;
    private int month;
    private int year;

    public BudgetResponse() {
    }

    public BudgetResponse(Budget budget) {
        this.id = budget.getId();
        if (budget.getCategory() != null) {
            this.category = new CategoryResponse(budget.getCategory());
        }
        this.amount = budget.getAmount();
        this.month = budget.getMonth();
        this.year = budget.getYear();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CategoryResponse getCategory() {
        return category;
    }

    public void setCategory(CategoryResponse category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}

