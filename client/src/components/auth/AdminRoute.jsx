import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * AdminRoute — Protects admin-only routes.
 * - If loading: shows a skeleton loader
 * - If not logged in: redirects to /login
 * - If logged in but not admin: redirects to / with a message
 * - If admin: renders children
 */
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm text-white/40 font-medium tracking-wide">Loading admin…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
