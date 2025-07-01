import axiosClient from "./AxiosCLients";

const coachApi = {
  // Lấy thông tin coach theo id
  getById: (id) => axiosClient.get(`/api/coaches/${id}`),

  // Lấy tất cả coach
  getAll: () => axiosClient.get('/api/coaches/all'),

  // Cập nhật coach (RESTful style, giữ lại nếu đang dùng ở nơi khác)
  update: (id, data) => axiosClient.put(`/api/coaches/update/${id}`, data),

  updateProfile: (userId, data) => axiosClient.put(`/api/coaches/update-profile?userId=${userId}`, data),

  // Lấy danh sách coach (cho admin)
  getAllAdmin: () => axiosClient.get('/api/coaches/all'),

  // Thêm coach mới (admin)
  adminCreate: (data) => axiosClient.post('/api/coaches/admin-create', data),

  // Xóa coach theo id (admin) - xóa cứng khỏi database
  adminDelete: (id) => axiosClient.delete(`/api/coaches/delete/${id}?hardDelete=true`),

  // Xóa coach hoàn toàn (cả coach và user tương ứng)
  adminDeleteComplete: (id) => axiosClient.delete(`/api/coaches/delete-complete/${id}`),

  // BLOG POSTS API
  getAllBlogPosts: () => axiosClient.get('/api/blogposts'),
  getBlogPostById: (id) => axiosClient.get(`/api/blogposts/${id}`),
  createBlogPost: (data) => axiosClient.post('/api/blogposts', data),
  updateBlogPost: (id, data) => axiosClient.put(`/api/blogposts/${id}`, data),
  deleteBlogPost: (id) => axiosClient.delete(`/api/blogposts/${id}`),

  // Lấy thống kê tổng quan cho coach
  getConsultationSummary: (coachId) => axiosClient.get(`/api/statistics/consultations/summary/${coachId}`),

  // Lấy thống kê số buổi tư vấn theo tháng cho coach
  getMonthlyConsultations: (coachId) => axiosClient.get(`/api/statistics/consultations/monthly/${coachId}`),

  // Thống kê doanh thu và người dùng cho admin
  getRevenueTotal: () => axiosClient.get('/api/statistics/revenue/total'),
  getRevenueSubscribers: () => axiosClient.get('/api/statistics/revenue/subscribers'),
  getMostPopularPackage: () => axiosClient.get('/api/statistics/revenue/most-popular-package'),
  getRevenueMonthly: () => axiosClient.get('/api/statistics/revenue/monthly'),
  getRevenueAvgPerMember: () => axiosClient.get('/api/statistics/revenue/average-per-member'),
  getUsersMonthly: () => axiosClient.get('/api/statistics/users/guest-member-monthly'),

  // Lấy danh sách consultation của coach
  getCoachConsultations: (coachId) => axiosClient.get(`/api/consultations/coach/${coachId}`),

  // PACKAGE API
  getAllPackages: () => axiosClient.get('/api/packages'),
  getPackageById: (id) => axiosClient.get(`/api/packages/${id}`),
  createPackage: (data) => axiosClient.post('/api/packages', data),
  updatePackage: (id, data) => axiosClient.put(`/api/packages/${id}`, data),
  deletePackage: (id) => axiosClient.delete(`/api/packages/${id}`),
};

export default coachApi; 