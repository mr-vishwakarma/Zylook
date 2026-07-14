import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';

// ─── Helper: get or create cart for user ───────────────────────────────────
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate(
    'items.product',
    'name brand images price discountPrice sizes isActive'
  );
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// ─── GET /api/cart ──────────────────────────────────────────────────────────
export const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/cart/add ─────────────────────────────────────────────────────
export const addToCart = async (req, res, next) => {
  try {
    const { productId, selectedSize, quantity = 1 } = req.body;

    if (!productId || !selectedSize) {
      throw new ApiError('productId and selectedSize are required', 400);
    }

    // Validate product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      throw new ApiError('Product not found or unavailable', 404);
    }

    // Check stock for the requested size
    const sizeEntry = product.sizes?.find((s) => s.size === selectedSize);
    if (!sizeEntry || sizeEntry.stock < quantity) {
      throw new ApiError(
        `Not enough stock for size ${selectedSize}. Available: ${sizeEntry?.stock ?? 0}`,
        400
      );
    }

    const itemPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if same product + size already in cart → increment qty
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product?.toString() === productId &&
        item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (newQty > sizeEntry.stock) {
        throw new ApiError(`Only ${sizeEntry.stock} units available in size ${selectedSize}`, 400);
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        selectedSize,
        isOutfit: false,
        price: itemPrice,
      });
    }

    await cart.save();

    // Re-fetch with population
    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name brand images price discountPrice sizes isActive'
    );

    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/cart/update ───────────────────────────────────────────────────
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, selectedSize, quantity } = req.body;

    if (!productId || !selectedSize || quantity === undefined) {
      throw new ApiError('productId, selectedSize, and quantity are required', 400);
    }

    if (quantity < 1) {
      throw new ApiError('Quantity must be at least 1', 400);
    }

    // Validate stock
    const product = await Product.findById(productId);
    if (!product) throw new ApiError('Product not found', 404);

    const sizeEntry = product.sizes?.find((s) => s.size === selectedSize);
    if (!sizeEntry || sizeEntry.stock < quantity) {
      throw new ApiError(`Only ${sizeEntry?.stock ?? 0} units available in size ${selectedSize}`, 400);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new ApiError('Cart not found', 404);

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product?.toString() === productId &&
        item.selectedSize === selectedSize
    );

    if (itemIndex === -1) throw new ApiError('Item not found in cart', 404);

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name brand images price discountPrice sizes isActive'
    );

    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/cart/remove ────────────────────────────────────────────────
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, selectedSize } = req.body;

    if (!productId || !selectedSize) {
      throw new ApiError('productId and selectedSize are required', 400);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw new ApiError('Cart not found', 404);

    cart.items = cart.items.filter(
      (item) =>
        !(item.product?.toString() === productId && item.selectedSize === selectedSize)
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name brand images price discountPrice sizes isActive'
    );

    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/cart/clear ─────────────────────────────────────────────────
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ success: true, message: 'Cart already empty' });

    cart.items = [];
    await cart.save();

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
