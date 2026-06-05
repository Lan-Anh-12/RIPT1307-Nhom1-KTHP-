import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Button, Space, Input, Tag, message, Descriptions, Timeline } from 'antd';
import { CheckOutlined, CloseOutlined, RollbackOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  record: any | null;
  onUpdateStatus: (params: { id: string; status: string; rejectReason?: string; actualReturnDate?: string }) => Promise<boolean>;
}

const DetailModal: React.FC<DetailModalProps> = ({ open, onClose, record, onUpdateStatus }) => {
  const [rejectReason, setRejectReason] = useState<string>('');
  const [showRejectInput, setShowRejectInput] = useState<boolean>(false);

  // Reset trạng thái mỗi khi mở modal với dữ liệu mới
  useEffect(() => {
    if (open) {
      setRejectReason(record?.rejectReason || '');
      setShowRejectInput(false);
    }
  }, [open, record]);

  if (!record) return null;

  // Hàm điều hướng cập nhật trạng thái nghiệp vụ
  const handleAction = async (status: string, extra = {}) => {
    if (status === 'tu_choi' && !rejectReason.trim()) {
      message.warning('Vui lòng điền lý do từ chối thiết bị!');
      return;
    }

    const success = await onUpdateStatus({
      id: record.id,
      status,
      rejectReason: status === 'tu_choi' ? rejectReason : undefined,
      ...extra,
    });

    if (success) {
      message.success('Cập nhật trạng thái thành công!');
      onClose();
    } else {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const renderStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      'cho_duyet': { color: 'warning', text: 'Chờ duyệt' },
      'da_duyet': { color: 'processing', text: 'Đã duyệt' },
      'da_tra': { color: 'success', text: 'Đã trả' },
      'tu_choi': { color: 'error', text: 'Từ chối' },
      'qua_han': { color: 'magenta', text: 'Quá hạn' },
    };
    const config = statusMap[status] || { color: 'default', text: status || 'N/A' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'left', width: '100%' }}>
          <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#111' }}>Chi tiết yêu cầu</div>
          <div style={{ fontSize: '13px', color: '#8c8c8c', fontWeight: 'normal', marginTop: '2px' }}>
            {record.id}
          </div>
        </div>
      }
      visible={open}
      onCancel={onClose}
      width={580}
      centered
      footer={null} // Toàn bộ nút bấm đã đẩy vào dòng thời gian nên ẩn thanh footer mặc định
      destroyOnClose
      bodyStyle={{ paddingTop: '2px' }}
    >
      <Tabs defaultActiveKey="1" centered style={{ marginTop: '1px' }}>
        {/* TAB 1: THÔNG TIN CHI TIẾT */}
        <Tabs.TabPane tab="Thông tin yêu cầu" key="1">
          <div style={{ padding: '8px 2px' }}>
            <Descriptions column={1} bordered size="small" labelStyle={{ width: '150px', fontWeight: 500 }}>
              <Descriptions.Item label="Tên thiết bị"><b>{record.deviceName || record.device?.name}</b></Descriptions.Item>
              <Descriptions.Item label="Số lượng">{record.quantity}</Descriptions.Item>
              <Descriptions.Item label="Ngày mượn">{record.borrowDate}</Descriptions.Item>
              <Descriptions.Item label="Hạn trả">{record.returnDate}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{renderStatusTag(record.status)}</Descriptions.Item>
              {record.actualReturnDate && (
                <Descriptions.Item label="Ngày trả thực tế">{record.actualReturnDate}</Descriptions.Item>
              )}
            </Descriptions>
          </div>
        </Tabs.TabPane>

        {/* TAB 2: THÔNG TIN SINH VIÊN CHỦ THỂ */}
        <Tabs.TabPane tab="Sinh viên" key="2">
          <div style={{ padding: '8px 2px' }}>
            <Descriptions column={1} bordered size="small" labelStyle={{ width: '150px', fontWeight: 500 }}>
              <Descriptions.Item label="Họ và tên">{record.studentName}</Descriptions.Item>
              <Descriptions.Item label="Mã sinh viên">{record.studentCode || 'SV001'}</Descriptions.Item>
              <Descriptions.Item label="Email">{record.studentEmail || 'student@ptit.edu.vn'}</Descriptions.Item>
              <Descriptions.Item label="Tổng yêu cầu">{record.totalRequests || 1}</Descriptions.Item>
            </Descriptions>
          </div>
        </Tabs.TabPane>

        {/* TAB 3: LỊCH SỬ XỬ LÝ (TÍCH HỢP ĐỘNG KHÔNG DÙNG CONFIG PROP) */}
        <Tabs.TabPane tab="Lịch sử xử lý" key="3">
          <div style={{ padding: '24px 16px 8px 16px' }}>
            <Timeline mode="left">
              
              {/* Mốc 1: Luôn luôn có - Sinh viên gửi đơn */}
              <Timeline.Item color="blue">
                <div style={{ fontWeight: 500, fontSize: '14px' }}>Gửi yêu cầu mượn thiết bị</div>
                <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '2px' }}>
                  Người gửi: {record.studentName} | Lúc: {record.requestDate || record.createdAt || 'N/A'}
                </div>
              </Timeline.Item>

              {/* Mốc 2: Hiện các nút tương tác tùy thuộc vào trạng thái hiện tại của bản ghi */}
              
              {/* Trạng thái: CHỜ DUYỆT */}
              {record.status === 'cho_duyet' && (
                <Timeline.Item color="orange">
                  <div style={{ fontWeight: 500, fontSize: '14px', color: '#fa8c16', marginBottom: '8px' }}>
                    Đang chờ quản trị viên phê duyệt
                  </div>
                  
                  {!showRejectInput ? (
                    <Space size="middle" style={{ marginTop: '4px' }}>
                      <Button 
                        type="primary" 
                        icon={<CheckOutlined />} 
                        onClick={() => handleAction('da_duyet')} 
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                      >
                        Duyệt
                      </Button>
                      <Button 
                        danger 
                        icon={<CloseOutlined />} 
                        onClick={() => setShowRejectInput(true)}
                      >
                        Từ chối
                      </Button>
                    </Space>
                  ) : (
                    <div style={{ background: '#fff1f0', padding: '12px', borderRadius: '6px', border: '1px solid #ffa39e', marginTop: '8px', maxWidth: '100%' }}>
                      <div style={{ marginBottom: '6px', fontWeight: 500, color: '#cf1322', fontSize: '13px' }}>
                        <EditOutlined /> Nhập lý do từ chối:
                      </div>
                      <Input.TextArea
                        rows={2}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Vui lòng cung cấp lý do cụ thể..."
                        style={{ marginBottom: '10px' }}
                      />
                      <Space>
                        <Button 
                          type="primary" 
                          danger 
                          size="small"
                          onClick={() => handleAction('tu_choi')}
                        >
                          Xác nhận từ chối
                        </Button>
                        <Button 
                          size="small" 
                          onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
                        >
                          Hủy
                        </Button>
                      </Space>
                    </div>
                  )}
                </Timeline.Item>
              )}

              {/* Trạng thái: ĐÃ DUYỆT (Đang mượn thiết bị) */}
              {record.status === 'da_duyet' && (
                <>
                  <Timeline.Item color="green">
                    <div style={{ fontWeight: 500, fontSize: '14px', color: '#52c41a' }}>Cập nhật trạng thái: Đã duyệt</div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px' }}>Người duyệt: Admin Khoa CNTT</div>
                  </Timeline.Item>
                  <Timeline.Item color="blue">
                    <div style={{ fontWeight: 500, fontSize: '14px', color: '#1890ff', marginBottom: '8px' }}>
                      Sinh viên đang giữ thiết bị
                    </div>
                    <Button 
                      type="primary" 
                      icon={<RollbackOutlined />} 
                      onClick={() => handleAction('da_tra', { actualReturnDate: '25/05/2026' })} 
                      style={{ backgroundColor: '#2f54eb', borderColor: '#2f54eb', marginTop: '4px' }}
                    >
                      Trả thiết bị
                    </Button>
                  </Timeline.Item>
                </>
              )}

              {/* Trạng thái: ĐÃ TRẢ (Hoàn tất chu kỳ) */}
              {record.status === 'da_tra' && (
                <>
                  <Timeline.Item color="green">
                    <div style={{ color: '#8c8c8c', fontSize: '14px' }}>Cập nhật trạng thái: Đã duyệt</div>
                  </Timeline.Item>
                  <Timeline.Item color="green" dot={<ClockCircleOutlined style={{ fontSize: '14px' }} />}>
                    <div style={{ fontWeight: 500, fontSize: '14px', color: '#52c41a' }}>Ghi nhận trả thiết bị thành công</div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '2px' }}>
                      Thời gian thực tế: {record.actualReturnDate || '25/05/2026'}
                    </div>
                  </Timeline.Item>
                </>
              )}

              {/* Trạng thái: TỪ CHỐI */}
              {record.status === 'tu_choi' && (
                <Timeline.Item color="red">
                  <div style={{ fontWeight: 500, fontSize: '14px', color: '#f5222d' }}>Yêu cầu đã bị từ chối</div>
                  <div style={{ color: '#595959', fontSize: '13px', marginTop: '6px', fontStyle: 'italic', background: '#fafafa', padding: '8px', borderRadius: '4px', border: '1px solid #f0f0f0' }}>
                    Lý do: "{record.rejectReason || 'Không đáp ứng đủ điều kiện hoặc kho hết thiết bị'}"
                  </div>
                </Timeline.Item>
              )}

              {/* Trạng thái: QUÁ HẠN TRẢ */}
              {record.status === 'qua_han' && (
                <>
                  <Timeline.Item color="green">
                    <div style={{ color: '#8c8c8c', fontSize: '14px' }}>Cập nhật trạng thái: Đã duyệt</div>
                  </Timeline.Item>
                  <Timeline.Item color="red">
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#f5222d' }}>Hệ thống cảnh báo: Quá hạn hoàn trả thiết bị!</div>
                    <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '2px' }}>Hạn trả đăng ký: {record.returnDate}</div>
                  </Timeline.Item>
                </>
              )}

            </Timeline>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default DetailModal;