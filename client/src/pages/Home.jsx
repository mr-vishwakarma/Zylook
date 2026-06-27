import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, ArrowRight, Star, Sparkles, Zap, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   REUSABLE: scroll-triggered fade-in wrapper
   ───────────────────────────────────────────────────────── */
const Reveal = ({ children, delay = 0, y = 32, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────
   SVG ASSETS (inline for zero-dependency rendering)
   ───────────────────────────────────────────────────────── */

// Coral organic blob for the background
const CoralBlob = ({ className = '' }) => (
  <svg viewBox="0 0 500 500" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M440,290Q430,380,350,420Q270,460,190,430Q110,400,70,320Q30,240,80,170Q130,100,210,70Q290,40,360,90Q430,140,440,220Z"
      fill="currentColor"
    />
  </svg>
);

// Brush stroke SVG behind headline text
const BrushStroke = ({ className = '' }) => (
  <svg viewBox="0 0 300 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10,40 Q40,10 80,35 Q120,55 160,30 Q200,10 240,38 Q270,55 290,25"
      stroke="currentColor"
      strokeWidth="28"
      strokeLinecap="round"
      opacity="0.25"
    />
  </svg>
);

// Simple abstract shapes for the coral card bg
const AbstractShapes = ({ className = '' }) => (
  <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="320" cy="80" r="60" fill="rgba(255,255,255,0.1)" />
    <circle cx="350" cy="300" r="40" fill="rgba(255,255,255,0.08)" />
    <circle cx="60" cy="350" r="30" fill="rgba(255,255,255,0.06)" />
    <path d="M280,180 Q320,120 360,180 Q320,240 280,180Z" fill="rgba(255,255,255,0.07)" />
  </svg>
);

/* ─────────────────────────────────────────────────────────
   FEATURE ICONS
   ───────────────────────────────────────────────────────── */
const features = [
  { icon: Sparkles, label: 'Future\nThreads' },
  { icon: Zap, label: 'Unique\nDesigns' },
  { icon: Star, label: 'Limited\nDrops' },
];

/* ═════════════════════════════════════════════════════════
   HOME PAGE COMPONENT
   ═════════════════════════════════════════════════════════ */
const Home = () => {
  return (
    <div className="w-full bg-white">
      {/* ════════════ NAVBAR ════════════ */}
      <nav className="flex items-center justify-between px-10 py-5">
        {/* Left nav links */}
        <div className="flex items-center gap-8">
          {['Shop', 'Collections', 'About', 'Contact'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors tracking-wide"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Center logo */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <a href="/">
            <img
              src="/assets/logo/zylook-logo.png"
              alt="Zylook"
              className="h-36 object-contain"
              onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-xl font-black tracking-[0.12em] text-zinc-900 uppercase">Zylook</span>'; }}
            />
          </a>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-5">
          <button className="p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors">
            <Search size={18} strokeWidth={2} />
          </button>
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-rose-300 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 -ml-2 flex items-center justify-center border-2 border-white">
              <span className="text-[10px] font-bold text-white">Z</span>
            </div>
          </div>
          <motion.button
            className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-[#ff6c6e] text-white text-xs font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <ShoppingBag size={14} />
            1 product
          </motion.button>
        </div>
      </nav>

      {/* ════════════ HERO SECTION ════════════ */}
      <section className="relative px-10 pb-0 pt-4">
        {/* ── HEADLINE ROW: "Own the EDGE" … "Keep the VIBE" ── */}
        <div className="relative flex items-start justify-between mb-0 z-20 pointer-events-none select-none">
          {/* Left headline */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrushStroke className="absolute -top-2 -left-4 w-[320px] text-[#ff6c6e]" />
            <h1 className="relative text-zinc-900 m-0 leading-[0.95]">
              <span
                className="block text-[42px] font-normal tracking-normal"
                style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}
              >
                Own the
              </span>
              <span className="block text-[86px] font-black tracking-[-0.03em] uppercase leading-[0.9]"
                style={{ fontFamily: 'var(--sans)' }}
              >
                EDGE
              </span>
            </h1>
          </motion.div>

          {/* Right headline */}
          <motion.div
            className="relative text-right mt-4"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrushStroke className="absolute -top-1 right-0 w-[280px] text-[#ff6c6e] scale-x-[-1]" />
            <h1 className="relative text-zinc-900 m-0 leading-[0.95]">
              <span
                className="block text-[38px] font-normal tracking-normal"
                style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}
              >
                Keep the
              </span>
              <span className="block text-[86px] font-black tracking-[-0.03em] uppercase leading-[0.9]"
                style={{ fontFamily: 'var(--sans)' }}
              >
                VIBE
              </span>
            </h1>
          </motion.div>
        </div>

        {/* ── HERO CARD AREA (coral bg + model + right content) ── */}
        <div className="relative -mt-12 z-10">
          {/* The coral card */}
          <div
            className="relative w-full rounded-[28px] overflow-hidden"
            style={{ background: 'rgb(255,108,110)' }}
          >
            {/* Abstract shapes overlay */}
            <AbstractShapes className="absolute inset-0 w-full h-full" />

            <div className="relative flex min-h-[460px]">
              {/* ── LEFT COLUMN — text content ── */}
              <div className="flex-1 flex flex-col justify-center px-12 py-10 max-w-[380px] z-10">
                {/* New Arrivals tag */}
                <motion.span
                  className="text-[11px] font-semibold text-white/70 uppercase tracking-[0.15em] mb-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  New Arrivals
                </motion.span>

                {/* Main heading */}
                <motion.h2
                  className="text-[40px] leading-[1.05] font-black text-white tracking-[-0.02em] mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  Where Art Meets
                  <br />
                  your Style
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  className="text-[14px] text-white/75 leading-relaxed mb-8 max-w-[260px]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  Step into the future of streetwear today.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <motion.button
                    className="group inline-flex items-center gap-3 px-7 py-3.5 bg-white text-zinc-900 text-[13px] font-bold rounded-full shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    New Drops
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ff6c6e] text-white group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight size={13} strokeWidth={2.5} />
                    </span>
                  </motion.button>
                </motion.div>

                {/* Customer rating badge */}
                <motion.div
                  className="flex items-center gap-3 mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.7 }}
                >
                  {/* Avatars stack */}
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        src={`/assets/icons/avatar-${i}.jpg`}
                        alt={`Customer ${i}`}
                        className="w-8 h-8 rounded-full border-2 border-[#ff6c6e] object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full">
                    <Star size={11} className="text-amber-300 fill-amber-300" />
                    <span className="text-[11px] text-white font-semibold">
                      Rated 5 Stars by
                      <br />
                      <span className="text-white/70 font-normal">The Zylook Tribe</span>
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* ── CENTER — Fashion model ── */}
              <div className="flex-1 relative flex items-end justify-center z-20 min-w-[340px]">
                {/* Model container with 3D shadow */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* 3D depth shadows behind model */}
                  <div
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-[50px] rounded-[50%] blur-3xl"
                    style={{ background: 'rgba(0,0,0,0.25)' }}
                  />
                  <div
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[50%] h-[30px] rounded-[50%] blur-xl"
                    style={{ background: 'rgba(0,0,0,0.15)' }}
                  />

                  {/* Glow ring behind model */}
                  <motion.div
                    className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.25, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Model image */}
                  <motion.img
                    src="/assets/hero/model-hoodie.png"
                    alt="Fashion model in geometric hoodie"
                    className="relative z-10 h-[540px] w-auto object-contain drop-shadow-2xl -mt-[80px]"
                    style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))' }}
                    whileHover={{ scale: 1.02, y: -6 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  />
                </motion.div>
              </div>

              {/* ── RIGHT COLUMN — features + product card ── */}
              <div className="flex-1 flex flex-col items-center justify-start py-10 pr-10 pl-4 max-w-[320px] z-10">
                {/* Feature icons row */}
                <motion.div
                  className="flex items-start gap-6 mb-10 mt-2"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  {features.map((f, i) => (
                    <motion.div
                      key={f.label}
                      className="flex flex-col items-center gap-2 cursor-pointer"
                      whileHover={{ y: -4 }}
                    >
                      <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                        <f.icon size={16} className="text-white" />
                      </div>
                      <span className="text-[11px] font-medium text-white/80 text-center leading-tight whitespace-pre-line">
                        {f.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Featured Product Card */}
                <motion.div
                  className="w-full bg-white rounded-[24px] p-4 shadow-xl"
                  style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                  whileHover={{ y: -4 }}
                >
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.1em] mb-3">
                    Featured Product
                  </p>

                  {/* Product image area */}
                  <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden mb-3 bg-gradient-to-br from-amber-50 to-rose-50 relative">
                    <img
                      src="/assets/products/featured-tee-thumb.jpg"
                      alt="Urban Vanguard Tee"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product info */}
                  <h4 className="text-[15px] font-bold text-zinc-900 mb-0.5">
                    Urban Vanguard Tee
                  </h4>
                  <p className="text-[12px] text-zinc-400 mb-3">
                    Unmatched bold comfort.
                  </p>

                  {/* Price pill */}
                  <div className="flex items-center gap-2">
                    <motion.span
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#ff6c6e] text-white text-[12px] font-bold rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      <ShoppingBag size={11} />
                      $56.75
                    </motion.span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ SCROLL SECTIONS ════════════ */}

      {/* ── STATS BAR ── */}
      <section className="w-full px-10 py-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-4 gap-8">
          {[
            { val: '50K+', label: 'Happy Customers' },
            { val: '200+', label: 'Exclusive Drops' },
            { val: '4.9★', label: 'Average Rating' },
            { val: '24h', label: 'Fast Shipping' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="text-[40px] font-black text-zinc-900 tracking-tight mb-1"
                style={{ fontFamily: 'var(--sans)' }}
              >
                {s.val}
              </p>
              <p className="text-[13px] text-zinc-400 font-medium">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TRENDING DROPS (Product Grid) ── */}
      <section className="w-full px-10 pb-16 max-w-[1400px] mx-auto">
        <Reveal className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-[#ff6c6e] text-[11px] font-semibold rounded-full mb-3 uppercase tracking-wider">
              <Sparkles size={11} />
              Curated Collection
            </span>
            <h2 className="text-[32px] font-black text-zinc-900 tracking-[-0.02em]">
              Trending Drops
            </h2>
            <p className="text-[14px] text-zinc-400 mt-1.5 max-w-md">
              Hand-picked pieces that define the next wave of streetwear culture.
            </p>
          </div>
          <motion.button
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-600 text-[13px] font-semibold rounded-full hover:bg-zinc-200 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View All
            <ChevronRight size={14} />
          </motion.button>
        </Reveal>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-3 gap-7">
          {[
            {
              name: 'Urban Vanguard Tee',
              tagline: 'Unmatch bold comfort',
              desc: 'Step into the future of streetwear with our premium organic cotton tee.',
              price: 56.75,
              badge: 'Best Seller',
              image: '/assets/products/urban-vanguard-tee.jpg',
            },
            {
              name: 'Shadow Runner Hoodie',
              tagline: 'Own the night',
              desc: 'Heavyweight French terry hoodie with reflective accents and oversized fit.',
              price: 129,
              originalPrice: 159,
              badge: 'New Drop',
              image: '/assets/products/shadow-runner-hoodie.jpg',
            },
            {
              name: 'Retro Wave Sneakers',
              tagline: 'Classic meets future',
              desc: 'Step back into classic hoops style with durable leather and modern cushioning.',
              price: 111,
              badge: 'Limited',
              image: '/assets/products/retro-wave-sneakers.jpg',
            },
            {
              name: 'Neon Drift Jacket',
              tagline: 'Flow with colour',
              desc: 'Water-resistant windbreaker with holographic trim for festival season.',
              price: 189,
              originalPrice: 225,
              image: '/assets/products/neon-drift-jacket.jpg',
            },
            {
              name: 'Prism Cargo Pants',
              tagline: 'Utility remastered',
              desc: 'Six-pocket cargo with tapered legs and elastic ankle cuffs.',
              price: 94,
              badge: 'Trending',
              image: '/assets/products/prism-cargo-pants.jpg',
            },
            {
              name: 'Aurora Beanie',
              tagline: 'Keep the edge warm',
              desc: 'Merino-blend ribbed beanie with embroidered Zylook monogram.',
              price: 34,
              image: '/assets/products/aurora-beanie.jpg',
            },
          ].map((product, i) => (
            <Reveal key={product.name} delay={i * 0.08}>
              <motion.div
                className="group relative flex flex-col bg-white rounded-[24px] overflow-hidden border border-zinc-100 cursor-pointer"
                style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}
                whileHover={{ y: -8, boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              >
                {/* Image area */}
                <div className="relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden">
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/80 text-white text-[10px] font-semibold rounded-full">
                      {product.badge}
                    </span>
                  )}

                  {/* Heart button */}
                  <motion.button
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow-sm text-zinc-400 hover:text-red-400 transition-colors"
                    whileTap={{ scale: 0.85 }}
                  >
                    <Heart size={14} />
                  </motion.button>

                  {/* Product image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Dot indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <div
                        key={d}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${d === 0 ? 'bg-zinc-800 w-4' : 'bg-zinc-300'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5 p-5 flex-1">
                  <h3 className="text-[15px] font-bold text-zinc-900 leading-tight tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-[12px] font-medium text-zinc-400">{product.tagline}</p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2 mt-0.5">
                    {product.desc}
                  </p>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[18px] font-bold text-zinc-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-[12px] text-zinc-300 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <motion.button
                      className="flex items-center gap-1 px-4 py-2 bg-zinc-900 text-white text-[11px] font-semibold rounded-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Buy Now
                      <ArrowRight size={11} strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHY ZYLOOK (Features) ── */}
      <section
        className="w-full px-12 py-16"
        style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)' }}
      >
        <Reveal className="text-center mb-12">
          <h2 className="text-[32px] font-black text-zinc-900 tracking-[-0.02em]">
            Why Choose Zylook?
          </h2>
          <p className="text-[14px] text-zinc-600 mt-2 max-w-lg mx-auto">
            We're not just another fashion brand — we're a movement.
          </p>
        </Reveal>

        <div className="grid grid-cols-3 gap-7 max-w-[1200px] mx-auto">
          {[
            { icon: Star, title: 'Premium Quality', desc: 'Every stitch, every fabric — obsessively crafted for those who settle for nothing less.', color: 'from-amber-400 to-orange-500' },
            { icon: Zap, title: 'AI-Powered Style', desc: 'Our AI learns your vibe and curates outfits that are uniquely you.', color: 'from-violet-400 to-purple-600' },
            { icon: ShoppingBag, title: 'Lightning Delivery', desc: 'Order today, rock it tomorrow. Free express shipping on every order.', color: 'from-emerald-400 to-teal-600' },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <motion.div
                className="p-8 rounded-[24px] bg-white/60 backdrop-blur-sm border border-white/50 text-center cursor-pointer"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
                whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className={`w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg`}>
                  <f.icon size={24} className="text-white" />
                </div>
                <h3 className="text-[16px] font-bold text-zinc-900 mb-2">{f.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="w-full px-12 py-20 text-center text-white relative overflow-hidden"
        style={{ background: '#1a1a1a' }}
      >
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full opacity-30 blur-3xl"
          style={{ background: '#ff6c6e' }}
          animate={{ x: [-100, 100, -100], y: [-50, 80, -50] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full opacity-20 blur-3xl"
          style={{ background: '#ffd93d' }}
          animate={{ x: [80, -80, 80], y: [50, -60, 50] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <Reveal className="relative z-10">
          <h2 className="text-[40px] font-black tracking-[-0.02em] mb-4">
            Ready to Redefine
            <br />
            <span className="bg-gradient-to-r from-[#ff6c6e] to-[#ffd93d] bg-clip-text text-transparent">
              Your Style?
            </span>
          </h2>
          <p className="text-zinc-400 text-[15px] max-w-md mx-auto mb-8">
            Join 50,000+ trendsetters who've already made the switch.
          </p>
          <motion.button
            className="px-10 py-4 bg-gradient-to-r from-[#ff6c6e] to-[#ff9a76] text-white text-[14px] font-bold rounded-full shadow-xl"
            style={{ boxShadow: '0 8px 30px rgba(255,108,110,0.3)' }}
            whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(255,108,110,0.4)' }}
            whileTap={{ scale: 0.97 }}
          >
            Start Shopping
          </motion.button>
        </Reveal>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="w-full px-10 py-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-[18px] font-black text-zinc-900 mb-3 tracking-[0.08em] uppercase">
              Zylook<span className="text-[#ff6c6e]">.</span>
            </h4>
            <p className="text-[13px] text-zinc-400 leading-relaxed">
              Where Art Meets Your Style. AI-powered fashion for the bold.
            </p>
          </div>
          {[
            { title: 'Shop', links: ['New Arrivals', 'Best Sellers', 'Collections', 'Sale'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog'] },
            { title: 'Support', links: ['Help Center', 'Shipping', 'Returns', 'Contact'] },
          ].map((col) => (
            <div key={col.title}>
              <h5 className="text-[12px] font-bold text-zinc-900 uppercase tracking-[0.12em] mb-3">
                {col.title}
              </h5>
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-zinc-400 hover:text-zinc-800 transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-zinc-200 flex justify-between items-center">
          <p className="text-[12px] text-zinc-400">&copy; {new Date().getFullYear()} Zylook. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((l) => (
              <a key={l} href="#" className="text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
