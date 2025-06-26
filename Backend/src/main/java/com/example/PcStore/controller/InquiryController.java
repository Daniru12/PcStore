package com.example.PcStore.controller;

import com.example.PcStore.model.Inquiry;
import com.example.PcStore.service.InquiryService;
import com.example.PcStore.dto.InquiryRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class InquiryController {

    @Autowired
    private InquiryService inquiryService;

    // Public endpoint for creating inquiries
    @PostMapping("/inquiries")
    public ResponseEntity<Inquiry> createInquiry(@Valid @RequestBody InquiryRequest request) {
        return ResponseEntity.ok(inquiryService.createInquiry(request));
    }

    // Admin endpoint to get all inquiries
    @GetMapping("/admin/inquiries")
    public ResponseEntity<List<Inquiry>> getAllInquiries() {
        return ResponseEntity.ok(inquiryService.getAllInquiries());
    }

    // Admin endpoint to get a specific inquiry
    @GetMapping("/admin/inquiries/{id}")
    public ResponseEntity<Inquiry> getInquiry(@PathVariable Long id) {
        return ResponseEntity.ok(inquiryService.getInquiry(id));
    }

    // Admin endpoint to update inquiry status
    @PutMapping("/admin/inquiries/{id}/status")
    public ResponseEntity<Inquiry> updateInquiryStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(inquiryService.updateInquiryStatus(id, status));
    }
}
