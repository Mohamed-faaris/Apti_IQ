import { forwardRef, type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, children, className = '', ...props }, ref) => {
    // Lighter notebook paper color with responsive padding
    const baseClasses = 'bg-[#FEFDFB] rounded-lg p-3 sm:p-4 lg:p-6 transition-smooth border-l-4 border-[#D4C4B0]';
    const shadowClasses = 'shadow-[0_2px_8px_rgba(100,80,60,0.05),inset_0_0_0_1px_rgba(180,160,140,0.05)]';
    
    if (hover) {
      return (
        <motion.div
          ref={ref}
          whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(139, 69, 19, 0.12)' }}
          transition={{ duration: 0.3 }}
          className={`${baseClasses} ${shadowClasses} ${className}`}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${shadowClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
