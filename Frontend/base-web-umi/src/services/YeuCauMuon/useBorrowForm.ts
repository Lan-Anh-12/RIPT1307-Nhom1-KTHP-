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
                // Đảm bảo dữ liệu là mảng
                setDevices(Array.isArray(response) ? response : []);
            } catch (error) {
                message.error('Không thể tải danh sách thiết bị!');
            }
        };
        fetchDevices();
    }, []);

    const changeQuantity = (amount: number) => {
        const currentQty = form.getFieldValue('quantity') || 1;
        const newQty = Math.max(1, currentQty + amount);
        form.setFieldsValue({ quantity: newQty });
    };

    const handleSubmit = async (values: any) => {
        // Kiểm tra validate date trước khi gửi
        if (!values.requestDate || !values.expectedReturnDate) {
            message.warning('Vui lòng chọn đầy đủ ngày mượn và ngày trả!');
            return;
        }

        // Lấy userId từ localStorage (cần thiết để khớp với trường 'id' trong DTO của Backend)
        const userId = localStorage.getItem('userId');
        if (!userId) {
            message.error('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại!');
            history.push('/login');
            return;
        }

        setSubmitting(true);
        try {
            // Định dạng đúng chuẩn YYYY-MM-DD mà Java @RequestBody mong đợi
            const payload = {
                id: Number(userId), // Truyền ID người dùng để Backend xác định chủ sở hữu đơn
                deviceItemId: Number(values.deviceItemId),
                quantity: Number(values.quantity),
                requestDate: values.requestDate.format('YYYY-MM-DD'),
                expectedReturnDate: values.expectedReturnDate.format('YYYY-MM-DD'),
            };

            console.log("Payload gửi đi:", JSON.stringify(payload));

            await createBorrowRequest(payload);
            
            message.success('Gửi yêu cầu mượn thiết bị thành công!');
            form.resetFields();
            history.push('/student/lich-su-muon');
        } catch (error: any) {
            // Hiển thị chi tiết lỗi từ server nếu có
            const errorMsg = error?.response?.data?.message || 'Gửi yêu cầu thất bại! Vui lòng kiểm tra lại thông tin.';
            message.error(errorMsg);
            console.error("Lỗi API:", error);
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
        handleCancel 
    };
};