package com.example.backend_application.repository;

import com.example.backend_application.dto.DeviceResponseDTO;
import com.example.backend_application.entity.DeviceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<DeviceModel, Long> {
    // Chỉ cần thêm đúng dòng này vào file cũ của bạn
    List<DeviceModel> findByNameContainingIgnoreCase(String name);

    DeviceResponseDTO getDeviceById(Long id);

    @Query("SELECT d FROM DeviceModel d LEFT JOIN FETCH d.category")
    List<DeviceModel> findAllWithCategory();

    // Sử dụng 'stock' thay vì 'quantity'
    @Query("SELECT d.stock FROM DeviceModel d WHERE d.id = :id")
    Integer getAvailableQuantity(@Param("id") Long id);

    @Modifying
    @Query("UPDATE DeviceModel d SET d.stock = d.stock - :quantity WHERE d.id = :id")
    void decreaseQuantity(@Param("id") Long id, @Param("quantity") Integer quantity);

    @Modifying
    @Query("UPDATE DeviceModel d SET d.stock = d.stock + :quantity WHERE d.id = :id")
    void increaseQuantity(@Param("id") Long id, @Param("quantity") Integer quantity);

    @Query(value = "SELECT name FROM device_model WHERE id = :id", nativeQuery = true)
    String findDeviceNameById(@Param("id") Long id);

}