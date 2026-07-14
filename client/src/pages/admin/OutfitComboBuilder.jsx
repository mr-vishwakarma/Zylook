import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, Save, X, Plus, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../../services/productService';
import outfitService from '../../services/outfitService';

const CATEGORIES = ['casual', 'formal', 'ethnic', 'party', 'seasonal', 'streetwear'];

export const OutfitComboBuilder = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  // Panel 1: Product Browser
  const [browserProducts, setBrowserProducts] = useState([]);
  const [browserSearch, setBrowserSearch] = useState('');
  const [browserFilter, setBrowserFilter] = useState(''); // 'topwear', 'bottomwear' etc
  
  // Panel 2: Outfit Canvas (Slots)
  const [slots, setSlots] = useState({
    topwear: null,
    bottomwear: null,
    footwear: null,
    accessories: null,
  });
  
  // Panel 3: Combo Settings
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'casual',
    gender: 'unisex',
    bundlePrice: '',
    isFeatured: false,
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // Fetch products for the browser
  useEffect(() => {
    const fetchBrowserProducts = async () => {
      try {
        const { data } = await productService.getProducts({ 
          search: browserSearch, 
          category: browserFilter,
          limit: 20, // Load top 20 for drag and drop
          isActive: true
        });
        if (data.success) {
          setBrowserProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to load products for browser', error);
      }
    };
    
    const delay = setTimeout(fetchBrowserProducts, 300);
    return () => clearTimeout(delay);
  }, [browserSearch, browserFilter]);

  // Fetch outfit if editing
  useEffect(() => {
    if (isEdit) {
      const fetchOutfit = async () => {
        try {
          const { data } = await outfitService.getById(id);
          if (data.success) {
            const o = data.outfit;
            setFormData({
              title: o.title,
              description: o.description,
              category: o.category,
              gender: o.gender,
              bundlePrice: o.bundlePrice,
              isFeatured: o.isFeatured,
            });
            setTags(o.tags || []);
            setCoverPreview(o.coverImage);
            
            // Map items to slots
            const newSlots = { ...slots };
            o.items.forEach(item => {
              if (item.role in newSlots && item.product) {
                newSlots[item.role] = item.product;
              }
            });
            setSlots(newSlots);
          }
        } catch (error) {
          toast.error('Failed to load outfit');
          navigate('/admin/outfits');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchOutfit();
    }
  }, [id]);

  // Derived Values
  const totalPrice = Object.values(slots)
    .filter(p => p !== null)
    .reduce((sum, p) => sum + p.price, 0);

  const savings = formData.bundlePrice ? Math.max(0, totalPrice - Number(formData.bundlePrice)) : 0;

  // --- Handlers ---
  const handleDragStart = (e, product) => {
    e.dataTransfer.setData('product', JSON.stringify(product));
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = (e, targetRole) => {
    e.preventDefault();
    const productStr = e.dataTransfer.getData('product');
    if (!productStr) return;
    
    const product = JSON.parse(productStr);
    
    // Validate role mapping (simple mapping based on product category)
    const roleMapping = {
      topwear: ['topwear', 'outerwear', 'ethnic'],
      bottomwear: ['bottomwear'],
      footwear: ['footwear'],
      accessories: ['accessories'],
    };

    if (roleMapping[targetRole].includes(product.category)) {
      setSlots(prev => ({ ...prev, [targetRole]: product }));
    } else {
      toast.error(`A ${product.category} cannot be placed in the ${targetRole} slot.`);
    }
  };

  const clearSlot = (role) => {
    setSlots(prev => ({ ...prev, [role]: null }));
  };

  const handleCoverSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (coverPreview && coverPreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview);
    }
    
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare items array
    const itemsToSave = [];
    Object.entries(slots).forEach(([role, product]) => {
      if (product) {
        itemsToSave.push({ product: product._id, role });
      }
    });

    if (itemsToSave.length === 0) {
      toast.error('Please add at least one product to the outfit');
      return;
    }

    if (!isEdit && !coverFile) {
      toast.error('Please select a cover image');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(key => {
        fd.append(key, formData[key]);
      });
      
      fd.append('items', JSON.stringify(itemsToSave));
      fd.append('tags', JSON.stringify(tags));
      
      if (coverFile) {
        fd.append('coverImage', coverFile);
      } else if (isEdit && coverPreview) {
        fd.append('coverImage', coverPreview); // passing existing URL back
      }

      if (isEdit) {
        const { data } = await outfitService.updateOutfit(id, fd);
        if (data.success) {
          toast.success('Outfit updated successfully');
          navigate('/admin/outfits');
        }
      } else {
        const { data } = await outfitService.createOutfit(fd);
        if (data.success) {
          toast.success('Outfit created successfully');
          navigate('/admin/outfits');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-10 text-white/50 text-center">Loading builder...</div>;

  return (
    <div className="flex flex-col h-full gap-4 max-w-[1400px] mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-2">
        <div className="flex items-center gap-4">
          <Link to="/admin/outfits" className="p-2 -ml-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {isEdit ? 'Edit Outfit Combo' : 'Combo Builder'}
            </h1>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          <span>{loading ? 'Saving...' : 'Save Combo'}</span>
        </button>
      </div>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
        
        {/* PANEL 1: Product Browser */}
        <div className="w-[300px] shrink-0 bg-[#111116] border border-white/[0.08] rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/[0.08] shrink-0">
            <h2 className="text-sm font-bold text-white mb-3">Product Catalog</h2>
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={browserSearch}
                onChange={(e) => setBrowserSearch(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.08] text-white text-[13px] rounded-lg pl-8 pr-3 py-1.5 focus:border-white/20 outline-none"
              />
            </div>
            <select
              value={browserFilter}
              onChange={(e) => setBrowserFilter(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.08] text-white/70 text-[12px] rounded-lg px-2 py-1.5 outline-none appearance-none capitalize"
            >
              <option value="">All Categories</option>
              <option value="topwear">Topwear</option>
              <option value="bottomwear">Bottomwear</option>
              <option value="footwear">Footwear</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {browserProducts.map(product => (
              <div
                key={product._id}
                draggable
                onDragStart={(e) => handleDragStart(e, product)}
                className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/10 cursor-grab active:cursor-grabbing transition-colors"
                title="Drag me to the canvas"
              >
                <div className="w-12 h-12 rounded-lg bg-black border border-white/10 overflow-hidden shrink-0 pointer-events-none">
                  {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0 pointer-events-none">
                  <p className="text-[12px] font-bold text-white truncate">{product.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-white/40 capitalize">{product.category}</p>
                    <p className="text-[11px] font-bold text-white/70">₹{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
            {browserProducts.length === 0 && (
              <div className="text-center py-10 text-[12px] text-white/30">
                No products found
              </div>
            )}
          </div>
        </div>

        {/* PANEL 2: Canvas */}
        <div className="flex-1 bg-[#111116] border border-white/[0.08] rounded-2xl flex flex-col overflow-hidden relative">
          <div className="absolute top-4 left-4 z-10">
            <h2 className="text-sm font-bold text-white">Outfit Canvas</h2>
            <p className="text-[11px] text-white/40">Drag products here to build the look</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="w-full max-w-sm flex flex-col gap-4 py-8">
              
              {/* Slots Map */}
              {Object.entries(slots).map(([role, product]) => (
                <div 
                  key={role}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, role)}
                  className={`relative flex items-center p-3 rounded-2xl transition-colors border-2 border-dashed ${
                    product 
                      ? 'bg-white/[0.02] border-white/20' 
                      : 'bg-transparent border-white/10 hover:border-white/20 hover:bg-white/[0.01]'
                  }`}
                >
                  {/* Slot Label (Vertical) */}
                  <div className="w-8 shrink-0 flex items-center justify-center mr-2">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest -rotate-90 whitespace-nowrap">
                      {role}
                    </span>
                  </div>

                  {/* Slot Content */}
                  <div className="flex-1 min-w-0">
                    {product ? (
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0">
                          {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{product.name}</p>
                          <p className="text-xs font-medium text-emerald-400 mt-1">₹{product.price}</p>
                        </div>
                        <button 
                          onClick={() => clearSlot(role)}
                          className="w-8 h-8 rounded-full bg-white/5 hover:bg-rose-500/10 text-white/30 hover:text-rose-400 flex items-center justify-center transition-colors shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="h-16 flex flex-col items-center justify-center text-white/20">
                        <Plus size={16} className="mb-1 opacity-50" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Drop {role}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>
          
          {/* Canvas Footer (Price summary) */}
          <div className="p-4 border-t border-white/[0.08] bg-white/[0.01] flex items-center justify-between">
            <div>
              <p className="text-[11px] text-white/40 uppercase font-bold tracking-wider mb-1">Total Individual MRP</p>
              <p className="text-lg font-bold text-white">₹{totalPrice}</p>
            </div>
            {formData.bundlePrice && savings > 0 && (
              <div className="text-right">
                <p className="text-[11px] text-emerald-400/70 uppercase font-bold tracking-wider mb-1">Bundle Savings</p>
                <p className="text-lg font-bold text-emerald-400">₹{savings}</p>
              </div>
            )}
          </div>
        </div>

        {/* PANEL 3: Settings */}
        <div className="w-[320px] shrink-0 bg-[#111116] border border-white/[0.08] rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/[0.08] shrink-0">
            <h2 className="text-sm font-bold text-white">Combo Settings</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Cover Image Upload */}
            <div>
              <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-2">Cover Image *</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-[3/4] w-32 rounded-xl border border-dashed overflow-hidden cursor-pointer group ${
                  coverPreview ? 'border-white/20' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs text-white font-medium">Change</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/30">
                    <ImageIcon size={20} className="mb-2" />
                    <span className="text-[10px] font-semibold uppercase">Upload</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleCoverSelect} accept="image/*" className="hidden" />
            </div>

            {/* Basic Info */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Combo Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/[0.08] text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-white/20"
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/[0.08] text-white text-sm rounded-xl px-3 py-2 outline-none capitalize"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#111116]">{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/[0.08] text-white text-sm rounded-xl px-3 py-2 outline-none capitalize"
                >
                  <option value="unisex" className="bg-[#111116]">Unisex</option>
                  <option value="men" className="bg-[#111116]">Men</option>
                  <option value="women" className="bg-[#111116]">Women</option>
                </select>
              </div>
            </div>

            {/* Bundle Pricing */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
              <label className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">Bundle Price (₹) *</label>
              <input
                type="number"
                value={formData.bundlePrice}
                onChange={(e) => setFormData({...formData, bundlePrice: e.target.value})}
                placeholder="Set combo price..."
                className="w-full bg-transparent border-b border-emerald-500/20 text-white text-lg font-bold px-1 py-1 outline-none focus:border-emerald-500/50 placeholder-emerald-500/30"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white/80">
                    {t}
                    <button onClick={() => setTags(tags.filter(tag => tag !== t))} className="hover:text-white"><X size={10}/></button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tag (enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="w-full bg-white/[0.02] border border-white/[0.08] text-white text-xs rounded-lg px-3 py-1.5 outline-none"
              />
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <span className="text-sm font-semibold text-white/80">Featured Outfit</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};
