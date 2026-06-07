declare namespace NotificationSpace {
    // Cấu trúc một bản ghi thông báo chuẩn từ Backend DTO
    interface NotificationItem {
        id: number;      // Long ID
        userId: number;  // Long ID của User nhận thông báo
        title: string;
        content: string;
        isRead: boolean; // boolean trong Java tương ứng với boolean trong TS
    }

    // Số lượng thống kê phục vụ bộ lọc tab trên UI
    interface NotificationStats {
        all: number;
        unread: number;
        read: number;
    }
}