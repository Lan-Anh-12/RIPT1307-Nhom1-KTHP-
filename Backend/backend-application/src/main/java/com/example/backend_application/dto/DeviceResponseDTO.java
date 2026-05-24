package com.example.backend_application.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceResponseDTO {
    private Long id;
    private String name;
    private Long categoryId;
    private String category;
    private String imageUrl;
    private Integer quantity;
    private String status;
    private String description;

}
