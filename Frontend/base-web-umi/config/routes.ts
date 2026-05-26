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
];