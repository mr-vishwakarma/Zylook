import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Package,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const KPICard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group"
  >
    {/* Subtle glow effect */}
    <div className={`absolute -right-10 -top-10 w-32 h-32 blur-3xl opacity-10 rounded-full transition-opacity group-hover:opacity-20 ${colorClass}`} />
    
    <div className="flex items-center justify-between">
      <span className="text-[var(--admin-text-muted)] text-sm font-medium">{title}</span>
      <div className={`w-8 h-8 rounded-xl bg-[var(--admin-surface-hover)] border border-[var(--admin-border)] flex items-center justify-center ${colorClass}`}>
        <Icon size={16} />
      </div>
    </div>
    
    <div className="flex items-end justify-between">
      <h3 className="text-3xl font-bold text-[var(--admin-text)] tracking-tight">{value}</h3>
      {trend && (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md mb-1">
          <ArrowUpRight size={12} />
          {trend}
        </span>
      )}
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, revenueRes] = await Promise.all([
          adminService.getStats(),
          adminService.getRevenueAnalytics('7d'),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
        if (revenueRes.data.success) {
          setRevenueData(revenueRes.data.data);
        }
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--admin-text-muted)]">
        <div className="w-8 h-8 border-2 border-[var(--admin-border)] border-t-[var(--admin-text)] rounded-full animate-spin mr-3" />
        Loading Dashboard...
      </div>
    );
  }

  // Format chart data
  const chartData = {
    labels: revenueData.map((d) => {
      const date = new Date(d._id);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: revenueData.map((d) => d.revenue),
        borderColor: '#f43f5e', // rose-500
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        borderWidth: 2,
        tension: 0.4, // smooth curves
        fill: true,
        pointBackgroundColor: '#0a0a0f',
        pointBorderColor: '#f43f5e',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#111116',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: { 
          color: 'rgba(255,255,255,0.4)', 
          font: { size: 11 },
          callback: (value) => '₹' + value,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-text)] tracking-tight">Overview</h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-1">Here's what's happening today.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Today's Revenue" 
          value={`₹${stats?.todayRevenue?.toLocaleString() || 0}`} 
          icon={DollarSign} 
          trend="+12.5%" 
          colorClass="text-emerald-500"
        />
        <KPICard 
          title="Today's Orders" 
          value={stats?.todayOrders || 0} 
          icon={ShoppingCart} 
          trend="+5.2%" 
          colorClass="text-blue-500"
        />
        <KPICard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
          colorClass="text-violet-500"
        />
        <KPICard 
          title="Low Stock Items" 
          value={stats?.lowStockProducts || 0} 
          icon={AlertTriangle} 
          colorClass={stats?.lowStockProducts > 0 ? 'text-amber-500' : 'text-zinc-500'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-[var(--admin-text)]">Revenue (Last 7 Days)</h2>
            <select className="bg-[var(--admin-surface-hover)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] text-xs rounded-lg px-2.5 py-1.5 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px]">
            {revenueData.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--admin-text-muted)] text-sm">
                No revenue data for this period
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-[var(--admin-text)]">Recent Orders</h2>
            <button className="text-rose-500 text-xs font-medium hover:text-rose-600">View All</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {stats?.recentOrders?.length > 0 ? (
              stats.recentOrders.map(order => (
                <div key={order._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--admin-surface-hover)] transition-colors border border-transparent hover:border-[var(--admin-border)]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {order.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--admin-text)] truncate">{order.user?.name || 'Guest'}</p>
                    <p className="text-[11px] text-[var(--admin-text-muted)] truncate">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--admin-text)]">₹{order.finalAmount}</p>
                    <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">{order.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-[var(--admin-text-muted)] text-sm">
                <Package size={24} className="mb-2 opacity-50" />
                No recent orders
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
