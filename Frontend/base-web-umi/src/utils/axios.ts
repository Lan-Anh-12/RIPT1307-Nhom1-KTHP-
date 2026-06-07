import { notification, message } from 'antd';
import axios, { AxiosError } from 'axios';
import { history } from 'umi';

const instance = axios.create({
  baseURL: 'https://ript1307-nhom1-kthp.onrender.com',
  timeout: 15000, // Tăng lên 15s vì server render thường phản hồi chậm lần đầu
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Interceptor Request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Interceptor Response
instance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<any>) => {
    const { response } = error;

    if (!response) {
      message.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!');
      return Promise.reject(error);
    }

    const { status, data } = response;

    switch (status) {
      case 401:
        notification.error({
          message: 'Phiên đăng nhập đã hết hạn',
          description: 'Vui lòng đăng nhập lại để tiếp tục.',
        });
        localStorage.removeItem('token');
        history.push('/user/login');
        break;

      case 403:
        notification.error({
          message: 'Quyền truy cập bị từ chối',
          description: 'Bạn không có quyền thực hiện hành động này.',
        });
        break;

      case 404:
        notification.warning({
          message: 'Không tìm thấy dữ liệu',
          description: 'Tài nguyên bạn yêu cầu không tồn tại trên hệ thống.',
        });
        break;

      case 500:
        notification.error({
          message: 'Lỗi hệ thống',
          description: 'Máy chủ đang gặp sự cố, vui lòng thử lại sau.',
        });
        break;

      default:
        const errorMessage = data?.message || data?.error || 'Có lỗi xảy ra!';
        notification.error({
          message: `Lỗi ${status}`,
          description: errorMessage,
        });
        break;
    }

    return Promise.reject(error);
  },
);

export default instance;