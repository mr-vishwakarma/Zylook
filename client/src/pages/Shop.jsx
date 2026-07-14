import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal, X, ChevronDown, ShoppingBag,
  Heart, Star, Filter, Search, ArrowUpDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../services/productService';
import useCart from '../hooks/useCart';

// ── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'topwear', label: 'Tops' },
  { value: 'bottomwear', label: 'Bottoms' },
  { value: 'footwear', label: 'Footwear' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'ethnic', label: 'Ethnic' },
];

const GENDERS = [
  { value: '', label: 'All' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: Low → High' },
  { value: '-price', label: 'Price: High → Low' },
  { value: '-avgRating', label: 'Top Rated' },
];

// ── Price range slider ───────────────────────────────────────────────────────
const PRICE_RANGES = [
  { label: 'Any', min: '', max: '' },
  { label: 'Under ₹500', min: '', max: '500' },
  { label: '₹500 – ₹1,500', min: '500', max: '1500' },
  { label: '₹1,500 – ₹3,000', min: '1500', max: '3000' },
  { label: 'Above ₹3,000', min: '3000', max: '' },
];

// ── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const defaultSize = product.sizes?.find(s => s.stock > 0)?.size;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!defaultSize) {
      toast.error('Out of stock');
      return;
    }
    setAdding(true);
    await addToCart(product, defaultSize, 1);
    toast.success('Added to bag!', {
      icon: '🛍️',
      style: { background: '#08060d', color: '#fff', borderRadius: '10px' },
    });
    setAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#e5e4e7] hover:border-[#08060d]/20 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
    >
      {/* Image */}
      <Link to={`/product/${product._id}`} className="block relative">
        <div className="aspect-[3/4] overflow-hidden bg-[#f4f3ea]">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#6b6375]">
              <ShoppingBag size={32} />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-[#ea580c] text-white text-[10px] font-black rounded-md uppercase tracking-wider">
              -{discountPct}%
            </span>
          )}
          {product.tags?.includes('trending') && (
            <span className="px-2 py-0.5 bg-[#08060d] text-white text-[10px] font-black rounded-md uppercase tracking-wider">
              Trending
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlist(w => !w); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        >
          <Heart size={14} className={wishlist ? 'fill-rose-500 text-rose-500' : 'text-[#6b6375]'} />
        </button>

        {/* Quick Add — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleQuickAdd}
            disabled={adding || !defaultSize}
            className="w-full py-3 bg-[#08060d] hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {adding ? (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingBag size={13} />
            )}
            {adding ? 'Adding…' : defaultSize ? 'Quick Add' : 'Out of Stock'}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] font-bold text-[#6b6375] uppercase tracking-widest mb-0.5">{product.brand}</p>
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-bold text-[#08060d] leading-snug hover:text-[#ea580c] transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.avgRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-[#6b6375]">{product.avgRating.toFixed(1)}</span>
            {product.numReviews > 0 && (
              <span className="text-[10px] text-[#6b6375]">({product.numReviews})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-black text-[#08060d]">₹{price.toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-xs text-[#6b6375] line-through">₹{product.price.toLocaleString()}</span>
          )}
        </div>

        {/* Size dots */}
        {product.sizes?.length > 0 && (
          <div className="flex items-center gap-1 mt-2.5">
            {product.sizes.slice(0, 5).map((s) => (
              <span
                key={s.size}
                className={`text-[9px] px-1.5 py-0.5 rounded border font-bold
                  ${s.stock === 0 ? 'border-[#e5e4e7] text-[#c9c8cc] line-through' : 'border-[#c9c8cc] text-[#6b6375]'}`}
              >
                {s.size}
              </span>
            ))}
            {product.sizes.length > 5 && <span className="text-[9px] text-[#6b6375]">+{product.sizes.length - 5}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Filter Sidebar ────────────────────────────────────────────────────────────
const FilterSidebar = ({ filters, onChange, onReset, onClose, isDrawer }) => {
  const Section = ({ title, children }) => (
    <div className="border-b border-[#f4f3ea] pb-5 mb-5">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#6b6375] mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className={`flex flex-col gap-0 ${isDrawer ? 'p-6' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-black text-[#08060d] uppercase tracking-widest">Filters</h2>
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="text-xs font-bold text-[#ea580c] hover:underline">Reset</button>
          {isDrawer && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#f4f3ea]"><X size={16} /></button>
          )}
        </div>
      </div>

      <Section title="Category">
        <div className="flex flex-col gap-1">
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => onChange({ ...filters, category: c.value, page: 1 })}
              className={`text-left px-3 py-2 rounded-xl text-sm transition-all font-medium
                ${filters.category === c.value
                  ? 'bg-[#08060d] text-white font-bold'
                  : 'text-[#6b6375] hover:text-[#08060d] hover:bg-[#f4f3ea]'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Gender">
        <div className="flex flex-wrap gap-2">
          {GENDERS.map(g => (
            <button
              key={g.value}
              onClick={() => onChange({ ...filters, gender: g.value, page: 1 })}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all
                ${filters.gender === g.value
                  ? 'border-[#08060d] bg-[#08060d] text-white'
                  : 'border-[#e5e4e7] text-[#6b6375] hover:border-[#08060d]/40'}`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Price Range">
        <div className="flex flex-col gap-1">
          {PRICE_RANGES.map(p => {
            const active = filters.minPrice === p.min && filters.maxPrice === p.max;
            return (
              <button
                key={p.label}
                onClick={() => onChange({ ...filters, minPrice: p.min, maxPrice: p.max, page: 1 })}
                className={`text-left px-3 py-2 rounded-xl text-sm transition-all font-medium
                  ${active ? 'bg-[#08060d] text-white font-bold' : 'text-[#6b6375] hover:text-[#08060d] hover:bg-[#f4f3ea]'}`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
};

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e4e7] animate-pulse">
    <div className="aspect-[3/4] bg-[#f4f3ea]" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-[#f4f3ea] rounded w-1/3" />
      <div className="h-4 bg-[#f4f3ea] rounded w-3/4" />
      <div className="h-4 bg-[#f4f3ea] rounded w-1/2" />
    </div>
  </div>
);

// ── Main Shop Page ────────────────────────────────────────────────────────────
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: 1,
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 12, isActive: true };
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.gender) params.gender = filters.gender;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      params.sort = filters.sort;
      params.page = filters.page;

      const { data } = await productService.getProducts(params);
      setProducts(data.products || []);
      setTotalPages(data.pagination.pages);
      setTotal(data.pagination.total);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Sync URL with filters
  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.gender) params.gender = filters.gender;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.sort !== '-createdAt') params.sort = filters.sort;
    if (filters.page > 1) params.page = filters.page;
    setSearchParams(params, { replace: true });
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const resetFilters = () => {
    setFilters({ search: '', category: '', gender: '', minPrice: '', maxPrice: '', sort: '-createdAt', page: 1 });
  };

  const activeFilterCount = [
    filters.category, filters.gender,
    filters.minPrice || filters.maxPrice,
  ].filter(Boolean).length + (filters.search ? 1 : 0);

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === filters.sort)?.label || 'Newest';

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans">
      {/* Page header */}
      <div className="bg-white border-b border-[#e5e4e7]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-black text-[#08060d] tracking-tight">
            {filters.search ? `Search: "${filters.search}"` : filters.category
              ? CATEGORIES.find(c => c.value === filters.category)?.label || 'Shop'
              : 'All Products'}
          </h1>
          <p className="text-sm text-[#6b6375] mt-1">{loading ? '—' : `${total} products`}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Left: filter toggle */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e5e4e7] rounded-xl text-sm font-bold text-[#08060d] hover:border-[#08060d]/40 transition-all"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-[#ea580c] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Center: Category quick tabs — desktop */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => handleFilterChange({ ...filters, category: c.value })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all
                  ${filters.category === c.value
                    ? 'bg-[#08060d] text-white'
                    : 'text-[#6b6375] hover:text-[#08060d] hover:bg-white'}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Right: Sort */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e5e4e7] rounded-xl text-sm font-bold text-[#08060d] cursor-pointer">
              <ArrowUpDown size={14} />
              <select
                value={filters.sort}
                onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 1 }))}
                className="bg-transparent outline-none cursor-pointer text-sm font-bold text-[#08060d] appearance-none"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {filters.search && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#08060d] text-white rounded-full text-xs font-bold">
                "{filters.search}"
                <button onClick={() => setFilters(f => ({ ...f, search: '', page: 1 }))}><X size={11} /></button>
              </span>
            )}
            {filters.category && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#08060d] text-white rounded-full text-xs font-bold capitalize">
                {filters.category}
                <button onClick={() => setFilters(f => ({ ...f, category: '', page: 1 }))}><X size={11} /></button>
              </span>
            )}
            {filters.gender && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#08060d] text-white rounded-full text-xs font-bold capitalize">
                {filters.gender}
                <button onClick={() => setFilters(f => ({ ...f, gender: '', page: 1 }))}><X size={11} /></button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#08060d] text-white rounded-full text-xs font-bold">
                ₹{filters.minPrice || 0} – ₹{filters.maxPrice || '∞'}
                <button onClick={() => setFilters(f => ({ ...f, minPrice: '', maxPrice: '', page: 1 }))}><X size={11} /></button>
              </span>
            )}
            <button onClick={resetFilters} className="text-xs text-[#6b6375] hover:text-[#ea580c] font-medium">
              Clear all
            </button>
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          ) : products.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-[#f4f3ea] flex items-center justify-center mb-5">
                <ShoppingBag size={32} className="text-[#6b6375]" />
              </div>
              <h2 className="text-xl font-black text-[#08060d] mb-2">No products found</h2>
              <p className="text-sm text-[#6b6375] mb-6">Try changing your filters or search query.</p>
              <button onClick={resetFilters} className="px-6 py-3 bg-[#ea580c] text-white font-bold rounded-xl text-sm">
                Clear Filters
              </button>
            </div>
          ) : (
            products.map(product => <ProductCard key={product._id} product={product} />)
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setFilters(f => ({ ...f, page: Math.max(1, f.page - 1) }))}
              disabled={filters.page === 1}
              className="px-5 py-2.5 rounded-xl text-sm font-bold border border-[#e5e4e7] bg-white text-[#08060d] hover:bg-[#f4f3ea] disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setFilters(f => ({ ...f, page: pageNum }))}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all
                      ${filters.page === pageNum ? 'bg-[#08060d] text-white' : 'text-[#6b6375] hover:bg-white'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages, f.page + 1) }))}
              disabled={filters.page === totalPages}
              className="px-5 py-2.5 rounded-xl text-sm font-bold border border-[#e5e4e7] bg-white text-[#08060d] hover:bg-[#f4f3ea] disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ── Filter Drawer (mobile + desktop slide-in) ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-2xl overflow-y-auto"
            >
              <FilterSidebar
                filters={filters}
                onChange={(f) => { handleFilterChange(f); setDrawerOpen(false); }}
                onReset={() => { resetFilters(); setDrawerOpen(false); }}
                onClose={() => setDrawerOpen(false)}
                isDrawer
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
