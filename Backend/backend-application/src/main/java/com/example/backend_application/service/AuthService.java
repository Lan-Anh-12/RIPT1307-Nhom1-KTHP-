package com.example.backend_application.service;

import com.example.backend_application.dto.LoginRequest;
import com.example.backend_application.entity.User;
import com.example.backend_application.repository.UserRepository;
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
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Chuỗi bí mật dùng để ký mã hóa Token (Bạn có thể đổi thành chuỗi bất kỳ dài trên 32 ký tự)
    private final String SECRET_KEY = "chuoi_bi_mat_dung_de_ky_token_dang_nhap_du_an_pet";
    
    // Bộ băm mật khẩu chuẩn BCrypt
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Map<String, Object> login(LoginRequest loginRequest) {
        // 1. Tìm user theo email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không chính xác!"));

        // 2. Kiểm tra mật khẩu (So sánh mật khẩu thô FE gửi với mật khẩu băm trong DB)
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }

        // 3. Khởi tạo khóa ký Token
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
        
        // Cấu hình thời gian hết hạn của token: 1 ngày (86400000 mili giây)
        long expirationTime = 86400000; 
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        // 4. Tiến hành build chuỗi JWT Token
        String token = Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())      // Ném role vào token để FE tự check ẩn/hiển thị menu
                .claim("userId", user.getId())      // Ném luôn ID vào để FE tiện dùng sau này
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        // 5. Trả về cục data sạch cho Controller
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("name", user.getName());
        
        return response;
    }
}