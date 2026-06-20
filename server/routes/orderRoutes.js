import express from 'express';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// TODO: Implement in Step 7 — Order Management
// router.post('/', protect, createOrder);
// router.get('/', protect, getMyOrders);
// router.get('/:id', protect, getOrderById);
// router.put('/:id/status', protect, admin, updateOrderStatus);
// router.put('/:id/cancel', protect, cancelOrder);

export default router;
