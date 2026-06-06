export default [
  // 1. TRANG ĐĂNG NHẬP
  {
    path: '/login',
    name: 'Đăng nhập',
    component: './Login', 
    layout: false,        
    hideInMenu: true,     
  },
  
  // 2. ĐIỀU HƯỚNG MẶC ĐỊNH
  {
    path: '/',
    redirect: '/login',
  },

  // 3. CỤM LAYOUT QUẢN TRỊ NỘI BỘ
  {
    path: '/admin',
    name: 'Hệ thống Quản lý',
    flatMenu: true, 
    routes: [
      {
        path: '/admin/device-order',
        name: 'Quản lý yêu cầu',
        icon: 'Table', 
        component: './Admin/DeviceOrder/index',
      },
      {
        path: '/admin/device-order/form',
        name: 'Xử lý yêu cầu',
        component: './Admin/DeviceOrder/form',
        hideInMenu: true, 
      },
      {
        path: '/admin/device-inventory',
        name: 'Quản lý kho thiết bị',
        icon: 'Database', 
        component: './Admin/DeviceInventory', 
      },
      {
        path: '/admin/dashboard',
        name: 'Thống kê',
        icon: 'Dashboard', 
        component: './Admin/Dashboard', 
      },
    ],
  },
];