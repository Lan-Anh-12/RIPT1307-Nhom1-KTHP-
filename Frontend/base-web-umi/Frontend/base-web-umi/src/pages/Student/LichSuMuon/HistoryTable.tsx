import React from 'react';
import { Table, Tag } from 'antd';

interface HistoryTableProps {
	dataSource: any[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({ dataSource }) => {
	const columns = [
		{
			title: 'Mã yêu cầu',
			dataIndex: 'idRequest',
			key: 'idRequest',
			width: '140px',
			render: (idRequest: number) => <span style={{ fontWeight: 600, color: '#1e293b' }}>REQ-{idRequest}</span>,
		},
		{
			title: 'Tên thiết bị',
			dataIndex: 'device',
			key: 'device',
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
			dataIndex: 'requestDate',
			key: 'requestDate',
			width: '120px',
		},
		{
			title: 'Hạn trả dự kiến',
			dataIndex: 'expectedReturnDate',
			key: 'expectedReturnDate',
			width: '140px',
		},
		{
			title: 'Ngày trả thực tế',
			dataIndex: 'actualReturnDate',
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
			render: (status: string) => {
				const s = String(status || '')
					.toUpperCase()
					.trim();
				let color = 'default';
				let textVi = 'Không rõ';

				switch (s) {
					case 'PENDING':
						color = 'blue';
						textVi = 'Chờ duyệt';
						break;
					case 'APPROVED':
						color = 'orange';
						textVi = 'Đã duyệt';
						break;
					case 'RETURNED':
						color = 'green';
						textVi = 'Đã trả';
						break;
					case 'REJECTED':
						color = 'red';
						textVi = 'Từ chối';
						break;
				}

				return (
					<Tag color={color} style={{ borderRadius: '4px', fontWeight: 500 }}>
						{textVi}
					</Tag>
				);
			},
		},
	];

	return (
		<Table
			dataSource={dataSource}
			columns={columns}
			rowKey='idRequest'
			pagination={{ pageSize: 5, showTotal: (total) => `Tổng số ${total} yêu cầu` }}
			style={{ marginTop: '8px' }}
		/>
	);
};

export default HistoryTable;
