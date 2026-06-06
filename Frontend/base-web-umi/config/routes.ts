// Frontend/base-web-umi/config/routes.ts

export default [
	// 1. TRANG ĐĂNG NHẬP (Gộp chung chuẩn login)
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},
	{
		path: '/login',
		name: 'Đăng nhập',
		component: './Login',
		layout: false,
		hideInMenu: true,
	},

	// 2. MENU CHO TRANG USER (CỦA BẠN)
	{
		path: '/student/danh-sach-thiet-bi',
		name: 'Danh sách thiết bị',
		component: './Student/DanhSachThietBi',
		icon: 'BankOutlined',
	},
	{
		path: '/student/yeu-cau-muon',
		name: 'Yêu cầu mượn',
		component: './Student/YeuCauMuon',
		icon: 'FileTextOutlined',
	},
	{
		path: '/student/lich-su-muon',
		name: 'Lịch sử mượn',
		component: './Student/LichSuMuon',
		icon: 'HistoryOutlined',
	},
	{
		path: '/student/thong-bao',
		name: 'Thông báo',
		component: './Student/Tbao',
		icon: 'BellOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},

	// 3. MENU CHO TRANG ADMIN (CỦA NGỌC)
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

	// 4. ĐỊNH TUYẾN THÔNG BÁO NGẦM & HỆ THỐNG
	{
		path: '/notification',
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
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
		redirect: '/student/danh-sach-thiet-bi',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
