import { request } from 'umi';
import type { DeviceType } from './typing'; // Đường dẫn trỏ tới file src/services/DanhSachThietBi/typing.d.ts

// Hàm lấy danh sách thiết bị có truyền tham số bộ lọc xuống cho Backend xử lý
export async function getDeviceList(params?: { category?: string; keyword?: string }) {
	return request<{ data: DeviceType[] }>('/api/v1/devices', {
		method: 'GET',
		params,
	});
}

// Hàm lấy danh sách toàn bộ danh mục thiết bị động từ CSDL
export async function getCategories() {
	return request<{ data: string[] }>('/api/v1/categories', {
		method: 'GET',
	});
}
