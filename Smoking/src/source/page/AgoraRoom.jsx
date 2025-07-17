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
const getRole = () => {
  const role = localStorage.getItem('userRole');
  if (role === 'coach') return 'coach';
  if (role === 'member') return 'member';
  return 'user';
};

const getDisplayName = () => {
  const role = getRole();
  if (role === 'coach') {
    return localStorage.getItem('userName') || 'Khách hàng';
  } else {
    return localStorage.getItem('coachName') || 'Huấn luyện viên';
  }
};

const getTitle = () => {
  const role = getRole();
  if (role === 'coach') return 'Cuộc tư vấn trực tiếp với Khách hàng';
  return 'Cuộc tư vấn trực tiếp với Huấn luyện viên';
};

const AgoraRoom = () => {
  const { consultationId } = useParams();
  const uid = localStorage.getItem('userId'); // KHÔNG lấy từ query string!
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnHover, setBtnHover] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [remoteJoined, setRemoteJoined] = useState(false);
  const [remoteName, setRemoteName] = useState(getDisplayName());
  const [showModal, setShowModal] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const callStartTime = useRef(null);
  const remoteVideoRef = useRef(null);
  const pipVideoRef = useRef(null);
  const clientRef = useRef(null);
  const localTracks = useRef({});

  const navigate = useNavigate();
  const role = getRole();

  // --- Lấy token từ BE ---
  useEffect(() => {
    if (!uid) {
      console.error('Không xác định userId! Vui lòng đăng nhập lại.');
      navigate(-1);
      return;
    }
    axiosClient.get(`/api/consultations/${consultationId}/agora-token?uid=${uid}`)
        .then(res => {
          setTokenData(res.data);
          setLoading(false);
          callStartTime.current = Date.now();
          // LOG
          console.log('[Agora FE] Nhận token:', {
            channelName: res.data.channelName,
            token: res.data.token,
            uid: res.data.uid
          });
        })
        .catch(() => {
          console.error('Không lấy được token phòng!');
          navigate(-1);
        });
  }, [consultationId, uid, navigate]);

  // --- Join phòng Agora ---
  useEffect(() => {
    if (!tokenData) return;
    let isMounted = true;

    const join = async () => {
      clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      // Đăng ký các event **trước khi join** để đảm bảo không miss event nào
      clientRef.current.on('user-joined', user => {
        console.log('[Agora FE] user-joined:', user);
      });

      clientRef.current.on('user-published', async (user, mediaType) => {
        console.log('[Agora FE] user-published:', user, mediaType);
        await clientRef.current.subscribe(user, mediaType);
        if (!isMounted) return;
        setRemoteJoined(true);
        if (mediaType === 'video') {
          user.videoTrack.play(remoteVideoRef.current);
        }
        if (mediaType === 'audio') {
          user.audioTrack.play();
        }
      });

      clientRef.current.on('user-unpublished', (user, mediaType) => {
        console.log('[Agora FE] user-unpublished:', user, mediaType);
        if (!isMounted) return;
        setRemoteJoined(false);
      });

      clientRef.current.on('user-left', user => {
        console.log('[Agora FE] user-left:', user);
        if (!isMounted) return;
        setRemoteJoined(false);
      });

      try {
        // LOG
        console.log('[Agora FE] Join phòng:', {
          appId, channelName: tokenData.channelName, token: tokenData.token, uid: Number(uid)
        });

        await clientRef.current.join(appId, tokenData.channelName, tokenData.token, Number(uid));

        // KHỞI TẠO LOCAL TRACKS
        localTracks.current.audio = await AgoraRTC.createMicrophoneAudioTrack();
        localTracks.current.video = await AgoraRTC.createCameraVideoTrack();
        await clientRef.current.publish([localTracks.current.audio, localTracks.current.video]);
        localTracks.current.video.play(pipVideoRef.current);

      } catch (err) {
        console.error('Không thể tham gia phòng! Có thể bạn đang bị trùng UID hoặc token có vấn đề.', err);
      }
    };
    join();

    return () => {
      isMounted = false;
      if (localTracks.current.audio) localTracks.current.audio.close();
      if (localTracks.current.video) localTracks.current.video.close();
      if (clientRef.current) clientRef.current.leave();
    };
  }, [tokenData, uid]);

  // Toggle mic/cam
  const handleToggleMic = () => {
    if (localTracks.current.audio) {
      localTracks.current.audio.setEnabled(!micOn);
      setMicOn(!micOn);
    }
  };
  const handleToggleCam = () => {
    if (localTracks.current.video) {
      localTracks.current.video.setEnabled(!camOn);
      setCamOn(!camOn);
    }
  };

  // Kết thúc cuộc gọi
  const handleEndCall = () => {
    const end = Date.now();
    const duration = Math.floor((end - (callStartTime.current || end)) / 1000);
    setCallDuration(duration);

    if (localTracks.current.audio) localTracks.current.audio.close();
    if (localTracks.current.video) localTracks.current.video.close();
    if (clientRef.current) clientRef.current.leave();
    if (role === 'member') {
      setShowModal(true);
    } else {
      if (role === 'coach') {
        navigate('/coach/consultation');
      } else {
        navigate('/users/consultation');
      }
    }
  };

  const handleSubmitFeedback = async () => {
    setSubmitting(true);
    try {
      await axiosClient.post(`/api/consultations/${consultationId}/finish`, {
        feedback,
        feedbackRating,
      });
      setShowModal(false);
      if (role === 'coach') {
        navigate('/coach/consultation');
      } else {
        navigate('/users/consultation');
      }
    } catch (error) {
      console.error('Lỗi gửi feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

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