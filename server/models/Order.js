import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    items: [
      {
        outfit: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Outfit',
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
        selectedSize: String,
        selectedColor: String,
        isOutfit: Boolean,
        price: Number,
      },
    ],
    shippingAddress: {
      label: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    payment: {
      method: {
        type: String,
        enum: ['razorpay', 'stripe', 'cod', 'upi'],
        required: true,
      },
      transactionId: String,
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      paidAt: Date,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'returned'],
      default: 'placed',
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
  },
  {
    timestamps: true,
  }
);

// Generate order number before save
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ZYL-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
