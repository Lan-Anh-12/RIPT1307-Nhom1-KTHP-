package com.example.backend_application.service;

import com.example.backend_application.dto.ServiceRequestDTO;
import com.example.backend_application.entity.BorrowRequest;
import com.example.backend_application.entity.User;
import com.example.backend_application.repository.BorrowRequestRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

@Service
public class RequestManagementServiceImpl implements RequestManagementService {

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @Override
    public Page<ServiceRequestDTO> searchRequests(String keyword, Pageable pageable) {
        if (pageable == null) {
            pageable = PageRequest.of(0, 10);
        }

        Specification<BorrowRequest> spec = (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return cb.conjunction();
            }

            String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.like(root.get("id").as(String.class), searchPattern));


            predicates.add(cb.like(cb.lower(root.get("studentId")), searchPattern));

            try {
                Join<BorrowRequest, User> userJoin = root.join("appUser");
                String userFieldName = findNameFieldInUserClass();
                predicates.add(cb.like(cb.lower(userJoin.get(userFieldName)), searchPattern));
            } catch (Exception e) {
            }

            return cb.or(predicates.toArray(new Predicate[0]));
        };

        Page<BorrowRequest> entityPage = borrowRequestRepository.findAll(spec, pageable);
        return entityPage.map(this::convertToDTO);
    }

    private ServiceRequestDTO convertToDTO(BorrowRequest entity) {
        ServiceRequestDTO dto = new ServiceRequestDTO();
        
        dto.setIdRequest(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setStatus(entity.getStatus());
        dto.setQuantity(1); 

        if (entity.getExpectedReturnDate() != null) {
            dto.setExpectedReturnDate(entity.getExpectedReturnDate().atStartOfDay());
        }
        if (entity.getActualReturnDate() != null) {
            dto.setActualReturnDate(entity.getActualReturnDate().atStartOfDay());
        }


        try {
            if (entity.getStudentId() != null) {
                String digitsOnly = entity.getStudentId().replaceAll("[^0-9]", "");
                if (!digitsOnly.isEmpty()) {
                    dto.setStudentId(Long.parseLong(digitsOnly));
                }
            }
        } catch (NumberFormatException e) {
            dto.setStudentId(null);
        }


        if (entity.getAppUser() != null) {
            dto.setEmail(entity.getAppUser().getEmail());
            dto.setStudentName(getStudentNameSafely(entity.getAppUser()));
        }


        dto.setDevice("Thiết bị ID: " + entity.getDeviceItemId());
        dto.setTotalRequest(4); 

        return dto;
    }

    private String findNameFieldInUserClass() {
        for (Field field : User.class.getDeclaredFields()) {
            String name = field.getName().toLowerCase();
            if (name.equals("fullname") || name.equals("name") || name.equals("username") || name.equals("firstname")) {
                return field.getName();
            }
        }
        return "username";
    }

    private String getStudentNameSafely(User user) {
        try {
            String fieldName = findNameFieldInUserClass();
            Field field = User.class.getDeclaredField(fieldName);
            field.setAccessible(true);
            Object value = field.get(user);
            return value != null ? value.toString() : "Chưa có tên";
        } catch (Exception e) {
            return "Sinh viên"; 
        }
    }
}