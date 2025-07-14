import React, { useState, useEffect } from 'react';
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
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: '#2c7a75',
    marginBottom: 32,
    letterSpacing: 1.2,
  },
  tableContainer: {
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 6px 32px rgba(95,184,179,0.13)',
    padding: '32px 40px',
    width: '100%',
    maxWidth: 1200,
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 16,
  },
  th: {
    background: 'linear-gradient(90deg, #5FB8B3 0%, #2c7a75 100%)',
    color: '#fff',
    padding: '16px 12px',
    textAlign: 'left',
    fontWeight: 700,
    fontSize: 16,
    borderBottom: '2px solid #2c7a75',
  },
  td: {
    padding: '16px 12px',
    borderBottom: '1px solid #e3f6f5',
    color: '#444',
    fontSize: 15,
  },
  tr: {
    '&:hover': {
      backgroundColor: '#f6fcfb',
    },
  },
  stars: {
    fontSize: 20,
    color: '#FFD700',
  },
  loading: {
    textAlign: 'center',
    fontSize: 18,
    color: '#2c7a75',
    fontWeight: 600,
    marginTop: 32,
  },
  error: {
    color: '#ff4d4f',
    fontWeight: 600,
    textAlign: 'center',
    marginTop: 32,
  },
};

function formatDateTime(dt) {
  if (!dt) return '-';
  const d = new Date(dt);
  return d.toLocaleString('vi-VN', { 
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false 
  });
}

const AdminCallManagement = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/api/consultations/all');
      setConsultations(res.data);
    } catch (err) {
      setError('Không thể tải danh sách cuộc gọi tư vấn!');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return 'Chưa có';
    return [...Array(rating)].map((_, i) => <span key={i} style={styles.stars}>★</span>);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Đang tải danh sách cuộc gọi tư vấn...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>Quản lý cuộc gọi tư vấn</div>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Người dùng</th>
              <th style={styles.th}>Coach</th>
              <th style={styles.th}>Bắt đầu</th>
              <th style={styles.th}>Kết thúc</th>
              <th style={styles.th}>Đánh giá</th>
              <th style={styles.th}>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((consultation) => (
              <tr key={consultation.consultationId} style={styles.tr}>
                <td style={styles.td}>{consultation.userFullName || '-'}</td>
                <td style={styles.td}>{consultation.coachName || '-'}</td>
                <td style={styles.td}>{formatDateTime(consultation.scheduledTime)}</td>
                <td style={styles.td}>{formatDateTime(consultation.endTime)}</td>
                <td style={styles.td}>{renderStars(consultation.feedbackRating)}</td>
                <td style={styles.td}>{consultation.feedback || 'Chưa có'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCallManagement; 