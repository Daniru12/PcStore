package com.example.PcStore.repository.inventory;



import com.example.PcStore.model.inventory.PC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.PathVariable;

public interface PCRepository extends JpaRepository<PC, Long> {

    @Query(value = "select * from pc where id=?1 ",nativeQuery = true)
    PC detailpcbyid(@PathVariable Long pcid);
}