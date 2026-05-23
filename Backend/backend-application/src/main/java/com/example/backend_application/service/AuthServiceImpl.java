package com.example.backend_application.service;

import com.example.backend_application.dto.LoginRequest;
import com.example.backend_application.entity.User;
import com.example.backend_application.repository.UserRepository;
import com.example.backend_application.service.AuthService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    private final String SECRET_KEY = "chuoi_bi_mat_dung_de_ky_token_dang_nhap_du_an_pet";
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Map<String, Object> login(LoginRequest loginRequest) {
        // 1. Tìm user theo email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không chính xác!"));

        // 2. Kiểm tra mật khẩu
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }

        // 3. Khởi tạo khóa ký Token
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
        
        long expirationTime = 86400000; 
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        // 4. Build JWT Token
        String token = Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .claim("userId", user.getId())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        // 5. Trả về kết quả
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("name", user.getName());
        
        return response;
    }
}