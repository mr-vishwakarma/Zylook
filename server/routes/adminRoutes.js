import express from 'express';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import {
  getDashboardStats,
  getRevenueAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
  getUsers,
  updateUserRole,
  getTopOutfits,
} from '../controllers/adminController.js';
import {
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, admin);

// Dashboard
router.get('/stats', getDashboardStats);

// Analytics
router.get('/analytics/revenue', getRevenueAnalytics);
router.get('/analytics/orders', getOrderAnalytics);
router.get('/analytics/users', getUserAnalytics);
router.get('/analytics/top-outfits', getTopOutfits);

// User management
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router;
