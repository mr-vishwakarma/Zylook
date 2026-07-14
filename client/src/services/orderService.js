import api from './api';

const orderService = {
  // POST /api/orders — { shippingAddress, paymentMethod, paymentTransactionId? }
  createOrder: (data) => api.post('/orders', data),

  // GET /api/orders/my
  getMyOrders: (params = {}) => api.get('/orders/my', { params }),

  // GET /api/orders/:id
  getOrderById: (id) => api.get(`/orders/${id}`),

  // PUT /api/orders/:id/cancel
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),

  // Admin
  getAllOrders: (params = {}) => api.get('/orders/all', { params }),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export default orderService;
