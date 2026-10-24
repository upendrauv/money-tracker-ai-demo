package com.moneytracker.dto;

import com.moneytracker.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 60, message = "Name must be between 2 and 60 characters")
    private String name;

    @NotNull(message = "Transaction type is required (INCOME or EXPENSE)")
    private TransactionType type;

    private String icon = "Tag";
    private String color = "#6366F1";

    public CategoryRequest() {
    }

    public CategoryRequest(String name, TransactionType type, String icon, String color) {
        this.name = name;
        this.type = type;
        this.icon = icon;
        this.color = color;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}

