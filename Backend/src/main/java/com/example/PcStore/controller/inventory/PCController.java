package com.example.PcStore.controller.inventory;


import com.example.PcStore.dto.inventory.PCDto;
import com.example.PcStore.service.inventory.PCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/api/pcs")
public class PCController {

    @Autowired
    private PCService pcService;

    @PostMapping(value = "/pcadd", consumes = "application/json", produces = "application/json")
    public PCDto addPC(@RequestBody PCDto pcDto) {return pcService.addPC(pcDto);}

    @GetMapping(value = "/")
    public List<PCDto> getAllPCs() {
        return pcService.getAllPCs();
    }

    @GetMapping(value = "/{pcid}")
    public PCDto getPCById(@PathVariable Long pcid) {
        return pcService.getPCById(pcid);
    }

    @PutMapping(value = "/updatepc")
    public String updatePC(@RequestBody PCDto pcDto) {
        pcService.updatePC(pcDto);
        return "PC has been updated";
    }

    @DeleteMapping(value = "/pcdelete/{pcid}")
    public String deletePC(@PathVariable Long pcid) {
        return pcService.deletepc(pcid);
    }

}
