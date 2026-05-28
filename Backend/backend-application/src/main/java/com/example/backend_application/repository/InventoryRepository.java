package com.example.backend_application.repository;

import com.example.backend_application.entity.DeviceModel;
import com.example.backend_application.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<DeviceModel, Long> {
    <Optional>DeviceModel findById(Long id);
    
}
