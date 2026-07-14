import express from 'express';
import { protect } from '../middleware/auth.js';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);

export default router;
