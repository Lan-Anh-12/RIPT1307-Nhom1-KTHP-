export default [
  // 1. TRANG ĐĂNG NHẬP
  {
    path: '/login',
    name: 'Đăng nhập',
    component: './Login', 
    layout: false,
    hideInMenu: true,
  },
  
  // 2. ĐIỀU HƯỚNG MẶC ĐỊNH - SỬA LẠI ĐỂ KHÔNG BỊ VÒNG LẶP
  // Nếu đã đăng nhập, ở app.tsx ta sẽ redirect user về đúng trang của họ sau.
  {
    path: '/',
    redirect: '/login',
  },

  // 3. CỤM LAYOUT QUẢN TRỊ (ADMIN)
  {
    path: '/admin',
    name: 'Hệ thống Quản lý',
    access: 'isAdmin', // PHẢI KHỚP VỚI KEY TRONG ACCESS.TS
    flatMenu: true,
    routes: [
      { path: '/admin/device-order', name: 'Quản lý yêu cầu', component: './Admin/DeviceOrder/index',icon:'Table',  },
      { path: '/admin/device-inventory', name: 'Quản lý kho', component: './Admin/DeviceInventory',icon: 'Database' },
      { path: '/admin/dashboard', name: 'Thống kê', component: './Admin/Dashboard',icon: 'Dashboard',  },
      // Redirect mặc định cho admin
      { path: '/admin', redirect: '/admin/device-order' }, 
    ],
  },

  // 4. CỤM LAYOUT SINH VIÊN (STUDENT)
  {
    path: '/student',
    name: 'Sinh viên',
    access: 'isStudent', 
    flatMenu: true,
    routes: [
      { path: '/student/danh-sach-thiet-bi', name: 'Danh sách thiết bị', component: './Student/DanhSachThietBi',icon: 'BankOutlined' },
      { path: '/student/yeu-cau-muon', name: 'Yêu cầu mượn', component: './Student/YeuCauMuon',	icon: 'FileTextOutlined' },
      { path: '/student/lich-su-muon', name: 'Lịch sử mượn', component: './Student/LichSuMuon',icon: 'HistoryOutlined' },
	  { path: '/student/thong-bao', name: 'Thông báo', component: './Student/Tbao',	icon: 'BellOutlined'},
      // Redirect mặc định cho sinh viên
      { path: '/student', redirect: '/student/danh-sach-thiet-bi' },
    ],
  },
  


  // 5. CÁC ĐỊNH TUYẾN PHỤ VÀ HỆ THỐNG KHÁC
  {
    path: '/gioi-thieu',
    name: 'About',
    component: './TienIch/GioiThieu',
    hideInMenu: true,
  },
  {
    path: '/notification',
    layout: false,
    hideInMenu: true,
    routes: [
      {
        path: './subscribe',
        exact: true,
        component: './ThongBao/Subscribe',
      },
      {
        path: './check',
        exact: true,
        component: './ThongBao/Check',
      },
      {
        path: './',
        exact: true,
        component: './ThongBao/NotifOneSignal',
      },
    ],
  },

  // 6. TRANG LỖI HỆ THỐNG (NẰM DƯỚI CÙNG ĐỂ BẮT ROUTE CHÍNH XÁC)

  {
    path: '/hold-on',
    component: './exception/DangCapNhat',
    layout: false,
  },
  {
    component: './exception/404',
  },
];