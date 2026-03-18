// widgets/category-products/CategoryProducts.tsx
'use client';

import React, { useMemo } from 'react';
import { useProductsByCategory } from '@/entities/product/hooks/hooks';
import ProductCard from '@/widgets/product-card/ProductCard';
import ProductCardGroup from '@/widgets/product-card-group/ProductCardGroup';
import { Loader2 } from 'lucide-react';
import { normalizeProductName } from '@/lib/utils/normalizeName';
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

interface CategoryProductsProps {
  categoryId: number;
  limit?: number;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ categoryId, limit = 20 }) => {
  const { data, isLoading, error } = useProductsByCategory(categoryId, limit);

  const groupedProducts = useMemo(() => {
    if (!data?.result) return [];
    const groups: Record<string, typeof data.result> = {};
    data.result.forEach(product => {
      const normalizedName = normalizeProductName(product.name);
      if (!groups[normalizedName]) {
        groups[normalizedName] = [];
      }
      groups[normalizedName].push(product);
    });
    return Object.values(groups);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-10 h-10 text-[#394426] animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">Ошибка загрузки товаров</div>;
  }

  if (!data?.result.length) {
    return <div className="py-12 text-center text-gray-500">В этой категории пока нет товаров</div>;
  }

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {groupedProducts.map((group) => {
        if (group.length === 1) {
          return (
            <motion.div key={group[0].id} variants={itemVariants}>
              <ProductCard product={group[0]} />
            </motion.div>
          );
        }
        return (
          <motion.div key={group[0].id} variants={itemVariants}>
            <ProductCardGroup products={group} />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default CategoryProducts;