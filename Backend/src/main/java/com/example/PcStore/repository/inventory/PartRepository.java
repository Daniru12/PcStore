package com.example.PcStore.repository.inventory;

import com.example.PcStore.model.inventory.pcPart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.PathVariable;

public interface PartRepository extends JpaRepository<pcPart, Long> {
    @Query(value = "select * from pc_part where id=?1 ",nativeQuery = true)
    pcPart detailpcpartbyid(@PathVariable Long partid);
}