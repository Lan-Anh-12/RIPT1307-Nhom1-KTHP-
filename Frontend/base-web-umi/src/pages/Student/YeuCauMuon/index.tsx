import React from 'react';
import { Form, Select, DatePicker, Button, Input, Space, Typography, Card } from 'antd';
import { MinusOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import moment from 'moment';
// Đường dẫn gọi hook dịch vụ kết nối Backend thật
import { useBorrowForm } from '../../../services/YeuCauMuon/useBorrowForm';

const { Title, Paragraph } = Typography;

const YeuCauMuonThietBi: React.FC = () => {
	const { form, submitting, deviceOptions, changeQuantity, handleSubmit, handleCancel } = useBorrowForm();

	return (
		<div style={{ padding: '0 16px', minHeight: '100vh', overflow: 'hidden' }}>
			<div style={{ marginBottom: '24px' }}>
				<Title level={2} style={{ marginBottom: '4px' }}>
					Yêu cầu mượn thiết bị
				</Title>
				<Paragraph type='secondary'>Điền thông tin để gửi yêu cầu mượn thiết bị</Paragraph>
			</div>

			<div style={{ width: '100%', maxWidth: '560px', margin: '40px auto' }}>
				<Card
					style={{
						borderRadius: '12px',
						boxShadow: '0 4px 14px rgba(0, 0, 0, 0.02)',
						border: '1px solid #e2e8f0',
					}}
				>
					<Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{ quantity: 1 }}>
						{/* Chọn thiết bị - Đã đồng bộ trường deviceItemId khớp Backend */}
						<Form.Item
							label={<span style={{ fontWeight: 600 }}>Chọn thiết bị</span>}
							name='deviceItemId'
							rules={[{ required: true, message: 'Vui lòng chọn thiết bị muốn mượn!' }]}
						>
							<Select placeholder='-- Chọn thiết bị --' size='large' style={{ borderRadius: '6px' }}>
								{deviceOptions.map((device) => (
									/* Đã đồng bộ thuộc tính quantity thay cho stock */
									<Select.Option key={device.id} value={device.id}>
										{device.name} (Kho: {device.quantity ?? 0})
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						{/* Cụm Ngày mượn & Ngày trả */}
						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
							{/* Ngày mượn: Khóa hiển thị mặc định là ngày hôm nay, Backend tự động xử lý ngày tạo */}
							<Form.Item label={<span style={{ fontWeight: 600 }}>Ngày mượn (Hôm nay)</span>}>
								<DatePicker
									defaultValue={moment()}
									disabled
									size='large'
									style={{ width: '100%', borderRadius: '6px', background: '#f5f5f5' }}
									format='MM/DD/YYYY'
								/>
							</Form.Item>

							{/* Ngày trả dự kiến - Đã đồng bộ trường expectedReturnDate khớp Backend */}
							<Form.Item
								label={<span style={{ fontWeight: 600 }}>Ngày trả dự kiến</span>}
								name='expectedReturnDate'
								rules={[
									{ required: true, message: 'Chọn ngày trả dự kiến!' },
									() => ({
										validator(_, value) {
											// Ràng buộc logic: Ngày hẹn trả phải từ ngày mai trở đi
											if (!value || value.isAfter(moment().endOf('day'))) {
												return Promise.resolve();
											}
											return Promise.reject(new Error('Ngày trả phải sau ngày hôm nay!'));
										},
									}),
								]}
							>
								<DatePicker
									placeholder='mm/dd/yyyy'
									size='large'
									style={{ width: '100%', borderRadius: '6px' }}
									format='MM/DD/YYYY'
									disabledDate={(current) => current && current < moment().endOf('day')}
								/>
							</Form.Item>
						</div>

						{/* Tăng giảm Số lượng */}
						<Form.Item
							label={<span style={{ fontWeight: 600 }}>Số lượng</span>}
							name='quantity'
							rules={[{ required: true }]}
							style={{ marginBottom: '24px' }}
						>
							<Space>
								<Button
									icon={<MinusOutlined />}
									onClick={() => changeQuantity(-1)}
									style={{ borderRadius: '6px', height: '40px', width: '40px' }}
								/>
								<Form.Item name='quantity' noStyle>
									<Input
										readOnly
										style={{
											width: '60px',
											textAlign: 'center',
											height: '40px',
											borderRadius: '6px',
											fontWeight: 'bold',
										}}
									/>
								</Form.Item>
								<Button
									icon={<PlusOutlined />}
									onClick={() => changeQuantity(1)}
									style={{ borderRadius: '6px', height: '40px', width: '40px' }}
								/>
							</Space>
						</Form.Item>

						{/* Cụm nút bấm hành động */}
						<Form.Item style={{ marginBottom: 0, marginTop: '16px' }}>
							<Space size='middle'>
								<Button
									type='primary'
									htmlType='submit'
									loading={submitting}
									icon={<SendOutlined />}
									style={{
										background: '#00b96b',
										borderColor: '#00b96b',
										height: '40px',
										padding: '0 24px',
										borderRadius: '6px',
										fontWeight: '600',
									}}
								>
									Gửi yêu cầu
								</Button>
								<Button
									onClick={handleCancel}
									style={{
										height: '40px',
										padding: '0 24px',
										borderRadius: '6px',
										color: '#64748b',
									}}
								>
									Hủy
								</Button>
							</Space>
						</Form.Item>
					</Form>
				</Card>
			</div>
		</div>
	);
};

export default YeuCauMuonThietBi;
