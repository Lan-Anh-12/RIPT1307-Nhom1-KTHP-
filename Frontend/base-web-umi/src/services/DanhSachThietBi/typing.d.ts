export interface DeviceType {
	id: number;
	name: string;
	categoryId?: number; // Cực kỳ quan trọng để lọc danh mục chuẩn
	category: string;
	status: string; // 'AVAILABLE', 'BORROWED', 'MAINTENANCE', 'DELETED'
	statusType?: 'success' | 'warning' | 'error' | 'default'; // Map màu chuẩn Antd
	description?: string;
	quantity: number;
	imageUrl?: string;
}
