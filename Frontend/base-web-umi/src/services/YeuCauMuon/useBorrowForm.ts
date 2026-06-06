import { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useLocation, history } from 'umi';
import moment from 'moment';
import { getActiveDevices, createBorrowRequest } from './api';

export const useBorrowForm = () => {
	const [form] = Form.useForm<BorrowRequestSpace.FormValues>();
	const location = useLocation();
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [devices, setDevices] = useState<BorrowRequestSpace.DeviceModel[]>([]);

	// 🔄 Lấy danh sách thiết bị thật từ Backend
	useEffect(() => {
		const fetchDevices = async () => {
			try {
				const response = await getActiveDevices();
				if (response && Array.isArray(response)) {
					setDevices(response);
				}
			} catch (error) {
				message.error('Không thể tải danh sách thiết bị từ hệ thống máy chủ!');
			}
		};
		fetchDevices();
	}, []);

	// 🎯 Tự động điền ID thiết bị nếu sinh viên bấm từ trang Chi tiết sang
	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const deviceIdFromUrl = searchParams.get('deviceId');

		if (deviceIdFromUrl) {
			form.setFieldsValue({ deviceItemId: Number(deviceIdFromUrl) });
		}
	}, [location.search, form]);

	// Hàm điều chỉnh số lượng mượn nhanh bằng nút bấm
	const changeQuantity = (amount: number) => {
		const currentQty = form.getFieldValue('quantity') || 1;
		const newQty = Math.max(1, currentQty + amount);
		form.setFieldsValue({ quantity: newQty });
	};

	// 🚀 Bấm nút gửi đơn - Đẩy thẳng data xuống Backend thật của Lan Anh
	const handleSubmit = async (values: BorrowRequestSpace.FormValues) => {
		setSubmitting(true);
		try {
			// Khớp chuẩn 100% thuộc tính của BorrowCreateRequestDTO.java
			const payload: BorrowRequestSpace.CreateBorrowPayload = {
				requestDate: moment().format('YYYY-MM-DD'), // Ngày hôm nay
				expectedReturnDate: values.expectedReturnDate?.format('YYYY-MM-DD'), // Ngày hẹn trả
				deviceItemId: Number(values.deviceItemId),
				quantity: values.quantity,
			};

			// Gọi API thật xuống Backend
			const res = await createBorrowRequest(payload);

			message.success(res?.message || 'Gửi yêu cầu mượn thiết bị thành công! Đang chờ phê duyệt.');
			form.resetFields();
			form.setFieldsValue({ quantity: 1 });

			// Chuyển hướng về trang lịch sử mượn để sinh viên theo dõi đơn
			history.push('/lich-su-muon');
		} catch (error: any) {
			console.error('Lỗi API create request:', error);
			message.error(error?.data?.message || 'Gửi yêu cầu thất bại. Vui lòng kiểm tra lại!');
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		form.setFieldsValue({ quantity: 1 });
		message.info('Đã hủy nhập đơn yêu cầu.');
		history.push('/thiet-bi'); // Hủy thì quay lại trang danh sách
	};

	return {
		form,
		submitting,
		deviceOptions: devices,
		changeQuantity,
		handleSubmit,
		handleCancel,
	};
};
