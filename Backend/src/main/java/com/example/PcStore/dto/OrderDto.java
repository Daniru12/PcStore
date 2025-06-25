package com.example.PcStore.dto;

import com.example.PcStore.dto.inventory.PCDto;
import com.example.PcStore.dto.inventory.PartDto;

import java.util.Date;
import java.util.List;

public class OrderDto {

    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private Date orderDate;
    private Date estimatedDelivery;

    private String status;

    private List<PartDto> parts;
    private List<PCDto> pcs;

    private String notes;

    // Getters and Setters

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public Date getEstimatedDelivery() {
        return estimatedDelivery;
    }

    public void setEstimatedDelivery(Date estimatedDelivery) {
        this.estimatedDelivery = estimatedDelivery;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<PartDto> getParts() {
        return parts;
    }

    public void setParts(List<PartDto> parts) {
        this.parts = parts;
    }

    public List<PCDto> getPcs() {
        return pcs;
    }

    public void setPcs(List<PCDto> pcs) {
        this.pcs = pcs;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}