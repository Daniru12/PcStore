package com.example.PcStore.service;

import com.example.PcStore.dto.OrderDto;
import com.example.PcStore.dto.ProductDto;
import com.example.PcStore.model.Order;
import com.example.PcStore.model.Product;
import com.example.PcStore.repository.OrderRepository;
import com.example.PcStore.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        ModelMapper modelMapper) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public OrderDto createOrder(OrderDto orderDto) {
        try {
            Order order = modelMapper.map(orderDto, Order.class);
            if (order.getOrderDate() == null) {
                order.setOrderDate(new Date());
            }
            List<Product> products = orderDto.getParts().stream()
                    .map(productDto -> {
                        if (productDto.getId() == null) {
                            throw new IllegalArgumentException("Product ID is required");
                        }
                        return productRepository.findById(productDto.getId())
                                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productDto.getId()));
                    })
                    .collect(Collectors.toList());
            order.setParts(products);
            Order savedOrder = orderRepository.save(order);
            return modelMapper.map(savedOrder, OrderDto.class);
        } catch (IllegalArgumentException e) {
            throw e; // Returns 400
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e); // Returns 500
        }
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> modelMapper.map(order, OrderDto.class))
                .collect(Collectors.toList());
    }

    public OrderDto getOrderById(Long id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found with ID: " + id);
        }
        return modelMapper.map(optionalOrder.get(), OrderDto.class);
    }

    public String deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            return "Order ID not found";
        }
        orderRepository.deleteById(id);
        return "Order has been deleted";
    }
}
