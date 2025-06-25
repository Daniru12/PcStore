package com.example.PcStore.dto;

import com.example.PcStore.model.enums.OrderStatus;
import lombok.Data;

@Data
public class OrderStatusUpdateDto {
    private OrderStatus status;
}