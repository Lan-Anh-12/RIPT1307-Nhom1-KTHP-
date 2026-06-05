declare namespace BorrowHistorySpace {
	// Cấu trúc dữ liệu hiển thị lịch sử đơn mượn
	interface HistoryItem {
		id: string;
		key: string; // Mã đơn mượn (Ví dụ: REQ-2025-001)
		deviceName: string; // Tên thiết bị map từ bảng device_model
		quantity: number; // Số lượng mượn
		startDate: string; // Ngày mượn (borrow_date)
		endDate: string; // Ngày trả dự kiến (expected_return_date)
		actualDate: string; // Ngày trả thực tế (nếu có)
		status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối' | 'Đã trả' | 'Quá hạn'; // Trạng thái hiển thị tiếng Việt
	}

	// Thống kê số lượng theo trạng thái đơn
	interface HistoryStats {
		pending: number;
		approved: number;
		rejected: number;
		returned: number;
		overdue: number;
	}
}
