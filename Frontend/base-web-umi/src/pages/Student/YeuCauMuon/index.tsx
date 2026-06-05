import React from 'react';
import { Form, Select, DatePicker, Button, Input, Space, Typography, Card } from 'antd';
import { MinusOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
// ĐÃ CHỈNH SỬA: Đường dẫn nhảy ra thư mục services
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
						{/* Chọn thiết bị */}
						<Form.Item
							label={<span style={{ fontWeight: 600 }}>Chọn thiết bị</span>}
							name='deviceId'
							rules={[{ required: true, message: 'Vui lòng chọn thiết bị muốn mượn!' }]}
						>
							<Select placeholder='-- Chọn thiết bị --' size='large' style={{ borderRadius: '6px' }}>
								{deviceOptions.map((device) => (
									<Select.Option key={device.id} value={device.id}>
										{device.name} (Kho: {device.stock})
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						{/* Cụm Ngày mượn & Ngày trả */}
						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
							<Form.Item
								label={<span style={{ fontWeight: 600 }}>Ngày mượn</span>}
								name='startDate'
								rules={[{ required: true, message: 'Chọn ngày mượn!' }]}
							>
								<DatePicker
									placeholder='mm/dd/yyyy'
									size='large'
									style={{ width: '100%', borderRadius: '6px' }}
									format='MM/DD/YYYY'
								/>
							</Form.Item>

							<Form.Item
								label={<span style={{ fontWeight: 600 }}>Ngày trả dự kiến</span>}
								name='endDate'
								rules={[
									{ required: true, message: 'Chọn ngày trả dự kiến!' },
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || !getFieldValue('startDate') || value.isAfter(getFieldValue('startDate'))) {
												return Promise.resolve();
											}
											return Promise.reject(new Error('Ngày trả phải sau ngày mượn!'));
										},
									}),
								]}
							>
								<DatePicker
									placeholder='mm/dd/yyyy'
									size='large'
									style={{ width: '100%', borderRadius: '6px' }}
									format='MM/DD/YYYY'
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

						{/* Cụm nút bấm */}
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
