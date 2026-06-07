package com.example.backend_application.controller;

import com.example.backend_application.dto.NotificationResponse;
import com.example.backend_application.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // API lấy thông báo cho một userId bất kỳ 
    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByUserId(@PathVariable("userId") Long userId) {
        List<NotificationResponse> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }
    
    // API đánh dấu một thông báo là đã đọc
    @PreAuthorize("hasAuthority('STUDENT')")
    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable("id") Long id) {
        boolean success = notificationService.markAsRead(id);
        return success 
                ? ResponseEntity.ok("Đã cập nhật trạng thái thông báo") 
                : ResponseEntity.notFound().build();
    }

    
}