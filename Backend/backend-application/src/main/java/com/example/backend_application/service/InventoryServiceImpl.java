package com.example.backend_application.service;

import com.example.backend_application.dto.DeviceCreateRequestDTO;
import com.example.backend_application.dto.DeviceResponseDTO;
import com.example.backend_application.entity.Category;
import com.example.backend_application.entity.DeviceModel;
import com.example.backend_application.repository.InventoryRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private EntityManager entityManager;

    // Phương thức tạo thiết bị mới đã được sửa để tương thích với DTO mới và Entity Category
    @Override
    @Transactional
    public DeviceResponseDTO createDevice(DeviceCreateRequestDTO dto) {
        DeviceModel device = new DeviceModel();
        device.setName(dto.getName());
        device.setImage(dto.getImageUrl());
        device.setStock(dto.getQuantity());
        device.setDescription(dto.getDescription());
        if (dto.getQuantity() != null && dto.getQuantity() > 0) {
            device.setStatus("AVAILABLE");
        } else {
            device.setStatus("UNAVAILABLE");
        }

        Category categoryProxy = entityManager.getReference(Category.class, dto.getCategoryId());
        device.setCategory(categoryProxy);

        DeviceModel savedDevice = inventoryRepository.save(device);
        return convertToDTO(savedDevice);
    }

    // --- PHẦN BỔ SUNG TÌM KIẾM 
    @Override
    public List<DeviceResponseDTO> searchDevices(String keyword) {
        List<DeviceModel> devices;
        if (keyword == null || keyword.trim().isEmpty()) {
            devices = inventoryRepository.findAll();
        } else {
            devices = inventoryRepository.findByNameContainingIgnoreCase(keyword);
        }

        return devices.stream()
                .filter(d -> !"DELETED".equals(d.getStatus()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Phương thức xóa mềm: cập nhật status thành 'DELETED'
    @Override
    @Transactional
    public boolean softDeleteDevice(Long id) {
        return inventoryRepository.findById(id).map(device -> {
            device.setStatus("DELETED");
            inventoryRepository.save(device);
            return true;
        }).orElse(false);
    }

    // --- PHẦN BỔ SUNG CẬP NHẬT THIẾT BỊ ---
    @Override
    @Transactional
    public DeviceResponseDTO updateDevice(Long id, DeviceCreateRequestDTO dto) {
        // Tìm thiết bị trong DB, nếu không có sẽ ném ra ngoại lệ
        DeviceModel device = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị với ID: " + id));

        // Cập nhật các thông tin từ DTO vào Entity
        device.setName(dto.getName());
        device.setImage(dto.getImageUrl());
        device.setStock(dto.getQuantity());
        device.setDescription(dto.getDescription());
        
        // Cập nhật trạng thái dựa trên số lượng mới
        if (dto.getQuantity() != null && dto.getQuantity() > 0) {
            device.setStatus("AVAILABLE");
        } else {
            device.setStatus("UNAVAILABLE");
        }

        Category categoryProxy = entityManager.getReference(Category.class, dto.getCategoryId());
        device.setCategory(categoryProxy);

        DeviceModel updatedDevice = inventoryRepository.save(device);
        
        return convertToDTO(updatedDevice);
    }

    // Hàm chuyển đổi dùng chung
    private DeviceResponseDTO convertToDTO(DeviceModel device) {
        DeviceResponseDTO response = new DeviceResponseDTO();
        response.setId(device.getId());
        response.setName(device.getName());
        response.setQuantity(device.getStock());
        response.setImageUrl(device.getImage());
        response.setDescription(device.getDescription());
        response.setStatus(device.getStatus());
        
        if (device.getCategory() != null) {
            response.setCategoryId(device.getCategory().getId());
            response.setCategory(device.getCategory().getName());
        }
        return response;
    }

    
}