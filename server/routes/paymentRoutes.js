import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// TODO: Implement in Step 6 — Payment Integration
// router.post('/create-order', protect, createPaymentOrder);     // Razorpay order
// router.post('/verify', protect, verifyPayment);                // Verify payment signature
// router.post('/webhook', handlePaymentWebhook);                 // Razorpay webhook (no auth)

export default router;
