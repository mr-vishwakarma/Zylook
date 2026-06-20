import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { isValidEmail } from '../utils/validators';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error('Please enter all required fields');
    }

    if (!isValidEmail(email)) {
      return toast.error('Please enter a valid email address');
    }

    setLoading(true);
    const toastId = toast.loading('Signing in...');

    try {
      const response = await login({ email, password });
      if (response.success) {
        toast.success(response.message || 'Welcome back to Zylook!', { id: toastId });
        navigate('/');
      } else {
        toast.error(response.message || 'Login failed', { id: toastId });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Invalid email or password. Please try again.',
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to discover your perfect look</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <div className="input-wrapper">
            <input
              className="form-input"
              type="email"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <Mail className="input-icon" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <div className="input-wrapper">
            <input
              className="form-input"
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <Lock className="input-icon" />
          </div>
        </div>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              Sign In <LogIn size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          <Link to="/register">
            Sign Up <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
