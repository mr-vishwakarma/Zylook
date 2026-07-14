import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, CreditCard, Truck, ChevronRight, CheckCircle2,
  Plus, Home, Briefcase, ShoppingBag, ArrowLeft, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';

// ── Step Indicator ──────────────────────────────────────────────────────────
const StepDot = ({ step, current, label }) => {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all
        ${done ? 'bg-emerald-500 text-white' : active ? 'bg-[#ea580c] text-white' : 'bg-[#f4f3ea] text-[#6b6375]'}`}>
        {done ? <CheckCircle2 size={16} /> : step}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-[#08060d]' : 'text-[#6b6375]'}`}>
        {label}
      </span>
    </div>
  );
};

// ── Address Form ─────────────────────────────────────────────────────────────
const AddressForm = ({ address, onChange }) => {
  const fields = [
    { key: 'street', label: 'Street Address', placeholder: 'House no., building, street', full: true },
    { key: 'city', label: 'City', placeholder: 'e.g. Mumbai' },
    { key: 'state', label: 'State', placeholder: 'e.g. Maharashtra' },
    { key: 'pincode', label: 'PIN Code', placeholder: '6-digit PIN', type: 'tel' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {fields.map(({ key, label, placeholder, full, type }) => (
        <div key={key} className={full ? 'col-span-2' : 'col-span-1'}>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6b6375] mb-1.5">
            {label}
          </label>
          <input
            type={type || 'text'}
            placeholder={placeholder}
            value={address[key] || ''}
            onChange={(e) => onChange({ ...address, [key]: e.target.value })}
            className="w-full px-4 py-3 bg-[#f9f8f6] border border-[#e5e4e7] rounded-xl text-sm text-[#08060d] placeholder:text-[#6b6375] focus:outline-none focus:border-[#ea580c] transition-colors"
          />
        </div>
      ))}
    </div>
  );
};

// ── Payment Option Card ───────────────────────────────────────────────────────
const PaymentCard = ({ id, selected, onSelect, icon: Icon, title, subtitle }) => (
  <button
    onClick={() => onSelect(id)}
    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
      ${selected === id
        ? 'border-[#ea580c] bg-[#fff8f5]'
        : 'border-[#e5e4e7] bg-white hover:border-[#08060d]/30'}`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
      ${selected === id ? 'bg-[#ea580c] text-white' : 'bg-[#f4f3ea] text-[#6b6375]'}`}>
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <p className={`text-sm font-bold ${selected === id ? 'text-[#ea580c]' : 'text-[#08060d]'}`}>
        {title}
      </p>
      <p className="text-xs text-[#6b6375]">{subtitle}</p>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
      ${selected === id ? 'border-[#ea580c]' : 'border-[#e5e4e7]'}`}>
      {selected === id && <div className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />}
    </div>
  </button>
);

// ── Order Item Row ─────────────────────────────────────────────────────────────
const OrderItemRow = ({ item }) => {
  const product = item.product;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#f4f3ea] last:border-0">
      <div className="w-12 h-14 rounded-lg overflow-hidden bg-[#f4f3ea] shrink-0">
        {product?.images?.[0] && (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#08060d] truncate">{product?.name}</p>
        <p className="text-[10px] text-[#6b6375] mt-0.5">Size: {item.selectedSize} · Qty: {item.quantity}</p>
      </div>
      <span className="text-sm font-bold text-[#08060d] shrink-0">
        ₹{(item.price * item.quantity).toLocaleString()}
      </span>
    </div>
  );
};

// ── Main Checkout ──────────────────────────────────────────────────────────────
const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1=Address, 2=Payment, 3=Review
  const [placing, setPlacing] = useState(false);

  const [address, setAddress] = useState({
    label: 'Home',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    pincode: user?.addresses?.[0]?.pincode || '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const FREE_SHIPPING = 2000;
  const deliveryCharge = cartTotal >= FREE_SHIPPING ? 0 : 99;
  const finalAmount = cartTotal + deliveryCharge;

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 p-6">
        <ShoppingBag size={48} className="text-[#6b6375]" />
        <h2 className="text-xl font-black text-[#08060d]">Your cart is empty</h2>
        <Link to="/" className="px-6 py-3 bg-[#ea580c] text-white font-bold rounded-xl text-sm uppercase tracking-wider">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const validateAddress = () => {
    const { street, city, state, pincode } = address;
    if (!street || !city || !state || !pincode) {
      toast.error('Please fill in all address fields');
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Please enter a valid 6-digit PIN code');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateAddress()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;
    setPlacing(true);
    const toastId = toast.loading('Placing your order...');

    try {
      if (paymentMethod === 'razorpay') {
        // Step 1: Create mock payment order
        const { data: payData } = await paymentService.createOrder({ amount: finalAmount });
        if (!payData.success) throw new Error('Payment initiation failed');

        // Step 2: Create the actual order with "paid" status
        const { data: orderData } = await orderService.createOrder({
          shippingAddress: address,
          paymentMethod: 'razorpay',
          paymentTransactionId: payData.order.id,
        });

        if (!orderData.success) throw new Error('Order creation failed');

        // Step 3: Verify (mock)
        await paymentService.verifyPayment({
          razorpay_order_id: payData.order.id,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: 'mock_signature',
          orderId: orderData.order._id,
        });

        toast.success('Payment successful! Order placed.', { id: toastId });
        await clearCart();
        navigate(`/order-success?id=${orderData.order._id}`);
      } else {
        // COD
        const { data } = await orderService.createOrder({
          shippingAddress: address,
          paymentMethod: 'cod',
        });

        if (!data.success) throw new Error(data.message || 'Order failed');
        toast.success('Order placed! Pay on delivery.', { id: toastId });
        await clearCart();
        navigate(`/order-success?id=${data.order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Order failed. Please try again.', { id: toastId });
    } finally {
      setPlacing(false);
    }
  };

  const stepLabels = ['Address', 'Payment', 'Review'];

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#e5e4e7]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/cart" className="text-sm text-[#6b6375] hover:text-[#08060d] flex items-center gap-1 transition-colors">
            <ArrowLeft size={16} /> Cart
          </Link>
          <div className="flex items-center gap-4">
            {stepLabels.map((label, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <StepDot step={idx + 1} current={step} label={label} />
                {idx < stepLabels.length - 1 && (
                  <div className={`w-8 h-0.5 rounded-full ${step > idx + 1 ? 'bg-emerald-400' : 'bg-[#e5e4e7]'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#6b6375]">
            <Lock size={12} /> Secure
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

        {/* ── Left Panel ── */}
        <div>
          <AnimatePresence mode="wait">

            {/* Step 1: Address */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="bg-white rounded-2xl p-6 border border-[#e5e4e7]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f3ea] flex items-center justify-center">
                      <MapPin size={20} className="text-[#ea580c]" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-[#08060d]">Delivery Address</h2>
                      <p className="text-xs text-[#6b6375]">Where should we deliver your order?</p>
                    </div>
                  </div>

                  {/* Address type selector */}
                  <div className="flex gap-2 mb-5">
                    {[{ id: 'Home', icon: Home }, { id: 'Work', icon: Briefcase }].map(({ id, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setAddress({ ...address, label: id })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all
                          ${address.label === id ? 'border-[#ea580c] text-[#ea580c] bg-[#fff8f5]' : 'border-[#e5e4e7] text-[#6b6375] hover:border-[#08060d]/30'}`}
                      >
                        <Icon size={14} /> {id}
                      </button>
                    ))}
                  </div>

                  <AddressForm address={address} onChange={setAddress} />
                </div>

                <button
                  onClick={handleNextStep}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-4 bg-[#08060d] hover:bg-[#ea580c] text-white font-black text-sm rounded-xl uppercase tracking-widest transition-all"
                >
                  Continue to Payment <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="bg-white rounded-2xl p-6 border border-[#e5e4e7]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f3ea] flex items-center justify-center">
                      <CreditCard size={20} className="text-[#ea580c]" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-[#08060d]">Payment Method</h2>
                      <p className="text-xs text-[#6b6375]">How would you like to pay?</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <PaymentCard
                      id="razorpay"
                      selected={paymentMethod}
                      onSelect={setPaymentMethod}
                      icon={CreditCard}
                      title="Pay Online"
                      subtitle="Credit / Debit card, UPI, Net Banking"
                    />
                    <PaymentCard
                      id="cod"
                      selected={paymentMethod}
                      onSelect={setPaymentMethod}
                      icon={Truck}
                      title="Cash on Delivery"
                      subtitle="Pay when your order arrives"
                    />
                  </div>

                  {paymentMethod === 'razorpay' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-[#f9f8f6] rounded-xl text-xs text-[#6b6375] border border-[#e5e4e7]"
                    >
                      🔒 Payments are processed securely. Your card details are never stored on our servers.
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-4 border border-[#e5e4e7] text-[#08060d] font-bold text-sm rounded-xl hover:bg-[#f4f3ea] transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#08060d] hover:bg-[#ea580c] text-white font-black text-sm rounded-xl uppercase tracking-widest transition-all"
                  >
                    Review Order <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                {/* Address Summary */}
                <div className="bg-white rounded-2xl p-5 border border-[#e5e4e7] mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#08060d]">Deliver to</h3>
                    <button onClick={() => setStep(1)} className="text-xs text-[#ea580c] font-bold hover:underline">Edit</button>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f4f3ea] flex items-center justify-center shrink-0">
                      <MapPin size={14} className="text-[#ea580c]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#08060d]">{address.label}</p>
                      <p className="text-xs text-[#6b6375] leading-relaxed mt-0.5">
                        {address.street}, {address.city}, {address.state} — {address.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-2xl p-5 border border-[#e5e4e7] mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#08060d]">Payment</h3>
                    <button onClick={() => setStep(2)} className="text-xs text-[#ea580c] font-bold hover:underline">Edit</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f4f3ea] flex items-center justify-center">
                      <CreditCard size={14} className="text-[#ea580c]" />
                    </div>
                    <p className="text-xs font-bold text-[#08060d]">
                      {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Card/UPI)'}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl p-5 border border-[#e5e4e7]">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#08060d] mb-3">
                    Items ({cartCount})
                  </h3>
                  {cartItems.map((item, idx) => (
                    <OrderItemRow key={idx} item={item} />
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-4 border border-[#e5e4e7] text-[#08060d] font-bold text-sm rounded-xl hover:bg-[#f4f3ea] transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20"
                  >
                    {placing ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</>
                    ) : (
                      <><Lock size={14} /> Place Order · ₹{finalAmount.toLocaleString()}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Right: Order Summary Sidebar ── */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl p-6 border border-[#e5e4e7]">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#08060d] mb-4">
              Order Summary
            </h2>
            <div className="max-h-56 overflow-y-auto mb-4 pr-1 space-y-2">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-12 rounded-lg overflow-hidden bg-[#f4f3ea] shrink-0">
                    {item.product?.images?.[0] && (
                      <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#08060d] truncate">{item.product?.name}</p>
                    <p className="text-[10px] text-[#6b6375]">Sz: {item.selectedSize} × {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-[#08060d]">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#f4f3ea] pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#6b6375]">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6b6375]">
                <span>Delivery</span>
                <span className={deliveryCharge === 0 ? 'text-emerald-600 font-semibold' : ''}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between font-black text-[#08060d] text-base pt-2 border-t border-[#f4f3ea]">
                <span>Total</span>
                <span>₹{finalAmount.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[10px] text-[#6b6375] text-center mt-4 flex items-center justify-center gap-1">
              <Lock size={10} /> 100% Secure · Free Returns · GST Inclusive
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
