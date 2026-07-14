import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Landmark, Package, CheckCircle2, ArrowRight, UploadCloud, Store } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SellerOnboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Business', icon: Building2 },
    { id: 2, title: 'Bank', icon: Landmark },
    { id: 3, title: 'Catalog', icon: Package },
    { id: 4, title: 'Approval', icon: CheckCircle2 }
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleFinish = () => {
    navigate('/seller/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f9f8f6] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#08060d] text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#08060d] tracking-tight">Become a Seller</h1>
          <p className="text-[#6b6375] mt-2">Join Zylook and reach millions of fashion enthusiasts.</p>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white p-6 rounded-2xl border border-[#e5e4e7] mb-8 flex justify-between relative">
          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-[#f4f3ea] -z-10 -translate-y-1/2" />
          {steps.map(s => {
            const Icon = s.icon;
            const active = step >= s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                  ${active ? 'bg-[#ea580c] border-[#ea580c] text-white' : 'bg-white border-[#e5e4e7] text-[#6b6375]'}`}>
                  <Icon size={18} />
                </div>
                <span className={`text-xs font-bold ${active ? 'text-[#08060d]' : 'text-[#6b6375]'}`}>{s.title}</span>
              </div>
            );
          })}
        </div>

        {/* Forms Container */}
        <div className="bg-white p-8 rounded-2xl border border-[#e5e4e7] min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-6 text-[#08060d]">Business Registration</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">Business Name</label>
                    <input type="text" className="w-full bg-[#f9f8f6] border border-[#e5e4e7] rounded-xl px-4 py-3 outline-none focus:border-[#ea580c] transition-colors" placeholder="e.g. Urban Threads" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">GST Number</label>
                    <input type="text" className="w-full bg-[#f9f8f6] border border-[#e5e4e7] rounded-xl px-4 py-3 outline-none focus:border-[#ea580c] transition-colors" placeholder="22AAAAA0000A1Z5" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">PAN Number</label>
                    <input type="text" className="w-full bg-[#f9f8f6] border border-[#e5e4e7] rounded-xl px-4 py-3 outline-none focus:border-[#ea580c] transition-colors" placeholder="ABCDE1234F" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-6 text-[#08060d]">Bank Details</h2>
                <p className="text-sm text-[#6b6375] mb-6">We will drop a penny to verify your account.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">Account Number</label>
                    <input type="text" className="w-full bg-[#f9f8f6] border border-[#e5e4e7] rounded-xl px-4 py-3 outline-none focus:border-[#ea580c] transition-colors" placeholder="0000 0000 0000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">IFSC Code</label>
                    <input type="text" className="w-full bg-[#f9f8f6] border border-[#e5e4e7] rounded-xl px-4 py-3 outline-none focus:border-[#ea580c] transition-colors" placeholder="SBIN0000001" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-6 text-[#08060d]">Catalog Setup</h2>
                <div className="border-2 border-dashed border-[#e5e4e7] rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-[#ea580c] hover:bg-[#ea580c]/5 transition-all cursor-pointer">
                  <UploadCloud size={40} className="text-[#ea580c] mb-4" />
                  <h3 className="text-sm font-bold text-[#08060d] mb-1">Upload Product CSV</h3>
                  <p className="text-xs text-[#6b6375]">Drag and drop your catalog file here, or click to browse</p>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center py-10">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black text-[#08060d] mb-2">Application Submitted!</h2>
                <p className="text-[#6b6375] mb-8">Our quality team will review your application within 24-48 hours. You can proceed to your dashboard to explore features.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-between mt-8">
          {step > 1 && step < 4 ? (
            <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl font-bold text-[#6b6375] bg-white border border-[#e5e4e7] hover:bg-[#f4f3ea] transition-colors">
              Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button onClick={handleNext} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-[#08060d] hover:bg-[#ea580c] transition-colors">
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleFinish} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] transition-colors">
              Go to Dashboard <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOnboarding;
