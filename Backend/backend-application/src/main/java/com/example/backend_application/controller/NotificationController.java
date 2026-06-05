package com.example.backend_application.controller;

import com.example.backend_application.dto.NotificationResponse;
import com.example.backend_application.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // API lấy thông báo cho một userId bất kỳ (ví dụ: dùng cho Admin)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByUserId(@PathVariable("userId") Long userId) {
        List<NotificationResponse> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/my-notifications")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        // LƯU Ý: Nếu principal của bạn là một đối tượng CustomUser, 
        // hãy đảm bảo bạn lấy đúng ID từ đó.
        // Ví dụ: Long userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        Long userId = (Long) authentication.getPrincipal(); 
        
        return ResponseEntity.ok(notificationService.getNotificationsByUserId(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable("id") Long id) {
        boolean success = notificationService.markAsRead(id);
        return success 
                ? ResponseEntity.ok("Đã cập nhật trạng thái thông báo") 
                : ResponseEntity.notFound().build();
    }

    
}