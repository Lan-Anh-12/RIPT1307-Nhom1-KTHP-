import React from 'react';
import { useModel } from 'umi';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { LoginSpace } from '@/services/login/typing.d';

const LoginForm: React.FC = () => {
  // Lấy hàm xử lý và trạng thái xoay loading từ Model loginModel
  const { handleLogin, submitting } = useModel('login.loginModel');

  const onFinish = (values: LoginSpace.LoginParams) => {
    handleLogin(values);
  };

  return (
    <Form 
      name="login_form_component" 
      onFinish={onFinish} 
      layout="vertical"
      requiredMark={false}
    >
      {/* Trường Email - Đồng bộ LoginRequest.getEmail() ở Spring Boot */}
      <Form.Item
        label={<span style={{ fontWeight: 500, color: '#434343' }}>Địa chỉ Email</span>}
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập Email của bạn!' },
          { type: 'email', message: 'Định dạng Email không hợp lệ!' }
        ]}
      >
        <Input 
          prefix={<MailOutlined style={{ color: '#bfbfbf', marginRight: '4px' }} />} 
          placeholder="example@ptit.edu.vn" 
          size="large" 
          style={{ borderRadius: '6px' }}
        />
      </Form.Item>

      {/* Trường Mật khẩu - Đồng bộ với Spring Boot */}
      <Form.Item
        label={<span style={{ fontWeight: 500, color: '#434343' }}>Mật khẩu</span>}
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu bảo mật!' }]}
      >
        <Input.Password 
          prefix={<LockOutlined style={{ color: '#bfbfbf', marginRight: '4px' }} />} 
          placeholder="••••••••" 
          size="large" 
          style={{ borderRadius: '6px' }}
        />
      </Form.Item>

      {/* Nút bấm đăng nhập */}
      <Form.Item style={{ marginTop: '32px', marginBottom: '8px' }}>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={submitting} 
          block 
          size="large" 
          style={{ 
            borderRadius: '6px', 
            fontWeight: 500,
            height: '40px',
            boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)'
          }}
        >
          {submitting ? 'Đang xác thực...' : 'Đăng nhập'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;