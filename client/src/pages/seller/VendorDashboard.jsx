import React from 'react';
import { motion } from 'framer-motion';
import { Store, Package, TrendingUp, Star, DollarSign, Settings, Bell, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const VendorDashboard = () => {
  return (
    <div className="flex h-screen bg-[#f9f8f6] font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-[#e5e4e7] flex flex-col">
        <div className="p-6 border-b border-[#e5e4e7]">
          <Link to="/" className="text-xl font-black text-[#08060d]">
            Zylook<span className="text-[#ea580c]">.</span> <span className="text-sm font-bold text-[#6b6375]">Seller</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 bg-[#f4f3ea] text-[#08060d] font-bold rounded-xl">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 text-[#6b6375] font-medium hover:text-[#08060d] hover:bg-[#f4f3ea] rounded-xl transition-colors">
            <Package size={18} /> Products
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 text-[#6b6375] font-medium hover:text-[#08060d] hover:bg-[#f4f3ea] rounded-xl transition-colors">
            <TrendingUp size={18} /> Orders
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 text-[#6b6375] font-medium hover:text-[#08060d] hover:bg-[#f4f3ea] rounded-xl transition-colors">
            <DollarSign size={18} /> Earnings
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 text-[#6b6375] font-medium hover:text-[#08060d] hover:bg-[#f4f3ea] rounded-xl transition-colors">
            <Settings size={18} /> Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-[#e5e4e7] h-16 flex items-center justify-between px-8">
          <h2 className="text-lg font-bold text-[#08060d]">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#f4f3ea] text-[#6b6375] hover:text-[#08060d] transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ea580c] rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-[#ea580c] rounded-full flex items-center justify-center text-white font-bold text-xs">
                U
              </div>
              <span className="text-sm font-bold text-[#08060d]">Urban Threads</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-8">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-[#e5e4e7]">
              <p className="text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">Total Earnings</p>
              <h3 className="text-2xl font-black text-[#08060d]">₹45,230</h3>
              <p className="text-xs text-emerald-500 font-bold mt-2">+12% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#e5e4e7]">
              <p className="text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">Active Orders</p>
              <h3 className="text-2xl font-black text-[#08060d]">24</h3>
              <p className="text-xs text-[#6b6375] font-bold mt-2">5 pending fulfillment</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#e5e4e7]">
              <p className="text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">Products</p>
              <h3 className="text-2xl font-black text-[#08060d]">120</h3>
              <p className="text-xs text-rose-500 font-bold mt-2">3 out of stock</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-emerald-200 bg-emerald-50">
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Seller Rating</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-emerald-900">4.8</h3>
                <Star size={20} className="fill-amber-400 text-amber-400" />
              </div>
              <p className="text-[10px] text-emerald-700 font-bold mt-2">-2% commission applied! 🎉</p>
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
