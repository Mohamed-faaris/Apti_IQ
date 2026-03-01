import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface NotebookPageProps {
  children: ReactNode;
  showLines?: boolean;
  showMargin?: boolean;
}

export const NotebookPage = ({ 
  children, 
  showLines = true, 
  showMargin = true 
}: NotebookPageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -10 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-[#FFFBF0] rounded-lg shadow-lg p-8"
      style={{
        backgroundImage: showLines 
          ? 'repeating-linear-gradient(transparent, transparent 31px, #D4A574 31px, #D4A574 32px)'
          : 'none',
        backgroundSize: '100% 32px',
        backgroundPosition: '0 8px',
      }}
    >
      {/* Margin line */}
      {showMargin && (
        <div 
          className="absolute left-16 top-0 bottom-0 w-[2px] bg-[#E74C3C] opacity-40"
          style={{ boxShadow: '1px 0 1px rgba(0,0,0,0.1)' }}
        />
      )}
      
      {/* Hole punches */}
      <div className="absolute left-4 top-12 w-3 h-3 rounded-full bg-white border-2 border-[#D4A574] shadow-inner" />
      <div className="absolute left-4 top-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#D4A574] shadow-inner" />
      <div className="absolute left-4 bottom-12 w-3 h-3 rounded-full bg-white border-2 border-[#D4A574] shadow-inner" />
      
      {/* Content with margin offset */}
      <div className={showMargin ? 'ml-8' : ''}>
        {children}
      </div>
      
      {/* Page curl effect */}
      <div 
        className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#D4A574]/30 to-transparent opacity-30 rounded-tl-full"
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
      />
    </motion.div>
  );
};
