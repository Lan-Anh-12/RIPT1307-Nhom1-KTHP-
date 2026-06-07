import React from 'react';
import { Card, Typography, Space, Spin } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { useNotification } from '../../../services/Tbao/useNotification';

const { Title, Paragraph, Text } = Typography;

const ThongBaoCuaToi: React.FC = () => {
    // Đã xóa handleMarkAllAsRead vì không còn nhu cầu dùng
    const { activeTab, setActiveTab, stats, filteredNotifications, loading, handleMarkAsRead } =
        useNotification();

    return (
        <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <Title level={3} style={{ margin: 0, fontWeight: '700' }}>
                        Thông báo của tôi
                    </Title>
                    <Paragraph type='secondary' style={{ margin: '4px 0 0 0' }}>
                        Nhận cảnh báo từ hệ thống và quản trị viên
                    </Paragraph>
                </div>

                {/* Khối các thẻ bộ lọc */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    {[
                        { key: 'all', label: 'Tất cả', count: stats.all, color: '#1e293b' },
                        { key: 'unread', label: 'Chưa đọc', count: stats.unread, color: '#dc2626' },
                        { key: 'read', label: 'Đã đọc', count: stats.read, color: '#1e293b' },
                    ].map((tab) => {
                        const isSelected = activeTab === tab.key;
                        return (
                            <div
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                style={{
                                    padding: '16px 20px',
                                    background: '#ffffff',
                                    borderRadius: '8px',
                                    border: isSelected ? '1.5px solid #1e293b' : '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text type='secondary' style={{ fontSize: '14px', margin: 0 }}>{tab.label}</Text>
                                <span style={{ fontSize: '24px', fontWeight: 500, color: tab.color }}>{tab.count}</span>
                            </div>
                        );
                    })}
                </div>

                <Spin spinning={loading}>
                    <Space direction='vertical' size={16} style={{ width: '100%' }}>
                        {filteredNotifications.map((notif) => (
                            <Card
                                key={notif.id}
                                bodyStyle={{ padding: '20px' }}
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: notif.isRead ? '#ffffff' : '#f8fafc',
                                }}
                            >
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <InfoCircleFilled style={{ color: '#1890ff', fontSize: '20px', marginTop: '4px' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                            <Text style={{ fontWeight: 600, fontSize: '15px' }}>{notif.title}</Text>
                                            {!notif.isRead && (
                                                <span style={{ width: '6px', height: '6px', background: '#ff4d4f', borderRadius: '50%' }} />
                                            )}
                                        </div>
                                        <Paragraph style={{ color: '#475569', margin: '0 0 12px 0' }}>{notif.content}</Paragraph>
                                        
                                        {!notif.isRead && (
                                            <span
                                                onClick={() => handleMarkAsRead(notif.id)}
                                                style={{ fontSize: '13px', color: '#1e293b', fontWeight: '500', textDecoration: 'underline', cursor: 'pointer' }}
                                            >
                                                Đánh dấu đã đọc
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </Space>
                </Spin>
            </div>
        </div>
    );
};

export default ThongBaoCuaToi;