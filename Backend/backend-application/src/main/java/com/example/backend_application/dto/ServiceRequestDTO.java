package com.example.backend_application.dto;

import lombok.Data;
import java.time.LocalDate;


@Data
public class ServiceRequestDTO {
    private Long idRequest;
    private Long studentId;       
    private String studentName;   
    private String device;  
    private Integer quantity;        
    private LocalDate requestDate;
    private LocalDate actualReturnDate ;
    private LocalDate expectedReturnDate;
    private String status;
    private Integer totalRequest;
    private String email;
}