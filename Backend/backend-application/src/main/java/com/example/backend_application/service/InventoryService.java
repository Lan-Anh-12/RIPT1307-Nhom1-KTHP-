package com.example.backend_application.service;

import com.example.backend_application.dto.DeviceCreateRequestDTO;
import com.example.backend_application.dto.DeviceResponseDTO;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InventoryService {
    // Code cũ của bạn
    DeviceResponseDTO createDevice(DeviceCreateRequestDTO dto);
    
    // Bổ sung thêm
    List<DeviceResponseDTO> searchDevices(String keyword);
    boolean softDeleteDevice(Long id);

    DeviceResponseDTO updateDevice(Long id, DeviceCreateRequestDTO dto);

    // Bổ sung hàm lấy số lượng tồn kho hiện tại
}