import React, { useState } from 'react';
import axiosClient from '../Axios/AxiosCLients';

const styles = {
  container: {
    padding: 32,
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e6f7f6 0%, #f0f9f8 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 6px 32px rgba(95,184,179,0.13)',
    padding: '32px 40px',
    minWidth: 350,
    maxWidth: 480,
    marginTop: 32,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: '#2c7a75',
    marginBottom: 18,
    letterSpacing: 1.2,
  },
  label: {
    color: '#2c7a75',
    fontWeight: 600,
    fontSize: 17,
    marginRight: 8,
  },
  value: {
    color: '#222',
    fontWeight: 500,
    fontSize: 17,
  },
  feedback: {
    background: '#f6fcfb',
    borderRadius: 10,
    padding: '12px 18px',
    margin: '12px 0',
    fontSize: 16,
    color: '#444',
    minHeight: 40,
    textAlign: 'left',
  },
  stars: {
    fontSize: 28,
    color: '#FFD700',
    marginBottom: 8,
  },
  input: {
    padding: '8px 16px',
    borderRadius: 8,
    border: '1.5px solid #e3f6f5',
    fontSize: 16,
    marginRight: 8,
    width: 120,
  },
  btn: {
    background: 'linear-gradient(90deg, #5FB8B3 0%, #2c7a75 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 17,
    padding: '10px 32px',
    boxShadow: '0 2px 8px #5FB8B344',
    cursor: 'pointer',
    marginTop: 8,
  },
};

function formatDateTime(dt) {
  if (!dt) return '-';
  const d = new Date(dt);
  return d.toLocaleString('vi-VN', { hour12: false });
}

const AdminCallManagement = () => {
  const [consultationId, setConsultationId] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    setLoading(true);
    setError('');
    setSummary(null);
    try {
      const res = await axiosClient.get(`/api/consultations/${consultationId}/summary`);
      setSummary(res.data);
    } catch (err) {
      setError('Không tìm thấy cuộc gọi hoặc lỗi server!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Tra cứu thông tin cuộc gọi tư vấn</div>
      <div style={{ marginBottom: 18 }}>
        <input
          type="number"
          placeholder="Nhập consultationId..."
          value={consultationId}
          onChange={e => setConsultationId(e.target.value)}
          style={styles.input}
        />
        <button style={styles.btn} onClick={handleFetch} disabled={!consultationId || loading}>
          {loading ? 'Đang tra cứu...' : 'Xem chi tiết'}
        </button>
      </div>
      {error && <div style={{ color: '#ff4d4f', fontWeight: 600, marginBottom: 12 }}>{error}</div>}
      {summary && (
        <div style={styles.card}>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#2c7a75', marginBottom: 12 }}>Chi tiết cuộc gọi</div>
          <div style={{ marginBottom: 10 }}>
            <span style={styles.label}>Người dùng:</span>
            <span style={styles.value}>{summary.userFullName || '-'}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={styles.label}>Coach:</span>
            <span style={styles.value}>{summary.coachName || '-'}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={styles.label}>Bắt đầu:</span>
            <span style={styles.value}>{formatDateTime(summary.scheduledTime)}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={styles.label}>Kết thúc:</span>
            <span style={styles.value}>{formatDateTime(summary.endTime)}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={styles.label}>Đánh giá:</span>
            <span style={styles.stars}>
              {summary.feedbackRating ? [...Array(summary.feedbackRating)].map((_, i) => <span key={i}>★</span>) : 'Chưa có'}
            </span>
          </div>
          <div style={styles.feedback}>
            <b>Feedback:</b> {summary.feedback || 'Chưa có'}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCallManagement; 