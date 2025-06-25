package com.example.PcStore.model;

import com.example.PcStore.model.enums.OrderStatus;
import com.example.PcStore.model.inventory.PC;
import com.example.PcStore.model.inventory.pcPart;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "customer_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber = generateOrderNumber();

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerEmail;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "shipping_address", nullable = false)
    private String shippingAddress;

    @Column(name = "billing_address", nullable = false)
    private String billingAddress;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "order_date", nullable = false)
    private Date orderDate = new Date();

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "estimated_delivery")
    private Date estimatedDelivery;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "order_parts",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "part_id")
    )
    private List<pcPart> parts;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "order_pcs",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "pc_id")
    )
    private List<PC> pcs;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "tax_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "shipping_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingCost = BigDecimal.ZERO;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice = BigDecimal.ZERO;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Version
    private Long version;

    // Business logic methods
    @PrePersist
    protected void onCreate() {
        if (this.orderNumber == null) {
            this.orderNumber = generateOrderNumber();
        }
        calculateTotals();
    }

    @PreUpdate
    protected void onUpdate() {
        calculateTotals();
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public void calculateTotals() {
        BigDecimal partsTotal = parts != null ?
                parts.stream()
                        .map(pcPart::getPrice)
                        .map(BigDecimal::valueOf)  // Convert Double to BigDecimal
                        .reduce(BigDecimal.ZERO, BigDecimal::add) :
                BigDecimal.ZERO;

        BigDecimal pcsTotal = pcs != null ?
                pcs.stream()
                        .map(PC::getPrice)
                        .map(BigDecimal::valueOf)  // Convert Double to BigDecimal
                        .reduce(BigDecimal.ZERO, BigDecimal::add) :
                BigDecimal.ZERO;

        this.subtotal = partsTotal.add(pcsTotal);
        this.totalPrice = subtotal.add(taxAmount).add(shippingCost);
    }

    public boolean isCancellable() {
        return status == OrderStatus.PENDING || status == OrderStatus.PROCESSING;
    }
}