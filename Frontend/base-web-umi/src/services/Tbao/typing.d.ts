declare namespace NotificationSpace {
	// Cấu trúc một bản ghi thông báo chuẩn từ Backend DTO
	interface NotificationItem {
		id: number;
		userId: number;
		title: string;
		content: string;
		isRead: boolean;
	}

	// Số lượng thống kê phục vụ bộ lọc tab trên UI
	interface NotificationStats {
		all: number;
		unread: number;
		read: number;
	}
}
