import { useState, useCallback } from 'react';
import { login } from '@/services/login/api';
import { history } from 'umi';
import { message } from 'antd';

export default function useLoginModel() {
  // Lưu trữ thông tin user đăng nhập (bao gồm tên và quyền)
  const [currentUser, setCurrentUser] = useState<{ name?: string; role?: string } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Xử lý đăng nhập 
  const handleLogin = useCallback(async (values: LoginSpace.LoginParams): Promise<boolean> => {
    setSubmitting(true);
    
    // 🌟 SẠCH SẼ: Không cần dùng "as any" nữa vì values đã chuẩn cấu trúc { email, password }
    const { email, password } = values;

    // ==========================================================================
    // 🌟 KHU VỰC ĐĂNG NHẬP TẠM THỜI (TEST MODE - BYPASS KHI BACKEND CHƯA CÓ)
    // ==========================================================================
    const isMockAdmin = email === 'admin@ptit.edu.vn' && password === 'admin123';
    const isMockStudent = email === 'sv@student.ptit.edu.vn' && password === '123456';

    if (isMockAdmin || isMockStudent) {
      try {
        // Tạo độ trễ ảo 800ms giả lập quá trình gọi mạng
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Cấu hình linh hoạt Role dựa trên tài khoản test nhập vào
        const mockToken = isMockAdmin ? 'mock-env-admin-token-2026' : 'mock-env-student-token-2026';
        const mockRole = isMockAdmin ? 'ADMIN' : 'STUDENT';
        const mockName = isMockAdmin ? 'Quản trị viên PTIT' : 'Sinh viên PTIT';

        // 1. Lưu các thông tin cần thiết vào localStorage để duy trì phiên đăng nhập
        localStorage.setItem('token', mockToken);
        localStorage.setItem('role', mockRole);
        localStorage.setItem('userName', mockName);

        // 2. Cập nhật vào State của Model
        setCurrentUser({ name: mockName, role: mockRole });
        
        message.success(`[Test Mode] Chào mừng ${mockName} đã đăng nhập!`);

        // 3. 🌟 RẼ NHÁNH ĐIỀU HƯỚNG CHO TÀI KHOẢN TEST
        if (mockRole === 'ADMIN') {
          history.push('/admin/device-order');
        } else {
          history.push('/student/borrow'); // Điều hướng trang sinh viên
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
      // Gọi API gửi loginRequest (email, password) sang Java
      const res = await login(values);
      
      const token = res?.token; 
      const role = res?.role; // Nhận về "ADMIN" hoặc "STUDENT" từ DB Java
      const name = res?.name; // Nhận về tên thực của User từ DB Java

      if (token) {
        // 1. Lưu thông tin bảo mật vào hệ thống trình duyệt
        localStorage.setItem('token', token);
        localStorage.setItem('role', role || 'STUDENT');
        localStorage.setItem('userName', name || '');

        // 2. Cập nhật trạng thái User hiện tại
        setCurrentUser({ name, role });
        
        message.success(`Chào mừng ${name || 'bạn'} đã đăng nhập thành công!`);

        // 3.  RẼ NHÁNH ĐIỀU HƯỚNG THỰC TẾ DỰA TRÊN ROLE CỦA BACKEND
        if (role === 'ADMIN') {
          history.push('/admin/device-order'); // Admin vào khu quản lý thiết bị
        } else {
          history.push('/student/borrow');     // Sinh viên vào giao diện đăng ký mượn
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
  }, []);

  // Xử lý Đăng xuất / Thoát tài khoản
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    setCurrentUser(null);
    history.push('/login');
  }, []);

  return {
    currentUser,
    submitting,
    handleLogin,
    handleLogout,
  };
}