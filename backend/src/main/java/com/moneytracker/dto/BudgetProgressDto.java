package com.moneytracker.dto;

import java.math.BigDecimal;

public class BudgetProgressDto {
    private Long budgetId;
    private CategoryResponse category;
    private BigDecimal budgetAmount;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private double percentageSpent;
    private boolean overBudget;

    public BudgetProgressDto() {
    }

    public BudgetProgressDto(Long budgetId, CategoryResponse category, BigDecimal budgetAmount,
                             BigDecimal spentAmount, BigDecimal remainingAmount, double percentageSpent,
                             boolean overBudget) {
        this.budgetId = budgetId;
        this.category = category;
        this.budgetAmount = budgetAmount;
        this.spentAmount = spentAmount;
        this.remainingAmount = remainingAmount;
        this.percentageSpent = percentageSpent;
        this.overBudget = overBudget;
    }

    public Long getBudgetId() {
        return budgetId;
    }

    public void setBudgetId(Long budgetId) {
        this.budgetId = budgetId;
    }

    public CategoryResponse getCategory() {
        return category;
    }

    public void setCategory(CategoryResponse category) {
        this.category = category;
    }

    public BigDecimal getBudgetAmount() {
        return budgetAmount;
    }

    public void setBudgetAmount(BigDecimal budgetAmount) {
        this.budgetAmount = budgetAmount;
    }

    public BigDecimal getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public double getPercentageSpent() {
        return percentageSpent;
    }

    public void setPercentageSpent(double percentageSpent) {
        this.percentageSpent = percentageSpent;
    }

    public boolean isOverBudget() {
        return overBudget;
    }

    public void setOverBudget(boolean overBudget) {
        this.overBudget = overBudget;
    }
}

