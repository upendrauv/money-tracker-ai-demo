package com.moneytracker.service;

import com.moneytracker.dto.CategoryRequest;
import com.moneytracker.dto.CategoryResponse;
import com.moneytracker.entity.Category;
import com.moneytracker.entity.TransactionType;
import com.moneytracker.entity.User;
import com.moneytracker.exception.BadRequestException;
import com.moneytracker.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryResponse> getCategories(User user, TransactionType type) {
        List<Category> categories;
        if (type != null) {
            categories = categoryRepository.findAllAvailableForUserAndType(user, type);
        } else {
            categories = categoryRepository.findAllAvailableForUser(user);
        }
        return categories.stream().map(CategoryResponse::new).toList();
    }

    @Transactional
    public CategoryResponse createCategory(User user, CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCaseAndUser(request.getName().trim(), user)) {
            throw new BadRequestException("You already have a category named '" + request.getName() + "'");
        }

        Category category = new Category(
                request.getName().trim(),
                request.getType(),
                request.getIcon() != null ? request.getIcon().trim() : "Tag",
                request.getColor() != null ? request.getColor().trim() : "#6366F1",
                false,
                user
        );

        category = categoryRepository.save(category);
        return new CategoryResponse(category);
    }
}

