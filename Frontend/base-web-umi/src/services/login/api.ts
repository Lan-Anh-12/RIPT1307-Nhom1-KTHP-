import { request } from 'umi';

const BASE_URL = 'https://ript1307-nhom1-kthp.onrender.com';

/**
 * API Đăng nhập hệ thống (Dùng chung cho cả Admin và Sinh viên)
 * @param data Object chứa chính xác { email, password }
 */
export async function login(data: LoginSpace.LoginParams) {
  return request<LoginSpace.LoginResponse>(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    data, 
  });
}
