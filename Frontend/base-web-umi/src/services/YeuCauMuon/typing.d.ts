declare namespace BorrowRequestSpace {
	// Cấu trúc của thiết bị lấy từ bảng device_model (Khớp DeviceResponseDTO)
	interface DeviceModel {
		id: number; // Đổi từ string sang number khớp kiểu Long trong Java
		name: string;
		quantity: number; // 🌟 ĐÃ SỬA: Đổi từ stock sang quantity để hết lỗi gạch đỏ!
		description?: string;
		imageUrl?: string;
		status?: string;
		categoryId?: number;
	}

	// Cấu trúc dữ liệu Form người dùng nhập khớp với giao diện mới
	interface FormValues {
		deviceItemId: number; // Sửa từ deviceId thành deviceItemId
		expectedReturnDate: any; // Bỏ startDate, chỉ giữ ngày trả dự kiến
		quantity: number;
	}

	// Cấu trúc dữ liệu chuẩn để gửi lên Server (Khớp BorrowCreateRequestDTO trong Java)
	interface CreateBorrowPayload {
		requestDate: string; // Ngày hiện tại YYYY-MM-DD
		expectedReturnDate: string; // Ngày hẹn trả YYYY-MM-DD
		deviceItemId: number; // Đổi từ device_model_id thành deviceItemId
		quantity: number;
	}
}
