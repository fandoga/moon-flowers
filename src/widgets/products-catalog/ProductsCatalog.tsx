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
  limit?: number;
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
  limit,
  size,
  category,
  displayInfo = true,
  loadMore = true,
}) => {
  const { ref: sentinelRef, inView } = useInView({ threshold: 0 });
  const [offset, setOffset] = useState<number>(0);
  const [items, setItems] = useState<MpProduct[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const perPage = limit ?? size ?? 12;

  const search = query.trim().length > 0 ? query : undefined;

  const { data, isLoading, isFetching } = useMpProducts({
    global_category_name: normalizeCategory(category),
    limit: perPage,
    offset,
    search,
  });

  const totalCount = data?.count;
  const received = useMemo(() => data?.result ?? [], [data?.result]);
  const visibleItems = loadMore ? items : received;
  const hasMoreByCount =
    typeof totalCount === "number" ? items.length < totalCount : true;
  const hasMore = loadMore ? canLoadMore && hasMoreByCount : false;

  useEffect(() => {
    setTimeout(() => {
      setOffset(0);
      setItems([]);
      setCanLoadMore(true);
    }, 0);
  }, [query, perPage]);

  useEffect(() => {
    if (!received.length) {
      if (isLoading || isFetching) return;

      if (offset === 0) {
        setTimeout(() => {
          setItems([]);
        });
      }
      if (loadMore && offset > 0) {
        setTimeout(() => setCanLoadMore(false), 0);
      }
      return;
    }
    setTimeout(() => {
      setItems((prev) => {
        if (offset === 0) {
          if (loadMore) setCanLoadMore(true);
          return received;
        }

        const map = new Map<string, MpProduct>();
        for (const p of prev) map.set(String(p.id), p);
        const before = map.size;
        for (const p of received) map.set(String(p.id), p);
        const next = Array.from(map.values());
        const appendedUnique = map.size - before;

        // Stop only when backend returns duplicate window (no growth).
        if (loadMore && appendedUnique <= 0) {
          setCanLoadMore(false);
        }

        return next;
      });
    }, 0);
  }, [received, offset, loadMore, perPage, isLoading, isFetching]);

  useEffect(() => {
    if (!loadMore) return;
    if (!inView) return;
    if (!hasMore) return;
    if (isLoading || isFetching) return;
    setTimeout(() => {
      setOffset((prev) => prev + perPage);
    }, 0);
  }, [inView, hasMore, loadMore, perPage, isLoading, isFetching]);

  const showLoader = (isLoading || isFetching) && visibleItems.length === 0;
  const showEmptyState = !showLoader && visibleItems.length === 0;
  const desktopCols = perPage < 4 ? perPage : 4;
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
