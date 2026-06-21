import React from 'react';

const Card = ({
  children,
  variant = 'default', // default, glass, dark, gradient, outline
  className = '',
  onClick,
  ...props
}) => {
  const baseStyle = 'rounded-3xl p-8 transition-all duration-300';
  
  const variants = {
    default: 'bg-zinc-950 border border-zinc-800/80 shadow-2xl',
    glass: 'bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-2xl',
    dark: 'bg-zinc-950/90 border border-zinc-900 shadow-2xl',
    gradient: 'bg-gradient-to-b from-purple-950/40 to-zinc-950 border border-purple-900/10 shadow-2xl',
    outline: 'bg-transparent border-2 border-dashed border-zinc-800 shadow-none',
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div
      className={`${baseStyle} ${currentVariant} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
