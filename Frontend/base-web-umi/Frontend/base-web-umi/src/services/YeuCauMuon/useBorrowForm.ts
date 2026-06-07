import { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { useLocation, history } from 'umi';
import { getActiveDevices, createBorrowRequest } from './api';

export const useBorrowForm = () => {
	const [form] = Form.useForm();
	const location = useLocation();
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [devices, setDevices] = useState<any[]>([]);

	useEffect(() => {
		const fetchDevices = async () => {
			try {
				const response = await getActiveDevices();
				const deviceList = Array.isArray(response) ? response : [];
				setDevices(deviceList);
			} catch (error) {
				message.error('Không thể tải danh sách thiết bị!');
			}
		};
		fetchDevices();
	}, []);

	// Tự động điền thiết bị từ URL params
	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const deviceIdFromUrl = searchParams.get('deviceId');

		if (deviceIdFromUrl && devices.length > 0) {
			form.setFieldsValue({
				deviceItemId: Number(deviceIdFromUrl),
				quantity: 1,
			});
		}
	}, [location.search, devices, form]);

	// Lấy số lượng tồn kho của thiết bị đang chọn
	const getCurrentDeviceMaxQty = (): number => {
		const selectedDeviceId = form.getFieldValue('deviceItemId');
		if (!selectedDeviceId) return Infinity;

		const currentDevice = devices.find((d) => d.id === Number(selectedDeviceId));
		return currentDevice ? currentDevice.quantity ?? 0 : 0;
	};

	// Chặn bấm nút tăng quá số lượng tồn kho
	const changeQuantity = (amount: number) => {
		const currentQty = form.getFieldValue('quantity') || 1;
		const maxAvailable = getCurrentDeviceMaxQty();

		let newQty = currentQty + amount;

		if (newQty < 1) newQty = 1;
		if (newQty > maxAvailable) {
			message.warning(`Thiết bị này hiện tại chỉ còn tối đa ${maxAvailable} sản phẩm trong kho!`);
			newQty = maxAvailable;
		}

		form.setFieldsValue({ quantity: newQty });
	};

	const handleSubmit = async (values: any) => {
		if (!values.requestDate || !values.expectedReturnDate) {
			message.warning('Vui lòng chọn đầy đủ ngày mượn và ngày trả!');
			return;
		}

		if (!values.quantity || Number(values.quantity) <= 0) {
			message.error('Số lượng thiết bị mượn phải lớn hơn 0!');
			return;
		}

		// Kiểm tra tồn kho trước khi submit (chặn gõ tay số lượng lớn)
		const maxAvailable = getCurrentDeviceMaxQty();
		if (Number(values.quantity) > maxAvailable) {
			message.error(
				`Không thể mượn! Số lượng yêu cầu (${values.quantity}) lớn hơn số lượng tồn kho hiện tại (${maxAvailable}).`,
			);
			return;
		}

		const userId = localStorage.getItem('userId');
		if (!userId) {
			message.error('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại!');
			history.push('/login');
			return;
		}

		setSubmitting(true);
		try {
			const payload = {
				id: Number(userId),
				deviceItemId: Number(values.deviceItemId),
				quantity: Number(values.quantity),
				requestDate: values.requestDate.format('YYYY-MM-DD'),
				expectedReturnDate: values.expectedReturnDate.format('YYYY-MM-DD'),
			};

			console.log('Payload gửi đi:', JSON.stringify(payload));

			await createBorrowRequest(payload);

			message.success('Gửi yêu cầu mượn thiết bị thành công!');
			form.resetFields();
			history.push('/student/lich-su-muon');
		} catch (error: any) {
			const errorMsg = error?.response?.data?.message || 'Gửi yêu cầu thất bại! Vui lòng kiểm tra lại thông tin.';
			message.error(errorMsg);
			console.error('Lỗi API:', error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		history.goBack();
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
