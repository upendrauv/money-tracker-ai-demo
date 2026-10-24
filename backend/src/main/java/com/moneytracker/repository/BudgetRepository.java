package com.moneytracker.repository;

import com.moneytracker.entity.Category;
import com.moneytracker.entity.Budget;
import com.moneytracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserAndMonthAndYear(User user, int month, int year);

    Optional<Budget> findByUserAndCategoryAndMonthAndYear(User user, Category category, int month, int year);

    Optional<Budget> findByIdAndUser(Long id, User user);
}

