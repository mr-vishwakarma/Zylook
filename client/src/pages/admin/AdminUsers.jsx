import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, UserCheck, UserX, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const ROLE_CONFIG = {
  admin:   { label: 'Admin',   color: 'text-rose-500',   bg: 'bg-rose-500/10'   },
  creator: { label: 'Creator', color: 'text-violet-500', bg: 'bg-violet-500/10' },
  user:    { label: 'User',    color: 'text-blue-500',   bg: 'bg-blue-500/10'   },
};

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.user;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${cfg.color} ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
};

// ── Single User Row ─────────────────────────────────────────────────────────
const UserRow = ({ user, onRoleChange }) => {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const handleRole = async (newRole) => {
    if (newRole === user.role) { setOpen(false); return; }
    setUpdating(true);
    try {
      const { data } = await adminService.updateUserRole(user._id, newRole);
      if (data.success) {
        toast.success(`Role updated to ${newRole}`);
        onRoleChange(user._id, newRole);
        setOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hover:bg-[var(--admin-surface-hover)] transition-colors"
    >
      {/* Avatar + name */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              : user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--admin-text)]">{user.name}</p>
            <p className="text-[11px] text-[var(--admin-text-muted)]">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Role dropdown */}
      <td className="px-4 py-3.5 relative">
        <div className="relative w-fit">
          <button
            onClick={() => setOpen(!open)}
            disabled={updating}
            className="flex items-center gap-1 outline-none"
          >
            <RoleBadge role={user.role} />
            <ChevronDown size={12} className="text-[var(--admin-text-muted)]" />
          </button>
          {open && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl shadow-xl overflow-hidden min-w-[120px]">
              {Object.keys(ROLE_CONFIG).map(r => (
                <button
                  key={r}
                  onClick={() => handleRole(r)}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-2 transition-colors hover:bg-[var(--admin-surface-hover)]
                    ${user.role === r ? ROLE_CONFIG[r].color : 'text-[var(--admin-text-muted)]'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${user.role === r ? ROLE_CONFIG[r].bg.replace('/10','') : 'bg-[var(--admin-border)]'}`} />
                  {ROLE_CONFIG[r].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>

      {/* Joined */}
      <td className="px-4 py-3.5 text-sm text-[var(--admin-text-muted)]">{joinDate}</td>

      {/* Email verified */}
      <td className="px-4 py-3.5">
        {user.isEmailVerified ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
            <UserCheck size={12} /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--admin-text-muted)]">
            <UserX size={12} /> Unverified
          </span>
        )}
      </td>
    </motion.tr>
  );
};

// ── Main AdminUsers ────────────────────────────────────────────────────────────
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20, search: search || undefined, role: roleFilter || undefined };
      const { data } = await adminService.getUsers(params);
      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      }
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [page, search, roleFilter]);

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-text)] tracking-tight">Users</h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-1">{total} registered users.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text)] text-sm rounded-xl pl-9 pr-4 py-2.5 focus:border-[var(--admin-text-muted)] outline-none transition-colors placeholder:text-[var(--admin-text-muted)]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] text-sm rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="creator">Creator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--admin-surface-hover)] border-b border-[var(--admin-border)] text-[var(--admin-text-muted)] text-[11px] font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Joined</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-[var(--admin-text-muted)] text-sm">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-[var(--admin-text-muted)] text-sm">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <UserRow key={user._id} user={user} onRoleChange={handleRoleChange} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3.5 border-t border-[var(--admin-border)] flex items-center justify-between">
            <span className="text-xs text-[var(--admin-text-muted)]">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] disabled:opacity-40 transition-colors">
                Previous
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)] disabled:opacity-40 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
