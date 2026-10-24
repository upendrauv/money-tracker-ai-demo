package com.moneytracker.dto;

import com.moneytracker.entity.PaymentMethod;
import com.moneytracker.entity.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Type is required (INCOME or EXPENSE)")
    private TransactionType type;

    @NotNull(message = "Transaction date is required")
    private LocalDate date;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private PaymentMethod paymentMethod = PaymentMethod.CASH;

    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;

    public TransactionRequest() {
    }

    public TransactionRequest(String title, BigDecimal amount, TransactionType type, LocalDate date,
                              Long categoryId, PaymentMethod paymentMethod, String notes) {
        this.title = title;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.categoryId = categoryId;
        this.paymentMethod = paymentMethod;
        this.notes = notes;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

