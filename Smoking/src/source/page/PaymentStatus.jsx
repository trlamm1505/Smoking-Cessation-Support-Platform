



import React from 'react';
import { Result, Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy vnp_ResponseCode từ URL
  const params = new URLSearchParams(location.search);
  const responseCode = params.get('vnp_ResponseCode');

  return (
    <div style={{ padding: 50, maxWidth: 600, margin: '0 auto' }}>
      {responseCode === '00' ? (
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle="Cảm ơn bạn đã đăng ký. Gói Premium đã được kích hoạt."
          extra={[
            <Button type="primary" key="home" onClick={() => navigate('/')}>
              Quay về trang chủ
            </Button>,
          ]}
        />
      ) : (
        <Result
          status="error"
          title="Thanh toán thất bại!"
          subTitle="Giao dịch của bạn không thành công hoặc đã bị huỷ."
          extra={[
            <Button key="try" onClick={() => navigate(-1)}>
              Thử lại
            </Button>,
          ]}
        />
      )}
    </div>
  );
};

export default PaymentStatus;
