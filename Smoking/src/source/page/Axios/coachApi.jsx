import axiosClient from "./AxiosCLients";

const coachApi = {
  // Lấy thông tin coach theo id
  getById: (id) => axiosClient.get(`/api/coaches/${id}`),

  // Lấy tất cả coach
  getAll: () => axiosClient.get('/api/coaches/all'),

  // Tạo coach mới
  create: (data) => axiosClient.post('/api/coaches/create', data),

  // Cập nhật coach
  update: (id, data) => axiosClient.put(`/api/coaches/update/${id}`, data),

  // Xóa coach
  delete: (id) => axiosClient.delete(`/api/coaches/delete/${id}`),
};

export default coachApi; 