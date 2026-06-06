package com.example.backend_application.service;

import com.example.backend_application.entity.BorrowRequest;
import com.example.backend_application.entity.Notification;
import com.example.backend_application.entity.User;
import com.example.backend_application.repository.BorrowRequestRepository;
import com.example.backend_application.repository.InventoryRepository;
import com.example.backend_application.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationSchedulerImpl implements NotificationScheduler {

    @Autowired 
    private BorrowRequestRepository borrowRequestRepository;
    
    @Autowired 
    private NotificationRepository notificationRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    @Transactional
    @Scheduled(cron = "0 * * * * *", zone = "Asia/Ho_Chi_Minh")
    public void autoCheckDeadline() {
        List<BorrowRequest> requests = borrowRequestRepository.findAll();
        LocalDate today = LocalDate.now();

        for (BorrowRequest req : requests) {
            if (!"APPROVED".equals(req.getStatus())) continue;

            // Lấy tên thiết bị dựa trên ID
            // Nếu bạn dùng deviceItemId, hãy gọi repo của nó
            String deviceName = inventoryRepository.findById(req.getDeviceItemId())
                                    .map(device -> device.getName())
                                    .orElse("Thiết bị ID: " + req.getDeviceItemId());

            LocalDate deadline = req.getExpectedReturnDate();
            
            if (deadline != null) {
                if (deadline.isBefore(today)) {
                    req.setStatus("OVERDUE");
                    borrowRequestRepository.save(req);
                    saveAutoNotification(req.getAppUser(), "Cảnh báo quá hạn", 
                        "Thiết bị " + deviceName + " đã quá hạn trả!");
                } 
                else if (deadline.isEqual(today.plusDays(1))) {
                    saveAutoNotification(req.getAppUser(), "Nhắc nhở", 
                        "Thiết bị " + deviceName + " sắp đến hạn trả vào ngày mai.");
                }
            }
        }
    }

    private void saveAutoNotification(User user, String title, String content) {
        if (user == null) return;
        
        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setContent(content);
        n.setIsRead(false);
        n.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(n);
    }
}