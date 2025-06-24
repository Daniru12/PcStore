package com.example.PcStore.dto.inventory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PCDto {
    private Long id;
    private String name;
    private String brand;
}
