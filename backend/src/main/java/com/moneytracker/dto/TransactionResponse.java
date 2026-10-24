package com.moneytracker.dto;

import com.moneytracker.entity.PaymentMethod;
import com.moneytracker.entity.Transaction;
import com.moneytracker.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionResponse {
    private Long id;
    private String title;
    private BigDecimal amount;
    private TransactionType type;
    private LocalDate date;
    private CategoryResponse category;
    private PaymentMethod paymentMethod;
    private String notes;
    private LocalDateTime createdAt;

    public TransactionResponse() {
    }

    public TransactionResponse(Transaction transaction) {
        this.id = transaction.getId();
        this.title = transaction.getTitle();
        this.amount = transaction.getAmount();
        this.type = transaction.getType();
        this.date = transaction.getDate();
        if (transaction.getCategory() != null) {
            this.category = new CategoryResponse(transaction.getCategory());
        }
        this.paymentMethod = transaction.getPaymentMethod();
        this.notes = transaction.getNotes();
        this.createdAt = transaction.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public CategoryResponse getCategory() {
        return category;
    }

    public void setCategory(CategoryResponse category) {
        this.category = category;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

