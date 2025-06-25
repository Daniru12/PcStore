package com.example.PcStore.service;

import com.example.PcStore.dto.OrderDto;
import com.example.PcStore.model.Order;
import com.example.PcStore.model.inventory.PC;
import com.example.PcStore.model.inventory.pcPart;
import com.example.PcStore.repository.OrderRepository;
import com.example.PcStore.repository.inventory.PCRepository;
import com.example.PcStore.repository.inventory.PartRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
        Order order = modelMapper.map(orderDto, Order.class);

        // Load managed Part entities
        List<pcPart> managedParts = orderDto.getParts() == null ? List.of() :
                orderDto.getParts().stream()
                        .map(partDto -> partRepository.findById(partDto.getId())
                                .orElseThrow(() -> new RuntimeException("Part not found: " + partDto.getId())))
                        .collect(Collectors.toList());

        // Load managed PC entities
        List<PC> managedPcs = orderDto.getPcs() == null ? List.of() :
                orderDto.getPcs().stream()
                        .map(pcDto -> pcRepository.findById(pcDto.getId())
                                .orElseThrow(() -> new RuntimeException("PC not found: " + pcDto.getId())))
                        .collect(Collectors.toList());

        order.setParts(managedParts);
        order.setPcs(managedPcs);

        Order savedOrder = orderRepository.save(order);
        return modelMapper.map(savedOrder, OrderDto.class);
    }

    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return modelMapper.map(orders, new TypeToken<List<OrderDto>>() {}.getType());
    }

    public OrderDto getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(order -> modelMapper.map(order, OrderDto.class))
                .orElse(null);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
