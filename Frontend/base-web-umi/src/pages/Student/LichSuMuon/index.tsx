import React from 'react';
import { Input, Select, Card, Typography, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useBorrowHistory } from '../../../services/LichSuMuon/useBorrowHistory';
import HistoryTable from './HistoryTable';

const { Title, Paragraph, Text } = Typography;

const LichSuMuonThietBi: React.FC = () => {
	const { searchText, setSearchText, statusFilter, setStatusFilter, stats, filteredData, loading } = useBorrowHistory();

	return (
		<div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
			<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
				{/* Tiêu đề trang */}
				<div style={{ marginBottom: '24px' }}>
					<Title level={2} style={{ marginBottom: '4px' }}>
						Lịch sử mượn thiết bị
					</Title>
					<Paragraph type='secondary'>Xem lại các yêu cầu mượn thiết bị của bạn</Paragraph>
				</div>

				{/* Khối thẻ thống kê */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						gap: '16px',
						marginBottom: '24px',
					}}
				>
					{[
						{ label: 'Chờ duyệt', count: stats.pending },
						{ label: 'Đã duyệt', count: stats.approved },
						{ label: 'Từ chối', count: stats.rejected },
						{ label: 'Đã trả', count: stats.returned },
					].map((item, index) => (
						<Card
							key={index}
							bodyStyle={{ padding: '16px 20px' }}
							style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
						>
							<div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
								<Text type='secondary' style={{ fontSize: '14px', margin: 0 }}>
									{item.label}
								</Text>
								<span style={{ fontSize: '24px', fontWeight: 500, lineHeight: 1 }}>{item.count}</span>
							</div>
						</Card>
					))}
				</div>

				{/* Khu vực bộ lọc & Bảng hiển thị */}
				<Card style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} bodyStyle={{ padding: '20px' }}>
					<div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
						<Input
							placeholder='Tìm kiếm theo tên thiết bị hoặc mã yêu cầu...'
							prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							style={{ flex: 1, borderRadius: '6px' }}
							allowClear
						/>
						<Select
							value={statusFilter}
							onChange={(value) => setStatusFilter(value)}
							style={{ width: 140 }}
							options={[
								{ value: 'Tất cả', label: 'Tất cả' },
								{ value: 'Chờ duyệt', label: 'Chờ duyệt' },
								{ value: 'Đã duyệt', label: 'Đã duyệt' },
								{ value: 'Từ chối', label: 'Từ chối' },
								{ value: 'Đã trả', label: 'Đã trả' },
							]}
						/>
					</div>

					<Spin spinning={loading}>
						<HistoryTable dataSource={filteredData} />
					</Spin>
				</Card>
			</div>
		</div>
	);
};

export default LichSuMuonThietBi;
