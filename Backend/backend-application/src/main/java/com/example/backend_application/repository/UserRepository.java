package com.example.backend_application.repository;

import com.example.backend_application.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Tự động sinh câu lệnh SELECT * FROM app_user WHERE email = ?
    Optional<User> findByEmail(String email);
    
}