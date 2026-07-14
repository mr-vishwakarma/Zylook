import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Users, Package, BarChart2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

// ── Tiny sparkline bar chart ─────────────────────────────────────────────────
const MiniBarChart = ({ data, color = '#ea580c' }) => {
  if (!data || data.length === 0) return <div className="h-16 flex items-center justify-center text-[var(--admin-text-muted)] text-xs">No data</div>;
  const max = Math.max(...data.map(d => d.value || 0), 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.slice(-14).map((d, i) => {
        const height = Math.max(((d.value || 0) / max) * 100, 2);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
            <div
              className="w-full rounded-sm transition-all hover:opacity-80 cursor-pointer"
              style={{ height: `${height}%`, backgroundColor: color, opacity: 0.7 + (0.3 * (i / data.length)) }}
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--admin-text)] text-[var(--admin-bg)] text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
              {d.label}: {d.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Donut chart using SVG ─────────────────────────────────────────────────────
const DonutChart = ({ segments }) => {
  if (!segments || segments.length === 0) return null;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;
  const COLORS = ['#ea580c', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];
  let cumulative = 0;
  const r = 40, cx = 50, cy = 50, circumference = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-5">
      <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--admin-border)" strokeWidth="16" />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = pct * circumference;
          const gap = circumference - dash;
          const offset = -(cumulative * circumference);
          cumulative += pct;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={COLORS[i % COLORS.length]}
              strokeWidth="16"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })}
        <text x={cx} y={cy + 5} textAnchor="middle" className="text-xs font-bold fill-[var(--admin-text)]" fontSize="12" fontWeight="bold">
          {total}
        </text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: ['#ea580c','#8b5cf6','#10b981','#f59e0b','#3b82f6','#ec4899'][i % 6] }} />
            <span className="text-[var(--admin-text-muted)] capitalize">{seg.label}</span>
            <span className="font-bold text-[var(--admin-text)] ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl p-5">
    <div className="flex items-center justify-between mb-4">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--admin-text-muted)]">{title}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
    <p className="text-3xl font-black text-[var(--admin-text)] tracking-tight">{value}</p>
  </div>
);

// ── Main AdminAnalytics ───────────────────────────────────────────────────────
const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [orders, setOrders] = useState(null);
  const [users, setUsers] = useState(null);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [statsRes, revRes, orderRes, userRes] = await Promise.all([
        adminService.getStats(),
        adminService.getRevenueAnalytics(period),
        adminService.getOrderAnalytics(),
        adminService.getUserAnalytics(),
      ]);
      setStats(statsRes.data.stats);
      setRevenue(revRes.data.data || []);
      setOrders(orderRes.data.data);
      setUsers(userRes.data.data);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [period]);

  // Build chart data
  const revenueChartData = revenue.map(d => ({
    label: d._id,
    value: Math.round(d.revenue || 0),
  }));

  const signupsChartData = (users?.signupsByDay || []).map(d => ({
    label: d._id,
    value: d.count,
  }));

  const orderStatusSegments = (orders?.ordersByStatus || []).map(s => ({
    label: s._id,
    value: s.count,
  }));

  const userRoleSegments = (users?.usersByRole || []).map(r => ({
    label: r._id,
    value: r.count,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[var(--admin-border)] border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-text)] tracking-tight">Analytics</h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-1">Platform-wide performance overview.</p>
        </div>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all
                ${period === p ? 'bg-[var(--admin-text)] text-[var(--admin-bg)]' : 'text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)]'}`}
            >
              {p}
            </button>
          ))}
          <button onClick={fetchAll} className="p-2 rounded-lg hover:bg-[var(--admin-surface-hover)] text-[var(--admin-text-muted)] transition-colors">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Users"    value={stats?.totalUsers?.toLocaleString() || 0}    icon={Users}      color="bg-blue-500" />
        <KpiCard title="Total Orders"   value={stats?.totalOrders?.toLocaleString() || 0}   icon={ShoppingBag} color="bg-violet-500" />
        <KpiCard title="Products"       value={stats?.totalProducts?.toLocaleString() || 0} icon={Package}    color="bg-amber-500" />
        <KpiCard title="Today Revenue"  value={`₹${(stats?.todayRevenue || 0).toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500" />
      </div>

      {/* Revenue chart */}
      <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-bold text-[var(--admin-text)]">Revenue</h2>
            <p className="text-xs text-[var(--admin-text-muted)]">Paid orders over the last {period}</p>
          </div>
          <BarChart2 size={18} className="text-[var(--admin-text-muted)]" />
        </div>
        {revenueChartData.length > 0 ? (
          <MiniBarChart data={revenueChartData} color="#ea580c" />
        ) : (
          <div className="h-16 flex items-center justify-center text-[var(--admin-text-muted)] text-xs">
            No revenue data for this period
          </div>
        )}
      </div>

      {/* Bottom charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User signups */}
        <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl p-6">
          <h2 className="text-sm font-bold text-[var(--admin-text)] mb-1">New Users (30d)</h2>
          <p className="text-xs text-[var(--admin-text-muted)] mb-4">Daily signups</p>
          <MiniBarChart data={signupsChartData} color="#8b5cf6" />
        </div>

        {/* Order status breakdown */}
        <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl p-6">
          <h2 className="text-sm font-bold text-[var(--admin-text)] mb-1">Order Status</h2>
          <p className="text-xs text-[var(--admin-text-muted)] mb-4">All time breakdown</p>
          {orderStatusSegments.length > 0 ? (
            <DonutChart segments={orderStatusSegments} />
          ) : (
            <p className="text-xs text-[var(--admin-text-muted)]">No orders yet</p>
          )}
        </div>

        {/* User roles */}
        <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl p-6">
          <h2 className="text-sm font-bold text-[var(--admin-text)] mb-1">User Roles</h2>
          <p className="text-xs text-[var(--admin-text-muted)] mb-4">Platform role distribution</p>
          {userRoleSegments.length > 0 ? (
            <DonutChart segments={userRoleSegments} />
          ) : (
            <p className="text-xs text-[var(--admin-text-muted)]">No user data</p>
          )}
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[var(--admin-surface)] border border-amber-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Package size={18} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--admin-text)]">Low Stock Alert</p>
              <p className="text-xs text-[var(--admin-text-muted)]">
                {stats?.lowStockProducts || 0} products have ≤5 units left
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--admin-surface)] border border-rose-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <ShoppingBag size={18} className="text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--admin-text)]">Returns Pending</p>
              <p className="text-xs text-[var(--admin-text-muted)]">
                {stats?.pendingReturns || 0} orders awaiting return processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
