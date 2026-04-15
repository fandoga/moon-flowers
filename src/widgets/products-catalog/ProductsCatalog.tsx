"use client";

import React, { useState, useEffect, useRef } from "react";
import ProductCard from "@/widgets/product-card/ProductCard";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { NomenclatureItem } from "@/entities/product/types/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

interface ProductsCatalogProps {
  query: string;
  limit?: number;
  loadMore?: boolean;
}

const ProductsCatalog: React.FC<ProductsCatalogProps> = ({
  limit = 10,
  loadMore = true,
}) => {
  const [offset, setOffset] = useState(0);
  const [allProducts, setAllProducts] = useState<NomenclatureItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const loadedOffsetsRef = useRef<Set<number>>(new Set());

  const { ref: sentinelRef, inView } = useInView({ threshold: 0 });

  const hasMore = allProducts.length < totalCount;

  return (
    <>
      {loadMore && (
        <p className="text-sm md:text-base text-[#394426] font-manrope mb-4">
          Найдено товаров: {totalCount}
        </p>
      )}

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {allProducts.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* Sentinel element for infinite scroll */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-10"></div>
      )}

      {!hasMore && allProducts.length > 0 && (
        <p className="text-center text-gray-400 py-8 text-sm">
          Все товары загружены
        </p>
      )}
    </>
  );
};

export default ProductsCatalog;
