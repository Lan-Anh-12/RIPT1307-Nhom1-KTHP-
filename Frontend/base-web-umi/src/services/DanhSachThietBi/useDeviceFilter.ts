import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getDeviceList } from './api';
import type { DeviceType } from './typing';

// Hàm nội bộ hỗ trợ gán màu Badge Antd dựa vào status chữ hoa từ Backend của Lan Anh
const mapStatusToType = (status?: string): 'success' | 'warning' | 'error' | 'default' => {
	switch (status?.toUpperCase()) {
		case 'AVAILABLE':
			return 'success'; // Màu xanh lá
		case 'MAINTENANCE':
			return 'warning'; // Màu vàng bảo trì
		case 'BORROWED':
			return 'error'; // Màu đỏ đã bị mượn
		default:
			return 'default'; // Màu xám (DELETED hoặc không rõ)
	}
};

export const useDeviceFilter = () => {
	const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
	const [searchText, setSearchText] = useState<string>('');
	const [allDevices, setAllDevices] = useState<DeviceType[]>([]); // Danh sách gốc từ DB
	const [devices, setDevices] = useState<DeviceType[]>([]); // Danh sách sau lọc hiển thị lên UI
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

	// 🔄 EFFECT 1: Gọi API thực tế từ Backend khi người dùng gõ tìm kiếm
	useEffect(() => {
		const fetchDevicesFromServer = async () => {
			setLoading(true);
			try {
				// Gọi thẳng Endpoint /api/devices?keyword=...
				const response = await getDeviceList(searchText || undefined);

				if (response && Array.isArray(response)) {
					// 🌟 ĐÃ SỬA: Map thêm trường statusType tự động trước khi nạp vào State
					const normalizedDevices = response.map((device) => ({
						...device,
						statusType: mapStatusToType(device.status),
					}));
					setAllDevices(normalizedDevices);
				}
			} catch (error) {
				console.error('Lỗi lấy danh sách thiết bị từ API:', error);
				message.error('Không thể lấy dữ liệu thiết bị từ máy chủ!');
			} finally {
				setLoading(false);
			}
		};

		// Cơ chế debounce 300ms giữ nguyên chạy rất tốt
		const delayDebounce = setTimeout(() => {
			fetchDevicesFromServer();
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [searchText]);

	// 🎯 EFFECT 2: Tự động lọc theo Danh mục (Category) ở Frontend
	useEffect(() => {
		if (selectedCategory === 'Tất cả') {
			setDevices(allDevices);
		} else {
			// Lọc an toàn bằng cách loại bỏ khoảng trắng và không phân biệt hoa thường
			const filtered = allDevices.filter(
				(device) => device.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase(),
			);
			setDevices(filtered);
		}
	}, [selectedCategory, allDevices]);

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
