import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';

// ─── POST /api/orders ────────────────────────────────────────────────────────
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, paymentTransactionId } = req.body;

    if (!shippingAddress || !paymentMethod) {
      throw new ApiError('Shipping address and payment method are required', 400);
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price discountPrice sizes isActive'
    );

    if (!cart || cart.items.length === 0) {
      throw new ApiError('Cart is empty', 400);
    }

    // Validate stock and build order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = item.product;
      if (!product || !product.isActive) {
        throw new ApiError(`Product "${product?.name || 'Unknown'}" is no longer available`, 400);
      }

      const sizeEntry = product.sizes?.find((s) => s.size === item.selectedSize);
      if (!sizeEntry || sizeEntry.stock < item.quantity) {
        throw new ApiError(
          `Insufficient stock for "${product.name}" in size ${item.selectedSize}`,
          400
        );
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        isOutfit: item.isOutfit || false,
        price: item.price,
      });
    }

    // Deduct stock
    for (const item of orderItems) {
      await Product.findOneAndUpdate(
        { _id: item.product, 'sizes.size': item.selectedSize },
        { $inc: { 'sizes.$.stock': -item.quantity } }
      );
    }

    // Calculate totals
    const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryCharge = totalAmount >= 2000 ? 0 : 99;
    const finalAmount = totalAmount + deliveryCharge;

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      payment: {
        method: paymentMethod,
        transactionId: paymentTransactionId || null,
        status: paymentMethod === 'cod' ? 'pending' : 'paid',
        paidAt: paymentMethod !== 'cod' ? new Date() : undefined,
      },
      totalAmount,
      deliveryCharge,
      finalAmount,
      status: 'placed',
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
    });

    // Clear the cart
    cart.items = [];
    await cart.save();

    // Populate for response
    const populated = await Order.findById(order._id).populate(
      'items.product',
      'name brand images'
    );

    res.status(201).json({ success: true, order: populated });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/orders/my ──────────────────────────────────────────────────────
export const getMyOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name brand images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      orders,
      pagination: { page, pages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/orders/:id ─────────────────────────────────────────────────────
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.product',
      'name brand images price'
    );

    if (!order) throw new ApiError('Order not found', 404);

    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new ApiError('Not authorized to view this order', 403);
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/orders/:id/cancel ──────────────────────────────────────────────
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError('Order not found', 404);

    if (order.user.toString() !== req.user._id.toString()) {
      throw new ApiError('Not authorized', 403);
    }

    if (!['placed', 'confirmed'].includes(order.status)) {
      throw new ApiError('Order cannot be cancelled at this stage', 400);
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findOneAndUpdate(
        { _id: item.product, 'sizes.size': item.selectedSize },
        { $inc: { 'sizes.$.stock': item.quantity } }
      );
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason || 'Cancelled by user';
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/orders/:id/status (Admin only) ─────────────────────────────────
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      throw new ApiError('Invalid status', 400);
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === 'delivered' ? { deliveredAt: new Date() } : {}),
        ...(status === 'cancelled' ? { cancelledAt: new Date() } : {}),
      },
      { new: true }
    ).populate('items.product', 'name brand images');

    if (!order) throw new ApiError('Order not found', 404);

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/orders/all (Admin) ─────────────────────────────────────────────
export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = status && status !== 'all' ? { status } : {};
    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name brand images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      orders,
      pagination: { page, pages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    next(error);
  }
};
