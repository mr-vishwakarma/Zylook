import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Shirt,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Menu,
  Moon,
  Sun
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const sidebarLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/outfits', icon: Shirt, label: 'Outfits' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[var(--admin-bg)] text-[var(--admin-text)] transition-colors duration-300">
      {/* ── Sidebar ── */}
      <motion.aside
        className="relative flex flex-col h-full border-r border-[var(--admin-border)] bg-[var(--admin-surface)] z-20"
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-5 border-b border-[var(--admin-border)]">
          <motion.div
            className="flex items-center gap-3 overflow-hidden"
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 text-white text-sm font-black shrink-0">
              Z
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="text-[var(--admin-text)] font-bold text-lg tracking-tight whitespace-nowrap"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  Zylook<span className="text-rose-500">.</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto scrollbar-hide">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-[var(--admin-text)] bg-[var(--admin-surface-hover)]'
                    : 'text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-hover)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-rose-500"
                      layoutId="admin-nav-indicator"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <link.icon
                    size={18}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-rose-500' : 'text-[var(--admin-text-muted)] group-hover:text-[var(--admin-text)]'
                    }`}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        className="whitespace-nowrap"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.12 }}
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-[var(--admin-border)] px-3 py-3">
          {/* Settings link */}
          <NavLink
            to="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-hover)] transition-all duration-200"
          >
            <Settings size={18} strokeWidth={1.8} className="shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>

          {/* Admin profile */}
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  className="flex-1 min-w-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm font-medium text-[var(--admin-text)] truncate">{user?.name || 'Admin'}</p>
                  <p className="text-[11px] text-[var(--admin-text-muted)] truncate">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--admin-surface)] border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-hover)] shadow-sm transition-all z-30"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--admin-border)] bg-[var(--admin-surface)]/80 backdrop-blur-xl shrink-0">
          {/* Left: Search */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[var(--admin-surface-hover)] border border-[var(--admin-border)] w-full group focus-within:border-[var(--admin-text-muted)] transition-colors">
              <Search size={15} className="text-[var(--admin-text-muted)] group-focus-within:text-[var(--admin-text)] transition-colors" />
              <input
                type="text"
                placeholder="Search products, outfits, orders…"
                className="bg-transparent text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] opacity-80 outline-none w-full"
              />
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-[var(--admin-text-muted)] border border-[var(--admin-border)] bg-[var(--admin-surface)] font-mono">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="relative w-9 h-9 rounded-xl bg-[var(--admin-surface-hover)] border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-all"
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>

            {/* Notifications */}
            <motion.button
              className="relative w-9 h-9 rounded-xl bg-[var(--admin-surface-hover)] border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-all"
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </motion.button>

            {/* Divider */}
            <div className="w-px h-6 bg-[var(--admin-border)] mx-2" />

            {/* Admin badge */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-[11px] font-semibold tracking-wide uppercase">
                Admin
              </span>
            </div>

            {/* Logout */}
            <motion.button
              onClick={handleLogout}
              className="w-9 h-9 rounded-xl bg-[var(--admin-surface-hover)] border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-text-muted)] hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all"
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <LogOut size={15} />
            </motion.button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ scrollbarGutter: 'stable' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
