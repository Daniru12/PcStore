package com.example.PcStore.repository;

import com.example.PcStore.model.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    // Basic CRUD operations are provided by JpaRepository
} 