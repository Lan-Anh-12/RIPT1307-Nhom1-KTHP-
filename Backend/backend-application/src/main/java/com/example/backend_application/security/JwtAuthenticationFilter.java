package com.example.backend_application.security;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final String SECRET_KEY = "chuoi_bi_mat_dung_de_ky_token_dang_nhap_du_an_pet";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        response.setStatus(HttpServletResponse.SC_OK);
        filterChain.doFilter(request, response);
        return;
    }
        // 1. Lấy token từ header "Authorization: Bearer <token>"
        String header = request.getHeader("Authorization");
        
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // Nếu không có token, bỏ qua để đi tiếp (nếu API không bảo mật thì nó vẫn gọi được)
            return;
        }

        String token = header.substring(7); // Bỏ chữ "Bearer " để lấy chuỗi token thật

        try {
            // 2. Giải mã và xác thực token
            var claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY.getBytes())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String email = claims.getSubject();
            String role = claims.get("role", String.class); // Lấy role đã nhét vào khi login
            System.out.println("DEBUG: Role lấy ra từ Token là: " + role);

            // 3. Tạo thông tin xác thực cho Spring Security
            // Cần thêm "ROLE_" vào trước vì Spring Security mặc định hiểu role phải có tiền tố này
            // Sửa đoạn tạo auth trong JwtAuthenticationFilter.java
            var auth = new UsernamePasswordAuthenticationToken(
                email, 
                null, 
                // TRUYỀN THẲNG 'role', KHÔNG CỘNG "ROLE_"
                Collections.singletonList(new SimpleGrantedAuthority(role)) 
            );

            // 4. Lưu vào context của hệ thống
            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (Exception e) {
            // Nếu token sai hoặc hết hạn, xóa context để chặn truy cập
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response); // Tiếp tục đi vào Controller
    }
}