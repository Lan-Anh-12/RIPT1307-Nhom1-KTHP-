import React from 'react';
import { Row, Col, Card } from 'antd';
import LoginForm from './form'; // 

const LoginPage: React.FC = () => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#f0f2f5',
        padding: '0 16px'
      }}
    >
      <Row justify="center" style={{ width: '100%' }}>
        <Col xs={24} sm={18} md={12} lg={8} xl={6}>
          <Card 
            bordered={false}
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              padding: '12px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 
                style={{ 
                  margin: 0, 
                  fontWeight: 700, 
                  fontSize: '24px', 
                  color: '#3dcb3b',
                  letterSpacing: '0.5px'
                }}
              >
                PTIT EQUIPMENT
              </h2>
              <div style={{ color: '#8c8c8c', fontSize: '13px', marginTop: '6px' }}>
                Hệ thống quản lý mượn trả thiết bị Học viện
              </div>
            </div>

            <LoginForm />

          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;