import { forwardRef, type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, children, className = '', ...props }, ref) => {
    // Beautiful notebook paper color with warm tone
    const baseClasses = 'bg-[#FFFBF0] rounded-lg p-6 transition-smooth border-l-4 border-[#D4A574]';
    const shadowClasses = 'shadow-[0_2px_8px_rgba(139,69,19,0.1),inset_0_0_0_1px_rgba(212,165,116,0.1)]';
    
    if (hover) {
      return (
        <motion.div
          ref={ref}
          whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(139, 69, 19, 0.15)' }}
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
