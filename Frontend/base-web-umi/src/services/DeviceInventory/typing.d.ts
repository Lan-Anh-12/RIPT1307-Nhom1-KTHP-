declare namespace DeviceInventory {
  interface InventoryItem {
    id: number;           // Khóa chính Long từ Java chuyển thành number ở React
    name: string;         // Tên thiết bị
    imageUrl?: string;    // Đường dẫn ảnh từ Cloudinary (Java trả về imageUrl)
    quantity: number;     // Số lượng tồn kho thực tế (Java trả về quantity)
    description?: string; // Mô tả thiết bị
    status?: string;      // Trạng thái từ hệ thống (ACTIVE, DELETED, CON_HANG...)
    
    // Đối tượng danh mục lồng nhau trả về từ database của Backend
    category?: {
      id: number;
      name: string;
    };
    
    // Trường bổ trợ dự phòng
    categoryId?: number;
  }

  /** Định nghĩa tham số dữ liệu lấy từ Form Antd (Khớp chuẩn DeviceCreateRequestDTO) */
  interface DeviceFormParams {
    name: string;
    categoryId: number;    // Gửi ID danh mục dạng số lên Java
    stock: number;         // Ô nhập số lượng trên giao diện Form Antd
    description?: string;  // Ô nhập mô tả
    imageFile?: any;       // File ảnh thô giữ lại để FE xử lý đẩy lên Cloudinary
  }

  /** Cấu trúc bọc dữ liệu API trả về */
  interface InventoryResponse {
    data: InventoryItem[];
    success: boolean;
    total?: number;
  }
}