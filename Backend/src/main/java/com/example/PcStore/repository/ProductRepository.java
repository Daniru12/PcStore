package com.example.PcStore.repository;

import com.example.PcStore.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Basic CRUD operations are automatically provided by JpaRepository
    // We can add custom query methods here if needed in the future
} 