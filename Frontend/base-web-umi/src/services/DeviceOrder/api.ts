import { request } from 'umi';

const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

/**  1. API Lấy tất cả yêu cầu (Admin xem danh sách tổng)
 * GET /api/requests/all
 */
export async function getOrderList() {
  return request<DeviceRequest.RequestItem[]>(`${BASE_URL}/api/requests/all`, {
    method: 'GET',
  });
}

/**  2. API Tìm kiếm yêu cầu theo tên sinh viên (Thanh tìm kiếm chính)
 * GET /api/requests/search?name=...
 */
export async function searchRequestsByName(name: string) {
  return request<DeviceRequest.RequestItem[]>(`${BASE_URL}/api/requests/search`, {
    method: 'GET',
    params: { name },
  });
}

/**  3. API Tìm kiếm lịch sử mượn theo từ khóa
 * GET /api/requests/search-history?keyword=...
 */
export async function searchHistory(keyword: string) {
  return request<DeviceRequest.RequestItem[]>(`${BASE_URL}/api/requests/search-history`, {
    method: 'GET',
    params: { keyword },
  });
}

/**  4. API Lấy chi tiết 1 yêu cầu theo ID (Dùng cho Popup xem chi tiết hoặc Popup duyệt)
 * GET /api/requests/{id}
 */
export async function getRequestById(id: number | string) {
  return request<DeviceRequest.RequestItem>(`${BASE_URL}/api/requests/${id}`, {
    method: 'GET',
  });
}

/** 5. API Cập nhật trạng thái đơn mượn/trả (Khớp Map<String, String> của Java)
 * PUT /api/requests/{id}/status
 * body gửi lên: { "status": "APPROVED" | "REJECTED" | "RETURNED" }
 */
export async function updateOrderStatus(idRequest: number | string, status: 'APPROVED' | 'REJECTED' | 'RETURNED') {
  return request<any>(`${BASE_URL}/api/requests/${idRequest}/status`, {
    method: 'PUT',
    data: { status },
  });
}

/**  6. API Lấy toàn bộ danh sách thông báo tự động từ hệ thống (Để Admin lọc ra thông báo quá hạn)
 * GET /api/notifications
 */
export async function getAllNotifications() {
  return request<DeviceNotification.NotificationItem[]>(`${BASE_URL}/api/notifications`, {
    method: 'GET',
  });
}