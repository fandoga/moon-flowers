"use client";

import React from "react";
import { motion } from "framer-motion";
import Breadcrumb from "@/widgets/breadcrumb/Breadcrumb";
import ProductCardItem from "@/widgets/product-card/ProductCard";
import Pagination from "@/widgets/pagination/Pagination";
import { TrashIcon } from "lucide-react";
import { useFavoriteProducts, useRemoveFavorite } from "@/entities/favorites";
import { NomenclatureItem } from "@/entities/product/types/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export default function FavoritesPageClient() {
  const { data: products, favoriteItems } = useFavoriteProducts();
  const removeFavorite = useRemoveFavorite();

  const handleClearAll = () => {
    favoriteItems.forEach((item) => {
      removeFavorite.mutate(item.id);
    });
  };

  return (
    <motion.main
      className="py-8 md:py-12 bg-[#F8F9FB] max-w-[1440px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto">
        <motion.div variants={itemVariants}>
          <Breadcrumb
            paths={[
              { url: "/", name: "Главная" },
              { url: "/favorites", name: "Избранное" },
            ]}
          />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mt-4 pb-4 sm:pb-10 text-3xl md:text-5xl font-bold text-[#394426] mb-2"
        >
          Избранное
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="flex px-4 py-4 sm:py-0 rounded-md items-center justify-between mb-2 md:mb-8 bg-[#E3E4E7] sm:bg-[#F8F8F8]"
        >
          <p className="text-md sm:text-lg md:text-base text-[#394426] font-[600]">
            Растения в избранном: {products.length}
          </p>
          <button
            onClick={handleClearAll}
            className="flex gap-1 text-gray-500 text-sm md:text-base font-manrope no-underline hover:underline cursor-pointer"
          >
            <TrashIcon /> <span className="hidden sm:inline">Очистить избранное</span>
          </button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCardItem product={product} />
            </motion.div>
          ))}
        </motion.div>

        {products.length > 8 && (
          <motion.div variants={itemVariants}>
            <Pagination
              currentPage={1}
              totalPages={Math.ceil(products.length / 20)}
            />
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}