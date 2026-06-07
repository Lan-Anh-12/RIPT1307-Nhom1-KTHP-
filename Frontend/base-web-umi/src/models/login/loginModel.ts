import { useState, useCallback } from 'react';
import { login } from '@/services/login/api';
import { history, useModel } from 'umi';
import { message } from 'antd';
import { LoginSpace } from '@/services/login/typing';

interface UserInfo {
  id?: number;
  name?: string;
  role?: string;
}

interface LoginModelReturn {
  currentUser: UserInfo | null;
  submitting: boolean;
  handleLogin: (values: LoginSpace.LoginParams) => Promise<boolean>;
  handleLogout: () => Promise<void>;
}

export default function useLoginModel(): LoginModelReturn {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { setInitialState } = useModel('@@initialState');

  const handleLogin = useCallback(async (values: LoginSpace.LoginParams): Promise<boolean> => {
    setSubmitting(true);
    
    try {
      const res = await login(values);
      
      // SỬA: Lấy đúng tên trường 'userId' từ Backend trả về
      const { token, role, name, userId } = res; 

      if (token) {
        // 1. LƯU VÀO BROWSER STORAGE
        localStorage.setItem('token', token);
        localStorage.setItem('role', role || 'STUDENT');
        localStorage.setItem('userName', name || '');
        localStorage.setItem('userId', String(userId || ''));

        // 2. CẬP NHẬT TRẠNG THÁI TOÀN CỤC (gán userId vào thuộc tính id)
        const userObj: UserInfo = { id: userId, name: name || 'User', role: role || 'STUDENT' };
        setCurrentUser(userObj);

        // Lưu vào Umi InitialState
        await setInitialState((s) => ({
          ...s,
          currentUser: userObj,
        }));
        
        message.success(`Chào mừng ${name || 'bạn'} đã đăng nhập thành công!`);

        // 3. ĐIỀU HƯỚNG
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
      const errorMsg = error?.data?.message || error?.message || 'Tài khoản hoặc mật khẩu không chính xác!';
      message.error(errorMsg);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [setInitialState]);

  const handleLogout = useCallback(async () => {
    // Xóa sạch phiên đăng nhập
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.clear();
    sessionStorage.clear();
    
    setCurrentUser(null);
    await setInitialState((s) => ({ ...s, currentUser: undefined }));
    
    history.replace('/login');
  }, [setInitialState]);

  return { currentUser, submitting, handleLogin, handleLogout };
}