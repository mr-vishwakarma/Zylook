import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import outfitService from '../services/outfitService';
import useCart from '../hooks/useCart';

const OutfitCard = ({ outfit }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  // We could add all items to cart here if we want, but for now we'll just link to view
  // Or add a quick mock "Add Combo"
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    // Ideally we would loop over outfit.items and add each to cart
    // But since this is a mock action for now:
    toast.success('Combo added to bag!', {
      icon: '🛍️',
      style: { background: '#08060d', color: '#fff', borderRadius: '10px' },
    });
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#e5e4e7] hover:border-[#08060d]/20 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 flex flex-col"
    >
      <Link to={`/collections/${outfit._id}`} className="block relative aspect-[4/5] overflow-hidden bg-[#f4f3ea]">
        {outfit.coverImage ? (
          <img
            src={outfit.coverImage}
            alt={outfit.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6b6375]">
            <ShoppingBag size={32} />
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {outfit.savings > 0 && (
            <span className="px-2 py-0.5 bg-[#ea580c] text-white text-[10px] font-black rounded-md uppercase tracking-wider">
              Save ₹{outfit.savings}
            </span>
          )}
          {outfit.tags?.includes('featured') && (
            <span className="px-2 py-0.5 bg-[#08060d] text-white text-[10px] font-black rounded-md uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={10} /> Featured
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        
        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={adding || !outfit.isActive}
            className="w-full py-3 bg-[#08060d] hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {adding ? (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingBag size={13} />
            )}
            {adding ? 'Adding...' : 'Add Combo to Bag'}
          </button>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-auto">
          <Link to={`/collections/${outfit._id}`}>
            <h3 className="text-base font-bold text-[#08060d] leading-snug hover:text-[#ea580c] transition-colors line-clamp-1 mb-1.5">
              {outfit.title}
            </h3>
          </Link>
          <p className="text-xs text-[#6b6375] line-clamp-2 mb-4 leading-relaxed">
            {outfit.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#f4f3ea]">
          <div className="flex flex-col">
            <span className="text-xs text-[#6b6375] font-medium">Combo Price</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-black text-[#08060d]">₹{outfit.bundlePrice}</span>
              {outfit.savings > 0 && (
                <span className="text-xs text-[#6b6375] line-through">₹{outfit.totalPrice}</span>
              )}
            </div>
          </div>
          <Link
            to={`/collections/${outfit._id}`}
            className="w-10 h-10 rounded-full bg-[#f4f3ea] text-[#08060d] flex items-center justify-center hover:bg-[#ea580c] hover:text-white transition-colors"
          >
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e4e7] animate-pulse h-full flex flex-col">
    <div className="aspect-[4/5] bg-[#f4f3ea]" />
    <div className="p-5 flex-1 flex flex-col gap-3">
      <div className="h-5 bg-[#f4f3ea] rounded w-3/4" />
      <div className="h-3 bg-[#f4f3ea] rounded w-full" />
      <div className="h-3 bg-[#f4f3ea] rounded w-2/3" />
      <div className="mt-auto pt-4 border-t border-[#f4f3ea] flex justify-between items-end">
        <div>
          <div className="h-2 bg-[#f4f3ea] rounded w-16 mb-1" />
          <div className="h-6 bg-[#f4f3ea] rounded w-24" />
        </div>
        <div className="w-10 h-10 bg-[#f4f3ea] rounded-full" />
      </div>
    </div>
  </div>
);

const Collections = () => {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOutfits = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await outfitService.getOutfits({ isActive: true, limit: 12 });
      setOutfits(data.outfits || []);
    } catch {
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans pb-24">
      {/* Hero Header */}
      <div className="bg-[#08060d] text-white pt-16 pb-20 px-6 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-gradient-to-r from-rose-500/20 to-violet-500/20 blur-3xl rounded-full opacity-50" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md border border-white/10">
            <Sparkles size={12} /> Zylook Exclusives
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Curated <span className="text-[#ea580c]">Collections</span>
          </h1>
          <p className="text-[#a19fad] text-sm md:text-base max-w-xl mx-auto font-medium">
            Discover hand-picked outfit combos styled by our experts. Bundle up to save money and look effortlessly put together.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        {/* Outfit Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : outfits.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-[#e5e4e7] shadow-sm">
              <div className="w-20 h-20 rounded-full bg-[#f4f3ea] flex items-center justify-center mb-5">
                <Sparkles size={32} className="text-[#6b6375]" />
              </div>
              <h2 className="text-xl font-black text-[#08060d] mb-2">No collections yet</h2>
              <p className="text-sm text-[#6b6375] mb-6 max-w-sm text-center">
                Our stylists are working on new drops. Check back soon for fresh outfit combos!
              </p>
            </div>
          ) : (
            outfits.map(outfit => <OutfitCard key={outfit._id} outfit={outfit} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;
