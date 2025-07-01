package com.example.PcStore.service;

import com.example.PcStore.dto.OrderDto;
import com.example.PcStore.dto.OrderItemDto;
import com.example.PcStore.model.Order;
import com.example.PcStore.model.OrderItem;
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
        validateOrder(orderDto);

        Order order = new Order();
        order.setCustomerName(orderDto.getCustomerName());
        order.setCustomerEmail(orderDto.getCustomerEmail());
        order.setCustomerPhone(orderDto.getCustomerPhone());
        order.setOrderDate(orderDto.getOrderDate() != null ? orderDto.getOrderDate() : new Date());
        order.setStatus(orderDto.getStatus());
        order.setNotes(orderDto.getNotes());

        List<OrderItem> orderItems = processOrderItems(order, orderDto.getItems());
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return modelMapper.map(savedOrder, OrderDto.class);
    }

    private List<OrderItem> processOrderItems(Order order, List<OrderItemDto> itemDtos) {
        return itemDtos.stream().map(itemDto -> {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemDto.getProductId()));

            if (product.getStock() < itemDto.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
            }

            // Reduce stock
            product.setStock(product.getStock() - itemDto.getQuantity());
            productRepository.save(product);

            // Create and return OrderItem
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDto.getQuantity());

            return item;
        }).collect(Collectors.toList());
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
        if (orderDto.getItems() == null || orderDto.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }
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
