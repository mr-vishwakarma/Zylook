import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, X, ShoppingBag, ArrowRight, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  placed:           { label: 'Order Placed',      color: 'text-blue-600',   bg: 'bg-blue-50',   dot: 'bg-blue-500',    icon: Package },
  confirmed:        { label: 'Confirmed',          color: 'text-violet-600', bg: 'bg-violet-50', dot: 'bg-violet-500',  icon: CheckCircle2 },
  shipped:          { label: 'Shipped',            color: 'text-amber-600',  bg: 'bg-amber-50',  dot: 'bg-amber-500',   icon: Truck },
  'out-for-delivery': { label: 'Out for Delivery', color: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-500',  icon: Truck },
  delivered:        { label: 'Delivered',          color: 'text-emerald-600',bg: 'bg-emerald-50',dot: 'bg-emerald-500', icon: CheckCircle2 },
  cancelled:        { label: 'Cancelled',          color: 'text-rose-600',   bg: 'bg-rose-50',   dot: 'bg-rose-500',    icon: XCircle },
  returned:         { label: 'Returned',           color: 'text-gray-600',   bg: 'bg-gray-50',   dot: 'bg-gray-400',    icon: Package },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.placed;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${cfg.color} ${cfg.bg}`}>
      <Icon size={12} /> {cfg.label}
    </span>
  );
};

// ── Single Order Card ────────────────────────────────────────────────────────
const OrderCard = ({ order, onCancel }) => {
  const [expanded, setExpanded] = useState(false);
  const canCancel = ['placed', 'confirmed'].includes(order.status);
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#e5e4e7] overflow-hidden"
    >
      {/* Header row */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#f9f8f6] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          {/* Thumbnail stack */}
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item, i) => (
              <div key={i} className="w-10 h-12 rounded-lg overflow-hidden bg-[#f4f3ea] border-2 border-white shrink-0">
                {item.product?.images?.[0] && (
                  <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                )}
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-10 h-12 rounded-lg bg-[#f4f3ea] border-2 border-white flex items-center justify-center shrink-0">
                <span className="text-[9px] font-black text-[#6b6375]">+{order.items.length - 3}</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-black text-[#08060d] font-mono">{order.orderNumber}</p>
            <p className="text-[11px] text-[#6b6375] mt-0.5">{date} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-[#08060d]">₹{order.finalAmount?.toLocaleString()}</p>
            <p className="text-[10px] text-[#6b6375] capitalize">{order.payment?.method === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
          </div>
          <StatusBadge status={order.status} />
          {expanded ? <ChevronUp size={16} className="text-[#6b6375]" /> : <ChevronDown size={16} className="text-[#6b6375]" />}
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#f4f3ea] px-5 py-5">
              {/* Items list */}
              <div className="space-y-3 mb-5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-xl overflow-hidden bg-[#f4f3ea] shrink-0">
                      {item.product?.images?.[0] && (
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#08060d] truncate">{item.product?.name || 'Product'}</p>
                      <p className="text-[10px] text-[#6b6375] mt-0.5">
                        Size: {item.selectedSize} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-[#08060d] shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="bg-[#f9f8f6] rounded-xl p-4 mb-4 text-xs space-y-1.5">
                <div className="flex justify-between text-[#6b6375]">
                  <span>Subtotal</span><span>₹{order.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6b6375]">
                  <span>Delivery</span>
                  <span className={order.deliveryCharge === 0 ? 'text-emerald-600 font-semibold' : ''}>
                    {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between font-black text-[#08060d] text-sm pt-1.5 border-t border-[#e5e4e7]">
                  <span>Total</span><span>₹{order.finalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Delivery address */}
              {order.shippingAddress && (
                <div className="text-xs text-[#6b6375] mb-4">
                  <span className="font-bold text-[#08060d]">Deliver to: </span>
                  {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </div>
              )}

              {/* Actions */}
              {canCancel && (
                <button
                  onClick={() => onCancel(order._id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                >
                  <X size={14} /> Cancel Order
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Main Orders Page ─────────────────────────────────────────────────────────
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await orderService.getMyOrders({ page, limit: 10 });
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.pagination.pages);
      }
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const { data } = await orderService.cancelOrder(orderId, 'Cancelled by user');
      if (data.success) {
        toast.success('Order cancelled');
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans">
      {/* Header */}
      <div className="bg-white border-b border-[#e5e4e7] px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black text-[#08060d] tracking-tight">My Orders</h1>
          <p className="text-sm text-[#6b6375] mt-1">View and track all your past purchases.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-[#e5e4e7] h-20 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#f4f3ea] flex items-center justify-center mb-5">
              <Package size={32} className="text-[#6b6375]" />
            </div>
            <h2 className="text-xl font-black text-[#08060d] mb-2">No orders yet</h2>
            <p className="text-sm text-[#6b6375] mb-8 max-w-xs">
              You haven't placed any orders yet. Start shopping and find something you love!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#08060d] text-white font-bold text-sm rounded-xl uppercase tracking-widest hover:bg-[#ea580c] transition-colors"
            >
              Start Shopping <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} onCancel={handleCancel} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-[#08060d] border border-[#e5e4e7] hover:bg-[#f4f3ea] disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-[#6b6375] font-medium">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-[#08060d] border border-[#e5e4e7] hover:bg-[#f4f3ea] disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
