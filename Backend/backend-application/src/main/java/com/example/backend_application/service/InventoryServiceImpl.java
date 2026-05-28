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

    // --- CODE CŨ CỦA BẠN (ĐÃ ĐỒNG BỘ VỚI DTO MỚI) ---
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

    // --- CODE MỚI BỔ SUNG ---
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

    @Override
    @Transactional
    public boolean softDeleteDevice(Long id) {
        return inventoryRepository.findById(id).map(device -> {
            device.setStatus("DELETED");
            inventoryRepository.save(device);
            return true;
        }).orElse(false);
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