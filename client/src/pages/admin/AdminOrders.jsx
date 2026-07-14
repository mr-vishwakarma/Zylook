import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronDown, ChevronUp, Eye,
  Package, Truck, CheckCircle2, XCircle, Clock, RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  placed:             { label: 'Placed',           color: 'text-blue-500',   bg: 'bg-blue-500/10',   dot: 'bg-blue-500' },
  confirmed:          { label: 'Confirmed',         color: 'text-violet-500', bg: 'bg-violet-500/10', dot: 'bg-violet-500' },
  shipped:            { label: 'Shipped',           color: 'text-amber-500',  bg: 'bg-amber-500/10',  dot: 'bg-amber-500' },
  'out-for-delivery': { label: 'Out for Delivery',  color: 'text-orange-500', bg: 'bg-orange-500/10', dot: 'bg-orange-500' },
  delivered:          { label: 'Delivered',         color: 'text-emerald-500',bg: 'bg-emerald-500/10',dot: 'bg-emerald-500' },
  cancelled:          { label: 'Cancelled',         color: 'text-rose-500',   bg: 'bg-rose-500/10',   dot: 'bg-rose-500' },
  returned:           { label: 'Returned',          color: 'text-zinc-400',   bg: 'bg-zinc-500/10',   dot: 'bg-zinc-400' },
};

const STATUS_FLOW = ['confirmed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'];

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.placed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${cfg.color} ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ── Expanded Row ──────────────────────────────────────────────────────────────
const OrderRow = ({ order, onStatusUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const { data } = await adminService.updateOrderStatus(order._id, newStatus);
      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        onStatusUpdate(order._id, newStatus);
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hover:bg-[var(--admin-surface-hover)] transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5">
              {order.items?.slice(0, 2).map((item, i) => (
                <div key={i} className="w-8 h-10 rounded-md overflow-hidden border-2 border-[var(--admin-surface)] bg-[var(--admin-surface-hover)] shrink-0">
                  {item.product?.images?.[0] && (
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--admin-text)] font-mono">{order.orderNumber}</p>
              <p className="text-[10px] text-[var(--admin-text-muted)]">{date}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <p className="text-sm font-medium text-[var(--admin-text)]">{order.user?.name || '—'}</p>
          <p className="text-[11px] text-[var(--admin-text-muted)]">{order.user?.email}</p>
        </td>
        <td className="px-4 py-3.5 text-sm text-[var(--admin-text-muted)]">
          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
        </td>
        <td className="px-4 py-3.5 font-bold text-sm text-[var(--admin-text)]">
          ₹{order.finalAmount?.toLocaleString()}
        </td>
        <td className="px-4 py-3.5">
          <StatusBadge status={order.status} />
        </td>
        <td className="px-4 py-3.5 text-right">
          <button className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-hover)]">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </td>
      </motion.tr>

      {/* Expanded detail row */}
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={6} className="px-0 py-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-5 bg-[var(--admin-surface-hover)] border-b border-[var(--admin-border)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Items list */}
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--admin-text-muted)] mb-3">
                        Items
                      </h4>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-12 rounded-lg overflow-hidden bg-[var(--admin-surface)] shrink-0">
                              {item.product?.images?.[0] && (
                                <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[var(--admin-text)] truncate">{item.product?.name}</p>
                              <p className="text-[10px] text-[var(--admin-text-muted)]">
                                Size {item.selectedSize} × {item.quantity} · ₹{item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: address + status update */}
                    <div className="space-y-4">
                      {/* Address */}
                      {order.shippingAddress && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--admin-text-muted)] mb-2">
                            Shipping Address
                          </h4>
                          <p className="text-xs text-[var(--admin-text)] leading-relaxed">
                            {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                            {order.shippingAddress.state} — {order.shippingAddress.pincode}
                          </p>
                        </div>
                      )}

                      {/* Update Status */}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--admin-text-muted)] mb-2">
                            Update Status
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {STATUS_FLOW.map((s) => (
                              <button
                                key={s}
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(s); }}
                                disabled={updating || order.status === s}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all disabled:opacity-50
                                  ${order.status === s
                                    ? 'bg-[var(--admin-text)] text-[var(--admin-bg)]'
                                    : 'bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:border-[var(--admin-text-muted)]'
                                  }`}
                              >
                                {updating ? '...' : STATUS_CONFIG[s]?.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Main AdminOrders ───────────────────────────────────────────────────────────
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 15 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const { data } = await adminService.getOrders(params);
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      }
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
  };

  const TAB_STATUSES = ['all', 'placed', 'confirmed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'];

  const filteredOrders = search
    ? orders.filter(o =>
        o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-text)] tracking-tight">Orders</h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-1">
            {total} total orders across all statuses.
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 shrink-0">
        {TAB_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap capitalize transition-all
              ${statusFilter === s
                ? 'bg-[var(--admin-text)] text-[var(--admin-bg)]'
                : 'text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-hover)]'
              }`}
          >
            {s === 'all' ? 'All Orders' : STATUS_CONFIG[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md shrink-0">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
        <input
          type="text"
          placeholder="Search by order #, customer name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text)] text-sm rounded-xl pl-9 pr-4 py-2.5 focus:border-[var(--admin-text-muted)] outline-none transition-colors placeholder:text-[var(--admin-text-muted)]"
        />
      </div>

      {/* Table */}
      <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--admin-surface-hover)] border-b border-[var(--admin-border)] text-[var(--admin-text-muted)] text-[11px] font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Order</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Items</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[var(--admin-text-muted)] text-sm">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[var(--admin-text-muted)] text-sm">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <OrderRow key={order._id} order={order} onStatusUpdate={handleStatusUpdate} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3.5 border-t border-[var(--admin-border)] flex items-center justify-between">
            <span className="text-xs text-[var(--admin-text-muted)]">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
