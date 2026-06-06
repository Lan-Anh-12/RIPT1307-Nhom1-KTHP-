package com.example.backend_application.service;

import com.example.backend_application.dto.NotificationResponse;
import com.example.backend_application.entity.User; // Import thêm nếu cần
import java.util.List;

public interface NotificationService {
    // 1. Thêm hàm này để Controller có thể gọi
    List<NotificationResponse> getNotificationsByUserId(Long userId);

    // 2. Thêm hàm để các Service khác tạo thông báo thủ công
    void createManualNotification(User user, Long deviceId, String status);

    // 3. Hàm đánh dấu đã đọc
    boolean markAsRead(Long id);
}