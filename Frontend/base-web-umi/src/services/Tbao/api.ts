import { request } from 'umi';

// 1. API lấy toàn bộ danh sách thông báo của người dùng
export async function getNotificationList(): Promise<{ data: NotificationSpace.NotificationItem[] }> {
	return request('/api/notifications', {
		method: 'GET',
	});
}

// 2. API đánh dấu đã đọc một thông báo cụ thể
export async function markNotificationAsRead(id: string): Promise<any> {
	return request(`/api/notifications/${id}/read`, {
		method: 'PUT',
	});
}

// 3. API đánh dấu đã đọc toàn bộ thông báo của người dùng này
export async function markAllNotificationsAsRead(): Promise<any> {
	return request('/api/notifications/read-all', {
		method: 'PUT',
	});
}
