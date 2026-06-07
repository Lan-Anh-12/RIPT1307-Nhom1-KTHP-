import { useState, useMemo, useEffect } from 'react';
import { message, Modal } from 'antd';
import { getBorrowHistoryList } from './api';

const STATUS_MAP: Record<string, string> = {
	'Tất cả': 'ALL',
	'Chờ duyệt': 'PENDING',
	'Đã duyệt': 'APPROVED',
	'Từ chối': 'REJECTED',
	'Đã trả': 'RETURNED',
};

export const useBorrowHistory = () => {
	const [data, setData] = useState<BorrowHistorySpace.HistoryItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchText, setSearchText] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

	const fetchHistory = async () => {
		setLoading(true);
		try {
			const response = await getBorrowHistoryList();
			const result = Array.isArray(response) ? response : response?.data || [];
			setData(result);
		} catch (error) {
			console.error('Lỗi tải lịch sử:', error);
			message.error('Không thể tải lịch sử mượn!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchHistory();
	}, []);

	// Thống kê số lượng theo trạng thái
	const stats = useMemo<BorrowHistorySpace.HistoryStats>(() => {
		return {
			pending: data.filter((item) => item.status === 'PENDING').length,
			approved: data.filter((item) => item.status === 'APPROVED').length,
			rejected: data.filter((item) => item.status === 'REJECTED').length,
			returned: data.filter((item) => item.status === 'RETURNED').length,
		};
	}, [data]);

	// Lọc dữ liệu thông minh
	const filteredData = useMemo(() => {
		return data.filter((item) => {
			const searchLower = searchText.toLowerCase();
			const matchesSearch =
				item.device?.toLowerCase().includes(searchLower) || String(item.idRequest).includes(searchLower);

			const filterKey = STATUS_MAP[statusFilter];
			const matchesStatus = filterKey === 'ALL' || item.status === filterKey;

			return matchesSearch && matchesStatus;
		});
	}, [data, searchText, statusFilter]);

	// Xử lý hủy yêu cầu

	return {
		searchText,
		setSearchText,
		statusFilter,
		setStatusFilter,
		stats,
		filteredData,
		loading,
		fetchHistory,
	};
};
