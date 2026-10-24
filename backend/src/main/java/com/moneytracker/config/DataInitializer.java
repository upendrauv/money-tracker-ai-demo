package com.moneytracker.config;

import com.moneytracker.entity.*;
import com.moneytracker.repository.BudgetRepository;
import com.moneytracker.repository.CategoryRepository;
import com.moneytracker.repository.TransactionRepository;
import com.moneytracker.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedCategories();
        seedDemoUser();
    }

    private void seedCategories() {
        if (categoryRepository.findByIsDefaultTrue().isEmpty()) {
            logger.info("Seeding default categories...");

            List<Category> defaultCategories = List.of(
                    // Income
                    new Category("Salary", TransactionType.INCOME, "Briefcase", "#10B981", true, null),
                    new Category("Freelance", TransactionType.INCOME, "Laptop", "#06B6D4", true, null),
                    new Category("Investments", TransactionType.INCOME, "TrendingUp", "#8B5CF6", true, null),
                    new Category("Gifts & Grants", TransactionType.INCOME, "Gift", "#EC4899", true, null),
                    new Category("Other Income", TransactionType.INCOME, "PlusCircle", "#64748B", true, null),

                    // Expense
                    new Category("Housing & Rent", TransactionType.EXPENSE, "Home", "#EF4444", true, null),
                    new Category("Groceries", TransactionType.EXPENSE, "ShoppingCart", "#F97316", true, null),
                    new Category("Dining Out", TransactionType.EXPENSE, "Utensils", "#F59E0B", true, null),
                    new Category("Transportation", TransactionType.EXPENSE, "Car", "#3B82F6", true, null),
                    new Category("Utilities & Bills", TransactionType.EXPENSE, "Zap", "#6366F1", true, null),
                    new Category("Entertainment", TransactionType.EXPENSE, "Film", "#A855F7", true, null),
                    new Category("Healthcare", TransactionType.EXPENSE, "Activity", "#14B8A6", true, null),
                    new Category("Shopping", TransactionType.EXPENSE, "ShoppingBag", "#EC4899", true, null),
                    new Category("Education", TransactionType.EXPENSE, "BookOpen", "#3B82F6", true, null),
                    new Category("Other Expense", TransactionType.EXPENSE, "MoreHorizontal", "#94A3B8", true, null)
            );

            categoryRepository.saveAll(defaultCategories);
            logger.info("Default categories seeded successfully.");
        }
    }

    private void seedDemoUser() {
        String demoEmail = "demo@moneytracker.com";
        if (userRepository.findByEmail(demoEmail).isEmpty()) {
            logger.info("Seeding demo account with sample financial data...");
            User demo = new User(
                    demoEmail,
                    passwordEncoder.encode("password123"),
                    "Alex Mercer",
                    "USD"
            );
            userRepository.save(demo);

            LocalDate today = LocalDate.now();
            int currentMonth = today.getMonthValue();
            int currentYear = today.getYear();

            Category salaryCat = categoryRepository.findByNameIgnoreCaseAndIsDefaultTrue("Salary").orElse(null);
            Category freelanceCat = categoryRepository.findByNameIgnoreCaseAndIsDefaultTrue("Freelance").orElse(null);
            Category rentCat = categoryRepository.findByNameIgnoreCaseAndIsDefaultTrue("Housing & Rent").orElse(null);
            Category groceriesCat = categoryRepository.findByNameIgnoreCaseAndIsDefaultTrue("Groceries").orElse(null);
            Category diningCat = categoryRepository.findByNameIgnoreCaseAndIsDefaultTrue("Dining Out").orElse(null);
            Category transportCat = categoryRepository.findByNameIgnoreCaseAndIsDefaultTrue("Transportation").orElse(null);
            Category utilitiesCat = categoryRepository.findByNameIgnoreCaseAndIsDefaultTrue("Utilities & Bills").orElse(null);
            Category entertainmentCat = categoryRepository.findByNameIgnoreCaseAndIsDefaultTrue("Entertainment").orElse(null);

            if (rentCat != null) {
                budgetRepository.save(new Budget(rentCat, new BigDecimal("1500.00"), currentMonth, currentYear, demo));
            }
            if (groceriesCat != null) {
                budgetRepository.save(new Budget(groceriesCat, new BigDecimal("600.00"), currentMonth, currentYear, demo));
            }
            if (diningCat != null) {
                budgetRepository.save(new Budget(diningCat, new BigDecimal("350.00"), currentMonth, currentYear, demo));
            }
            if (transportCat != null) {
                budgetRepository.save(new Budget(transportCat, new BigDecimal("200.00"), currentMonth, currentYear, demo));
            }

            // Sample Transactions for this month & last month
            if (salaryCat != null) {
                transactionRepository.save(new Transaction("Monthly Tech Salary", new BigDecimal("5200.00"), TransactionType.INCOME, today.withDayOfMonth(1), salaryCat, PaymentMethod.BANK_TRANSFER, "Direct deposit", demo));
            }
            if (freelanceCat != null) {
                transactionRepository.save(new Transaction("Design Project Contract", new BigDecimal("1250.00"), TransactionType.INCOME, today.minusDays(5), freelanceCat, PaymentMethod.BANK_TRANSFER, "Milestone 2 payout", demo));
            }
            if (rentCat != null) {
                transactionRepository.save(new Transaction("Apartment Monthly Rent", new BigDecimal("1450.00"), TransactionType.EXPENSE, today.withDayOfMonth(2), rentCat, PaymentMethod.BANK_TRANSFER, "November Rent", demo));
            }
            if (groceriesCat != null) {
                transactionRepository.save(new Transaction("Weekly Supermarket Haul", new BigDecimal("184.50"), TransactionType.EXPENSE, today.minusDays(3), groceriesCat, PaymentMethod.CREDIT_CARD, "Organic produce & staples", demo));
                transactionRepository.save(new Transaction("Costco Wholesale Supply", new BigDecimal("230.15"), TransactionType.EXPENSE, today.minusDays(10), groceriesCat, PaymentMethod.CREDIT_CARD, "Bulk pantry items", demo));
            }
            if (diningCat != null) {
                transactionRepository.save(new Transaction("Weekend Sushi Dinner", new BigDecimal("86.40"), TransactionType.EXPENSE, today.minusDays(2), diningCat, PaymentMethod.CREDIT_CARD, "Dinner with friends", demo));
                transactionRepository.save(new Transaction("Artisan Coffee & Bagel", new BigDecimal("14.75"), TransactionType.EXPENSE, today.minusDays(1), diningCat, PaymentMethod.DEBIT_CARD, "Morning brew", demo));
            }
            if (transportCat != null) {
                transactionRepository.save(new Transaction("Metro Transit Card Recharge", new BigDecimal("75.00"), TransactionType.EXPENSE, today.minusDays(8), transportCat, PaymentMethod.DEBIT_CARD, "Monthly pass", demo));
            }
            if (utilitiesCat != null) {
                transactionRepository.save(new Transaction("High-Speed Fiber Internet", new BigDecimal("79.99"), TransactionType.EXPENSE, today.minusDays(12), utilitiesCat, PaymentMethod.CREDIT_CARD, "Monthly fiber bill", demo));
            }
            if (entertainmentCat != null) {
                transactionRepository.save(new Transaction("Streaming Subscriptions", new BigDecimal("32.98"), TransactionType.EXPENSE, today.minusDays(7), entertainmentCat, PaymentMethod.CREDIT_CARD, "Netflix & Spotify", demo));
            }

            logger.info("Demo account seeded successfully with email: demo@moneytracker.com / password: password123");
        }
    }
}

