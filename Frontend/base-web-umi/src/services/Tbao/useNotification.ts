import { useState, useMemo, useEffect } from 'react';
import { message } from 'antd';
import { getNotificationList, markNotificationAsRead, markAllNotificationsAsRead } from './api';

export const useNotification = () => {
	const [notifications, setNotifications] = useState<NotificationSpace.NotificationItem[]>([]);
	const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
	const [loading, setLoading] = useState<boolean>(false);

	// Hàm gọi dữ liệu thực tế từ hệ thống máy chủ
	const fetchNotifications = async () => {
		setLoading(true);
		try {
			const res = await getNotificationList();
			if (res && Array.isArray(res)) {
				setNotifications(res);
			}
		} catch (error) {
			message.error('Không thể tải danh sách thông báo từ Server!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, []);

	// 1. Tính toán số lượng dựa trên trường isRead mới (camelCase)
	const stats = useMemo<NotificationSpace.NotificationStats>(() => {
		return {
			all: notifications.length,
			unread: notifications.filter((n) => !n.isRead).length,
			read: notifications.filter((n) => n.isRead).length,
		};
	}, [notifications]);

	// 2. Bộ lọc danh sách hiển thị theo Tab đang hoạt động
	const filteredNotifications = useMemo(() => {
		if (activeTab === 'unread') return notifications.filter((n) => !n.isRead);
		if (activeTab === 'read') return notifications.filter((n) => n.isRead);
		return notifications;
	}, [notifications, activeTab]);

	// 3. Đánh dấu đã đọc một thông báo cụ thể thông qua API
	const handleMarkAsRead = async (id: number) => {
		try {
			setLoading(true);
			await markNotificationAsRead(id);
			message.success('Đã đánh dấu đọc thông báo');
			await fetchNotifications(); // Tải lại danh sách mới nhất từ DB để đồng bộ giao diện
		} catch (error) {
			message.error('Xử lý thất bại, vui lòng thử lại sau.');
		} finally {
			setLoading(false);
		}
	};

	// 4. Đánh dấu đã đọc tất cả thông báo của User
	const handleMarkAllAsRead = async () => {
		if (notifications.every((n) => n.isRead)) {
			message.info('Tất cả thông báo của bạn đã được đọc từ trước.');
			return;
		}

		try {
			setLoading(true);
			await markAllNotificationsAsRead();
			message.success('Đã đánh dấu đọc tất cả thông báo');
			await fetchNotifications(); // Tải lại danh sách mới nhất
		} catch (error) {
			message.error('Không thể cập nhật trạng thái đọc tất cả.');
		} finally {
			setLoading(false);
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
