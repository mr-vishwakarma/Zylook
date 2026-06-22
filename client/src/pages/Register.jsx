import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { isValidEmail } from '../utils/validators';

// UI components
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSocialRegister = (provider) => {
    toast.error(`${provider} registration is not implemented yet. Please use email.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      return toast.error('Please enter all required fields');
    }

    if (firstName.trim().length < 2) {
      return toast.error('First name must be at least 2 characters long');
    }

    if (!isValidEmail(email)) {
      return toast.error('Please enter a valid email address');
    }

    if (password.length < 8) {
      return toast.error('Password must be at least 8 characters long');
    }

    setLoading(true);
    const toastId = toast.loading('Creating account...');

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const response = await register({ name: fullName, email, password });
      
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
    <div className="min-h-screen w-full bg-black flex flex-col md:flex-row p-3 md:p-4 gap-4 md:gap-12 items-stretch box-border select-none">
      {/* Left Side - Rounded Purple Gradient Panel (Floated) */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-gradient-to-b from-purple-600 via-purple-900 to-[#0e071a] rounded-[2rem] p-10 flex-col justify-between relative overflow-hidden select-none">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[10%] w-[80%] h-[50%] bg-purple-400/20 blur-[50px] pointer-events-none" />
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5 text-lg font-bold text-white z-10">
          <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center font-extrabold text-[12px]">Z</div>
          <span className="tracking-wide">Zylook</span>
        </div>

        {/* Stepper & Text */}
        <div className="z-10 my-auto">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 leading-tight">Get Started with Us</h2>
          <p className="text-purple-200/70 text-sm leading-relaxed mb-8 max-w-xs">Complete these easy steps to register your account and unlock custom outfits.</p>

          <div className="flex flex-col gap-3.5 w-full">
            {/* Step 1 */}
            <div className="flex items-center gap-4.5 p-3.5 bg-white text-zinc-950 rounded-2xl shadow-lg transition-all duration-300">
              <span className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <span className="text-sm font-semibold">Sign up your account</span>
            </div>
            
            {/* Step 2 */}
            <div className="flex items-center gap-4.5 p-3.5 bg-white/5 border border-white/5 text-purple-200/60 rounded-2xl transition-all duration-300">
              <span className="w-6 h-6 rounded-full bg-white/10 text-white/80 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <span className="text-sm font-semibold">Set style preferences</span>
            </div>
            
            {/* Step 3 */}
            <div className="flex items-center gap-4.5 p-3.5 bg-white/5 border border-white/5 text-purple-200/60 rounded-2xl transition-all duration-300">
              <span className="w-6 h-6 rounded-full bg-white/10 text-white/80 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <span className="text-sm font-semibold">Explore curated outfits</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-purple-300/40 z-10">
          &copy; {new Date().getFullYear()} Zylook. All rights reserved.
        </div>
      </div>

      {/* Right Side - Immersive Dark Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 z-10 w-full">
        <div className="w-full max-w-[440px] py-6 text-left">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Sign Up Account</h3>
            <p className="text-zinc-400 text-sm">Enter your personal data to create your account.</p>
          </div>

          {/* Social Register Grid */}
          <div className="grid grid-cols-2 gap-3.5 mb-6">
            <Button
              variant="social"
              size="md"
              onClick={() => handleSocialRegister('Google')}
              icon={GoogleIcon}
            >
              Google
            </Button>
            <Button
              variant="social"
              size="md"
              onClick={() => handleSocialRegister('Github')}
              icon={GithubIcon}
            >
              Github
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center text-center my-6 text-zinc-800">
            <div className="flex-1 border-b border-zinc-900" />
            <span className="px-3.5 text-xs text-zinc-500 font-bold uppercase tracking-widest">Or</span>
            <div className="flex-1 border-b border-zinc-900" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4.5">
              <Input
                label="First Name"
                id="firstName"
                placeholder="eg. John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                required
              />
              <Input
                label="Last Name"
                id="lastName"
                placeholder="eg. Francisco"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="eg. johnfrans@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              helperText="Must be at least 8 characters."
            />

            <Button
              type="submit"
              variant="white"
              size="lg"
              loading={loading}
              className="mt-6 w-full"
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
