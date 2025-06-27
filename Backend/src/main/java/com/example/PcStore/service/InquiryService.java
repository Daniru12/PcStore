package com.example.PcStore.service;

import com.example.PcStore.model.Inquiry;
import com.example.PcStore.repository.InquiryRepository;
import com.example.PcStore.dto.InquiryRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InquiryService {
    
    @Autowired
    private InquiryRepository inquiryRepository;

    public Inquiry createInquiry(InquiryRequest request) {
        Inquiry inquiry = new Inquiry();
        inquiry.setName(request.getName());
        inquiry.setEmail(request.getEmail());
        inquiry.setSubject(request.getSubject());
        inquiry.setMessage(request.getMessage());
        
        return inquiryRepository.save(inquiry);
    }

    public List<Inquiry> getAllInquiries() {
        return inquiryRepository.findAll();
    }

    public Inquiry getInquiry(Long id) {
        return inquiryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Inquiry not found with id: " + id));
    }

    public Inquiry updateInquiryStatus(Long id, String status) {
        Inquiry inquiry = getInquiry(id);
        inquiry.setStatus(status);
        return inquiryRepository.save(inquiry);
    }
}
