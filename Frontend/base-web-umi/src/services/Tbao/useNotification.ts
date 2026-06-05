import { useState, useMemo, useEffect } from 'react';
import { message } from 'antd';
import { getNotificationList, markNotificationAsRead, markAllNotificationsAsRead } from './api';

// Bật true để dùng dữ liệu giả lập, đổi thành false để chạy API thực tế với BackEnd
const IS_MOCK = true;

const mockNotifications: NotificationSpace.NotificationItem[] = [
	{
		id: '1',
		user_id: 'USER_001',
		title: 'Thông báo bảo trì hệ thống',
		content:
			'Hệ thống mượn thiết bị sẽ tạm ngừng hoạt động từ 20:00 đến 22:00 ngày 15/05/2025 để bảo trì. Sinh viên vui lòng sắp xếp thời gian mượn/trả thiết bị trước hoặc sau khung giờ này.',
		is_read: false,
		created_at: '17:00 13/05/2025',
		type: 'error',
	},
	{
		id: '2',
		user_id: 'USER_001',
		title: 'Yêu cầu mượn đã được duyệt',
		content:
			'Yêu cầu mượn Máy tính xách tay Dell Latitude 5520 của bạn đã được duyệt. Vui lòng đến phòng thiết bị để nhận trước ngày 18/05/2025.',
		is_read: true,
		created_at: '16:30 13/05/2025',
		type: 'warning',
	},
	{
		id: '3',
		user_id: 'USER_001',
		title: 'Cảnh báo tồn kho thấp',
		content:
			'Máy chiếu Epson EB-X51 hiện chỉ còn 2 thiết bị trong kho. Vui lòng lên kế hoạch bảo trì hoặc đặt thêm nếu cần.',
		is_read: false,
		created_at: '21:00 12/05/2025',
		type: 'warning',
	},
	{
		id: '4',
		user_id: 'USER_001',
		title: 'Thông báo nghỉ lễ 30/4 - 1/5',
		content:
			'Phòng thiết bị sẽ đóng cửa từ ngày 29/04 đến 02/05. Không tiếp nhận mượn/trả thiết bị trong thời gian này.',
		is_read: true,
		created_at: '15:00 25/04/2025',
		type: 'info',
	},
];

export const useNotification = () => {
	const [notifications, setNotifications] = useState<NotificationSpace.NotificationItem[]>([]);
	const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
	const [loading, setLoading] = useState<boolean>(false);

	// Hàm gọi dữ liệu
	const fetchNotifications = async () => {
		setLoading(true);
		try {
			if (IS_MOCK) {
				await new Promise((resolve) => setTimeout(resolve, 300));
				setNotifications(mockNotifications);
			} else {
				const res = await getNotificationList();
				if (res && res.data) setNotifications(res.data);
			}
		} catch (error) {
			message.error('Không thể tải danh sách thông báo!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, []);

	// 1. Tính toán số lượng dựa trên trường is_read của data
	const stats = useMemo<NotificationSpace.NotificationStats>(() => {
		return {
			all: notifications.length,
			unread: notifications.filter((n) => !n.is_read).length,
			read: notifications.filter((n) => n.is_read).length,
		};
	}, [notifications]);

	// 2. Bộ lọc danh sách hiển thị theo Tab đang hoạt động
	const filteredNotifications = useMemo(() => {
		if (activeTab === 'unread') return notifications.filter((n) => !n.is_read);
		if (activeTab === 'read') return notifications.filter((n) => n.is_read);
		return notifications;
	}, [notifications, activeTab]);

	// 3. Đánh dấu đã đọc một thông báo
	const handleMarkAsRead = async (id: string) => {
		try {
			if (IS_MOCK) {
				setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, is_read: true } : item)));
			} else {
				await markNotificationAsRead(id);
				await fetchNotifications();
			}
			message.success('Đã cập nhật trạng thái thông báo');
		} catch (error) {
			message.error('Xử lý thất bại, vui lòng thử lại sau.');
		}
	};

	// 4. Đánh dấu đã đọc tất cả
	const handleMarkAllAsRead = async () => {
		try {
			if (IS_MOCK) {
				setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
			} else {
				await markAllNotificationsAsRead();
				await fetchNotifications();
			}
			message.success('Đã đánh dấu đọc tất cả thông báo');
		} catch (error) {
			message.error('Xử lý thất bại, vui lòng thử lại sau.');
		}
	};

	return {
		activeTab,
		setActiveTab,
		stats,
		filteredNotifications,
		loading,
		handleMarkAsRead,
		handleMarkAllAsRead,
	};
};
