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
      className="relative bg-[#FFFBF0] rounded-lg shadow-lg"
      style={{
        backgroundImage: showLines 
          ? 'repeating-linear-gradient(transparent, transparent 31px, #D4A574 31px, #D4A574 32px)'
          : 'none',
        backgroundSize: '100% 32px',
        backgroundPosition: '0 0',
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      {/* Margin line - hidden on mobile */}
      {showMargin && (
        <div 
          className="absolute left-12 lg:left-16 top-0 bottom-0 w-[2px] bg-[#E74C3C] opacity-40 hidden sm:block"
          style={{ boxShadow: '1px 0 1px rgba(0,0,0,0.1)' }}
        />
      )}
      
      {/* Hole punches - hidden on mobile */}
      <div className="absolute left-3 lg:left-4 top-8 lg:top-12 w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-white border-2 border-[#D4A574] shadow-inner hidden sm:block" />
      <div className="absolute left-3 lg:left-4 top-1/2 w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-white border-2 border-[#D4A574] shadow-inner hidden sm:block" />
      <div className="absolute left-3 lg:left-4 bottom-8 lg:bottom-12 w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-white border-2 border-[#D4A574] shadow-inner hidden sm:block" />
      
      {/* Content with margin offset */}
      <div className={showMargin ? 'sm:ml-4 lg:ml-8' : ''}>
        {children}
      </div>
      
      {/* Page curl effect */}
      <div 
        className="absolute bottom-0 right-0 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-tl from-[#D4A574]/30 to-transparent opacity-30 rounded-tl-full"
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
      />
    </motion.div>
  );
};
