package com.example.backend_application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Tự động tạo Getter, Setter, toString, equals, hashCode
@AllArgsConstructor // Tạo Constructor với tất cả tham số
@NoArgsConstructor // Tạo Constructor không tham số
@Builder // Hỗ trợ khởi tạo object theo kiểu Builder pattern
public class AuthResponseDTO {
    private String token;
    private Long userId;
    private String name;
    private String role;
}