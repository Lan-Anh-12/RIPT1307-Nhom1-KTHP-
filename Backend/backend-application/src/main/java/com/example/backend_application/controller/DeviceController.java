package com.example.backend_application.controller;

import com.example.backend_application.dto.DeviceCreateRequestDTO;
import com.example.backend_application.dto.DeviceResponseDTO;
import com.example.backend_application.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "*") // Cho phép frontend truy cập từ mọi nguồn
public class DeviceController {

    @Autowired
    private InventoryService inventoryService;

    // API tạo thiết bị mới
    @PostMapping("/create")
    public ResponseEntity<DeviceResponseDTO> createDevice(@RequestBody DeviceCreateRequestDTO request) {
        DeviceResponseDTO response = inventoryService.createDevice(request);
        return ResponseEntity.ok(response);
    }

    
}