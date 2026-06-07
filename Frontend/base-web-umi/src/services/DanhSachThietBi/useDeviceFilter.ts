import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getDeviceList } from './api';
import type { DeviceType } from './typing';

// Hàm gán màu trạng thái (Badge Antd)
const mapStatusToType = (status?: string): 'success' | 'warning' | 'error' | 'default' => {
	switch (status?.toUpperCase()) {
		case 'AVAILABLE':
			return 'success';
		case 'MAINTENANCE':
			return 'warning';
		case 'BORROWED':
			return 'error';
		default:
			return 'default';
	}
};

export const useDeviceFilter = () => {
	// Khai báo State quản lý bộ lọc và dữ liệu
	const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
	const [searchText, setSearchText] = useState<string>('');
	const [allDevices, setAllDevices] = useState<DeviceType[]>([]);
	const [devices, setDevices] = useState<DeviceType[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	// Khai báo State quản lý đóng mở Modal chi tiết
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null);

	// Hàm xử lý đóng mở Modal
	const openDetailModal = (device: DeviceType) => {
		setSelectedDevice(device);
		setIsModalOpen(true);
	};

	const closeDetailModal = () => {
		setIsModalOpen(false);
		setSelectedDevice(null);
	};

	// Effect gọi API lấy dữ liệu từ Server theo từ khóa tìm kiếm
	useEffect(() => {
		const fetchDevicesFromServer = async () => {
			setLoading(true);
			try {
				const response = await getDeviceList(searchText || undefined);

				if (response && Array.isArray(response)) {
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

		const delayDebounce = setTimeout(() => {
			fetchDevicesFromServer();
		}, 300);

		return () => clearTimeout(delayDebounce);
	}, [searchText]);

	// Effect lọc dữ liệu theo Danh mục sản phẩm tại Client
	useEffect(() => {
		if (selectedCategory === 'Tất cả') {
			setDevices(allDevices);
		} else {
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
