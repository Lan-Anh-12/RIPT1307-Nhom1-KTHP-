package com.example.backend_application.service;

import com.example.backend_application.dto.LoginRequest;
import java.util.Map;

public interface AuthService {
    Map<String, Object> login(LoginRequest loginRequest);
}