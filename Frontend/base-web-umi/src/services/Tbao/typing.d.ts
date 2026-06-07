declare namespace NotificationSpace {
	// Cấu trúc một bản ghi thông báo chuẩn từ Backend DTO
	interface NotificationItem {
		id: number; // Long ID trong MySQL/PostgreSQL
		userId: number; // Long ID của User nhận thông báo
		title: string;
		content: string;
		isRead: boolean; // camelCase chuẩn Java
		createdAt: string; // Chuỗi ISO String hoặc định dạng từ Server
		type?: 'ERROR' | 'WARNING' | 'INFO'; // Enum chữ in hoa đồng bộ với Database
	}

	// Số lượng thống kê phục vụ bộ lọc tab trên UI
	interface NotificationStats {
		all: number;
		unread: number;
		read: number;
	}
}
