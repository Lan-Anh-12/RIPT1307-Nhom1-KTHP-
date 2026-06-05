declare namespace NotificationSpace {
	// Cấu trúc một bản ghi thông báo trong Database
	interface NotificationItem {
		id: string;
		user_id: string;
		title: string;
		content: string;
		is_read: boolean;
		created_at: string;
		type?: 'error' | 'warning' | 'info'; // Định dạng cảnh báo để render icon tương ứng
	}

	// Số lượng thống kê phục vụ bộ lọc tab
	interface NotificationStats {
		all: number;
		unread: number;
		read: number;
	}
}
