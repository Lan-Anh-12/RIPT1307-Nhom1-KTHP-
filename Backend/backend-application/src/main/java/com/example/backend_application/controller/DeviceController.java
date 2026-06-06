package com.example.backend_application.controller;

import com.example.backend_application.dto.DeviceCreateRequestDTO;
import com.example.backend_application.dto.DeviceResponseDTO;
import com.example.backend_application.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    private InventoryService inventoryService;

    // API tạo thiết bị mới
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<DeviceResponseDTO> createDevice(@RequestBody DeviceCreateRequestDTO request) {
        DeviceResponseDTO response = inventoryService.createDevice(request);
        return ResponseEntity.ok(response);
    }

    // API tìm kiếm thiết bị (trả về danh sách, không bao gồm thiết bị có status 'DELETED')
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STUDENT')")
    @GetMapping
    public ResponseEntity<List<DeviceResponseDTO>> searchDevices(@RequestParam(required = false) String keyword) {
        List<DeviceResponseDTO> devices = inventoryService.searchDevices(keyword);
        System.out.println("DEBUG: User roles detected: " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        return ResponseEntity.ok(devices);
    }

    // API xóa mềm thiết bị (cập nhật status thành 'DELETED', trả về true/false)
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteDevice(@PathVariable Long id) {
        boolean isDeleted = inventoryService.softDeleteDevice(id);
        return ResponseEntity.ok(isDeleted);
    }

    // API cập nhật thông tin thiết bị
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<DeviceResponseDTO> updateDevice(
            @PathVariable Long id, 
            @RequestBody DeviceCreateRequestDTO request) {
        
        DeviceResponseDTO updatedDevice = inventoryService.updateDevice(id, request);
        return ResponseEntity.ok(updatedDevice);
    }
}