package com.example.backend_application.service;

import com.example.backend_application.dto.DeviceCreateRequestDTO;
import com.example.backend_application.dto.DeviceResponseDTO;
import java.util.List;

public interface InventoryService {
    // Code cũ của bạn
    DeviceResponseDTO createDevice(DeviceCreateRequestDTO dto);
    
    // Bổ sung thêm
    List<DeviceResponseDTO> searchDevices(String keyword);
    boolean softDeleteDevice(Long id);
}