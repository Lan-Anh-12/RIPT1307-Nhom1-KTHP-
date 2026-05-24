// src/pages/LichSuMuon/useBorrowHistory.ts
import { useState, useMemo } from 'react';
import { message, Modal } from 'antd';

// Dữ liệu giả lập khớp 100% với ảnh mẫu của bạn
const mockHistoryData = [
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
	const [data, setData] = useState(mockHistoryData);
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState('Tất cả');

	// 1. Tính toán số lượng cho các thẻ thống kê (Card stats) ở trên cùng
	const stats = useMemo(() => {
		return {
			pending: data.filter((item) => item.status === 'Chờ duyệt').length,
			approved: data.filter((item) => item.status === 'Đã duyệt').length,
			rejected: data.filter((item) => item.status === 'Từ chối').length,
			returned: data.filter((item) => item.status === 'Đã trả').length,
			overdue: data.filter((item) => item.status === 'Quá hạn').length,
		};
	}, [data]);

	// 2. Logic tìm kiếm văn bản và bộ lọc dropdown trạng thái
	const filteredData = useMemo(() => {
		return data.filter((item) => {
			const matchesSearch =
				item.key.toLowerCase().includes(searchText.toLowerCase()) ||
				item.deviceName.toLowerCase().includes(searchText.toLowerCase());

			const matchesStatus = statusFilter === 'Tất cả' || item.status === statusFilter;

			return matchesSearch && matchesStatus;
		});
	}, [data, searchText, statusFilter]);

	// 3. Logic xử lý khi người dùng nhấn nút Hủy yêu cầu (chỉ dùng cho đơn Chờ duyệt)
	const handleCancelRequest = (record: any) => {
		Modal.confirm({
			title: 'Xác nhận hủy yêu cầu',
			content: `Bạn có chắc chắn muốn hủy yêu cầu mượn thiết bị "${record.deviceName}" (${record.key}) không?`,
			okText: 'Hủy yêu cầu',
			okType: 'danger',
			cancelText: 'Đóng',
			centered: true,
			onOk: async () => {
				try {
					// Khi chạy thật, bạn sẽ gọi axios/fetch API xóa ở đây
					// Hiện tại ta lọc bỏ record này khỏi danh sách hiển thị để giả lập xóa thành công
					setData((prevData) => prevData.filter((item) => item.id !== record.id));
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
		handleCancelRequest,
	};
};
