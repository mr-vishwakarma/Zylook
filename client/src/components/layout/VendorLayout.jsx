import { Outlet, useLocation } from 'react-router-dom';
import VendorSidebar from './VendorSidebar';
import VendorHeader from './VendorHeader';

const VendorLayout = () => {
  const location = useLocation();
  
  // Map pathnames to titles
  const getTitle = () => {
    if (location.pathname.includes('/products')) return 'Products Management';
    if (location.pathname.includes('/orders')) return 'Order Fulfillment';
    if (location.pathname.includes('/earnings')) return 'Financials & Payouts';
    if (location.pathname.includes('/settings')) return 'Seller Settings';
    return 'Dashboard Overview';
  };

  return (
    <div className="flex h-screen bg-[#f9f8f6] font-sans overflow-hidden">
      <VendorSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <VendorHeader title={getTitle()} />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
