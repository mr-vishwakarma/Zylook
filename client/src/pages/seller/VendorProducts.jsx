import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const VendorProducts = () => {
  const products = [
    { id: 'PRD-001', name: 'Urban Vanguard Tee', category: 'Apparel', price: '₹1,299', stock: 45, status: 'Active' },
    { id: 'PRD-002', name: 'Shadow Runner Hoodie', category: 'Apparel', price: '₹2,499', stock: 12, status: 'Active' },
    { id: 'PRD-003', name: 'Retro Wave Sneakers', category: 'Footwear', price: '₹4,999', stock: 0, status: 'Out of Stock' },
    { id: 'PRD-004', name: 'Neon Drift Jacket', category: 'Outerwear', price: '₹3,499', stock: 8, status: 'Active' },
    { id: 'PRD-005', name: 'Prism Cargo Pants', category: 'Apparel', price: '₹1,899', stock: 32, status: 'Draft' },
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
              placeholder="Search products by name or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#e5e4e7] rounded-xl outline-none focus:border-[#ea580c] transition-colors text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e4e7] rounded-xl text-sm font-bold text-[#6b6375] hover:bg-[#f4f3ea] transition-colors">
            <Filter size={16} /> Filters
          </button>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#08060d] text-white rounded-xl text-sm font-bold hover:bg-[#ea580c] transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#e5e4e7] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f4f3ea]">
            <tr className="text-[10px] font-bold text-[#6b6375] uppercase tracking-wider">
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e4e7]">
            {products.map((product) => (
              <motion.tr 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={product.id} 
                className="hover:bg-[#f9f8f6] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f4f3ea] rounded-lg"></div>
                    <div>
                      <p className="text-sm font-bold text-[#08060d]">{product.name}</p>
                      <p className="text-[10px] text-[#6b6375] uppercase tracking-wider">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#6b6375]">{product.category}</td>
                <td className="px-6 py-4 text-sm font-bold text-[#08060d]">{product.price}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-bold ${product.stock === 0 ? 'text-rose-500' : 'text-[#08060d]'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider
                    ${product.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                      product.status === 'Out of Stock' ? 'bg-rose-100 text-rose-700' : 
                      'bg-zinc-100 text-zinc-700'}`
                  }>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-[#6b6375] hover:text-[#08060d] hover:bg-[#f4f3ea] rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-[#6b6375] hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
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

export default VendorProducts;
