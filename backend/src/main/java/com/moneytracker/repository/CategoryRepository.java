package com.moneytracker.repository;

import com.moneytracker.entity.Category;
import com.moneytracker.entity.TransactionType;
import com.moneytracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE c.isDefault = true OR c.user = :user ORDER BY c.name ASC")
    List<Category> findAllAvailableForUser(@Param("user") User user);

    @Query("SELECT c FROM Category c WHERE (c.isDefault = true OR c.user = :user) AND c.type = :type ORDER BY c.name ASC")
    List<Category> findAllAvailableForUserAndType(@Param("user") User user, @Param("type") TransactionType type);

    List<Category> findByIsDefaultTrue();

    @Query("SELECT c FROM Category c WHERE c.id = :id AND (c.isDefault = true OR c.user = :user)")
    Optional<Category> findByIdAndAvailableForUser(@Param("id") Long id, @Param("user") User user);

    Optional<Category> findByNameIgnoreCaseAndIsDefaultTrue(String name);

    boolean existsByNameIgnoreCaseAndUser(String name, User user);
}

