package com.example.PcStore.dto;

import com.example.PcStore.dto.inventory.PCDto;
import com.example.PcStore.dto.inventory.PartDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;  // Added field
    private String shippingAddress;  // Added field
    private Date orderDate;
    private Date estimatedDelivery;  // Added field
    private OrderStatus status;
    private List<PartDto> parts;
    private List<PCDto> pcs;
    private Double subtotal;
    private Double taxAmount;  // Added field
    private Double shippingCost;  // Added field
    private Double totalPrice;
    private String paymentMethod;  // Added field
    private String notes;  // Added field

    // Nested OrderStatus enum
    public enum OrderStatus {
        PENDING("Pending", "Order received but not processed"),
        PROCESSING("Processing", "Order being prepared"),
        SHIPPED("Shipped", "Order has been dispatched"),
        DELIVERED("Delivered", "Order received by customer"),
        CANCELLED("Cancelled", "Order was cancelled"),
        RETURNED("Returned", "Order was returned");

        private final String displayName;
        private final String description;

        OrderStatus(String displayName, String description) {
            this.displayName = displayName;
            this.description = description;
        }

        public String getDisplayName() {
            return displayName;
        }

        public String getDescription() {
            return description;
        }
    }

    // Business logic methods
    public boolean hasParts() {
        return parts != null && !parts.isEmpty();
    }

    public boolean hasPCs() {
        return pcs != null && !pcs.isEmpty();
    }

    public boolean isCancellable() {
        return status == OrderStatus.PENDING || status == OrderStatus.PROCESSING;
    }

    public void calculateTotals(double taxRate, double flatShippingRate) {
        subtotal = (hasParts() ? parts.stream().mapToDouble(PartDto::getPrice).sum() : 0) +
                (hasPCs() ? pcs.stream().mapToDouble(PCDto::getPrice).sum() : 0);

        taxAmount = subtotal * taxRate;
        shippingCost = flatShippingRate;
        totalPrice = subtotal + taxAmount + shippingCost;
    }
}