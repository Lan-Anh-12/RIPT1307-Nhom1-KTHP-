import { useState, useCallback } from 'react';
import { login } from '@/services/login/api';
import { history, useModel } from 'umi';
import { message } from 'antd';

// Định nghĩa interface trả về tường minh để giải quyết triệt để lỗi ts(7023)
interface LoginModelReturn {
  currentUser: { name?: string; role?: string } | null;
  submitting: boolean;
  handleLogin: (values: any) => Promise<boolean>;
  handleLogout: () => Promise<void>;
}

export default function useLoginModel(): LoginModelReturn {
  // Lưu trữ thông tin user đăng nhập cục bộ
  const [currentUser, setCurrentUser] = useState<{ name?: string; role?: string } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Lấy hàm setInitialState từ hệ thống phân quyền lõi của UmiJS
  const { setInitialState } = useModel('@@initialState');

  // Xử lý đăng nhập (Nhận values: any để tránh lỗi lệch cấu trúc namespace)
  const handleLogin = useCallback(async (values: any): Promise<boolean> => {
    setSubmitting(true);
    const { email, password } = values;

    // ==========================================================================
    // 🌟 KHU VỰC ĐĂNG NHẬP TẠM THỜI (TEST MODE - BYPASS KHI BACKEND CHƯA CÓ)
    // ==========================================================================
    const isMockAdmin = email === 'admin@ptit.edu.vn' && password === 'admin123';
    const isMockStudent = email === 'sv@student.ptit.edu.vn' && password === '123456';

    if (isMockAdmin || isMockStudent) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockToken = isMockAdmin ? 'mock-env-admin-token-2026' : 'mock-env-student-token-2026';
        const mockRole = isMockAdmin ? 'ADMIN' : 'STUDENT';
        const mockName = isMockAdmin ? 'Quản trị viên PTIT' : 'Sinh viên PTIT';

        // 1. Lưu vào localStorage duy trì phiên khi F5
        localStorage.setItem('token', mockToken);
        localStorage.setItem('role', mockRole);
        localStorage.setItem('userName', mockName);

        // 2. Cập nhật Model cục bộ
        setCurrentUser({ name: mockName, role: mockRole });

        // 🎯 ĐỒNG BỘ RAM HỆ THỐNG: Đập tan vòng lặp vô tận
        await setInitialState((s) => ({
          ...s,
          currentUser: { name: mockName, role: mockRole },
        }));
        
        message.success(`[Test Mode] Chào mừng ${mockName} đã đăng nhập!`);

        // 3. Rẽ nhánh điều hướng trực tiếp
        if (mockRole === 'ADMIN') {
          history.push('/admin/device-order');
        } else {
          history.push('/student/danh-sach-thiet-bi');
        }
        return true;
      } finally {
        setSubmitting(false);
      }
    }

    // ==========================================================================
    // --- LUỒNG CHẠY GỐC KẾT NỐI VỚI BACKEND JAVA ---
    // ==========================================================================
    try {
      const res = await login(values);
      const token = res?.token; 
      const role = res?.role; 
      const name = res?.name; 

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role || 'STUDENT');
        localStorage.setItem('userName', name || '');

        setCurrentUser({ name, role });

        // 🎯 ĐỒNG BỘ RAM HỆ THỐNG: Áp dụng luồng thật
        await setInitialState((s) => ({
          ...s,
          currentUser: {
            name: name || 'User',
            role: (role || 'STUDENT') as 'ADMIN' | 'STUDENT',
          },
        }));
        
        message.success(`Chào mừng ${name || 'bạn'} đã đăng nhập thành công!`);

        if (role === 'ADMIN') {
          history.push('/admin/device-order');
        } else {
          history.push('/student/danh-sach-thiet-bi');      
        }
        return true;
      } else {
        message.error('Hệ thống lỗi: Không nhận được Token bảo mật từ Server!');
        return false;
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập hệ thống:', error);
      const errorMsg = error?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác!';
      message.error(errorMsg);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [setInitialState]);

  // Xử lý Đăng xuất / Thoát tài khoản mượt mà không dính 403
  const handleLogout = useCallback(async () => {
    // 🎯 ĐIỀU HƯỚNG TRƯỚC: Đưa về vùng an toàn (Login) trước khi hủy Token để tránh lỗi 403 ở trang Admin cũ
    history.replace('/login');

    // XÓA DỮ LIỆU SAU
    localStorage.clear();
    sessionStorage.clear();
    setCurrentUser(null);
    await setInitialState((s) => ({ ...s, currentUser: undefined }));
  }, [setInitialState]);

  return {
    currentUser,
    submitting,
    handleLogin,
    handleLogout,
  };
}