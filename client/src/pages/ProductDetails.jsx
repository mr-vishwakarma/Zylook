import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  Wind, 
  Thermometer, 
  Feather, 
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../services/productService';
import useCart from '../hooks/useCart';

// Accordion Component
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#e5e4e7] py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-[#08060d] group-hover:text-[#ea580c] transition-colors">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-[#6b6375]" />
        ) : (
          <ChevronDown size={16} className="text-[#6b6375]" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2 text-sm text-[#6b6375] leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id === 'demo') throw new Error('Demo mode');
        const { data } = await productService.getProductById(id);
        if (data.success) {
          setProduct(data.product);
          if (data.product.sizes?.length > 0) {
            setSelectedSize(data.product.sizes[0].size);
          }
        }
      } catch (error) {
        // Fallback to beautiful mock data for the demo
        const mockProduct = {
          _id: 'demo',
          name: 'Astro Winter Armor II',
          brand: 'Zylook',
          description: 'A next-gen cold war jacket. The essence of retro style and the resilience you need for extreme winter conditions. Engineered to provide versatile function for your winter wardrobe, accented with strategic utility details.',
          price: 560,
          discountPrice: null,
          category: 'outerwear',
          isNew: true,
          sizes: [
            { size: 'S', stock: 5 },
            { size: 'M', stock: 12 },
            { size: 'L', stock: 8 },
            { size: 'XL', stock: 0 }
          ],
          colors: [
            { name: 'Beige', hex: '#e5e4d9' },
            { name: 'Red', hex: '#dc2626' },
            { name: 'Black', hex: '#171717' },
            { name: 'White', hex: '#fafafa' }
          ],
          images: [
            '/assets/products/astro-beige.png',
            '/assets/products/astro-red.png',
            '/assets/products/astro-black.png',
            '/assets/products/astro-white.png'
          ]
        };
        setProduct(mockProduct);
        setSelectedSize('M');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if stock is available for selected size
    const sizeData = product.sizes?.find(s => s.size === selectedSize);
    if (!sizeData || sizeData.stock <= 0) {
      toast.error('Selected size is out of stock');
      return;
    }

    addToCart(product, selectedSize, 1);
    toast.success('Added to Bag');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f8f6] pt-24 flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-[#ea580c]/20 border-t-[#ea580c] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f9f8f6] pt-24 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#08060d]">Product Not Found</h2>
        <Link to="/" className="mt-4 text-[#ea580c] hover:underline">Return to Home</Link>
      </div>
    );
  }

  // Formatting name logic to match the Astro style (last word highlighted)
  const nameParts = product.name.split(' ');
  const lastWord = nameParts.pop();
  const firstPart = nameParts.join(' ');

  const displayPrice = product.discountPrice || product.price;

  return (
    <div className="min-h-screen bg-[#f4f3ea] font-sans pb-20">
      
      {/* ── Top Grid Layout (Desktop) ── */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-28 lg:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start relative">
          
          {/* 1. Left Column (Details) */}
          <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col gap-6 lg:sticky lg:top-32">
            
            {/* Header / Brand */}
            <div>
              {product.isNew && (
                <span className="text-[#ea580c] text-[10px] font-black uppercase tracking-widest mb-4 block">
                  New Arrival
                </span>
              )}
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-[#08060d] leading-[1.1] tracking-tight uppercase">
                {firstPart} <span className="text-[#ea580c]">{lastWord}</span>
              </h1>
              
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-2xl lg:text-3xl font-bold text-[#08060d]">
                  ₹{displayPrice}
                </span>
                {product.discountPrice && (
                  <span className="text-sm font-semibold text-[#6b6375] line-through">
                    ₹{product.price}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-2">
              <h3 className="text-[10px] font-bold text-[#08060d] uppercase tracking-widest mb-2">Description</h3>
              <p className="text-sm text-[#6b6375] leading-relaxed">
                {product.description || "A next-gen garment engineered for ultimate comfort and resilience. Designed to provide versatile function for your wardrobe, accented with strategic utility details."}
              </p>
              <button className="mt-3 text-[10px] font-bold text-[#ea580c] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Read More <ArrowRight size={12} />
              </button>
            </div>

            {/* Accordions */}
            <div className="mt-6 border-t border-[#e5e4e7]">
              <Accordion title="Material & Care" defaultOpen={true}>
                {product.material ? (
                  <p>{product.material}</p>
                ) : (
                  <ul className="list-disc pl-4 space-y-1">
                    <li>100% Premium Technical Fabric</li>
                    <li>Machine wash cold, inside out</li>
                    <li>Do not tumble dry</li>
                    <li>Avoid ironing directly on prints</li>
                  </ul>
                )}
              </Accordion>
              <Accordion title="Shipping & Returns">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><Truck size={16} className="shrink-0 mt-0.5 text-[#ea580c]" /> <span>Free standard shipping on orders over ₹2000.</span></li>
                  <li className="flex items-start gap-2"><RotateCcw size={16} className="shrink-0 mt-0.5 text-[#ea580c]" /> <span>30-day return policy for unworn items with tags attached.</span></li>
                </ul>
              </Accordion>
            </div>
          </div>

          {/* 2. Center Column (Image Gallery) */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center">
            {/* Main Image Container */}
            <motion.div 
              className="w-full max-w-[600px] aspect-[4/5] lg:aspect-square relative flex items-center justify-center mix-blend-multiply"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Optional: Backdrop graphic / blueprint behind image if transparent */}
              <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                style={{
                  backgroundImage: 'radial-gradient(circle at center, #08060d 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />
              
              <img 
                src={product.images?.[activeImageIndex]} 
                alt={product.name} 
                className="relative z-10 w-full h-full object-contain filter drop-shadow-2xl"
              />
            </motion.div>

            {/* Feature Badges (Below Image) */}
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8 mt-8">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6b6375] uppercase tracking-wider">
                <Thermometer size={16} className="text-[#08060d]" /> Extreme Warmth
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#6b6375] uppercase tracking-wider">
                <Wind size={16} className="text-[#08060d]" /> Wind Resistant
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#6b6375] uppercase tracking-wider">
                <Feather size={16} className="text-[#08060d]" /> Lightweight
              </div>
            </div>
          </div>

          {/* 3. Right Column (Actions) */}
          <div className="lg:col-span-3 order-3 flex flex-col gap-8 lg:sticky lg:top-32 lg:pl-8">
            
            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold text-[#08060d] uppercase tracking-widest">Size</h3>
                  <button className="text-[10px] font-bold text-[#6b6375] uppercase tracking-widest hover:text-[#08060d] flex items-center gap-1">
                    Size Guide <ChevronDown size={12} />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize === s.size;
                    const isOutOfStock = s.stock <= 0;
                    
                    return (
                      <button
                        key={s.size}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(s.size)}
                        className={`
                          w-12 h-10 flex items-center justify-center rounded-lg text-xs font-bold uppercase transition-all
                          ${isSelected 
                            ? 'bg-[#ea580c] text-white shadow-lg shadow-orange-500/25 border border-[#ea580c]' 
                            : 'bg-white text-[#08060d] border border-[#e5e4e7] hover:border-[#ea580c]'}
                          ${isOutOfStock ? 'opacity-30 cursor-not-allowed bg-[#e5e4e7] line-through' : ''}
                        `}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color/Variant Selector (using alternate images if colors aren't defined) */}
            {product.images?.length > 1 && (
              <div>
                <h3 className="text-[10px] font-bold text-[#08060d] uppercase tracking-widest mb-4">Color / Views</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {product.images.map((img, idx) => {
                    const isSelected = activeImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`
                          relative aspect-square rounded-xl overflow-hidden bg-white transition-all
                          ${isSelected ? 'ring-2 ring-[#ea580c] ring-offset-2 ring-offset-[#f43f5e]/5' : 'border border-[#e5e4e7] hover:border-[#ea580c]/50'}
                        `}
                      >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply p-1" />
                        <div className="absolute bottom-1 w-full text-center">
                          {/* Pseudo color names for aesthetic if none exist */}
                          <span className="text-[8px] font-bold uppercase text-[#08060d] bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded">
                            {product.colors?.[idx]?.name || `View ${idx + 1}`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-3 mt-4">
              <button 
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-[#08060d] text-[#08060d] font-bold uppercase tracking-widest text-xs hover:bg-[#08060d] hover:text-white transition-colors"
              >
                <Heart size={16} /> Add to Wishlist
              </button>
              
              <button 
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-0.5"
              >
                Add to Bag <ShoppingBag size={16} />
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* ── Bottom Feature Grid ── */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mt-20 lg:mt-32">
        <div className="bg-[#efeee4] rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="flex flex-col lg:flex-row items-start gap-4">
              <div className="w-20 h-20 shrink-0 rounded-xl bg-[#e5e4d9] overflow-hidden">
                 <img src={product.images?.[0]} alt="Feature 1" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#08060d] uppercase tracking-widest mb-2">3X Water-Repellent</h4>
                <p className="text-xs text-[#6b6375] leading-relaxed">
                  The technical fabric repels rain, snow and moisture while keeping you dry and comfortable.
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-4">
              <div className="w-20 h-20 shrink-0 rounded-xl bg-[#e5e4d9] overflow-hidden flex items-center justify-center text-[#ea580c]">
                 <ShieldCheck size={32} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#08060d] uppercase tracking-widest mb-2">Durability</h4>
                <p className="text-xs text-[#6b6375] leading-relaxed">
                  Reinforced stitching and abrasion-resistant panels ensure this piece lasts through extreme wear.
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-4">
              <div className="w-20 h-20 shrink-0 rounded-xl bg-[#e5e4d9] overflow-hidden">
                 <img src={product.images?.[1] || product.images?.[0]} alt="Feature 3" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#08060d] uppercase tracking-widest mb-2">Insulation</h4>
                <p className="text-xs text-[#6b6375] leading-relaxed">
                  Advanced thermal filling locks in warmth without adding unnecessary bulk to your silhouette.
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-4">
              <div className="w-20 h-20 shrink-0 rounded-xl bg-[#e5e4d9] flex items-center justify-center overflow-hidden">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#08060d]">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#08060d] uppercase tracking-widest mb-2">Utility Pockets</h4>
                <p className="text-xs text-[#6b6375] leading-relaxed">
                  Multi-functional secure pockets designed for quick access to your daily essentials on the go.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
