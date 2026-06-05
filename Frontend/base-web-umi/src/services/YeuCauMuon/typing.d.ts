declare namespace BorrowRequestSpace {
	// Cấu trúc của thiết bị lấy từ bảng device_model
	interface DeviceModel {
		id: string;
		name: string;
		stock: number;
		description?: string;
		image?: string;
		status?: string;
		category_id?: number;
	}

	// Cấu trúc dữ liệu Form người dùng nhập
	interface FormValues {
		deviceId: string;
		startDate: any; // Moment hoặc Dayjs từ Antd DatePicker
		endDate: any;
		quantity: number;
	}

	// Cấu trúc dữ liệu chuẩn để gửi lên Server (Bảng borrow_request)
	interface CreateBorrowPayload {
		device_model_id: string;
		borrow_date: string;
		expected_return_date: string;
		quantity: number;
		app_user_id: number;
		status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';
	}
}
