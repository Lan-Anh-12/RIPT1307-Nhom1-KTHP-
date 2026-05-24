import { icons } from 'antd/lib/image/PreviewGroup';

export default [
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

	///////////////////////////////////
	// DEFAULT MENU

	{
		path: '/danh-sach-thiet-bi',
		name: 'Danh sách thiết bị',
		component: './DanhSachThietBi',
		icon: 'BankOutlined',
	},
	{
		path: '/yeu-cau-muon',
		name: 'Yêu cầu mượn',
		component: './YeuCauMuon',
		icon: 'FileTextOutlined',
	},
	{
		path: '/lich-su-muon',
		name: 'Lịch sử mượn',
		component: './LichSuMuon',
		icon: 'HistoryOutlined',
	},
	{
		path: '/thong-bao',
		name: 'Thông báo',
		component: './Tbao',
		icon: 'BellOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	
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
