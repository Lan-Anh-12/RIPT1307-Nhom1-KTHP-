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
			dataIndex: 'key',
			key: 'key',
			width: '140px',
			render: (text: string) => <span style={{ fontWeight: 600, color: '#1e293b' }}>{text}</span>,
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
			dataIndex: 'startDate',
			key: 'startDate',
			width: '120px',
		},
		{
			title: 'Hạn trả dự kiến',
			dataIndex: 'endDate',
			key: 'endDate',
			width: '130px',
		},
		{
			title: 'Ngày trả thực tế',
			dataIndex: 'actualDate',
			key: 'actualDate',
			width: '130px',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: '120px',
			align: 'center' as const,
			render: (status: string) => {
				let color = 'default';
				if (status === 'Chờ duyệt') color = 'blue';
				if (status === 'Đã duyệt') color = 'orange';
				if (status === 'Đã trả') color = 'green';
				if (status === 'Từ chối') color = 'red';
				if (status === 'Quá hạn') color = 'magenta';
				return (
					<Tag color={color} style={{ borderRadius: '4px', fontWeight: 500 }}>
						{status}
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
				// Chỉ hiển thị nút hủy khi đơn ở trạng thái Chờ duyệt
				if (record.status === 'Chờ duyệt') {
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
