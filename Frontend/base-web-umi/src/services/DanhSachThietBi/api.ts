import { request } from 'umi';
import type { DeviceType } from './typing';

/**
 * API lấy danh sách thiết bị thực tế từ Backend
 * @param keyword Từ khóa tìm kiếm (Tên thiết bị hoặc thông tin liên quan)
 */
export async function getDeviceList(keyword?: string): Promise<DeviceType[]> {
	return request<DeviceType[]>('/api/devices', {
		method: 'GET',
		params: {
			keyword, // Tự động map thành ?keyword=... nếu người dùng nhập ô tìm kiếm
		},
	});
}
