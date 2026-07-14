import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, Home, MapPin, Truck } from 'lucide-react';
import orderService from '../services/orderService';

// ── Confetti particles ────────────────────────────────────────────────────────
const Confetti = () => {
  const colors = ['#ea580c', '#f59e0b', '#10b981', '#6366f1', '#ec4899'];
  const particles = Array.from({ length: 20 });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: '-10px',
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 1.5,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
};

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) { setLoading(false); return; }
      try {
        const { data } = await orderService.getOrderById(orderId);
        if (data.success) setOrder(data.order);
      } catch {
        // Silently fail — show generic success
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const estimatedDate = order?.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long'
      })
    : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long'
      });

  const steps = [
    { label: 'Order Placed', done: true, icon: CheckCircle2 },
    { label: 'Processing', done: false, icon: Package },
    { label: 'Shipped', done: false, icon: Truck },
    { label: 'Delivered', done: false, icon: Home },
  ];

  return (
    <div className="min-h-screen bg-[#f9f8f6] flex items-center justify-center p-6 relative overflow-hidden">
      <Confetti />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Success Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[#e5e4e7] shadow-xl shadow-black/5">
          {/* Top banner */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-8 py-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 size={40} className="text-white" />
            </motion.div>
            <h1 className="text-2xl font-black text-white tracking-tight">Order Placed!</h1>
            <p className="text-emerald-100 text-sm mt-1">
              Thank you for shopping with Zylook
            </p>
          </div>

          <div className="p-8">
            {/* Order Number */}
            {order?.orderNumber && (
              <div className="text-center mb-6 p-4 bg-[#f9f8f6] rounded-xl border border-[#e5e4e7]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b6375] mb-1">Order Number</p>
                <p className="text-sm font-black text-[#08060d] font-mono">{order.orderNumber}</p>
              </div>
            )}

            {/* Estimated Delivery */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-[#fff8f5] rounded-xl border border-orange-100">
              <div className="w-10 h-10 rounded-xl bg-[#ea580c] flex items-center justify-center shrink-0">
                <Truck size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b6375]">
                  Estimated Delivery
                </p>
                <p className="text-sm font-bold text-[#08060d]">{estimatedDate}</p>
              </div>
            </div>

            {/* Delivery Address */}
            {order?.shippingAddress && (
              <div className="flex items-start gap-3 mb-6 p-4 bg-[#f9f8f6] rounded-xl border border-[#e5e4e7]">
                <MapPin size={16} className="text-[#ea580c] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b6375] mb-0.5">Delivering to</p>
                  <p className="text-xs text-[#08060d] leading-relaxed">
                    {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state} — {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            )}

            {/* Order Progress */}
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b6375] mb-4">Order Status</p>
              <div className="flex items-center gap-1">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="flex items-center flex-1">
                      <div className={`flex flex-col items-center gap-1 ${idx === 0 ? 'flex-1' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                          ${idx === 0 ? 'bg-emerald-500 text-white' : 'bg-[#f4f3ea] text-[#6b6375]'}`}>
                          <Icon size={14} />
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider text-center
                          ${idx === 0 ? 'text-emerald-600' : 'text-[#6b6375]'}`}>
                          {s.label}
                        </span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 rounded-full mx-1 mb-4 ${idx === 0 ? 'bg-emerald-200' : 'bg-[#e5e4e7]'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <Link
                to="/orders"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#08060d] text-white font-bold text-sm rounded-xl uppercase tracking-widest hover:bg-[#ea580c] transition-colors"
              >
                Track Order <ArrowRight size={16} />
              </Link>
              <Link
                to="/"
                className="w-full flex items-center justify-center py-3.5 border border-[#e5e4e7] text-[#6b6375] font-bold text-sm rounded-xl hover:bg-[#f4f3ea] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
