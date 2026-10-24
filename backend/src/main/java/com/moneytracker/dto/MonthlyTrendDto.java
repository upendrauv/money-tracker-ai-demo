package com.moneytracker.dto;

import java.math.BigDecimal;

public class MonthlyTrendDto {
    private String monthName; // e.g., "Jan", "Feb"
    private int month;
    private int year;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal netSavings;

    public MonthlyTrendDto() {
    }

    public MonthlyTrendDto(String monthName, int month, int year, BigDecimal income, BigDecimal expense) {
        this.monthName = monthName;
        this.month = month;
        this.year = year;
        this.income = income != null ? income : BigDecimal.ZERO;
        this.expense = expense != null ? expense : BigDecimal.ZERO;
        this.netSavings = this.income.subtract(this.expense);
    }

    public String getMonthName() {
        return monthName;
    }

    public void setMonthName(String monthName) {
        this.monthName = monthName;
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

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }

    public BigDecimal getNetSavings() {
        return netSavings;
    }

    public void setNetSavings(BigDecimal netSavings) {
        this.netSavings = netSavings;
    }
}

