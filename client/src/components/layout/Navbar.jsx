import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import productService from '../../services/productService';

// ── Debounce helper ─────────────────────────────────────────────────────────
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const Navbar = () => {
  const { cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 350);

  // Focus input when panel opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100);
    else { setQuery(''); setResults([]); }
  }, [searchOpen]);

  // Live search
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setSearching(true);
      try {
        const { data } = await productService.getProducts({ search: debouncedQuery, limit: 6, isActive: true });
        setResults(data.products || []);
      } catch { setResults([]); }
      finally { setSearching(false); }
    };
    fetchResults();
  }, [debouncedQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/collections', label: 'Collections' },
    { to: '/shop?category=topwear', label: 'Tops' },
    { to: '/shop?category=bottomwear', label: 'Bottoms' },
    { to: '/shop?category=footwear', label: 'Shoes' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#e5e4e7]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="text-xl font-black tracking-tight text-[#08060d] shrink-0">
            Zylook<span className="text-[#ea580c]">.</span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-3 py-2 text-sm font-medium text-[#6b6375] hover:text-[#08060d] hover:bg-[#f4f3ea] rounded-lg transition-all"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#6b6375] hover:text-[#08060d] hover:bg-[#f4f3ea] transition-all"
            >
              <Search size={18} />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#6b6375] hover:text-[#08060d] hover:bg-[#f4f3ea] transition-all"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ea580c] text-white text-[9px] font-black rounded-full flex items-center justify-center"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <Link
                to="/orders"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-[#6b6375] hover:text-[#08060d] hover:bg-[#f4f3ea] transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-black">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex px-4 py-2 bg-[#08060d] text-white text-xs font-bold rounded-xl uppercase tracking-wider hover:bg-[#ea580c] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e5e4e7] shadow-2xl"
            >
              <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto px-6 py-5">
                <div className="flex items-center gap-3 bg-[#f4f3ea] rounded-2xl px-4 py-3">
                  <Search size={18} className="text-[#6b6375] shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products, brands, categories..."
                    className="flex-1 bg-transparent text-[#08060d] text-base outline-none placeholder:text-[#6b6375]"
                  />
                  {searching && (
                    <div className="w-4 h-4 border-2 border-[#6b6375] border-t-transparent rounded-full animate-spin shrink-0" />
                  )}
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#e5e4e7] text-[#6b6375] transition-colors shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Results dropdown */}
                <AnimatePresence>
                  {results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="flex flex-col gap-1">
                        {results.map((product) => (
                          <Link
                            key={product._id}
                            to={`/product/${product._id}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f4f3ea] transition-colors"
                          >
                            <div className="w-10 h-12 rounded-lg overflow-hidden bg-[#f4f3ea] shrink-0">
                              {product.images?.[0] && (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#08060d] truncate">{product.name}</p>
                              <p className="text-xs text-[#6b6375]">{product.brand} · {product.category}</p>
                            </div>
                            <div className="text-sm font-bold text-[#08060d] shrink-0">
                              ₹{(product.discountPrice > 0 ? product.discountPrice : product.price).toLocaleString()}
                            </div>
                          </Link>
                        ))}
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-[#ea580c] hover:text-[#c2410c] transition-colors"
                        >
                          See all results for "{query}" <ArrowRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
