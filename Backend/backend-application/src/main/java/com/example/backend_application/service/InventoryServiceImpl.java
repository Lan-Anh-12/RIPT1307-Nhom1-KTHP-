package com.example.backend_application.service;

import com.example.backend_application.dto.DeviceCreateRequestDTO;
import com.example.backend_application.dto.DeviceResponseDTO;
import com.example.backend_application.entity.Category;
import com.example.backend_application.entity.DeviceModel;
import com.example.backend_application.repository.InventoryRepository;
import com.example.backend_application.service.InventoryService;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private EntityManager entityManager; // Dùng để tạo Proxy Category

    @Override
    @Transactional
    public DeviceResponseDTO createDevice(DeviceCreateRequestDTO dto) {
        // 1. Chuyển từ DTO sang Entity
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

        // 2. Gán khóa ngoại bằng ID mà không cần sửa Entity 
        // và không cần query database để lấy cả object Category
        Category categoryProxy = entityManager.getReference(Category.class, dto.getCategoryId());
        device.setCategory(categoryProxy);

        // 3. Lưu vào DB
        DeviceModel savedDevice = inventoryRepository.save(device);

        // 4. Chuyển từ Entity sang Response DTO để trả về
        DeviceResponseDTO response = new DeviceResponseDTO();
        response.setId(savedDevice.getId());
        response.setName(savedDevice.getName());
        // Kiểm tra xem category có tồn tại không để tránh lỗi NullPointerException
        if (savedDevice.getCategory() != null) {
            response.setCategoryId(savedDevice.getCategory().getId());
        }
        response.setQuantity(savedDevice.getStock());
        response.setImageUrl(savedDevice.getImage());
        response.setDescription(savedDevice.getDescription());
        response.setStatus(savedDevice.getStatus());
        
        // Nếu muốn hiển thị tên danh mục trong DTO trả về
        if (savedDevice.getCategory() != null) {
            response.setCategory(savedDevice.getCategory().getName());
        }
        
        return response;
    }
}