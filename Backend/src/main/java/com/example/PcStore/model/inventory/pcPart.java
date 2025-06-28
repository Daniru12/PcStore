package com.example.PcStore.model.inventory;

import com.example.PcStore.dto.inventory.PartDto;
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


    public void setPartName(String partName) {
        this.partName = partName;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setPc(PC pc) {
        this.pc = pc;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getPartName() {
        return partName;
    }

    public String getType() {
        return type;
    }

    public PC getPc() {
        return pc;
    }

    public Double getPrice() {
        return price;
    }
}
