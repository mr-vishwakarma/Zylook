import { Search, Filter, Eye, Truck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const VendorOrders = () => {
  const orders = [
    { id: 'ORD-9912', product: 'Urban Vanguard Tee', date: 'Oct 24, 2024', amount: '₹1,299', status: 'Pending Fulfillment' },
    { id: 'ORD-9911', product: 'Shadow Runner Hoodie', date: 'Oct 23, 2024', amount: '₹2,499', status: 'Shipped (AWB: 1Z99999999)' },
    { id: 'ORD-9910', product: 'Prism Cargo Pants', date: 'Oct 21, 2024', amount: '₹1,899', status: 'Delivered' },
    { id: 'ORD-9909', product: 'Neon Drift Jacket', date: 'Oct 20, 2024', amount: '₹3,499', status: 'Delivered' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6375]" />
            <input 
              type="text" 
              placeholder="Search orders by ID..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#e5e4e7] rounded-xl outline-none focus:border-[#ea580c] transition-colors text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e4e7] rounded-xl text-sm font-bold text-[#6b6375] hover:bg-[#f4f3ea] transition-colors">
            <Filter size={16} /> Status Filter
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#e5e4e7] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f4f3ea]">
            <tr className="text-[10px] font-bold text-[#6b6375] uppercase tracking-wider">
              <th className="px-6 py-4">Order Details</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status & Tracking</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e4e7]">
            {orders.map((order) => (
              <motion.tr 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={order.id} 
                className="hover:bg-[#f9f8f6] transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-bold text-[#08060d]">{order.id}</p>
                    <p className="text-xs text-[#6b6375] mt-1">{order.product}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#6b6375]">{order.date}</td>
                <td className="px-6 py-4 text-sm font-bold text-[#08060d]">{order.amount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider
                      ${order.status.includes('Pending') ? 'bg-amber-100 text-amber-700' : 
                        order.status.includes('Shipped') ? 'bg-blue-100 text-blue-700' : 
                        'bg-emerald-100 text-emerald-700'}`
                    }>
                      {order.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {order.status.includes('Pending') && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#08060d] text-white rounded-lg text-[11px] font-bold hover:bg-[#ea580c] transition-colors">
                        <Truck size={12} /> Ship via Shiprocket
                      </button>
                    )}
                    <button className="p-2 text-[#6b6375] hover:text-[#08060d] hover:bg-[#f4f3ea] rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorOrders;
