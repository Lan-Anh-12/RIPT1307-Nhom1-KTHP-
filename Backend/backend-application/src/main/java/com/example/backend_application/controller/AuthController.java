package com.example.backend_application.controller;

import com.example.backend_application.dto.LoginRequest;
import com.example.backend_application.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Chặn lỗi CORS khi chạy khác Port với Front-end
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    // 1. Dòng này giúp bạn nhìn thấy chuỗi băm do chính ứng dụng của bạn sinh ra
    try {
        Map<String, Object> result = authService.login(loginRequest);
        return ResponseEntity.ok(result);
    } catch (RuntimeException e) {
        System.out.println("Lỗi đăng nhập: " + e.getMessage());
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
    }
    
}