"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useMpProducts, type MpProduct } from "@/entities/mp-product";
import ProductCard from "../product-card/ProductCard";
import Logo from "@/components/ui/logo";
import { normalizeCategory } from "@/lib/utils/normalizeCategory";

type ProductsCatalogProps = {
  query: string;
  size?: number;
  displayInfo?: boolean;
  category?: string;
  loadMore?: boolean;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const ProductsCatalog: React.FC<ProductsCatalogProps> = ({
  query,
  size,
  category,
  displayInfo = true,
  loadMore = true,
}) => {
  const { ref: sentinelRef, inView } = useInView({ threshold: 0 });
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<MpProduct[]>([]);

  const search = query.trim().length > 0 ? query : undefined;

  const { data, isLoading, isFetching } = useMpProducts({
    category: normalizeCategory(category),
    seller_id: 813,
    size: size || 12,
    page,
    search,
  });

  const totalCount = data?.count ?? Math.max(data?.result?.length ?? 0, 0);
  const received = useMemo(() => data?.result ?? [], [data?.result]);
  const visibleItems = loadMore ? items : received;
  const hasMore = loadMore ? items.length < totalCount : false;

  useEffect(() => {
    setTimeout(() => {
      setPage(1);
      setItems([]);
    }, 0);
  }, [query, size, category]);

  useEffect(() => {
    if (!received.length) {
      if (page <= 1) {
        setTimeout(() => {
          setItems([]);
        });
      }
      return;
    }
    setTimeout(() => {
      setItems((prev) => {
        if (page <= 1) return received;

        const map = new Map<string, MpProduct>();
        for (const p of prev) map.set(String(p.id), p);
        for (const p of received) map.set(String(p.id), p);
        return Array.from(map.values());
      });
    }, 0);
  }, [received, page]);

  useEffect(() => {
    if (!loadMore) return;
    if (!inView) return;
    if (!hasMore) return;
    if (isLoading || isFetching) return;
    setTimeout(() => {
      setPage((prev) => prev + 1);
    }, 0);
  }, [inView, hasMore, loadMore, size, isLoading, isFetching]);

  const showLoader = (isLoading || isFetching) && visibleItems.length === 0;
  const showEmptyState = !showLoader && visibleItems.length === 0;
  const desktopCols = size ? (size < 4 ? size : 4) : 4;
  const lgColsClass =
    desktopCols === 1
      ? "lg:grid-cols-1"
      : desktopCols === 2
        ? "lg:grid-cols-2"
        : desktopCols === 3
          ? "lg:grid-cols-3"
          : "lg:grid-cols-4";

  return (
    <>
      {showLoader ? (
        <div className="py-12 bg-baclground h-200 flex justify-center">
          <Logo alwaysEnabled />
        </div>
      ) : (
        <motion.div
          className={`grid grid-cols-1 md:grid-cols-2 ${lgColsClass} gap-4 sm:gap-6 lg:gap-8 w-full`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {visibleItems.map((product) => (
            <motion.div key={Number(product.id)} variants={itemVariants}>
              <ProductCard displayOnHover={!displayInfo} product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {loadMore && hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-10"></div>
      )}
      {isFetching && visibleItems.length > 0 && loadMore && (
        <div className="w-full flex justify-center h-10 py-10">
          <Logo alwaysEnabled />
        </div>
      )}

      {showEmptyState && (
        <div className="w-full min-h-[220px] rounded-xl border border-[#E7E7E7] flex items-center justify-center px-4 text-center">
          <p
            className={`text-sm ${data?.error ? "text-red-500" : "text-muted-foreground"}`}
          >
            {data?.error || "Товары не найдены"}
          </p>
        </div>
      )}
    </>
  );
};

export default ProductsCatalog;
