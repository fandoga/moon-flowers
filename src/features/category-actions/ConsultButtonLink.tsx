import React from 'react';
import { motion } from 'framer-motion';

interface ConsultButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
  mobile?: boolean; 
}

const ConsultButton: React.FC<ConsultButtonProps> = ({
  onClick,
  className = '',
  children,
  mobile = false,
}) => {
  const baseClasses = mobile
    ? 'bg-white text-[#394426] whitespace-nowrap text-[12px] font-manrope font-medium py-2.75 rounded-md border border-[#394426]/40 hover:bg-[#102902] hover:text-white hover:border-[#394426] transition-all duration-200 w-full cursor-pointer'
    : 'bg-white/90 backdrop-blur-sm text-[#394426] text-xs sm:text-sm md:text-base font-manrope font-medium py-2 sm:py-2.5 rounded-md border border-[#394426]/40 hover:bg-[#102902] hover:text-white hover:border-[#394426] transition-all duration-200 w-full cursor-pointer';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {children || 'Заказать консультацию'}
    </motion.button>
  );
};

export default ConsultButton;