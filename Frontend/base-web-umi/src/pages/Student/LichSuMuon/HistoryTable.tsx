import React from 'react';
import { Table, Tag, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

interface HistoryTableProps {
	dataSource: any[];
	onCancel: (record: any) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ dataSource, onCancel }) => {
	const columns = [
		{
			title: 'Mã yêu cầu',
			dataIndex: 'id',
			key: 'id',
			width: '140px',
			// Sinh mã hiển thị tự động từ ID thực tế của Database
			render: (id: number) => <span style={{ fontWeight: 600, color: '#1e293b' }}>REQ-{id}</span>,
		},
		{
			title: 'Tên thiết bị',
			dataIndex: 'deviceName',
			key: 'deviceName',
		},
		{
			title: 'SL',
			dataIndex: 'quantity',
			key: 'quantity',
			width: '60px',
			align: 'center' as const,
		},
		{
			title: 'Ngày mượn',
			dataIndex: 'requestDate', // 🌟 ĐÃ SỬA từ startDate
			key: 'requestDate',
			width: '120px',
		},
		{
			title: 'Hạn trả dự kiến',
			dataIndex: 'expectedReturnDate', // 🌟 ĐÃ SỬA từ endDate
			key: 'expectedReturnDate',
			width: '140px',
		},
		{
			title: 'Ngày trả thực tế',
			dataIndex: 'actualReturnDate', // 🌟 ĐÃ SỬA từ actualDate
			key: 'actualReturnDate',
			width: '140px',
			render: (text: string | null) => text || <span style={{ color: '#94a3b8' }}>—</span>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: '130px',
			align: 'center' as const,
			// Ánh xạ tag màu sắc dựa trên Enum từ API trả về
			render: (status: string) => {
				let color = 'default';
				let textVi = 'Không rõ';

				if (status === 'PENDING') {
					color = 'blue';
					textVi = 'Chờ duyệt';
				} else if (status === 'APPROVED') {
					color = 'orange';
					textVi = 'Đã duyệt';
				} else if (status === 'RETURNED') {
					color = 'green';
					textVi = 'Đã trả';
				} else if (status === 'REJECTED') {
					color = 'red';
					textVi = 'Từ chối';
				}

				return (
					<Tag color={color} style={{ borderRadius: '4px', fontWeight: 500 }}>
						{textVi}
					</Tag>
				);
			},
		},
		{
			title: 'Hành động',
			key: 'action',
			width: '130px',
			align: 'center' as const,
			render: (_: any, record: any) => {
				// Chỉ cho phép hiển thị nút Hủy yêu cầu khi trạng thái Backend là PENDING
				if (record.status === 'PENDING') {
					return (
						<Button
							type='text'
							danger
							icon={<CloseCircleOutlined />}
							onClick={() => onCancel(record)}
							style={{ display: 'inline-flex', alignItems: 'center', fontSize: '13px' }}
						>
							Hủy yêu cầu
						</Button>
					);
				}
				return <span style={{ color: '#94a3b8' }}>—</span>;
			},
		},
	];

	return (
		<Table
			dataSource={dataSource}
			columns={columns}
			rowKey='id'
			pagination={{ pageSize: 5, showTotal: (total) => `Tổng số ${total} yêu cầu` }}
			style={{ marginTop: '8px' }}
		/>
	);
};

export default HistoryTable;
