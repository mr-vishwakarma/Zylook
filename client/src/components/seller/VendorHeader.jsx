import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const VendorHeader = ({ title }) => {
  return (
    <header className="bg-white border-b border-[#e5e4e7] h-16 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
      <h2 className="text-xl font-bold text-[#08060d]">{title}</h2>
      <div className="flex items-center gap-6">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f4f3ea] text-[#6b6375] hover:text-[#08060d] transition-colors relative"
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ea580c] rounded-full border-2 border-[#f4f3ea]" />
        </motion.button>
        <div className="flex items-center gap-3 pl-6 border-l border-[#e5e4e7] cursor-pointer group">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-[#ea580c] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
            U
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#08060d] leading-none">Urban Threads</span>
            <span className="text-[10px] text-[#6b6375] font-medium mt-1">Vendor ID: V-9938</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;
