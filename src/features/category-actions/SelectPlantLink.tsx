import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface SelectPlantLinkProps {
  href: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void; 
}

const SelectPlantLink: React.FC<SelectPlantLinkProps> = ({
  href,
  className = '',
  children,
  onClick,
}) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-[#394426] text-[12px] text-white font-manrope font-medium py-2.75 sm:py-3 rounded-md hover:bg-[#102902] transition-colors w-full text-center cursor-pointer inline-block ${className}`}
        onClick={onClick}
      >
        {children || 'Подобрать растение'}
      </motion.a>
    </Link>
  );
};

export default SelectPlantLink;