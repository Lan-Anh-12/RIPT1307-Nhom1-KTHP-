package com.example.backend_application.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ServiceRequestDTO {
    private Long idRequest;
    private Long studentId;       
    private String studentName;   
    private String device;  
    private Integer quantity;        
    private LocalDateTime createdAt;
    private LocalDateTime actualReturnDate ;
    private LocalDateTime expectedReturnDate;
    private String status;
    private Integer totalRequest;
    private String email;
}