package com.moneytracker.service;

import com.moneytracker.dto.CategorySpendDto;
import com.moneytracker.dto.DashboardSummaryResponse;
import com.moneytracker.dto.MonthlyTrendDto;
import com.moneytracker.dto.TransactionResponse;
import com.moneytracker.entity.Transaction;
import com.moneytracker.entity.TransactionType;
import com.moneytracker.entity.User;
import com.moneytracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class DashboardService {

    @Autowired
    private TransactionRepository transactionRepository;

    public DashboardSummaryResponse getDashboardSummary(User user) {
        DashboardSummaryResponse response = new DashboardSummaryResponse();
        response.setCurrency(user.getCurrency());

        // All time balance
        BigDecimal allTimeIncome = transactionRepository.sumAmountByUserAndType(user, TransactionType.INCOME);
        BigDecimal allTimeExpense = transactionRepository.sumAmountByUserAndType(user, TransactionType.EXPENSE);
        if (allTimeIncome == null) allTimeIncome = BigDecimal.ZERO;
        if (allTimeExpense == null) allTimeExpense = BigDecimal.ZERO;
        response.setTotalBalance(allTimeIncome.subtract(allTimeExpense));

        // Current month totals
        LocalDate today = LocalDate.now();
        YearMonth currentYearMonth = YearMonth.from(today);
        LocalDate startOfMonth = currentYearMonth.atDay(1);
        LocalDate endOfMonth = currentYearMonth.atEndOfMonth();

        BigDecimal monthlyIncome = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user, TransactionType.INCOME, startOfMonth, endOfMonth);
        BigDecimal monthlyExpense = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user, TransactionType.EXPENSE, startOfMonth, endOfMonth);
        if (monthlyIncome == null) monthlyIncome = BigDecimal.ZERO;
        if (monthlyExpense == null) monthlyExpense = BigDecimal.ZERO;

        response.setMonthlyIncome(monthlyIncome);
        response.setMonthlyExpense(monthlyExpense);

        // Savings Rate
        if (monthlyIncome.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal savings = monthlyIncome.subtract(monthlyExpense);
            BigDecimal rate = savings.multiply(new BigDecimal("100"))
                    .divide(monthlyIncome, 1, RoundingMode.HALF_UP);
            response.setSavingsRate(rate);
        } else {
            response.setSavingsRate(BigDecimal.ZERO);
        }

        // Category spendings this month
        List<Object[]> rawCategorySpends = transactionRepository.findCategorySpendingBreakdown(
                user, TransactionType.EXPENSE, startOfMonth, endOfMonth);
        List<CategorySpendDto> categorySpendDtos = new ArrayList<>();

        for (Object[] row : rawCategorySpends) {
            Long catId = (Long) row[0];
            String name = (String) row[1];
            String color = (String) row[2];
            String icon = (String) row[3];
            BigDecimal amount = (BigDecimal) row[4];

            double percentage = 0.0;
            if (monthlyExpense.compareTo(BigDecimal.ZERO) > 0) {
                percentage = amount.multiply(new BigDecimal("100"))
                        .divide(monthlyExpense, 1, RoundingMode.HALF_UP)
                        .doubleValue();
            }

            categorySpendDtos.add(new CategorySpendDto(catId, name, color, icon, amount, percentage));
        }
        response.setCategorySpendings(categorySpendDtos);

        // 6-Month Monthly Trends
        List<MonthlyTrendDto> monthlyTrends = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = currentYearMonth.minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();
            String monthName = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            BigDecimal inc = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                    user, TransactionType.INCOME, start, end);
            BigDecimal exp = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                    user, TransactionType.EXPENSE, start, end);

            monthlyTrends.add(new MonthlyTrendDto(
                    monthName,
                    ym.getMonthValue(),
                    ym.getYear(),
                    inc != null ? inc : BigDecimal.ZERO,
                    exp != null ? exp : BigDecimal.ZERO
            ));
        }
        response.setMonthlyTrends(monthlyTrends);

        // Recent 5 transactions
        List<Transaction> recent = transactionRepository.findTop5ByUserOrderByDateDescCreatedAtDesc(user);
        response.setRecentTransactions(recent.stream().map(TransactionResponse::new).toList());

        return response;
    }
}

