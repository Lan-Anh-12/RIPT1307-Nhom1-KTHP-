export default [
  // Định tuyến mặc định khi vào trang web
  {
    path: '/',
    redirect: '/admin/device-order',
  },

  // 1. MENU: QUẢN LÝ YÊU CẦU (Đã đưa ra ngoài cùng cấp cao nhất)
  {
    path: '/admin/device-order',
    name: 'Quản lý yêu cầu',
    icon: 'table', // Hoặc icon bất kỳ bạn thích như 'solution', 'profile'
    component: './Admin/DeviceOrder/index',
  },
  
  // Tuyến đường ngầm để xử lý form (Không hiển thị trên thanh điều hướng Sidebar)
  {
    path: '/admin/device-order/form',
    name: 'Xử lý yêu cầu',
    component: './Admin/DeviceOrder/form',
    hideInMenu: true,
  },
  {
    path: '/admin/device-inventory',
    name: 'Quản lý kho thiết bị',
    icon: 'database', // Icon dạng hộp lưu trữ/cơ sở dữ liệu cực hợp với "Kho"
    component: './Admin/DeviceInventory', // Chỉ đúng vào thư mục pages/Admin/DeviceInventory
  },
  {
    path: '/admin/dashboard',
    name: 'Thống kê',
    icon: 'dashboard', // Hiển thị icon đồng hồ đo tốc độ/báo cáo trực quan
    component: './Admin/Dashboard', // Ăn khớp chính xác với src/pages/Admin/Dashboard/index.tsx
  },
];