import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Eye, LayoutTemplate } from 'lucide-react';
import toast from 'react-hot-toast';
import outfitService from '../../services/outfitService';

const AdminOutfits = () => {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOutfits = async () => {
    try {
      setLoading(true);
      // Wait, our backend search and get list are different routes.
      // If there's a search term, call search route. Otherwise call get route.
      let data;
      if (search.trim()) {
        const res = await outfitService.search(search, { page, limit: 12 });
        data = res.data;
      } else {
        const res = await outfitService.getOutfits({ page, limit: 12 });
        data = res.data;
      }

      if (data.success) {
        setOutfits(data.outfits);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      toast.error('Failed to load outfits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchOutfits();
    }, 400);
    return () => clearTimeout(delay);
  }, [search, page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this outfit combo?')) {
      try {
        const { data } = await outfitService.deleteOutfit(id);
        if (data.success) {
          toast.success('Outfit deactivated');
          fetchOutfits();
        }
      } catch (error) {
        toast.error('Failed to delete outfit');
      }
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Outfit Combos</h1>
          <p className="text-sm text-white/50 mt-1">Curate multi-product bundles and looks.</p>
        </div>
        <Link
          to="/admin/outfits/builder"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#ffffff', color: '#000000' }}
        >
          <Plus size={18} />
          <span>Build New Combo</span>
        </Link>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search outfits..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#111116] border border-white/[0.08] text-white text-sm rounded-xl pl-9 pr-4 py-2.5 focus:border-white/20 outline-none transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111116] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/20 transition-colors">
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>

      {/* Grid View */}
      <div className="flex-1 overflow-y-auto pb-10">
        {loading ? (
          <div className="flex justify-center py-20 text-white/40">Loading outfits...</div>
        ) : outfits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/40 border border-dashed border-white/10 rounded-2xl">
            <LayoutTemplate size={32} className="mb-3 opacity-50" />
            <p>No outfit combos found.</p>
            <Link to="/admin/outfits/builder" className="mt-4 text-rose-400 hover:text-rose-300 font-medium">
              Create your first combo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {outfits.map((outfit) => (
              <motion.div
                key={outfit._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111116] border border-white/[0.08] rounded-2xl overflow-hidden group flex flex-col"
              >
                {/* Cover Image */}
                <div className="relative aspect-[4/5] bg-white/5">
                  {outfit.coverImage ? (
                    <img src={outfit.coverImage} alt={outfit.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <LayoutTemplate size={24} />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {!outfit.isActive && (
                      <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white/70 text-[10px] font-bold uppercase tracking-wider rounded-md border border-white/10">
                        Draft
                      </span>
                    )}
                    {outfit.isFeatured && (
                      <span className="px-2 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors" title="View">
                      <Eye size={18} />
                    </button>
                    <Link to={`/admin/outfits/${outfit._id}/edit`} className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors" title="Edit">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(outfit._id)} className="w-10 h-10 rounded-full bg-rose-500/80 text-white flex items-center justify-center hover:bg-rose-500 transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-white truncate pr-2">{outfit.title}</h3>
                    <span className="text-sm font-bold text-emerald-400">₹{outfit.bundlePrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span className="capitalize">{outfit.category}</span>
                    <span className="line-through">₹{outfit.totalPrice}</span>
                  </div>
                  
                  <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center gap-1.5">
                    {outfit.items.slice(0, 4).map((item, i) => (
                      <div key={i} className="w-6 h-6 rounded-md bg-white/5 border border-white/10 overflow-hidden" title={item.product?.name}>
                        {item.product?.images?.[0] && (
                          <img src={item.product.images[0]} alt="item" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                    {outfit.items.length > 4 && (
                      <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[9px] text-white/50 font-bold">
                        +{outfit.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm text-white/70 bg-[#111116] border border-white/[0.08] hover:bg-white/5 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              <span className="px-3 py-1.5 text-sm text-white/50">
                {page} / {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm text-white/70 bg-[#111116] border border-white/[0.08] hover:bg-white/5 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOutfits;
