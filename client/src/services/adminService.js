import api from './api';

const adminService = {
  // Dashboard stats
  getStats: () => api.get('/admin/stats'),

  // Analytics
  getRevenueAnalytics: (period = '7d') =>
    api.get(`/admin/analytics/revenue?period=${period}`),
  getOrderAnalytics: () => api.get('/admin/analytics/orders'),
  getUserAnalytics: () => api.get('/admin/analytics/users'),
  getTopOutfits: () => api.get('/admin/analytics/top-outfits'),

  // User management
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  updateUserRole: (userId, role) =>
    api.patch(`/admin/users/${userId}/role`, { role }),

  // Order management
  getOrders: (params = {}) => api.get('/admin/orders', { params }),
  updateOrderStatus: (orderId, status) =>
    api.put(`/admin/orders/${orderId}/status`, { status }),
};

export default adminService;
