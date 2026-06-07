import { useState, useMemo, useEffect } from 'react';
import { message } from 'antd';
import { getNotificationList, markNotificationAsRead } from './api';

export const useNotification = () => {
	const [notifications, setNotifications] = useState<any[]>([]);
	const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
	const [loading, setLoading] = useState<boolean>(true);

	const fetchNotifications = async () => {
		try {
			setLoading(true);
			const res = await getNotificationList();

			const data = Array.isArray(res) ? [...res] : [];
			setNotifications(data);
		} catch (error) {
			console.error('Lỗi tải thông báo:', error);
			message.error('Không thể tải danh sách thông báo!');
			setNotifications([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, []);

	// Logic thống kê dùng chính xác isRead (boolean)
	const stats = useMemo(
		() => ({
			all: notifications.length,
			unread: notifications.filter((n) => n.isRead === false).length,
			read: notifications.filter((n) => n.isRead === true).length,
		}),
		[notifications],
	);

	// Logic lọc danh sách
	const filteredNotifications = useMemo(() => {
		if (activeTab === 'unread') return notifications.filter((n) => n.isRead === false);
		if (activeTab === 'read') return notifications.filter((n) => n.isRead === true);
		return notifications;
	}, [notifications, activeTab]);

	const handleMarkAsRead = async (id: number) => {
		try {
			await markNotificationAsRead(id);
			setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
		} catch (error) {
			message.error('Đánh dấu đọc thất bại.');
		}
	};

	return {
		activeTab,
		setActiveTab,
		stats,
		filteredNotifications,
		loading,
		handleMarkAsRead,
	};
};
