import { Star } from 'lucide-react';
import VendorStatCard from '../../components/seller/VendorStatCard';

const VendorDashboard = () => {
  return (
    <>
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <VendorStatCard 
          title="Total Earnings"
          value="₹45,230"
          subtext="+12% from last month"
          subtextColor="text-emerald-500"
        />
        <VendorStatCard 
          title="Active Orders"
          value="24"
          subtext="5 pending fulfillment"
        />
        <VendorStatCard 
          title="Products"
          value="120"
          subtext="3 out of stock"
          subtextColor="text-rose-500"
        />
        <VendorStatCard 
          title="Seller Rating"
          value="4.8"
          subtext="-2% commission applied! 🎉"
          subtextColor="text-emerald-700"
          bgClass="border-emerald-200 bg-emerald-50"
          customIcon={<Star size={20} className="fill-amber-400 text-amber-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e5e4e7] p-6">
          <h3 className="text-lg font-bold text-[#08060d] mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-[#6b6375] uppercase tracking-wider border-b border-[#f4f3ea]">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((_, i) => (
                  <tr key={i} className="border-b border-[#f4f3ea] last:border-0">
                    <td className="py-4 text-xs font-bold">#ORD-99{i}2</td>
                    <td className="py-4 text-xs">Oversized Cotton Tee</td>
                    <td className="py-4 text-xs font-bold">₹899</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-md">Pending</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission Structure */}
        <div className="bg-white rounded-2xl border border-[#e5e4e7] p-6">
          <h3 className="text-lg font-bold text-[#08060d] mb-4">Platform Commission</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#6b6375]">Apparel</span>
              <span className="font-bold text-[#08060d]">18%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#6b6375]">Footwear</span>
              <span className="font-bold text-[#08060d]">22%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#6b6375]">Accessories</span>
              <span className="font-bold text-[#08060d]">25%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#6b6375]">Luxury / Premium</span>
              <span className="font-bold text-[#08060d]">30%</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-[#f9f8f6] rounded-xl border border-[#e5e4e7]">
            <p className="text-[10px] font-bold text-[#6b6375] uppercase tracking-wider mb-2">Rating Bonus Applied</p>
            <div className="flex items-center gap-2">
              <Star size={14} className="fill-emerald-500 text-emerald-500" />
              <p className="text-xs font-bold text-emerald-600">You get 2% discount on commission for maintaining 4.5+ rating.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDashboard;
