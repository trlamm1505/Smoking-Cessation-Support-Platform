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

    // Lấy bài viết cộng đồng (public)
    getCommunityPosts: () => axiosClient.get('/api/community-posts/public'),

    // Lấy huy hiệu đã đạt của user
    getUserAchievements: (userId) => axiosClient.get(`/achievements/achieved/${userId}`),

    // Đăng bài viết cộng đồng
    createCommunityPost: (data) => axiosClient.post('/api/community-posts', data),

    // Sửa bài viết cộng đồng
    updateCommunityPost: (id, data) => axiosClient.put(`/api/community-posts/${id}`, data),

    // Xóa bài viết cộng đồng
    deleteCommunityPost: (id) => axiosClient.delete(`/api/community-posts/${id}`),

    // COMMENT API
    getCommentsByPostId: (postId) => axiosClient.get(`/api/post-comments/post/${postId}`),
    createComment: (data) => axiosClient.post('/api/post-comments', data),
    updateComment: (commentId, data) => axiosClient.put(`/api/post-comments/${commentId}`, data),
    deleteComment: (commentId, userId) => axiosClient.delete(`/api/post-comments/${commentId}?userId=${userId}`),

    // LIKE API
    likeCommunityPost: (postId, userId) => axiosClient.post(`/api/community-posts/${postId}/like?userId=${userId}`),
};

export default userApi;