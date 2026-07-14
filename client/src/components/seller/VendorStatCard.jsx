const VendorStatCard = ({ title, value, subtext, subtextColor = 'text-[#6b6375]', bgClass = 'bg-white', customIcon }) => {
  return (
    <div className={`${bgClass} p-6 rounded-2xl border border-[#e5e4e7] relative overflow-hidden`}>
      {customIcon && (
        <div className="absolute top-4 right-4 text-[#e5e4e7]">
          {customIcon}
        </div>
      )}
      <p className="text-xs font-bold text-[#6b6375] uppercase tracking-wider mb-2">{title}</p>
      <h3 className="text-2xl font-black text-[#08060d]">{value}</h3>
      <p className={`text-xs font-bold mt-2 ${subtextColor}`}>{subtext}</p>
    </div>
  );
};

export default VendorStatCard;
