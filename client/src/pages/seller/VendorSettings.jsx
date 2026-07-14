import { Store, Shield, CreditCard, Mail } from 'lucide-react';

const VendorSettings = () => {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Business Profile */}
      <div className="bg-white rounded-2xl border border-[#e5e4e7] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#f4f3ea] text-[#6b6375] rounded-xl flex items-center justify-center">
            <Store size={20} />
          </div>
          <h3 className="text-lg font-bold text-[#08060d]">Business Profile</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">Store Name</label>
            <input type="text" defaultValue="Urban Threads" className="w-full bg-[#f9f8f6] border border-[#e5e4e7] rounded-xl px-4 py-2.5 outline-none focus:border-[#ea580c] transition-colors text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">Support Email</label>
            <input type="email" defaultValue="support@urbanthreads.com" className="w-full bg-[#f9f8f6] border border-[#e5e4e7] rounded-xl px-4 py-2.5 outline-none focus:border-[#ea580c] transition-colors text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">Store Description</label>
            <textarea rows="3" defaultValue="Premium streetwear for the modern generation." className="w-full bg-[#f9f8f6] border border-[#e5e4e7] rounded-xl px-4 py-2.5 outline-none focus:border-[#ea580c] transition-colors text-sm"></textarea>
          </div>
        </div>
      </div>

      {/* Tax & Legal */}
      <div className="bg-white rounded-2xl border border-[#e5e4e7] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#f4f3ea] text-[#6b6375] rounded-xl flex items-center justify-center">
            <Shield size={20} />
          </div>
          <h3 className="text-lg font-bold text-[#08060d]">Tax & Legal (Verified)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">GSTIN</label>
            <input type="text" defaultValue="22AAAAA0000A1Z5" disabled className="w-full bg-zinc-100 border border-[#e5e4e7] rounded-xl px-4 py-2.5 text-zinc-500 cursor-not-allowed text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">PAN</label>
            <input type="text" defaultValue="ABCDE1234F" disabled className="w-full bg-zinc-100 border border-[#e5e4e7] rounded-xl px-4 py-2.5 text-zinc-500 cursor-not-allowed text-sm" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-8 py-3 bg-[#ea580c] text-white rounded-xl font-bold hover:bg-[#c2410c] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default VendorSettings;
