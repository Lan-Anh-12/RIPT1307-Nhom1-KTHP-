import { useState, useMemo, useEffect } from 'react';
import { message, Modal } from 'antd';
import { getBorrowHistoryList, cancelBorrowRequest } from './api';

// Bật true để test giao diện bằng data mẫu, bật false để gọi API thật từ Database
const IS_MOCK = true;

const mockHistoryData: BorrowHistorySpace.HistoryItem[] = [
	{
		id: '1',
		key: 'REQ-2025-001',
		deviceName: 'Máy chiếu Epson EB-X51',
		quantity: 1,
		startDate: '2025-05-10',
		endDate: '2025-05-17',
		actualDate: '2025-05-16',
		status: 'Đã trả',
	},
	{
		id: '2',
		key: 'REQ-2025-002',
		deviceName: 'Máy tính xách tay Dell Latitude 5520',
		quantity: 1,
		startDate: '2025-05-15',
		endDate: '2025-05-22',
		actualDate: '—',
		status: 'Đã duyệt',
	},
	{
		id: '3',
		key: 'REQ-2025-005',
		deviceName: 'Bộ đàm Motorola CP1660',
		quantity: 3,
		startDate: '2025-04-20',
		endDate: '2025-04-27',
		actualDate: '2025-04-26',
		status: 'Đã trả',
	},
	{
		id: '4',
		key: 'REQ-2025-010',
		deviceName: 'Màn hình LED Samsung 55 inch',
		quantity: 1,
		startDate: '2025-05-22',
		endDate: '2025-05-29',
		actualDate: '—',
		status: 'Chờ duyệt',
	},
];

export const useBorrowHistory = () => {
	const [data, setData] = useState<BorrowHistorySpace.HistoryItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchText, setSearchText] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

	// Hàm gọi dữ liệu động
	const fetchHistory = async () => {
		setLoading(true);
		try {
			if (IS_MOCK) {
				await new Promise((resolve) => setTimeout(resolve, 500));
				setData(mockHistoryData);
			} else {
				const response = await getBorrowHistoryList();
				if (response && response.data) {
					setData(response.data);
				}
			}
		} catch (error) {
			message.error('Không thể tải lịch sử mượn từ hệ thống!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchHistory();
	}, []);

	// 1. Tính toán số lượng cho các thẻ thống kê tự động
	const stats = useMemo<BorrowHistorySpace.HistoryStats>(() => {
		return {
			pending: data.filter((item) => item.status === 'Chờ duyệt').length,
			approved: data.filter((item) => item.status === 'Đã duyệt').length,
			rejected: data.filter((item) => item.status === 'Từ chối').length,
			returned: data.filter((item) => item.status === 'Đã trả').length,
			overdue: data.filter((item) => item.status === 'Quá hạn').length,
		};
	}, [data]);

	// 2. Bộ lọc tìm kiếm và trạng thái đơn mượn
	const filteredData = useMemo(() => {
		return data.filter((item) => {
			const matchesSearch =
				item.key.toLowerCase().includes(searchText.toLowerCase()) ||
				item.deviceName.toLowerCase().includes(searchText.toLowerCase());

			const matchesStatus = statusFilter === 'Tất cả' || item.status === statusFilter;

			return matchesSearch && matchesStatus;
		});
	}, [data, searchText, statusFilter]);

	// 3. Logic xử lý khi người dùng nhấn hủy yêu cầu đơn mượn
	const handleCancelRequest = (record: BorrowHistorySpace.HistoryItem) => {
		Modal.confirm({
			title: 'Xác nhận hủy yêu cầu',
			content: `Bạn có chắc chắn muốn hủy yêu cầu mượn thiết bị "${record.deviceName}" (${record.key}) không?`,
			okText: 'Hủy yêu cầu',
			okType: 'danger',
			cancelText: 'Đóng',
			centered: true,
			onOk: async () => {
				try {
					if (IS_MOCK) {
						await new Promise((resolve) => setTimeout(resolve, 500));
						setData((prevData) => prevData.filter((item) => item.id !== record.id));
					} else {
						await cancelBorrowRequest(record.id);
						await fetchHistory(); // Tải lại danh sách mới nhất từ DB sau khi xóa thành công
					}
					message.success(`Đã hủy thành công yêu cầu ${record.key}`);
				} catch (error) {
					message.error('Không thể hủy yêu cầu, vui lòng thử lại sau.');
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
