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
        String deviceName = inventoryRepository.findDeviceNameById(deviceId);
        if (deviceName == null) deviceName = "Thiết bị không xác định";

        String title;
        String content;

        // Gán title và content dựa trên status
        switch (status) {
            case "APPROVED" -> {
                title = "Phê duyệt yêu cầu";
                content = "Yêu cầu mượn " + deviceName + " đã được chấp nhận.";
            }
            case "REJECTED" -> {
                title = "Yêu cầu bị từ chối";
                content = "Yêu cầu mượn " + deviceName + " đã bị từ chối.";
            }
            case "RETURNED" -> {
                title = "Xác nhận trả thiết bị";
                content = "Thiết bị " + deviceName + " đã được trả lại.";
            }
            case "PENDING"  -> {
                title = "Đơn mượn mới";
                content = "Yêu cầu mượn " + deviceName + " đã được gửi thành công.";
            }
            case "OVERDUE"  -> {
                title = "Cảnh báo quá hạn";
                content = "Thiết bị " + deviceName + " đã quá hạn trả!";
            }
            case "DUE_SOON" -> {
                title = "Nhắc nhở trả thiết bị";
                content = "Thiết bị " + deviceName + " sắp đến hạn trả vào ngày mai.";
            }
            default -> {
                title = "Thông báo hệ thống";
                content = "Cập nhật trạng thái cho " + deviceName;
            }
        }
        
        saveNotification(user, title, content);
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