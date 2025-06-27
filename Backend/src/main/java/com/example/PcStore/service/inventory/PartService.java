package com.example.PcStore.service.inventory;


import com.example.PcStore.dto.inventory.PartDto;
import com.example.PcStore.model.inventory.PC;
import com.example.PcStore.model.inventory.pcPart;
import com.example.PcStore.repository.inventory.PCRepository;
import com.example.PcStore.repository.inventory.PartRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class PartService {

    @Autowired
    private PartRepository pcPartRepository;
    private PCRepository pcRepository;
    @Autowired
    private ModelMapper modelMapper;

    public PartService(PCRepository pcRepository,PartRepository partRepository, ModelMapper modelMapper) {
        this.pcPartRepository = partRepository;
        this.pcRepository = pcRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public PartDto addpart(@RequestBody PartDto partDto) {
        // Ensure PC exists
        PC pc = pcRepository.findById(partDto.getPcId())
                .orElseThrow(() -> new RuntimeException("PC not found with ID: " + partDto.getPcId()));

        // Map DTO to Entity manually
        pcPart part = new pcPart();
        part.setPartName(partDto.getPartName());
        part.setType(partDto.getType());
        part.setPc(pc); // set PC reference
        part.setPrice(partDto.getPrice());

        // Save part
        pcPart savedPart = pcPartRepository.save(part);

        // Map back to DTO to return
        PartDto response = new PartDto();
        response.setId(savedPart.getId());
        response.setPartName(savedPart.getPartName());
        response.setType(savedPart.getType());
        response.setPcId(savedPart.getPc().getId());
        response.setPrice(savedPart.getPrice());

        return response;
    }


    public List<PartDto> getAllParts() {
        List<pcPart> pcspart = pcPartRepository.findAll();
        return  modelMapper.map(pcspart, new TypeToken<List<PartDto>>() {}.getType());
    }

    public PartDto getPCpartysById(@PathVariable Long partid) {
        pcPart part = pcPartRepository.findById(partid).get();
        return modelMapper.map(part, PartDto.class);
    }

    public PartDto updatePart(PartDto partDto) {
        // Ensure part exists
        pcPart existingPart = pcPartRepository.findById(partDto.getId())
                .orElseThrow(() -> new RuntimeException("Part not found with ID: " + partDto.getId()));

        // Ensure PC exists if changing
        PC pc = pcRepository.findById(partDto.getPcId())
                .orElseThrow(() -> new RuntimeException("PC not found with ID: " + partDto.getPcId()));

        // Update fields including price
        existingPart.setPartName(partDto.getPartName());
        existingPart.setType(partDto.getType());
        existingPart.setPc(pc);
        existingPart.setPrice(partDto.getPrice());  // <-- Set price

        // Save and return updated part
        pcPart updated = pcPartRepository.save(existingPart);

        PartDto response = new PartDto();
        response.setId(updated.getId());
        response.setPartName(updated.getPartName());
        response.setType(updated.getType());
        response.setPcId(updated.getPc().getId());
        response.setPrice(updated.getPrice());      // <-- Return price

        return response;
    }


    public String deletepart(@PathVariable Long partid) {
        pcPartRepository.detailpcpartbyid(partid);
        return "PC has been deleted";
    }
}