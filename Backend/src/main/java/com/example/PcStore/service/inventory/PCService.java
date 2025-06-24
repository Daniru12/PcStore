package com.example.PcStore.service.inventory;

import com.example.PcStore.dto.inventory.PCDto;
import com.example.PcStore.model.inventory.PC;
import com.example.PcStore.repository.inventory.PCRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class PCService {
    @Autowired
    private PCRepository pcRepository;
    @Autowired
    private ModelMapper modelMapper;

    public PCService(PCRepository pcRepository, ModelMapper modelMapper) {
        this.pcRepository = pcRepository;
        this.modelMapper = modelMapper;
    }

    public PCDto addPC(@RequestBody PCDto pcDto) {
        pcRepository.save(modelMapper.map(pcDto, PC.class));
        return modelMapper.map(pcDto, PCDto.class);
    }

    public List<PCDto> getAllPCs() {
        List<PC> pcs = pcRepository.findAll();
        return  modelMapper.map(pcs, new TypeToken<List<PCDto>>() {}.getType());
    }

    public PCDto getPCById(@PathVariable Long pcid) {
        PC pc = pcRepository.findById(pcid).get();
        return modelMapper.map(pc, PCDto.class);
    }

    public PCDto updatePC(@RequestBody PCDto pcDto) {
        pcRepository.save(modelMapper.map(pcDto, PC.class));
        return modelMapper.map(pcDto, PCDto.class);
    }

    public String deletepc(@PathVariable Long pcid) {
        pcRepository.detailpcbyid(pcid);
        return "PC has been deleted";
    }
}