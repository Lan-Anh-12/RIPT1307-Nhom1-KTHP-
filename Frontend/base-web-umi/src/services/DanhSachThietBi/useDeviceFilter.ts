import { useState, useEffect } from 'react';

// 1. ĐỐNG DỮ LIỆU MẪU (Để tạm ở đây để giả lập database của Server)
const mockDatabase = [
	{
		id: 'DEV-001',
		name: 'Máy chiếu Epson EB-X51',
		category: 'Máy chiếu',
		status: 'Còn hàng',
		statusType: 'success',
		description: 'Máy chiếu XGA 3800 lumens, phù hợp phòng học vừa và nhỏ',
		stock: '5/6',
		image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=500',
	},
	{
		id: 'DEV-002',
		name: 'Máy tính xách tay Dell Latitude 5520',
		category: 'Laptop',
		status: 'Còn hàng',
		statusType: 'success',
		description: 'Laptop văn phòng Intel Core i5, RAM 16GB, SSD 512GB',
		stock: '8/10',
		image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=500',
	},
	{
		id: 'DEV-003',
		name: 'Micro không dây Shure BLX24',
		category: 'Âm thanh',
		status: 'Bảo trì',
		statusType: 'warning',
		description: 'Micro karaoke không dây UHF, bộ thu + 1 micro cầm tay',
		stock: '0/4',
		image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=500',
	},
];

export const useDeviceFilter = () => {
	const [selectedCategory, setSelectedCategory] = useState('Tất cả');
	const [searchText, setSearchText] = useState('');
	const [devices, setDevices] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	// 🌟 STATE QUẢN LÝ POPUP
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<any>(null);

	// ✅ ĐÃ SỬA: Chỉ giữ lại duy nhất 1 hàm mở Popup sạch sẽ
	const openDetailModal = (device: any) => {
		setSelectedDevice(device);
		setIsModalOpen(true);
	};

	// Hàm xử lý đóng popup
	const closeDetailModal = () => {
		setIsModalOpen(false);
		setSelectedDevice(null);
	};

	useEffect(() => {
		const fetchDevices = () => {
			setLoading(true); // Bật vòng xoay loading

			// Giả lập mạng chậm: Đợi 500ms (0.5 giây) sau đó mới trả dữ liệu về y như API thật
			setTimeout(() => {
				try {
					// Logic xử lý tìm kiếm và lọc (Server tương lai sẽ làm việc này)
					const result = mockDatabase.filter((device) => {
						const matchesCategory = selectedCategory === 'Tất cả' || device.category === selectedCategory;
						const matchesSearch =
							device.name.toLowerCase().includes(searchText.toLowerCase()) ||
							device.id.toLowerCase().includes(searchText.toLowerCase());
						return matchesCategory && matchesSearch;
					});

					setDevices(result); // Đổ dữ liệu sau khi lọc vào state
				} catch (error) {
					console.error('Lỗi lấy dữ liệu:', error);
				} finally {
					setLoading(false); // Tắt loading
				}
			}, 500);
		};

		fetchDevices();
	}, [selectedCategory, searchText]);

	// ✅ ĐÃ SỬA: Thêm đầy đủ dữ liệu popup vào lệnh return để file index.tsx nhận được
	return {
		selectedCategory,
		setSelectedCategory,
		searchText,
		setSearchText,
		devices,
		loading,
		isModalOpen, // Cần thiết cho index.tsx
		selectedDevice, // Cần thiết cho index.tsx
		openDetailModal, // Cần thiết cho index.tsx
		closeDetailModal, // Cần thiết cho index.tsx
	};
};
