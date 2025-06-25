package com.example.PcStore.model.inventory;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.repository.query.parser.Part;

import java.util.List;

@Entity
@NoArgsConstructor
@Data
@AllArgsConstructor
public class PC {

    @Id

    private Long id;

    private String name;
    private String brand;
    private double price;

}
