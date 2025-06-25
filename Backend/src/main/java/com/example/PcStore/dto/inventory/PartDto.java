package com.example.PcStore.dto.inventory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartDto {
    private Long id;
    private String partName;
    private String type;
    private Long pcId;
    private Double price;

    public double getPrice() {
        return price;
    }
}
