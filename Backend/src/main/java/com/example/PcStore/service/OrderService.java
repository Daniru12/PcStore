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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
            // Validate order data
            validateOrder(orderDto);

            // Create order entity
            Order order = modelMapper.map(orderDto, Order.class);
            if (order.getOrderDate() == null) {
                order.setOrderDate(new Date());
            }

            // Process products and reduce stock
            List<Product> orderedProducts = processOrderProducts(orderDto.getParts());
            order.setParts(orderedProducts);

            // Save the order
            Order savedOrder = orderRepository.save(order);
            return modelMapper.map(savedOrder, OrderDto.class);

        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to create order: " + e.getMessage(), e);
        }
    }

    private void validateOrder(OrderDto orderDto) {
        if (orderDto == null) {
            throw new IllegalArgumentException("Order data cannot be null");
        }
        if (orderDto.getCustomerName() == null || orderDto.getCustomerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name is required");
        }
        if (orderDto.getCustomerEmail() == null || orderDto.getCustomerEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email is required");
        }
        if (orderDto.getParts() == null || orderDto.getParts().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one product");
        }
    }

    private List<Product> processOrderProducts(List<ProductDto> productDtos) {
        return productDtos.stream()
                .map(productDto -> {
                    // Validate product ID
                    if (productDto.getId() == null) {
                        throw new IllegalArgumentException("Product ID is required");
                    }

                    // Get product from repository
                    Product product = productRepository.findById(productDto.getId())
                            .orElseThrow(() -> new IllegalArgumentException(
                                    "Product not found with ID: " + productDto.getId()));

                    // Check and reduce stock
                    if (product.getStock() <= 0) {
                        throw new IllegalArgumentException(
                                "Product out of stock: " + product.getName());
                    }

                    // Reduce stock by 1 (assuming 1 quantity per product)
                    product.setStock(product.getStock() - 1);
                    productRepository.save(product);

                    return product;
                })
                .collect(Collectors.toList());
    }

    public List<OrderDto> getAllOrders() {
        try {
            return orderRepository.findAll().stream()
                    .map(order -> modelMapper.map(order, OrderDto.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to retrieve orders: " + e.getMessage(), e);
        }
    }

    public OrderDto getOrderById(Long id) {
        try {
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Order not found with ID: " + id));
            return modelMapper.map(order, OrderDto.class);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to retrieve order: " + e.getMessage(), e);
        }
    }

    @Transactional
    public String deleteOrder(Long id) {
        try {
            if (!orderRepository.existsById(id)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Order not found with ID: " + id);
            }
            orderRepository.deleteById(id);
            return "Order with ID " + id + " has been deleted successfully";
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to delete order: " + e.getMessage(), e);
        }
    }
}