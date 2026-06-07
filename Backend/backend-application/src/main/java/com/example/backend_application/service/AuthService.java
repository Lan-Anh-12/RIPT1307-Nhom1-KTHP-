package com.example.backend_application.service;

import com.example.backend_application.dto.LoginRequest;
import com.example.backend_application.dto.AuthResponseDTO; // Import DTO mới

public interface AuthService {
    AuthResponseDTO login(LoginRequest loginRequest);
}