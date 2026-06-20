import api from './api';

// TODO: Implement in Step 6
export const paymentService = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
};

export default paymentService;
