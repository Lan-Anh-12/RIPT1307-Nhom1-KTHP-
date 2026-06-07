import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Button, Space, Input, Tag, message, Descriptions, Timeline, Spin } from 'antd';
import { CheckOutlined, CloseOutlined, RollbackOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  record: DeviceRequest.RequestItem | null; 
  loading?: boolean; 
  // Đổi cấu trúc nhận tham số phẳng (id, status) khớp hoàn toàn với hàm bọc ở file index.tsx
  onUpdateStatus: (id: number | string, status: 'APPROVED' | 'REJECTED' | 'RETURNED') => Promise<void>;
}

const DetailModal: React.FC<DetailModalProps> = ({ open, onClose, record, loading = false, onUpdateStatus }) => {
  const [rejectReason, setRejectReason] = useState<string>('');
  const [showRejectInput, setShowRejectInput] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Reset trạng thái nhập liệu mỗi khi mở modal với dữ liệu mới
  useEffect(() => {
    if (open) {
      setRejectReason('');
      setShowRejectInput(false);
    }
  }, [open, record]);

  if (!open) return null;

  // Hàm điều hướng cập nhật trạng thái nghiệp vụ lên Server
  const handleAction = async (status: 'APPROVED' | 'REJECTED' | 'RETURNED') => {
    if (!record) return;

    if (status === 'REJECTED' && !rejectReason.trim()) {
      message.warning('Vui lòng điền lý do từ chối thiết bị!');
      return;
    }

    try {
      setSubmitting(true);
      // Gọi hàm cập nhật phẳng theo đúng thiết kế của index.tsx
      await onUpdateStatus(record.idRequest, status);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // 🌟 Hàm render Tag trạng thái đồng bộ CHỮ HOA Tiếng Anh
  const renderStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      'PENDING': { color: 'warning', text: 'Chờ duyệt' },
      'APPROVED': { color: 'processing', text: 'Đang mượn' },
      'RETURNED': { color: 'success', text: 'Đã trả' },
      'REJECTED': { color: 'error', text: 'Từ chối' },
      'OVERDUE': { color: 'magenta', text: 'Quá hạn' },
    };
    const upperStatus = status?.toUpperCase() || 'PENDING';
    const config = statusMap[upperStatus] || { color: 'default', text: status || 'N/A' };
    return <Tag color={config.color} style={{ borderRadius: '4px' }}>{config.text}</Tag>;
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'left', width: '100%' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f1f1f' }}>Chi tiết yêu cầu thiết bị</div>
          {record && (
            <div style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 'normal', marginTop: '2px' }}>
              Mã yêu cầu hệ thống: <b>#{record.idRequest}</b>
            </div>
          )}
        </div>
      }
      visible={open}
      onCancel={onClose}
      width={580}
      centered
      footer={null} 
      destroyOnClose
      bodyStyle={{ paddingTop: '2px', minHeight: loading ? '200px' : 'auto' }}
    >
      <Spin spinning={loading || submitting} tip="Đang xử lý thông tin...">
        {record ? (
          <Tabs defaultActiveKey="1" centered style={{ marginTop: '1px' }}>
            
            {/* TAB 1: THÔNG TIN CHI TIẾT ĐƠN HÀNG (ĐÃ MAP KHỚP JAVA DTO) */}
            <Tabs.TabPane tab="Thông tin yêu cầu" key="1">
              <div style={{ padding: '8px 2px' }}>
                <Descriptions column={1} bordered size="small" labelStyle={{ width: '150px', fontWeight: 500, backgroundColor: '#fafafa' }}>
                  <Descriptions.Item label="Tên thiết bị"><b>{record.device}</b></Descriptions.Item>
                  <Descriptions.Item label="Số lượng mượn">{record.quantity} chiếc</Descriptions.Item>
                  <Descriptions.Item label="Ngày mượn đầu">{record.requestDate}</Descriptions.Item>
                  <Descriptions.Item label="Hạn trả dự kiến">{record.expectedReturnDate}</Descriptions.Item>
                  <Descriptions.Item label="Trạng thái đơn">{renderStatusTag(record.status)}</Descriptions.Item>
                  {record.actualReturnDate && (
                    <Descriptions.Item label="Ngày trả thực tế">{record.actualReturnDate}</Descriptions.Item>
                  )}
                </Descriptions>
              </div>
            </Tabs.TabPane>

            {/* TAB 2: THÔNG TIN SINH VIÊN */}
            <Tabs.TabPane tab="Sinh viên mượn" key="2">
              <div style={{ padding: '8px 2px' }}>
                <Descriptions column={1} bordered size="small" labelStyle={{ width: '150px', fontWeight: 500, backgroundColor: '#fafafa' }}>
                  <Descriptions.Item label="Họ và tên">{record.studentName}</Descriptions.Item>
                  <Descriptions.Item label="ID / Mã số sinh viên">{record.studentId}</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ Email">{record.email || 'N/A'}</Descriptions.Item>
                  <Descriptions.Item label="Tổng lượt đã mượn">{record.totalRequest || 1} lần</Descriptions.Item>
                </Descriptions>
              </div>
            </Tabs.TabPane>

            {/* TAB 3: TIẾN TRÌNH LỊCH SỬ XỬ LÝ */}
            <Tabs.TabPane tab="Lịch sử xử lý" key="3">
              <div style={{ padding: '24px 16px 8px 16px' }}>
                <Timeline mode="left">
                  
                  {/* Mốc cố định: Sinh viên gửi đơn ban đầu */}
                  <Timeline.Item color="blue">
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>Gửi yêu cầu mượn thiết bị</div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '2px' }}>
                      Người gửi: {record.studentName} | Ngày: {record.requestDate}
                    </div>
                  </Timeline.Item>

                  {/* Nhánh 1: Xử lý Trạng thái CHỜ DUYỆT (PENDING) */}
                  {record.status?.toUpperCase() === 'PENDING' && (
                    <Timeline.Item color="orange">
                      <div style={{ fontWeight: 500, fontSize: '14px', color: '#fa8c16', marginBottom: '8px' }}>
                        Đang chờ quản trị viên phê duyệt
                      </div>
                      
                      {!showRejectInput ? (
                        <Space size="middle" style={{ marginTop: '4px' }}>
                          <Button 
                            type="primary" 
                            icon={<CheckOutlined />} 
                            onClick={() => handleAction('APPROVED')} 
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', borderRadius: '4px' }}
                          >
                            Phê duyệt đơn
                          </Button>
                          <Button 
                            danger 
                            icon={<CloseOutlined />} 
                            onClick={() => setShowRejectInput(true)}
                            style={{ borderRadius: '4px' }}
                          >
                            Từ chối
                          </Button>
                        </Space>
                      ) : (
                        <div style={{ background: '#fff1f0', padding: '12px', borderRadius: '6px', border: '1px solid #ffa39e', marginTop: '8px' }}>
                          <div style={{ marginBottom: '6px', fontWeight: 500, color: '#cf1322', fontSize: '13px' }}>
                            <EditOutlined /> Nhập lý do từ chối:
                          </div>
                          <Input.TextArea
                            rows={2}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Cung cấp lý do không phê duyệt..."
                            style={{ marginBottom: '10px', borderRadius: '4px' }}
                          />
                          <Space>
                            <Button 
                              type="primary" 
                              danger 
                              size="small"
                              onClick={() => handleAction('REJECTED')}
                              style={{ borderRadius: '4px' }}
                            >
                              Xác nhận từ chối
                            </Button>
                            <Button 
                              size="small" 
                              onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
                              style={{ borderRadius: '4px' }}
                            >
                              Hủy
                            </Button>
                          </Space>
                        </div>
                      )}
                    </Timeline.Item>
                  )}

                  {/* Nhánh 2: Xử lý Trạng thái ĐÃ DUYỆT (APPROVED) */}
                  {record.status?.toUpperCase() === 'APPROVED' && (
                    <>
                      <Timeline.Item color="green">
                        <div style={{ fontWeight: 500, fontSize: '14px', color: '#52c41a' }}>Đã phê duyệt đơn mượn</div>
                        <div style={{ color: '#8c8c8c', fontSize: '12px' }}>Hệ thống đã trừ bớt số lượng thiết bị trong kho hàng.</div>
                      </Timeline.Item>
                      <Timeline.Item color="blue">
                        <div style={{ fontWeight: 500, fontSize: '14px', color: '#1890ff', marginBottom: '8px' }}>
                          Sinh viên đang cầm giữ thiết bị thực tế
                        </div>
                        <Button 
                          type="primary" 
                          icon={<RollbackOutlined />} 
                          onClick={() => handleAction('RETURNED')} 
                          style={{ backgroundColor: '#b30000', borderColor: '#b30000', marginTop: '4px', borderRadius: '4px' }}
                        >
                          Ghi nhận trả thiết bị
                        </Button>
                      </Timeline.Item>
                    </>
                  )}

                  {/* Nhánh 3: Xử lý Trạng thái ĐÃ TRẢ (RETURNED) */}
                  {record.status?.toUpperCase() === 'RETURNED' && (
                    <>
                      <Timeline.Item color="green">
                        <div style={{ color: '#8c8c8c', fontSize: '13px' }}>Đã phê duyệt mượn thành công trước đó</div>
                      </Timeline.Item>
                      <Timeline.Item color="green" dot={<ClockCircleOutlined style={{ fontSize: '14px' }} />}>
                        <div style={{ fontWeight: 500, fontSize: '14px', color: '#52c41a' }}>Ghi nhận hoàn trả thiết bị thành công</div>
                        <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '2px' }}>
                          Thiết bị đã được tự động hoàn lại số lượng khả dụng vào kho lưu trữ.
                        </div>
                      </Timeline.Item>
                    </>
                  )}

                  {/* Nhánh 4: Xử lý Trạng thái TỪ CHỐI (REJECTED) */}
                  {record.status?.toUpperCase() === 'REJECTED' && (
                    <Timeline.Item color="red">
                      <div style={{ fontWeight: 500, fontSize: '14px', color: '#f5222d' }}>Yêu cầu mượn đã bị từ chối phê duyệt</div>
                      <div style={{ color: '#595959', fontSize: '13px', marginTop: '6px', fontStyle: 'italic', background: '#fafafa', padding: '8px', borderRadius: '4px', border: '1px solid #f0f0f0' }}>
                        Lý do: Không đáp ứng đủ điều kiện phê duyệt hoặc kho hết thiết bị đột xuất.
                      </div>
                    </Timeline.Item>
                  )}

                  {/* Nhánh 5: Xử lý Trạng thái QUÁ HẠN (OVERDUE) */}
                  {record.status?.toUpperCase() === 'OVERDUE' && (
                    <>
                      <Timeline.Item color="green">
                        <div style={{ color: '#8c8c8c', fontSize: '13px' }}>Đã phê duyệt mượn thành công trước đó</div>
                      </Timeline.Item>
                      <Timeline.Item color="red">
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#f5222d' }}>Hệ thống tự động quét: Thiết bị quá hạn hoàn trả!</div>
                        <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '2px' }}>Hạn trả quy định ban đầu: {record.expectedReturnDate}</div>
                      </Timeline.Item>
                    </>
                  )}

                </Timeline>
              </div>
            </Tabs.TabPane>
          </Tabs>
        ) : null}
      </Spin>
    </Modal>
  );
};

export default DetailModal;