// widgets/search-results/SearchResults.tsx
'use client';

import React from 'react';
import { useProducts } from '@/entities/product/hooks/hooks';
import ProductCard from '@/widgets/product-card/ProductCard';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

interface SearchResultsProps {
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const { data, isLoading, error } = useProducts({ 
    name: query, 
    limit: 100, 
    has_photos: true, 
    with_prices: true 
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-10 h-10 text-[#394426] animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">Ошибка загрузки</div>;
  }

  if (!data?.result.length) {
    return <div className="py-12 text-center text-gray-500">Ничего не найдено</div>;
  }

  return (
    <>
      <p className="text-sm md:text-base text-[#394426] font-manrope mb-4">
        Найдено товаров: {data.count}
      </p>
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {data.result.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default SearchResults;