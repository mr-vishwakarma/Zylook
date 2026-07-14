import { ApiError } from '../utils/apiError.js';
import Order from '../models/Order.js';

// ─── POST /api/payments/create-order (Mock) ──────────────────────────────────
// In production: replace mock with → razorpay.orders.create({ amount, currency })
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) throw new ApiError('Invalid amount', 400);

    // Mock Razorpay order — same shape as real Razorpay response
    const mockOrder = {
      id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      entity: 'order',
      amount: Math.round(amount * 100), // Razorpay works in paise
      amount_paid: 0,
      amount_due: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
    };

    res.json({ success: true, order: mockOrder });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/payments/verify ───────────────────────────────────────────────
// In production: verify HMAC signature with razorpay secret
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_payment_id) {
      throw new ApiError('Payment verification failed — no payment ID', 400);
    }

    // Mock verification — always passes
    // In production: crypto.createHmac + compare signature
    const isValid = true;

    if (!isValid) throw new ApiError('Payment signature verification failed', 400);

    // Mark the order as paid
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        'payment.status': 'paid',
        'payment.transactionId': razorpay_payment_id,
        'payment.paidAt': new Date(),
        status: 'confirmed',
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    next(error);
  }
};
