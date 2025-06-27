import axiosClient from "./AxiosCLients";

const userApi = {
    // Lấy thông tin user theo id
    get: (id) => axiosClient.get(`/api/user/${id}`),

    // Cập nhật thông tin user theo id
    put: (id, data) => axiosClient.put(`/api/user/${id}`, data),

    // Xóa user theo id - xóa cứng khỏi database
    delete: (id) => axiosClient.delete(`/api/user/${id}?hardDelete=true`),

    // Cập nhật profile (POST)
    updateProfile: (data) => axiosClient.post('/update-profile', data),

    // Đổi mật khẩu (POST)
    changePassword: (data) => axiosClient.post('/change-password', data),

    // Lấy danh sách user
    getAll: () => axiosClient.get('/api/user'),

    // Tạo user mới
    create: (data) => axiosClient.post('/api/user', data),

    // Lấy user có coach
    getWithCoach: () => axiosClient.get('/api/user/with-coach'),

    // Lấy user theo username
    getByUsername: (username) => axiosClient.get(`/api/user/username/${username}`),

    // Lấy user theo role
    getByRole: (role) => axiosClient.get(`/api/user/role/${role}`),

    // Lấy user theo email
    getByEmail: (email) => axiosClient.get(`/api/user/email/${email}`),

    // Lấy user theo coachId
    getByCoachId: (coachId) => axiosClient.get(`/api/user/coach/${coachId}`),

    // FEEDBACK API
    getFeedbacks: (params) => axiosClient.get('/api/feedback', { params }),
    getFeedbackById: (id) => axiosClient.get(`/api/feedback/${id}`),
    createFeedback: (data) => axiosClient.post('/api/feedback', data),
    updateFeedback: (id, data) => axiosClient.put(`/api/feedback/${id}`, data),
    deleteFeedback: (id) => axiosClient.delete(`/api/feedback/${id}`),
};

export default userApi;