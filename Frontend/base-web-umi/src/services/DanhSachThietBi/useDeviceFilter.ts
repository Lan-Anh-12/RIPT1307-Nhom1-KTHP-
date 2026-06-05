import { useState, useEffect } from 'react';
import { getDeviceList } from '../DanhSachThietBi/api';
import type { DeviceType } from '../DanhSachThietBi/typing';

const IS_MOCK = true;

// 🌟 ĐÃ CHỈNH SỬA: Dữ liệu mẫu khớp 100% với khung cấu trúc DeviceType
const mockDatabase: DeviceType[] = [
	{
		id: 'DEV-001',
		name: 'Máy chiếu Epson EB-X51',
		category: 'Máy chiếu',
		status: 'Còn hàng',
		statusType: 'success',
		description: 'Máy chiếu XGA 3800 lumens, phù hợp phòng học vừa và nhỏ',
		stock: 5, // Đã sửa thành kiểu số nguyên
		image_url: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=500', // Đã đổi tên trường
	},
	{
		id: 'DEV-002',
		name: 'Máy tính xách tay Dell Latitude 5520',
		category: 'Laptop',
		status: 'Còn hàng',
		statusType: 'success',
		description: 'Laptop văn phòng Intel Core i5, RAM 16GB, SSD 512GB',
		stock: 8, // Đã sửa thành kiểu số nguyên
		image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=500', // Đã đổi tên trường
	},
	{
		id: 'DEV-003',
		name: 'Micro không dây Shure BLX24',
		category: 'Âm thanh',
		status: 'Bảo trì',
		statusType: 'warning',
		description: 'Micro karaoke không dây UHF, bộ thu + 1 micro cầm tay',
		stock: 0, // Đã sửa thành kiểu số nguyên
		image_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=500', // Đã đổi tên trường
	},
];

export const useDeviceFilter = () => {
	const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
	const [searchText, setSearchText] = useState<string>('');
	const [devices, setDevices] = useState<DeviceType[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null);

	const openDetailModal = (device: DeviceType) => {
		setSelectedDevice(device);
		setIsModalOpen(true);
	};

	const closeDetailModal = () => {
		setIsModalOpen(false);
		setSelectedDevice(null);
	};

	useEffect(() => {
		const fetchDevices = async () => {
			setLoading(true);
			try {
				if (IS_MOCK) {
					await new Promise((resolve) => setTimeout(resolve, 500));
					const result = mockDatabase.filter((device) => {
						const matchesCategory = selectedCategory === 'Tất cả' || device.category === selectedCategory;
						const matchesSearch =
							device.name.toLowerCase().includes(searchText.toLowerCase()) ||
							device.id.toLowerCase().includes(searchText.toLowerCase());
						return matchesCategory && matchesSearch;
					});
					setDevices(result);
				} else {
					const response = await getDeviceList({
						category: selectedCategory === 'Tất cả' ? undefined : selectedCategory,
						keyword: searchText || undefined,
					});
					if (response && response.data) {
						setDevices(response.data);
					}
				}
			} catch (error) {
				console.error('Lỗi lấy danh sách thiết bị:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchDevices();
	}, [selectedCategory, searchText]);

	return {
		selectedCategory,
		setSelectedCategory,
		searchText,
		setSearchText,
		devices,
		loading,
		isModalOpen,
		selectedDevice,
		openDetailModal,
		closeDetailModal,
	};
};
