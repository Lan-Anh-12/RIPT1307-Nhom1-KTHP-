import { useState, useCallback } from 'react';
import { login } from '@/services/login/api';
import { history, useModel } from 'umi';
import { message } from 'antd';
import { LoginSpace } from '@/services/login/typing';

interface LoginModelReturn {
  currentUser: { name?: string; role?: string } | null;
  submitting: boolean;
  handleLogin: (values: LoginSpace.LoginParams) => Promise<boolean>;
  handleLogout: () => Promise<void>;
}

export default function useLoginModel(): LoginModelReturn {
  const [currentUser, setCurrentUser] = useState<{ name?: string; role?: string } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { setInitialState } = useModel('@@initialState');

  const handleLogin = useCallback(async (values: LoginSpace.LoginParams): Promise<boolean> => {
    setSubmitting(true);
    
    try {
      const res = await login(values);
      
      // Kiểm tra nếu Backend trả về { token: '...' } trực tiếp
      // Nếu Backend bọc trong data, bạn có thể sửa thành: const { token, role, name } = res.data || res;
      const { token, role, name } = res; 

      if (token) {
        // 1. LƯU VÀO BROWSER STORAGE
        localStorage.setItem('token', token);
        localStorage.setItem('role', role || 'STUDENT');
        localStorage.setItem('userName', name || '');

        // 2. CẬP NHẬT TRẠNG THÁI TOÀN CỤC
        const userObj = { name: name || 'User', role: role || 'STUDENT' };
        setCurrentUser(userObj);

        // Lưu vào Umi InitialState để hệ thống phân quyền nhận biết
        await setInitialState((s) => ({
          ...s,
          currentUser: userObj,
        }));
        
        message.success(`Chào mừng ${name || 'bạn'} đã đăng nhập thành công!`);

        // 3. ĐIỀU HƯỚNG THEO VAI TRÒ
        if (role === 'ADMIN') {
          history.push('/admin/device-order');
        } else {
          history.push('/student/danh-sach-thiet-bi');      
        }
        return true;
      } else {
        message.error('Đăng nhập thất bại: Không nhận được token từ server.');
        return false;
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      // Xử lý thông báo lỗi từ server gửi về
      const errorMsg = error?.data?.message || error?.message || 'Tài khoản hoặc mật khẩu không chính xác!';
      message.error(errorMsg);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [setInitialState]);

  const handleLogout = useCallback(async () => {
    // Xóa sạch dấu vết phiên đăng nhập
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.clear();
    sessionStorage.clear();
    
    setCurrentUser(null);
    await setInitialState((s) => ({ ...s, currentUser: undefined }));
    
    // Đẩy về login
    history.replace('/login');
  }, [setInitialState]);

  return { currentUser, submitting, handleLogin, handleLogout };
}