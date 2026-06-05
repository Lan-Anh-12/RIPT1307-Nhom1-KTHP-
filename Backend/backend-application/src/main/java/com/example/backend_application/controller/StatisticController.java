package com.example.backend_application.controller;

import com.example.backend_application.dto.DeviceTopDTO;
import com.example.backend_application.dto.StatusStatDTO;
import com.example.backend_application.repository.BorrowRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statistics")
public class StatisticController {

    @Autowired
    private BorrowRequestRepository borrowRequestRepository;

    @GetMapping("/top-devices")
    public List<DeviceTopDTO> getTopBorrowedDevices(
            @RequestParam(value = "limit", defaultValue = "5") int limit) {
        
        // Gọi thẳng từ repository và trả về cho FE
        return borrowRequestRepository.findTop5MostBorrowedDevices(PageRequest.of(0, limit));
    }

    @GetMapping("/borrow-stats")
    public List<StatusStatDTO> getBorrowStatistics() {
        return borrowRequestRepository.getBorrowStatistics().stream()
            .map(obj -> new StatusStatDTO((String) obj[0], ((Number) obj[1]).longValue()))
            .collect(Collectors.toList());
    }
}