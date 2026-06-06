declare namespace LoginSpace {
  /**
   * Cấu hình tham số gửi lên API Đăng nhập
   */
  interface LoginParams {
    email?: string;       // private String email;
    password?: string;    // private String password;
  }

  /**
   * Cấu hình dữ liệu nhận về từ API Đăng nhập (Response)
   */
  interface LoginResponse {
    token?: string;
    role?: 'ADMIN' | 'STUDENT' | string;
    name?: string;
  }
}