import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  helperText,
  rightElement,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col w-full mb-4 ${className}`}>
      {label && (
        <label className="text-[13px] font-semibold text-zinc-300 mb-1.5 flex items-center justify-between tracking-wide" htmlFor={id}>
          <span>
            {label} {required && <span className="text-red-400 ml-0.5">*</span>}
          </span>
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        {Icon && (
          <span className="absolute left-4 text-zinc-500 pointer-events-none transition-colors duration-200">
            <Icon size={16} />
          </span>
        )}
        
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-3 bg-zinc-900/40 border ${
            error ? 'border-red-500/80 focus:ring-1 focus:ring-red-500/30' : 'border-zinc-800 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10'
          } rounded-xl text-white placeholder-zinc-500/70 focus:outline-none focus:bg-zinc-900/60 transition-all duration-200 text-[14px] font-sans ${
            Icon ? 'pl-11' : ''
          } ${isPassword ? 'pr-11' : ''}`}
          {...props}
        />
        
        {isPassword ? (
          <button
            type="button"
            className="absolute right-4 bg-transparent border-none text-zinc-500 hover:text-zinc-200 cursor-pointer p-0 flex items-center justify-center transition-colors duration-200"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : (
          rightElement && <div className="absolute right-4 flex items-center">{rightElement}</div>
        )}
      </div>
      
      {error && <span className="text-red-400 text-xs mt-1 font-medium">{error}</span>}
      {!error && helperText && <span className="text-zinc-500 text-xs mt-1 font-normal leading-normal">{helperText}</span>}
    </div>
  );
};

export default Input;
