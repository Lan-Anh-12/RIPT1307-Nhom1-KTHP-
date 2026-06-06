import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Button, Badge, Popover, List, Typography } from 'antd';
import { BellOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const NotificationBell: React.FC = () => {
  // Lấy dữ liệu thông báo trực tiếp từ model chung (Đảm bảo đúng namespace)
  const { adminNotis = [], fetchAdminNotifications } = useModel('deviceOrder.requestModel');

  useEffect(() => {
    // Tự động gọi API lấy thông báo quá hạn khi quả chuông được nạp vào giao diện
    if (fetchAdminNotifications) {
      fetchAdminNotifications();
    }
  }, [fetchAdminNotifications]);

  // Nội dung danh sách thông báo khi click vào quả chuông
  const notificationContent = (
    <List
      dataSource={adminNotis}
      locale={{ emptyText: 'Hệ thống an toàn. Không có cảnh báo quá hạn nào.' }}
      style={{ width: 340, maxHeight: 400, overflowY: 'auto' }}
      renderItem={(item: DeviceNotification.NotificationItem) => ( // 🌟 Định dạng chuẩn Type thay vì any
        <List.Item style={{ padding: '12px 16px', backgroundColor: item.isRead ? '#ffffff' : '#fff1f0' }}>
          <List.Item.Meta
            avatar={<ClockCircleOutlined style={{ color: '#ff4d4f', fontSize: '18px', marginTop: '4px' }} />}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: '13px', color: '#cf1322' }}>{item.title || 'Cảnh báo quá hạn'}</Text>
                {!item.isRead && <Badge status="error" />}
              </div>
            }
            description={
              <div>
                <div style={{ color: '#434343', fontSize: '12px', marginTop: '2px', lineHeight: '1.4' }}>
                  {item.content}
                </div>
                <div style={{ fontSize: '11px', color: '#bfbfbf', marginTop: '6px' }}>
                  Mã SV liên quan: <b>{item.userId}</b>
                </div>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  return (
    <Popover 
      content={notificationContent} 
      title={<b style={{ fontSize: '14px', color: '#1f1f1f' }}>Cảnh báo thiết bị quá hạn</b>} 
      trigger="click" 
      placement="bottomRight"
      overlayStyle={{ paddingTop: '8px' }}
    >
      <Badge count={adminNotis.filter(n => !n.isRead).length || adminNotis.length} offset={[-2, 5]} size="small">
        <Button 
          type="text" 
          icon={<BellOutlined style={{ fontSize: '22px', color: '#434343' }} />} 
          style={{ 
            height: '40px', 
            width: '40px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: adminNotis.length > 0 ? '#fff1f0' : 'transparent'
          }} 
        />
      </Badge>
    </Popover>
  );
};

export default NotificationBell;