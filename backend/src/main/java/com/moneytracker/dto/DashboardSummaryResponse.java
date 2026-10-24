package com.moneytracker.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryResponse {
    private BigDecimal totalBalance;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpense;
    private BigDecimal savingsRate; // Percentage e.g. 35.5%
    private String currency;
    private List<CategorySpendDto> categorySpendings;
    private List<MonthlyTrendDto> monthlyTrends;
    private List<TransactionResponse> recentTransactions;

    public DashboardSummaryResponse() {
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public BigDecimal getMonthlyExpense() {
        return monthlyExpense;
    }

    public void setMonthlyExpense(BigDecimal monthlyExpense) {
        this.monthlyExpense = monthlyExpense;
    }

    public BigDecimal getSavingsRate() {
        return savingsRate;
    }

    public void setSavingsRate(BigDecimal savingsRate) {
        this.savingsRate = savingsRate;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public List<CategorySpendDto> getCategorySpendings() {
        return categorySpendings;
    }

    public void setCategorySpendings(List<CategorySpendDto> categorySpendings) {
        this.categorySpendings = categorySpendings;
    }

    public List<MonthlyTrendDto> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<MonthlyTrendDto> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }

    public List<TransactionResponse> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionResponse> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }
}

