import api from './axios';

export const usersApi = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  updateUserStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
};
