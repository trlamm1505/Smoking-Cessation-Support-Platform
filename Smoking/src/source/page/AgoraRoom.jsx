import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../page/Axios/AxiosCLients';

const appId = '0b04ebb5e6e048878169a4ecd7d05fa3';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e6f7f6 0%, #f0f9f8 100%)',
    padding: 0,
  },
  card: {
    background: 'white',
    borderRadius: 24,
    boxShadow: '0 6px 32px rgba(95,184,179,0.13)',
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 1000,
    width: '100%',
    margin: '0 16px',
    position: 'relative',
  },
  title: {
    fontSize: 30,
    fontWeight: 800,
    color: '#2c7a75',
    marginBottom: 24,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  remoteVideo: {
    width: '100%',
    maxWidth: 900,
    height: 500,
    background: 'transparent',
    borderRadius: 18,
    marginBottom: 24,
    boxShadow: '0 2px 12px #5FB8B344',
    objectFit: 'cover',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  localVideoPiP: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 160,
    height: 120,
    borderRadius: 16,
    boxShadow: '0 2px 8px #5FB8B344',
    background: '#fff',
    overflow: 'hidden',
    zIndex: 2,
  },
  avatarBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 350,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: '#e6f7f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 60,
    color: '#bdbdbd',
    marginBottom: 16,
    boxShadow: '0 2px 8px #5FB8B344',
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: '#2c7a75',
    marginBottom: 6,
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    color: '#888',
    fontWeight: 500,
    textAlign: 'center',
  },
  controls: {
    display: 'flex',
    gap: 24,
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 12,
  },
  controlBtn: {
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '50%',
    width: 56,
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    color: '#2c7a75',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #5FB8B344',
    transition: 'background 0.2s, color 0.2s',
  },
  controlBtnActive: {
    background: '#5FB8B3',
    color: '#fff',
  },
  controlBtnOff: {
    background: '#ff4d4f',
    color: '#fff',
  },
  btn: {
    background: 'linear-gradient(90deg, #5FB8B3 0%, #2c7a75 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 18,
    padding: '12px 36px',
    boxShadow: '0 2px 8px #5FB8B344',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s',
    marginTop: 16,
  },
  btnHover: {
    background: 'linear-gradient(90deg, #2c7a75 0%, #5FB8B3 100%)',
    boxShadow: '0 4px 16px #5FB8B344',
  },
  loading: {
    fontSize: 22,
    color: '#2c7a75',
    fontWeight: 600,
    marginTop: 40,
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.25)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    background: '#fff',
    borderRadius: 16,
    padding: '32px 40px',
    boxShadow: '0 6px 32px rgba(95,184,179,0.13)',
    textAlign: 'center',
    minWidth: 320,
    maxWidth: '90vw',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#2c7a75',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 18,
    color: '#444',
    marginBottom: 24,
  },
  modalBtn: {
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

// Helpers
// Hàm lấy vai trò của người dùng từ localStorage
const getRole = () => {
  const role = localStorage.getItem('userRole'); // Lấy userRole
  if (role === 'coach') return 'coach'; // Nếu là coach
  if (role === 'member') return 'member'; // Nếu là member
  return 'user'; // Mặc định là user
};

// Hàm lấy tên hiển thị của người ở phía bên kia cuộc gọi
const getDisplayName = () => {
  const role = getRole();
  if (role === 'coach') {
    // Nếu là coach thì hiển thị tên khách hàng
    return localStorage.getItem('userName') || 'Khách hàng';
  } else {
    // Nếu là member thì hiển thị tên huấn luyện viên
    return localStorage.getItem('coachName') || 'Huấn luyện viên';
  }
};

// Hàm lấy tiêu đề cho phòng gọi dựa vào vai trò
const getTitle = () => {
  const role = getRole();
  if (role === 'coach') return 'Cuộc tư vấn trực tiếp với Khách hàng';
  return 'Cuộc tư vấn trực tiếp với Huấn luyện viên';
};

// Component chính quản lý phòng gọi Agora
const AgoraRoom = () => {
  // Lấy consultationId từ URL
  const { consultationId } = useParams();

  // Lấy uid từ localStorage (id của người dùng hiện tại)
  const uid = localStorage.getItem('userId');

  // State lưu thông tin token phòng gọi (từ backend trả về)
  const [tokenData, setTokenData] = useState(null);
  // State loading khi đang lấy token hoặc join phòng
  const [loading, setLoading] = useState(true);
  // State hiệu ứng hover cho nút kết thúc
  const [btnHover, setBtnHover] = useState(false);
  // State trạng thái mic (bật/tắt)
  const [micOn, setMicOn] = useState(true);
  // State trạng thái camera (bật/tắt)
  const [camOn, setCamOn] = useState(true);
  // State kiểm tra đã có người ở phía bên kia join chưa
  const [remoteJoined, setRemoteJoined] = useState(false);
  // State tên hiển thị của người ở phía bên kia
  const [remoteName, setRemoteName] = useState(getDisplayName());
  // State hiển thị modal đánh giá sau khi kết thúc cuộc gọi
  const [showModal, setShowModal] = useState(false);
  // State lưu thời lượng cuộc gọi (tính bằng giây)
  const [callDuration, setCallDuration] = useState(0);
  // State lưu nội dung feedback
  const [feedback, setFeedback] = useState('');
  // State lưu số sao đánh giá
  const [feedbackRating, setFeedbackRating] = useState(5);
  // State trạng thái đang gửi feedback
  const [submitting, setSubmitting] = useState(false);
  // Ref lưu thời điểm bắt đầu cuộc gọi
  const callStartTime = useRef(null);
  // Ref cho video của người ở phía bên kia
  const remoteVideoRef = useRef(null);
  // Ref cho video của mình (PiP)
  const pipVideoRef = useRef(null);
  // Ref cho client Agora
  const clientRef = useRef(null);
  // Ref cho các track audio/video của mình
  const localTracks = useRef({});

  // Hook điều hướng trang
  const navigate = useNavigate();

  // Lấy vai trò hiện tại
  const role = getRole();

  // useEffect: Khi component mount, gọi API lấy token phòng gọi
  useEffect(() => {
    if (!uid) {
      // Nếu không có userId thì báo lỗi và quay lại trang trước
      console.error('Không xác định userId! Vui lòng đăng nhập lại.');
      navigate(-1);
      return;
    }
    // Gọi API lấy token phòng gọi cho cuộc tư vấn này
    axiosClient.get(`/api/consultations/${consultationId}/agora-token?uid=${uid}`)
      .then(res => {
        setTokenData(res.data); // Lưu token vào state
        setLoading(false); // Tắt loading
        callStartTime.current = Date.now(); // Lưu thời điểm bắt đầu gọi

        // Log thông tin token để debug
        console.log('[Agora FE] Nhận token:', {
          channelName: res.data.channelName,
          token: res.data.token,
          uid: res.data.uid
        });

      })
      .catch(() => {
        // Nếu lỗi thì báo và quay lại trang trước
        console.error('Không lấy được token phòng!');
        navigate(-1);
      });
  }, [consultationId, uid, navigate]);

  // useEffect: Khi đã có token phòng gọi, tiến hành join phòng Agora
  useEffect(() => {
    if (!tokenData) return; // Nếu chưa có token thì không làm gì
    const join = async () => {
      // Tạo client Agora
      clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      try {
        // Log thông tin join phòng để debug
        console.log('[Agora FE] Join phòng:', {
          appId, channelName: tokenData.channelName, token: tokenData.token, uid: Number(uid)
        });

        // Tham gia phòng với appId, channelName, token, uid
        await clientRef.current.join(appId, tokenData.channelName, tokenData.token, Number(uid));
        // Tạo track audio và video từ thiết bị
        localTracks.current.audio = await AgoraRTC.createMicrophoneAudioTrack();
        localTracks.current.video = await AgoraRTC.createCameraVideoTrack();
        // Publish track lên phòng
        await clientRef.current.publish([localTracks.current.audio, localTracks.current.video]);
        // Hiển thị video của mình ở PiP
        localTracks.current.video.play(pipVideoRef.current);

        // Khi có người ở phía bên kia publish media
        clientRef.current.on('user-published', async (user, mediaType) => {
          await clientRef.current.subscribe(user, mediaType); // Subscribe media
          setRemoteJoined(true); // Đánh dấu đã có người join
          if (mediaType === 'video') {
            user.videoTrack.play(remoteVideoRef.current); // Hiển thị video của người kia
          }
          if (mediaType === 'audio') {
            user.audioTrack.play(); // Phát audio của người kia
          }
        });

        // Khi người kia tắt media hoặc rời phòng
        clientRef.current.on('user-unpublished', (user, mediaType) => {
          setRemoteJoined(false);
        });
        clientRef.current.on('user-left', () => {
          setRemoteJoined(false);
        });
      } catch (err) {
        // Nếu lỗi join phòng (ví dụ trùng UID)
        console.error('Không thể tham gia phòng! Có thể bạn đang bị trùng UID.', err);
      }
    };
    join();

    // Cleanup: đóng track và rời phòng khi unmount
    return () => {
      if (localTracks.current.audio) localTracks.current.audio.close();
      if (localTracks.current.video) localTracks.current.video.close();
      if (clientRef.current) clientRef.current.leave();
    };
  }, [tokenData, uid]);


  // Hàm bật/tắt micro
  const handleToggleMic = () => {
    if (localTracks.current.audio) {
      if (micOn) {
        // Nếu đang bật thì tắt
        localTracks.current.audio.setEnabled(false);
        setMicOn(false);
      } else {
        // Nếu đang tắt thì bật
        localTracks.current.audio.setEnabled(true);
        setMicOn(true);
      }
    }
  };
  // Hàm bật/tắt camera
  const handleToggleCam = () => {
    if (localTracks.current.video) {
      if (camOn) {
        // Nếu đang bật thì tắt
        localTracks.current.video.setEnabled(false);
        setCamOn(false);
      } else {
        // Nếu đang tắt thì bật
        localTracks.current.video.setEnabled(true);
        setCamOn(true);
      }
    }
  };


  // Hàm kết thúc cuộc gọi
  const handleEndCall = () => {
    const end = Date.now(); // Lấy thời điểm kết thúc
    const duration = Math.floor((end - (callStartTime.current || end)) / 1000); // Tính thời lượng cuộc gọi (giây)
    setCallDuration(duration); // Lưu vào state

    // Đóng các track audio/video và rời phòng
    if (localTracks.current.audio) localTracks.current.audio.close();
    if (localTracks.current.video) localTracks.current.video.close();
    if (clientRef.current) clientRef.current.leave();
    // Nếu là member thì hiện modal đánh giá
    if (role === 'member') {
      setShowModal(true);
    } else {
      // Nếu là coach hoặc user thì chuyển về trang lịch tư vấn
      if (role === 'coach') {
        navigate('/coach/consultation');
      } else {
        navigate('/users/consultation');
      }
    }
  };

  // Hàm gửi đánh giá sau khi kết thúc cuộc gọi
  const handleSubmitFeedback = async () => {
    setSubmitting(true); // Đánh dấu đang gửi
    try {
      // Gọi API gửi feedback cho cuộc tư vấn
      await axiosClient.post(`/api/consultations/${consultationId}/finish`, {
        feedback,
        feedbackRating,
      });
      setShowModal(false); // Đóng modal
      // Sau khi gửi xong, chuyển về trang lịch tư vấn
      if (role === 'coach') {
        navigate('/coach/consultation');
      } else {
        navigate('/users/consultation');
      }
    } catch (error) {
      // Nếu lỗi thì log ra
      console.error('Lỗi gửi feedback:', error);
    } finally {
      setSubmitting(false); // Kết thúc trạng thái gửi
    }
  };


  // Hàm format thời lượng cuộc gọi sang dạng "x phút y giây"
  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m > 0 ? m + ' phút ' : ''}${s} giây`;
  };

  if (loading) return <div style={styles.loading}>Đang vào phòng tư vấn trực tuyến...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>{getTitle()}</div>
        <div style={styles.remoteVideo}>
          {remoteJoined ? (
            <div ref={remoteVideoRef} style={{ width: '100%', height: '100%', borderRadius: 18, overflow: 'hidden' }} />
          ) : (
            <div style={styles.avatarBox}>
              <div style={styles.avatar}>
                <span role="img" aria-label="avatar">👤</span>
              </div>
              <div style={styles.name}>{remoteName}</div>
              <div style={styles.status}>Đang kết nối...</div>
            </div>
          )}
          <div style={styles.localVideoPiP}>
            <div ref={pipVideoRef} style={{ width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden', background: '#000' }} />
          </div>
        </div>
        <div style={styles.controls}>
          <button
            style={{
              ...styles.controlBtn,
              ...(micOn ? styles.controlBtnActive : styles.controlBtnOff),
            }}
            onClick={handleToggleMic}
            title={micOn ? 'Tắt mic' : 'Bật mic'}
          >
            {micOn ? (
              <span role="img" aria-label="mic">🎤</span>
            ) : (
              <span role="img" aria-label="mic-off">🔇</span>
            )}
          </button>
          <button
            style={{
              ...styles.controlBtn,
              ...(camOn ? styles.controlBtnActive : styles.controlBtnOff),
            }}
            onClick={handleToggleCam}
            title={camOn ? 'Tắt camera' : 'Bật camera'}
          >
            {camOn ? (
              <span role="img" aria-label="cam">📷</span>
            ) : (
              <span role="img" aria-label="cam-off">🚫</span>
            )}
          </button>
        </div>
        <button
          style={btnHover ? { ...styles.btn, ...styles.btnHover } : styles.btn}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          onClick={handleEndCall}
        >
          Kết thúc cuộc gọi
        </button>
      </div>

      {/* Feedback Modal for member */}
      {showModal && role === 'member' && (

        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={styles.modalTitle}>Đánh giá cuộc gọi</div>
            <div style={styles.modalText}>Thời lượng cuộc gọi: <b>{formatDuration(callDuration)}</b></div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600, color: '#2c7a75', fontSize: 16 }}>Nội dung đánh giá:</label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={4}
                style={{ width: '100%', borderRadius: 8, border: '1.5px solid #e3f6f5', padding: 10, fontSize: 16, marginTop: 6 }}
                placeholder="Nhập nhận xét về cuộc gọi..."
                disabled={submitting}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: '#2c7a75', fontSize: 16, display: 'block', marginBottom: 8 }}>Số sao đánh giá:</label>
              <div style={{ fontSize: 32, marginBottom: 8 }}>
                {[1,2,3,4,5].map(star => (
                  <span
                    key={star}
                    style={{
                      cursor: 'pointer',
                      color: star <= feedbackRating ? '#FFD700' : '#ccc',
                      transition: 'color 0.2s',
                      marginRight: 4
                    }}
                    onClick={() => setFeedbackRating(star)}
                    role="button"
                    aria-label={`Chọn ${star} sao`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <button
              style={styles.modalBtn}
              onClick={handleSubmitFeedback}
              disabled={submitting}
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá & Kết thúc'}
            </button>

          </div>
        </div>
      )}
    </div>
  );
};


export default AgoraRoom;

