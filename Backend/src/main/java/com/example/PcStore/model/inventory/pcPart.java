package com.example.PcStore.model.inventory;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data

public class pcPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String partName;
    private String type; // CPU, GPU, RAM, etc.
    private double price;
    @ManyToOne
    @JoinColumn(name = "pc_id")
    private PC pc;


}
