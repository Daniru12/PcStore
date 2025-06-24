package com.example.PcStore.controller.inventory;



import com.example.PcStore.dto.inventory.PartDto;
import com.example.PcStore.service.inventory.PartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController

@RequestMapping("/api/parts")
public class PartController {


    @Autowired
    private PartService partService;

    @PostMapping(value = "/partadd", consumes = "application/json", produces = "application/json")
    public PartDto addPart(@RequestBody PartDto partDto) {return partService.addpart(partDto);}

    @GetMapping(value = "/")
    public List<PartDto> getAllParts() {
        return partService.getAllParts();
    }

    @GetMapping(value = "/{partid}")
    public PartDto getPCById(@PathVariable Long partid) {
        return partService.getPCpartysById(partid);
    }

    @PutMapping(value = "/updatepart")
    public String updatePart(@RequestBody PartDto partDto) {
        partService.updatePart(partDto);
        return "PC has been updated";
    }

    @DeleteMapping(value = "/partdelete/{partid}")
    public String deletePart(@PathVariable Long partid) {
        return partService.deletepart(partid);
    }

}
