import { useState, useMemo, useEffect } from 'react';
import { message, Modal } from 'antd';
import { getBorrowHistoryList, cancelBorrowRequest } from './api';

export const useBorrowHistory = () => {
	const [data, setData] = useState<BorrowHistorySpace.HistoryItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchText, setSearchText] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

	// Gọi dữ liệu lịch sử mượn thực tế từ Server
	const fetchHistory = async () => {
		setLoading(true);
		try {
			const response = await getBorrowHistoryList();
			if (response && Array.isArray(response)) {
				setData(response);
			}
		} catch (error) {
			message.error('Không thể tải lịch sử mượn từ hệ thống máy chủ!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchHistory();
	}, []);

	// 1. Tính toán số lượng cho các thẻ thống kê tự động dựa trên Enum
	const stats = useMemo<BorrowHistorySpace.HistoryStats>(() => {
		return {
			pending: data.filter((item) => item.status === 'PENDING').length,
			approved: data.filter((item) => item.status === 'APPROVED').length,
			rejected: data.filter((item) => item.status === 'REJECTED').length,
			returned: data.filter((item) => item.status === 'RETURNED').length,
		};
	}, [data]);

	// 2. Bộ lọc tìm kiếm theo tên thiết bị và trạng thái tương ứng trên giao diện
	const filteredData = useMemo(() => {
		return data.filter((item) => {
			const matchesSearch = item.deviceName?.toLowerCase().includes(searchText.toLowerCase());

			// Ánh xạ trạng thái tiếng Việt từ giao diện sang Enum Backend để lọc
			let matchesStatus = false;
			if (statusFilter === 'Tất cả') matchesStatus = true;
			else if (statusFilter === 'Chờ duyệt' && item.status === 'PENDING') matchesStatus = true;
			else if (statusFilter === 'Đã duyệt' && item.status === 'APPROVED') matchesStatus = true;
			else if (statusFilter === 'Từ chối' && item.status === 'REJECTED') matchesStatus = true;
			else if (statusFilter === 'Đã trả' && item.status === 'RETURNED') matchesStatus = true;

			return matchesSearch && matchesStatus;
		});
	}, [data, searchText, statusFilter]);

	// 3. Logic xử lý khi sinh viên nhấn hủy đơn mượn (Chỉ cho phép khi trạng thái là PENDING)
	const handleCancelRequest = (record: BorrowHistorySpace.HistoryItem) => {
		if (record.status !== 'PENDING') {
			message.warning('Không thể hủy đơn hàng đã được xử lý!');
			return;
		}

		Modal.confirm({
			title: 'Xác nhận hủy yêu cầu',
			content: `Bạn có chắc chắn muốn hủy yêu cầu mượn thiết bị "${record.deviceName}" này không?`,
			okText: 'Hủy yêu cầu',
			okType: 'danger',
			cancelText: 'Đóng',
			centered: true,
			onOk: async () => {
				try {
					await cancelBorrowRequest(record.id);
					message.success('Đã hủy thành công yêu cầu mượn thiết bị!');
					await fetchHistory(); // Gọi lại hàm cập nhật danh sách mới từ DB
				} catch (error: any) {
					message.error(error?.data?.message || 'Không thể hủy yêu cầu, vui lòng thử lại sau.');
				}
			},
		});
	};

	return {
		searchText,
		setSearchText,
		statusFilter,
		setStatusFilter,
		stats,
		filteredData,
		loading,
		handleCancelRequest,
	};
};
