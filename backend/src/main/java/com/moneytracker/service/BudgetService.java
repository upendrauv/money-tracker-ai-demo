package com.moneytracker.service;

import com.moneytracker.dto.BudgetProgressDto;
import com.moneytracker.dto.BudgetRequest;
import com.moneytracker.dto.BudgetResponse;
import com.moneytracker.dto.CategoryResponse;
import com.moneytracker.entity.Budget;
import com.moneytracker.entity.Category;
import com.moneytracker.entity.User;
import com.moneytracker.exception.ResourceNotFoundException;
import com.moneytracker.repository.BudgetRepository;
import com.moneytracker.repository.CategoryRepository;
import com.moneytracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<BudgetProgressDto> getBudgetsForMonth(User user, int month, int year) {
        List<Budget> budgets = budgetRepository.findByUserAndMonthAndYear(user, month, year);

        YearMonth ym = YearMonth.of(year, month);
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        List<BudgetProgressDto> progressList = new ArrayList<>();

        for (Budget budget : budgets) {
            BigDecimal spent = transactionRepository.sumAmountByUserAndCategoryAndDateBetween(
                    user, budget.getCategory(), startDate, endDate);
            if (spent == null) {
                spent = BigDecimal.ZERO;
            }

            BigDecimal remaining = budget.getAmount().subtract(spent);
            double percentage = 0.0;
            if (budget.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                percentage = spent.multiply(new BigDecimal("100"))
                        .divide(budget.getAmount(), 2, RoundingMode.HALF_UP)
                        .doubleValue();
            }

            boolean isOverBudget = spent.compareTo(budget.getAmount()) > 0;

            progressList.add(new BudgetProgressDto(
                    budget.getId(),
                    new CategoryResponse(budget.getCategory()),
                    budget.getAmount(),
                    spent,
                    remaining,
                    percentage,
                    isOverBudget
            ));
        }

        return progressList;
    }

    @Transactional
    public BudgetResponse setBudget(User user, BudgetRequest request) {
        Category category = categoryRepository.findByIdAndAvailableForUser(request.getCategoryId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Optional<Budget> existing = budgetRepository.findByUserAndCategoryAndMonthAndYear(
                user, category, request.getMonth(), request.getYear());

        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setAmount(request.getAmount());
        } else {
            budget = new Budget(category, request.getAmount(), request.getMonth(), request.getYear(), user);
        }

        budget = budgetRepository.save(budget);
        return new BudgetResponse(budget);
    }

    @Transactional
    public void deleteBudget(Long id, User user) {
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
        budgetRepository.delete(budget);
    }
}

