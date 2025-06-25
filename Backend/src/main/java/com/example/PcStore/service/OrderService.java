package com.example.PcStore.service;

import com.example.PcStore.dto.OrderDto;
import com.example.PcStore.dto.inventory.PCDto;
import com.example.PcStore.dto.inventory.PartDto;
import com.example.PcStore.exception.ResourceNotFoundException;
import com.example.PcStore.model.enums.OrderStatus;
import com.example.PcStore.model.inventory.PC;
import com.example.PcStore.model.inventory.pcPart;
import com.example.PcStore.model.Order;
import com.example.PcStore.repository.OrderRepository;
import com.example.PcStore.repository.inventory.PCRepository;
import com.example.PcStore.repository.inventory.PartRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final PartRepository partRepository;
    private final PCRepository pcRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        PartRepository partRepository,
                        PCRepository pcRepository,
                        ModelMapper modelMapper) {
        this.orderRepository = orderRepository;
        this.partRepository = partRepository;
        this.pcRepository = pcRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public OrderDto createOrder(OrderDto orderDto) {
        Order order = new Order();
        order.setCustomerName(orderDto.getCustomerName());
        order.setCustomerEmail(orderDto.getCustomerEmail());
        order.setOrderDate(new Date());
        order.setStatus(OrderStatus.PENDING);

        if (orderDto.getParts() != null && !orderDto.getParts().isEmpty()) {
            List<Long> partIds = orderDto.getParts().stream()
                    .map(PartDto::getId)
                    .collect(Collectors.toList());
            List<pcPart> parts = partRepository.findAllById(partIds);
            validateInventoryItems(parts, partIds, "part");
            order.setParts(parts);
        }

        if (orderDto.getPcs() != null && !orderDto.getPcs().isEmpty()) {
            List<Long> pcIds = orderDto.getPcs().stream()
                    .map(PCDto::getId)
                    .collect(Collectors.toList());
            List<PC> pcs = pcRepository.findAllById(pcIds);
            validateInventoryItems(pcs, pcIds, "PC");
            order.setPcs(pcs);
        }

        calculateOrderTotals(order);
        return convertToDto(orderRepository.save(order));
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public OrderDto getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    @Transactional
    public OrderDto updateOrder(Long id, OrderDto orderDto) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        // Update only updatable fields
        existingOrder.setCustomerName(orderDto.getCustomerName());
        existingOrder.setCustomerEmail(orderDto.getCustomerEmail());

        if (orderDto.getParts() != null) {
            // Handle parts update
        }

        if (orderDto.getPcs() != null) {
            // Handle PCs update
        }

        calculateOrderTotals(existingOrder);
        return convertToDto(orderRepository.save(existingOrder));
    }

    @Transactional
    public OrderDto updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        validateStatusTransition(order.getStatus(), status);
        order.setStatus(status);

        return convertToDto(orderRepository.save(order));
    }

    @Transactional
    public OrderDto cancelOrder(Long id) {
        return updateOrderStatus(id, OrderStatus.CANCELLED);
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus newStatus) {
        if (current == OrderStatus.COMPLETED || current == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Cannot modify a completed or cancelled order");
        }

        // Add additional business rules as needed
        if (newStatus == OrderStatus.PENDING && current != OrderStatus.PENDING) {
            throw new IllegalStateException("Cannot revert to PENDING status");
        }
    }

    private void calculateOrderTotals(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }

        // Calculate parts total
        BigDecimal partsTotal = Optional.ofNullable(order.getParts())
                .map(parts -> parts.stream()
                        .map(p -> Optional.ofNullable(p.getPrice())
                                .map(BigDecimal::valueOf)
                                .orElse(BigDecimal.ZERO))
                        .reduce(BigDecimal.ZERO, BigDecimal::add))
                .orElse(BigDecimal.ZERO);

        // Calculate PCs total
        BigDecimal pcsTotal = Optional.ofNullable(order.getPcs())
                .map(pcs -> pcs.stream()
                        .map(p -> Optional.ofNullable(p.getPrice())
                                .map(BigDecimal::valueOf)
                                .orElse(BigDecimal.ZERO))
                        .reduce(BigDecimal.ZERO, BigDecimal::add))
                .orElse(BigDecimal.ZERO);

        // Set subtotal
        BigDecimal subtotal = partsTotal.add(pcsTotal);
        order.setSubtotal(subtotal);

        // Handle tax and shipping safely
        BigDecimal tax = Optional.ofNullable(order.getTaxAmount()).orElse(BigDecimal.ZERO);
        BigDecimal shipping = Optional.ofNullable(order.getShippingCost()).orElse(BigDecimal.ZERO);

        // Calculate final total
        BigDecimal totalPrice = subtotal.add(tax).add(shipping);
        order.setTotalPrice(totalPrice);
    }

    private <T> void validateInventoryItems(List<T> foundItems, List<Long> requestedIds, String itemType) {
        if (foundItems.size() != requestedIds.size()) {
            List<Long> foundIds = foundItems.stream()
                    .map(item -> item instanceof pcPart ? ((pcPart) item).getId() : ((PC) item).getId())
                    .collect(Collectors.toList());

            requestedIds.removeAll(foundIds);
            throw new ResourceNotFoundException(
                    String.format("The following %s IDs were not found: %s", itemType, requestedIds));
        }
    }

    private OrderDto convertToDto(Order order) {
        OrderDto orderDto = modelMapper.map(order, OrderDto.class);

        if (order.getParts() != null) {
            orderDto.setParts(order.getParts().stream()
                    .map(part -> modelMapper.map(part, PartDto.class))
                    .collect(Collectors.toList()));
        }

        if (order.getPcs() != null) {
            orderDto.setPcs(order.getPcs().stream()
                    .map(pc -> modelMapper.map(pc, PCDto.class))
                    .collect(Collectors.toList()));
        }

        return orderDto;
    }
}