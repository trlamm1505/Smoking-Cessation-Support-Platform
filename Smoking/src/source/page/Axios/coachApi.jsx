import axiosClient from "./AxiosCLients";

const coachApi = {
  // Lấy thông tin coach theo id
  getById: (id) => axiosClient.get(`/api/coaches/${id}`),

  // Lấy tất cả coach
  getAll: () => axiosClient.get('/api/coaches/all'),

  // Cập nhật coach (RESTful style, giữ lại nếu đang dùng ở nơi khác)
  update: (id, data) => axiosClient.put(`/api/coaches/update/${id}`, data),

  // Cập nhật profile coach đúng chuẩn API backend (userId truyền qua query string)
  updateProfile: (userId, data) => axiosClient.put(`/api/coaches/update-profile?userId=${userId}`, data),

  // Lấy danh sách coach (cho admin)
  getAllAdmin: () => axiosClient.get('/api/coaches/all'),

  // Thêm coach mới (admin)
  adminCreate: (data) => axiosClient.post('/api/coaches/admin-create', data),

  // Xóa coach theo id (admin)
  adminDelete: (id) => axiosClient.delete(`/api/coaches/delete/${id}`),

  // BLOG POSTS API
  getAllBlogPosts: () => axiosClient.get('/api/blogposts'),
  getBlogPostById: (id) => axiosClient.get(`/api/blogposts/${id}`),
  createBlogPost: (data) => axiosClient.post('/api/blogposts', data),
  updateBlogPost: (id, data) => axiosClient.put(`/api/blogposts/${id}`, data),
  deleteBlogPost: (id) => axiosClient.delete(`/api/blogposts/${id}`),
};

export default coachApi; 