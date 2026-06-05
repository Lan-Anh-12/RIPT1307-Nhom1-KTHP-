export interface DeviceType {
	id: string;
	name: string;
	category: string;
	status: string;
	statusType: 'success' | 'warning' | 'error' | 'processing';
	description?: string;
	stock: number; // Bắt buộc dạng Số để khớp logic Database
	image_url?: string; // Dùng snake_case chuẩn Database
}
