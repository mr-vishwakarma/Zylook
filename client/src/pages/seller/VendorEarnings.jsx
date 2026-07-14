import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Download } from 'lucide-react';
import VendorStatCard from '../../components/seller/VendorStatCard';

const VendorEarnings = () => {
  const payouts = [
    { id: 'PYT-004', date: 'Oct 15, 2024', amount: '₹12,450', status: 'Settled' },
    { id: 'PYT-003', date: 'Oct 01, 2024', amount: '₹14,200', status: 'Settled' },
    { id: 'PYT-002', date: 'Sep 15, 2024', amount: '₹9,800', status: 'Settled' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <VendorStatCard 
          title="Total Earnings (All Time)"
          value="₹1,45,230"
          subtext="+₹12,450 this month"
          subtextColor="text-emerald-500"
        />
        <VendorStatCard 
          title="Next Payout"
          value="₹4,250"
          subtext="Expected: Nov 01, 2024"
        />
        <VendorStatCard 
          title="Platform Commission Paid"
          value="₹28,500"
          subtext="19.6% effective rate"
          subtextColor="text-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payout History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e5e4e7] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#08060d]">Payout History</h3>
            <button className="flex items-center gap-2 text-sm font-bold text-[#ea580c] hover:text-[#c2410c] transition-colors">
              <Download size={16} /> Export CSV
            </button>
          </div>
          
          <div className="space-y-4">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-4 bg-[#f9f8f6] rounded-xl border border-[#e5e4e7]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <ArrowUpRight size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#08060d]">{payout.amount}</p>
                    <p className="text-[10px] text-[#6b6375] uppercase tracking-wider">{payout.id} • {payout.date}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {payout.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Account Details */}
        <div className="bg-white rounded-2xl border border-[#e5e4e7] p-6">
          <h3 className="text-lg font-bold text-[#08060d] mb-4">Settlement Account</h3>
          
          <div className="p-5 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-xl text-white relative overflow-hidden">
            <CreditCard className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" />
            <div className="relative z-10">
              <p className="text-xs text-zinc-400 font-medium mb-1">State Bank of India</p>
              <p className="text-lg font-mono tracking-widest mb-4">**** **** 1234</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Account Holder</p>
                  <p className="text-sm font-bold">Urban Threads LLC</p>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-4 py-2.5 bg-[#f4f3ea] text-[#08060d] rounded-xl text-sm font-bold hover:bg-[#e5e4e7] transition-colors">
            Update Bank Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorEarnings;
