package com.moneytracker.service;

import com.moneytracker.dto.TransactionRequest;
import com.moneytracker.dto.TransactionResponse;
import com.moneytracker.entity.Category;
import com.moneytracker.entity.Transaction;
import com.moneytracker.entity.TransactionType;
import com.moneytracker.entity.User;
import com.moneytracker.exception.ResourceNotFoundException;
import com.moneytracker.repository.CategoryRepository;
import com.moneytracker.repository.TransactionRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Page<TransactionResponse> getTransactions(User user,
                                                    TransactionType type,
                                                    Long categoryId,
                                                    LocalDate startDate,
                                                    LocalDate endDate,
                                                    String search,
                                                    Pageable pageable) {

        Specification<Transaction> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // User isolation
            predicates.add(cb.equal(root.get("user"), user));

            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), startDate));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), endDate));
            }

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate titleLike = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate notesLike = cb.like(cb.lower(root.get("notes")), searchPattern);
                predicates.add(cb.or(titleLike, notesLike));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return transactionRepository.findAll(spec, pageable).map(TransactionResponse::new);
    }

    public TransactionResponse getTransactionById(Long id, User user) {
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return new TransactionResponse(transaction);
    }

    @Transactional
    public TransactionResponse createTransaction(User user, TransactionRequest request) {
        Category category = categoryRepository.findByIdAndAvailableForUser(request.getCategoryId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Transaction transaction = new Transaction(
                request.getTitle().trim(),
                request.getAmount(),
                request.getType(),
                request.getDate(),
                category,
                request.getPaymentMethod(),
                request.getNotes(),
                user
        );

        transaction = transactionRepository.save(transaction);
        return new TransactionResponse(transaction);
    }

    @Transactional
    public TransactionResponse updateTransaction(Long id, User user, TransactionRequest request) {
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        Category category = categoryRepository.findByIdAndAvailableForUser(request.getCategoryId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        transaction.setTitle(request.getTitle().trim());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDate(request.getDate());
        transaction.setCategory(category);
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setNotes(request.getNotes());

        transaction = transactionRepository.save(transaction);
        return new TransactionResponse(transaction);
    }

    @Transactional
    public void deleteTransaction(Long id, User user) {
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        transactionRepository.delete(transaction);
    }
}

