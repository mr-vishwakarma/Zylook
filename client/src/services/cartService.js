import api from './api';

const cartService = {
  // GET /api/cart
  getCart: () => api.get('/cart'),

  // POST /api/cart/add  { productId, selectedSize, quantity }
  addToCart: (productId, selectedSize, quantity = 1) =>
    api.post('/cart/add', { productId, selectedSize, quantity }),

  // PUT /api/cart/update  { productId, selectedSize, quantity }
  updateCartItem: (productId, selectedSize, quantity) =>
    api.put('/cart/update', { productId, selectedSize, quantity }),

  // DELETE /api/cart/remove  { productId, selectedSize }
  removeFromCart: (productId, selectedSize) =>
    api.delete('/cart/remove', { data: { productId, selectedSize } }),

  // DELETE /api/cart/clear
  clearCart: () => api.delete('/cart/clear'),
};

export default cartService;
