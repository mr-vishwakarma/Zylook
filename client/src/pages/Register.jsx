import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { isValidEmail, isValidName } from '../utils/validators';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error('Please enter all required fields');
    }

    if (!isValidName(name)) {
      return toast.error('Name must be at least 2 characters long');
    }

    if (!isValidEmail(email)) {
      return toast.error('Please enter a valid email address');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    setLoading(true);
    const toastId = toast.loading('Creating account...');

    try {
      const response = await register({ name, email, password });
      if (response.success) {
        toast.success(response.message || 'Account created successfully! Please verify your email.', { id: toastId });
        navigate('/');
      } else {
        toast.error(response.message || 'Registration failed', { id: toastId });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Something went wrong. Please try again.',
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Join Zylook to pre-curated complete looks</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <div className="input-wrapper">
            <input
              className="form-input"
              type="text"
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
            <User className="input-icon" />
          </div>
        </div>

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
              placeholder="•••••••• (Min. 6 characters)"
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
            <span>Creating account...</span>
          ) : (
            <>
              Sign Up <UserPlus size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <Link to="/login">
            Sign In <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
