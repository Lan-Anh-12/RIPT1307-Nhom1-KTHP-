package com.example.backend_application.service;

import com.example.backend_application.dto.DeviceCreateRequestDTO;
import com.example.backend_application.dto.DeviceResponseDTO;

public interface InventoryService {
    // Định nghĩa hàm tạo thiết bị
    DeviceResponseDTO createDevice(DeviceCreateRequestDTO dto);
    
  
}