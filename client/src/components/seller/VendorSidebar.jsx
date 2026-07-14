import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, TrendingUp, DollarSign, Settings } from 'lucide-react';

const VendorSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/seller/products', icon: Package },
    { name: 'Orders', path: '/seller/orders', icon: TrendingUp },
    { name: 'Earnings', path: '/seller/earnings', icon: DollarSign },
    { name: 'Settings', path: '/seller/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-[#e5e4e7] flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-[#e5e4e7]">
        <Link to="/" className="text-xl font-black text-[#08060d]">
          Zylook<span className="text-[#ea580c]">.</span> <span className="text-sm font-bold text-[#6b6375]">Seller</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive
                  ? 'bg-[#08060d] text-white'
                  : 'text-[#6b6375] hover:text-[#08060d] hover:bg-[#f4f3ea]'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-[#e5e4e7]">
        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-orange-100">
          <p className="text-xs font-bold text-orange-800 mb-1">Need help?</p>
          <p className="text-[10px] text-orange-600 mb-3">Contact seller support for quick assistance.</p>
          <button className="w-full py-2 bg-white text-orange-600 text-xs font-bold rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors">
            Support Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorSidebar;
