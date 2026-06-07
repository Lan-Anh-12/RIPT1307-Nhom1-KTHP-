import { request } from 'umi';

const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

/**  1. API lấy danh sách thiết bị kho (Khớp chuẩn RequestParam 'keyword' của Java) */
export async function getInventoryList(params?: { keyword?: string }) {
  // Trả về kiểu dữ liệu là một mảng InventoryItem đã định nghĩa trong typings
  return request<DeviceInventory.InventoryItem[]>(`${BASE_URL}/api/devices`, { 
    method: 'GET', 
    params,
    skipErrorHandler: true,
  });
}

/**  2. API Thêm thiết bị mới (Sửa chuẩn endpoint /create khớp DeviceController) */
export async function addDevice(data: {
  name: string;
  categoryId: number;  // ID danh mục dạng số Long
  imageUrl?: string;   // Đường dẫn ảnh từ Cloudinary
  quantity: number;    // Số lượng Integer quantity
  description?: string;
}) {
  return request<DeviceInventory.InventoryItem>(`${BASE_URL}/api/devices/create`, { 
    method: 'POST', 
    data 
  });
}

/**  3. API Cập nhật thông tin thiết bị (Nhận id dạng number tương ứng với Long) */
export async function updateDevice(id: number, data: {
  name: string;
  categoryId: number;
  imageUrl?: string;
  quantity: number;
  description?: string;
}) {
  return request<DeviceInventory.InventoryItem>(`${BASE_URL}/api/devices/${id}`, { 
    method: 'PUT', 
    data 
  });
}

/**  4. API Xóa mềm thiết bị (Trả về kiểu boolean khớp chuẩn ResponseEntity<Boolean> của Java) */
export async function deleteDevice(id: number) {
  return request<boolean>(`${BASE_URL}/api/devices/${id}`, { 
    method: 'DELETE' 
  });
}