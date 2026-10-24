package com.moneytracker.repository;

import com.moneytracker.entity.Category;
import com.moneytracker.entity.Transaction;
import com.moneytracker.entity.TransactionType;
import com.moneytracker.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    Optional<Transaction> findByIdAndUser(Long id, User user);

    List<Transaction> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    BigDecimal sumAmountByUserAndType(@Param("user") User user, @Param("type") TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type AND t.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserAndTypeAndDateBetween(@Param("user") User user,
                                                   @Param("type") TransactionType type,
                                                   @Param("startDate") LocalDate startDate,
                                                   @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.category = :category AND t.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserAndCategoryAndDateBetween(@Param("user") User user,
                                                       @Param("category") Category category,
                                                       @Param("startDate") LocalDate startDate,
                                                       @Param("endDate") LocalDate endDate);

    @Query("SELECT t.category.id, t.category.name, t.category.color, t.category.icon, SUM(t.amount) " +
           "FROM Transaction t " +
           "WHERE t.user = :user AND t.type = :type AND t.date BETWEEN :startDate AND :endDate " +
           "GROUP BY t.category.id, t.category.name, t.category.color, t.category.icon " +
           "ORDER BY SUM(t.amount) DESC")
    List<Object[]> findCategorySpendingBreakdown(@Param("user") User user,
                                                @Param("type") TransactionType type,
                                                @Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);

    List<Transaction> findTop5ByUserOrderByDateDescCreatedAtDesc(User user);
}

