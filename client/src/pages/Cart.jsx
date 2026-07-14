import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import useCart from '../hooks/useCart';
import toast from 'react-hot-toast';

// ── Quantity Stepper ────────────────────────────────────────────────────────
const QtyControl = ({ qty, onInc, onDec, min = 1, max = 10 }) => (
  <div className="flex items-center gap-1 bg-[#f4f3ea] rounded-lg p-0.5">
    <button
      onClick={onDec}
      disabled={qty <= min}
      className="w-7 h-7 flex items-center justify-center rounded-md text-[#08060d] hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <Minus size={12} strokeWidth={2.5} />
    </button>
    <span className="w-6 text-center text-sm font-bold text-[#08060d]">{qty}</span>
    <button
      onClick={onInc}
      disabled={qty >= max}
      className="w-7 h-7 flex items-center justify-center rounded-md text-[#08060d] hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <Plus size={12} strokeWidth={2.5} />
    </button>
  </div>
);

// ── Cart Item Row ───────────────────────────────────────────────────────────
const CartItem = ({ item, onUpdate, onRemove }) => {
  const product = item.product;
  const name = product?.name || 'Product';
  const brand = product?.brand || '';
  const image = product?.images?.[0] || '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
      className="flex gap-5 py-6 border-b border-[#e5e4e7] group"
    >
      {/* Image */}
      <Link to={`/product/${product?._id}`} className="shrink-0">
        <div className="w-24 h-28 rounded-xl overflow-hidden bg-[#f4f3ea]">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#6b6375]">
              <ShoppingBag size={24} />
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div>
          <p className="text-[10px] font-bold text-[#6b6375] uppercase tracking-widest mb-1">
            {brand}
          </p>
          <Link
            to={`/product/${product?._id}`}
            className="text-sm font-bold text-[#08060d] hover:text-[#ea580c] transition-colors leading-tight line-clamp-2"
          >
            {name}
          </Link>
          <p className="text-xs text-[#6b6375] mt-1.5">
            Size: <span className="font-semibold text-[#08060d]">{item.selectedSize}</span>
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <QtyControl
            qty={item.quantity}
            onInc={() => onUpdate(product?._id, item.selectedSize, item.quantity + 1)}
            onDec={() => onUpdate(product?._id, item.selectedSize, item.quantity - 1)}
          />
          <button
            onClick={() => onRemove(product?._id, item.selectedSize)}
            className="p-1.5 rounded-lg text-[#6b6375] hover:text-rose-500 hover:bg-rose-50 transition-colors"
            title="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right flex flex-col items-end justify-between py-0.5">
        <span className="text-base font-bold text-[#08060d]">
          ₹{(item.price * item.quantity).toLocaleString()}
        </span>
        {item.quantity > 1 && (
          <span className="text-[11px] text-[#6b6375]">₹{item.price} each</span>
        )}
      </div>
    </motion.div>
  );
};

// ── Empty State ─────────────────────────────────────────────────────────────
const EmptyCart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <div className="w-24 h-24 rounded-full bg-[#f4f3ea] flex items-center justify-center mb-6">
      <ShoppingBag size={36} className="text-[#6b6375]" />
    </div>
    <h2 className="text-2xl font-black text-[#08060d] tracking-tight mb-2">Your bag is empty</h2>
    <p className="text-sm text-[#6b6375] mb-8 max-w-xs">
      Looks like you haven't added anything yet. Start exploring and find something you love.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#08060d] text-white font-bold text-sm rounded-xl uppercase tracking-widest hover:bg-[#ea580c] transition-colors"
    >
      Explore Collection <ArrowRight size={16} />
    </Link>
  </motion.div>
);

// ── Main Cart Page ──────────────────────────────────────────────────────────
const Cart = () => {
  const { cartItems, cartTotal, cartCount, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const FREE_SHIPPING_THRESHOLD = 2000;
  const DELIVERY_CHARGE = 99;
  const isEligibleForFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryCharge = isEligibleForFreeShipping ? 0 : DELIVERY_CHARGE;
  const finalTotal = cartTotal + deliveryCharge;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#e5e4e7] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-sm font-bold text-[#6b6375] hover:text-[#08060d] transition-colors flex items-center gap-1">
            ← Back
          </Link>
          <h1 className="text-base font-black uppercase tracking-widest text-[#08060d]">
            My Bag
            {cartCount > 0 && (
              <span className="ml-2 text-xs font-bold text-[#6b6375]">({cartCount} items)</span>
            )}
          </h1>
          <div className="w-12" /> {/* spacer */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

            {/* ── Left: Item List ── */}
            <div>
              {/* Free shipping bar */}
              {!isEligibleForFreeShipping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 bg-[#f4f3ea] rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Truck size={14} className="text-[#ea580c]" />
                    <span className="text-xs font-bold text-[#08060d]">
                      Add ₹{(FREE_SHIPPING_THRESHOLD - cartTotal).toLocaleString()} more for free delivery
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#e5e4e7] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#ea580c] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              )}

              {isEligibleForFreeShipping && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                  <Truck size={14} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">
                    🎉 You've unlocked free delivery!
                  </span>
                </div>
              )}

              {/* Items */}
              <AnimatePresence>
                {cartItems.map((item, idx) => (
                  <CartItem
                    key={`${item.product?._id}-${item.selectedSize}-${idx}`}
                    item={item}
                    onUpdate={updateQty}
                    onRemove={removeFromCart}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-[#f9f8f6] rounded-2xl p-6 border border-[#e5e4e7]">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#08060d] mb-6">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-3 text-sm mb-6">
                  <div className="flex justify-between text-[#6b6375]">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-semibold text-[#08060d]">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#6b6375]">
                    <span>Delivery</span>
                    {isEligibleForFreeShipping ? (
                      <span className="font-semibold text-emerald-600">FREE</span>
                    ) : (
                      <span className="font-semibold text-[#08060d]">₹{DELIVERY_CHARGE}</span>
                    )}
                  </div>

                  <div className="border-t border-[#e5e4e7] pt-3 flex justify-between">
                    <span className="font-black text-[#08060d]">Total</span>
                    <span className="font-black text-[#08060d] text-lg">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <div className="flex-1 flex items-center gap-2 bg-white border border-[#e5e4e7] rounded-xl px-3 py-2.5">
                    <Tag size={14} className="text-[#6b6375] shrink-0" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="flex-1 text-sm text-[#08060d] bg-transparent outline-none placeholder:text-[#6b6375]"
                    />
                  </div>
                  <button className="px-4 py-2.5 bg-[#08060d] text-white text-xs font-bold rounded-xl hover:bg-[#ea580c] transition-colors uppercase tracking-wider">
                    Apply
                  </button>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-sm rounded-xl uppercase tracking-widest transition-all hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>

                <p className="text-center text-[11px] text-[#6b6375] mt-4">
                  Free returns · Secure checkout · GST inclusive
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
