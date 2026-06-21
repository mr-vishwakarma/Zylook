import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, ghost, white, social
  size = 'md', // sm, md, lg
  loading = false,
  disabled = false,
  onClick,
  icon: Icon,
  className = '',
  ...props
}) => {
  // Tailwind base styles
  const baseStyle = 'inline-flex items-center justify-center gap-2 font-sans font-semibold cursor-pointer select-none transition-all duration-200 w-full focus:outline-none';

  // Variant mappings
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 active:scale-[0.98]',
    secondary: 'bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 active:scale-[0.98]',
    outline: 'bg-transparent hover:bg-white/5 text-gray-200 border border-zinc-800 hover:border-zinc-700 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white',
    white: 'bg-white hover:bg-gray-100 text-zinc-950 font-bold shadow-md active:scale-[0.98]',
    social: 'bg-zinc-900/60 hover:bg-zinc-900/90 text-gray-200 border border-zinc-800 hover:border-zinc-700 font-medium active:scale-[0.98]',
  };

  // Size mappings
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3.5 text-sm rounded-xl',
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;
  const disabledStyle = (disabled || loading) ? 'opacity-50 cursor-not-allowed transform-none pointer-events-none' : '';

  return (
    <button
      type={type}
      className={`${baseStyle} ${currentVariant} ${currentSize} ${disabledStyle} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-b-transparent rounded-full animate-spin mr-1" />
      )}
      {!loading && Icon && (
        <span className="flex-shrink-0">
          <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        </span>
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
