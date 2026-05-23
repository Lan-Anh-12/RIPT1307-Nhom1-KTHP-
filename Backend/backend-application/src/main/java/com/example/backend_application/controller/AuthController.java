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
    String maHoaChuan = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("123456");
    System.out.println("CHUOI BAM XIN TRÊN MAY BAN: " + maHoaChuan);

    System.out.println("FE gui Email: " + loginRequest.getEmail());
    System.out.println("FE gui Password: " + loginRequest.getPassword());
    try {
        Map<String, Object> result = authService.login(loginRequest);
        return ResponseEntity.ok(result);
    } catch (RuntimeException e) {
        System.out.println("Lỗi đăng nhập: " + e.getMessage());
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
    }
}