package com.example.backend_application.service;

import com.example.backend_application.dto.NotificationResponse;
import com.example.backend_application.entity.Notification;
import com.example.backend_application.entity.User;
import com.example.backend_application.repository.InventoryRepository;
import com.example.backend_application.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {
    
    @Autowired 
    private NotificationRepository notificationRepository;

    @Autowired 
    private InventoryRepository inventoryRepository;

    @Override
    public void createManualNotification(User user, Long deviceId, String status) {
        // Tối ưu: Sử dụng map an toàn hơn để tránh lỗi nếu getDevice() trả về null
        String deviceName = inventoryRepository.findDeviceNameById(deviceId);
    
        // Nếu nó trả về null (do sai ID), gán tạm giá trị mặc định
        if (deviceName == null) deviceName = "Thiết bị không xác định";

        String content = switch (status) {
            case "APPROVED" -> "Yêu cầu mượn thiết bị " + deviceName + " của bạn đã được chấp nhận.";
            case "REJECTED" -> "Yêu cầu mượn thiết bị " + deviceName + " của bạn đã bị từ chối.";
            case "RETURNED" -> "Yêu cầu mượn thiết bị " + deviceName + " của bạn đã được trả lại.";
            case "PENDING"  -> "Yêu cầu mượn thiết bị " + deviceName + " của bạn đã được gửi thành công.";
            case "OVERDUE"  -> "Thiết bị " + deviceName + " của bạn đã quá hạn trả!";
            case "DUE_SOON" -> "Thiết bị " + deviceName + " sắp đến hạn trả vào ngày mai.";
            default -> "Cập nhật trạng thái thiết bị " + deviceName;
        };
        
        saveNotification(user, "Thông báo đơn mượn", content);
    }

    @Override
    public List<NotificationResponse> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean markAsRead(Long id) {
        return notificationRepository.findById(id).map(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
            return true;
        }).orElse(false);
    }

    private void saveNotification(User user, String title, String content) {
        Notification n = new Notification(null, user, title, content, false, LocalDateTime.now());
        notificationRepository.save(n);
    }

    // Helper method giúp code gọn hơn
    private NotificationResponse convertToDto(Notification n) {
        NotificationResponse dto = new NotificationResponse();
        dto.setId(n.getId());
        dto.setUserId(n.getUser() != null ? n.getUser().getId() : null);
        dto.setTitle(n.getTitle());
        dto.setContent(n.getContent());
        dto.setIsRead(n.getIsRead());
        return dto;
    }
}