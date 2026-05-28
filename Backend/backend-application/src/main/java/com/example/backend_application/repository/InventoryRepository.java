package com.example.backend_application.repository;

import com.example.backend_application.entity.DeviceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<DeviceModel, Long> {
    // Chỉ cần thêm đúng dòng này vào file cũ của bạn
    List<DeviceModel> findByNameContainingIgnoreCase(String name);
}