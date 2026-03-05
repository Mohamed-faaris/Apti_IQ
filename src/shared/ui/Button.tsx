import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, className = '', ...props }, ref) => {
    const baseStyles = 'rounded-lg font-medium transition-smooth disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-opacity-90 shadow-paper',
      secondary: 'bg-secondary text-white hover:bg-opacity-90 shadow-paper',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    };
    
    const sizes = {
      sm: 'px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm',
      md: 'px-3 py-2 text-sm sm:px-4 sm:text-base',
      lg: 'px-4 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading || props.disabled}
        type={props.type}
        onClick={props.onClick}
      >
        {isLoading ? 'Loading...' : children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
