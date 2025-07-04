import React, { useEffect, useState } from 'react';
import axiosClient from '../Axios/AxiosCLients';

const AdminCallManagement = () => {
  const [consultations, setConsultations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách consultationId (giả sử có API này)
  useEffect(() => {
    // Thay bằng API thực tế lấy danh sách cuộc gọi
    axiosClient.get('/api/consultations')
      .then(res => setConsultations(res.data))
      .catch(() => setConsultations([]));
  }, []);

  // Lấy chi tiết summary khi chọn
  const handleSelect = (id) => {
    setSelected(id);
    setLoading(true);
    axiosClient.get(`/api/consultations/${id}/summary`)
      .then(res => setSummary(res.data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: '#2c7a75', fontWeight: 800, marginBottom: 24 }}>Quản lý cuộc gọi tư vấn</h2>
      <div style={{ display: 'flex', gap: 48 }}>
        <div style={{ minWidth: 220 }}>
          <h3 style={{ color: '#5FB8B3', fontWeight: 700 }}>Danh sách cuộc gọi</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {consultations.length === 0 && <li>Không có cuộc gọi nào</li>}
            {consultations.map(c => (
              <li key={c.id} style={{ marginBottom: 10 }}>
                <button
                  onClick={() => handleSelect(c.id)}
                  style={{
                    background: selected === c.id ? 'linear-gradient(90deg, #5FB8B3 0%, #2c7a75 100%)' : '#f5f5f5',
                    color: selected === c.id ? '#fff' : '#2c7a75',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 18px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    boxShadow: selected === c.id ? '0 2px 8px #5FB8B344' : 'none',
                  }}
                >
                  Cuộc gọi #{c.id}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          {loading && <div style={{ color: '#2c7a75', fontWeight: 600 }}>Đang tải chi tiết...</div>}
          {summary && !loading && (
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #5FB8B344', padding: 32, minWidth: 320 }}>
              <h3 style={{ color: '#2c7a75', fontWeight: 700, marginBottom: 18 }}>Chi tiết cuộc gọi</h3>
              <p><b>Người dùng:</b> {summary.userFullName}</p>
              <p><b>Coach:</b> {summary.coachName}</p>
              <p><b>Bắt đầu:</b> {summary.scheduledTime}</p>
              <p><b>Kết thúc:</b> {summary.endTime}</p>
              <p><b>Đánh giá:</b> {summary.feedbackRating ? summary.feedbackRating + ' ★' : 'Chưa có'}</p>
              <p><b>Feedback:</b> {summary.feedback || 'Chưa có'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCallManagement; 