import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isHomePage = location.pathname === '/';

  // Auth pages — full-screen dark, no chrome
  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-black">
        <Outlet />
      </div>
    );
  }

  // Home page — has its own embedded navbar
  if (isHomePage) {
    return (
      <div className="w-full min-h-screen bg-white">
        <Outlet />
      </div>
    );
  }

  // All other pages — use shared Navbar
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f9f8f6]">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>
      <footer className="px-8 py-6 border-t border-[#e5e4e7] text-xs text-[#6b6375] bg-white flex items-center justify-between">
        <p>© {new Date().getFullYear()} Zylook. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="/shop" className="hover:text-[#08060d] transition-colors">Shop</a>
          <a href="/orders" className="hover:text-[#08060d] transition-colors">Orders</a>
          <a href="/cart" className="hover:text-[#08060d] transition-colors">Cart</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
