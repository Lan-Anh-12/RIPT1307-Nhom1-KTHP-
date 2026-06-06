package com.example.backend_application.controller;

import com.example.backend_application.dto.AuthResponseDTO; // Import DTO mới
import com.example.backend_application.dto.LoginRequest;
import com.example.backend_application.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Service giờ trả về DTO, không phải Map nữa
            AuthResponseDTO result = authService.login(loginRequest);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            System.out.println("Lỗi đăng nhập: " + e.getMessage());
            // Trả về message lỗi dưới dạng Map để FE dễ đọc
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}