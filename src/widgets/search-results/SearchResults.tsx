"use client";

import React, { useState, useEffect, useRef } from "react";
import { useProducts } from "@/entities/product/hooks/hooks";
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

interface SearchResultsProps {
  query: string;
  limit?: number;
  loadMore?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  limit = 10,
  loadMore = true,
}) => {
  const [offset, setOffset] = useState(0);
  const [allProducts, setAllProducts] = useState<NomenclatureItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const prevQueryRef = useRef(query);
  const loadedOffsetsRef = useRef<Set<number>>(new Set());

  const { data, isLoading, isFetching } = useProducts({
    name: query,
    limit: limit,
    offset,
    has_photos: true,
    with_prices: true,
    with_photos: true,
  });

  const { ref: sentinelRef, inView } = useInView({ threshold: 0 });

  // Reset when query changes
  useEffect(() => {
    if (prevQueryRef.current !== query) {
      setTimeout(() => {
        prevQueryRef.current = query;
        setAllProducts([]);
        setOffset(0);
        setTotalCount(0);
        loadedOffsetsRef.current = new Set();
      });
    }
  }, [query]);

  // Append results, deduplicated
  useEffect(() => {
    if (!data) return;
    if (loadedOffsetsRef.current.has(offset)) return;
    loadedOffsetsRef.current.add(offset);

    setTimeout(() => {
      setTotalCount(data.count);
      if (offset === 0) {
        setAllProducts(data.result);
      } else {
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = data.result.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newItems];
        });
      }
    });
  }, [data, offset]);

  const hasMore = allProducts.length < totalCount;

  // Load more when sentinel becomes visible
  useEffect(() => {
    if (inView && hasMore && !isFetching && !isLoading && loadMore) {
      setTimeout(() => {
        setOffset((prev) => prev + limit);
      });
    }
  }, [inView, hasMore, isFetching, isLoading, loadMore, limit]);

  if (isLoading && offset === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-10 h-10 text-[#394426] animate-spin" />
      </div>
    );
  }

  if (!isLoading && allProducts.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">Ничего не найдено</div>
    );
  }

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
        <div ref={sentinelRef} className="flex justify-center py-10">
          {isFetching && (
            <Loader2 className="w-8 h-8 text-[#394426] animate-spin" />
          )}
        </div>
      )}

      {!hasMore && allProducts.length > 0 && (
        <p className="text-center text-gray-400 py-8 text-sm">
          Все товары загружены
        </p>
      )}
    </>
  );
};

export default SearchResults;
