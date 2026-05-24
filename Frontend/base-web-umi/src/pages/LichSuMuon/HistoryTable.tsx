// src/pages/LichSuMuon/HistoryTable.tsx
import React from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

// Định nghĩa các "đầu vào" (Props) mà bảng này cần nhận từ trang chính
interface HistoryTableProps {
	dataSource: any[];
	onCancel: (record: any) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ dataSource, onCancel }) => {
	// Mảng định nghĩa các cột được dời hẳn sang đây để quản lý
	const columns = [
		{
			title: 'Mã yêu cầu',
			dataIndex: 'key',
			key: 'key',
		},
		{
			title: 'Thiết bị',
			dataIndex: 'deviceName',
			key: 'deviceName',
			render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center' as const,
		},
		{
			title: 'Ngày mượn',
			dataIndex: 'startDate',
			key: 'startDate',
		},
		{
			title: 'Ngày trả dự kiến',
			dataIndex: 'endDate',
			key: 'endDate',
		},
		{
			title: 'Ngày trả thực tế',
			dataIndex: 'actualDate',
			key: 'actualDate',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			align: 'center' as const,
			render: (status: string) => {
				let color = 'default';
				if (status === 'Chờ duyệt') color = 'processing';
				if (status === 'Đã duyệt') color = 'success';
				if (status === 'Từ chối') color = 'error';
				if (status === 'Đã trả') color = 'default';
				if (status === 'Quá hạn') color = 'warning';
				return (
					<Tag color={color} style={{ minWidth: '80px', textAlign: 'center' }}>
						{status}
					</Tag>
				);
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			render: (_: any, record: any) => (
				<Space size='middle'>
					{record.status === 'Chờ duyệt' ? (
						<Button
							type='text'
							danger
							icon={<DeleteOutlined />}
							onClick={() => onCancel(record)} // Gọi hàm xử lý được truyền từ cha xuống
							style={{ padding: '0 4px' }}
						>
							Hủy
						</Button>
					) : (
						<span style={{ color: '#bfbfbf', fontSize: '12px' }}>—</span>
					)}
				</Space>
			),
		},
	];

	return (
		<Table
			columns={columns}
			dataSource={dataSource}
			pagination={{
				pageSize: 5,
				hideOnSinglePage: true,
				showTotal: (total) => `Hiển thị ${total} / ${total} yêu cầu`,
			}}
			style={{ borderRadius: '8px' }}
		/>
	);
};

export default HistoryTable;
