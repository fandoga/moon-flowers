// app/catalog/page.tsx
"use client";
import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import ProductsCatalog from "@/widgets/products-catalog/ProductsCatalog";
import { useMpProducts } from "@/entities/mp-product";
import Logo from "@/components/ui/logo";
import CatalogReels from "@/widgets/catalog-reels/CatalogReels";

export interface CatalogItemType {
  id: string;
  name?: string | "";
  price?: number;
  image?: string | "";
  count?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function CatalogPage() {
  const [category, setCategory] = useState<string | undefined>("");
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>();

  // Загружаем товары для каждой категории отдельно
  const monoProducts = useMpProducts({ category: "монобукеты", size: 1 });
  const weddingProducts = useMpProducts({ category: "свадебные", size: 1 });
  const autorProducts = useMpProducts({ category: "авторские", size: 1 });
  const dryProducts = useMpProducts({ category: "сухоцветы", size: 1 });
  const basketProducts = useMpProducts({ category: "корзины", size: 1 });

  const categoriesQueries = [
    { id: "mono", name: "Моно-букеты", query: monoProducts },
    { id: "wedding", name: "Свадебные", query: weddingProducts },
    { id: "autor", name: "Авторские", query: autorProducts },
    { id: "dry", name: "Сухоцветы", query: dryProducts },
    { id: "basket", name: "Корзины", query: basketProducts },
  ];

  const isLoading = categoriesQueries.some((q) => q.query.isLoading);

  // Собираем категории с реальными данными
  const mobileCategories = categoriesQueries.map((cat) => {
    const products = cat.query.data?.result || [];
    const firstProduct = products[0];

    return {
      id: cat.id,
      name: cat.name,
      price: firstProduct?.price || 0,
      image: firstProduct?.images?.[0] || "",
      count: cat.query.data?.count || 0,
    };
  });

  // Фильтруем пустые
  const filteredCategories: CatalogItemType[] = mobileCategories.filter(
    (item) => item.count > 0,
  );

  useEffect(() => {
    if (typeof window === undefined) return;
    setTimeout(() => {
      setIsTouchDevice(
        typeof window !== "undefined" &&
          window.matchMedia("(hover: none), (pointer: coarse)").matches,
      );
    });
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Logo alwaysEnabled />
      </div>
    );
  }

  if (!isTouchDevice) {
    return (
      <motion.main
        className="py-8 md:py-12 bg-background max-w-[1440px] m-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto">
          <motion.div variants={itemVariants}></motion.div>
          <motion.h1
            variants={itemVariants}
            className="h text-4xl md:text-5xl mb-2"
          >
            Каталог
          </motion.h1>
          <div className="flex items-center gap-2 overflow-x-auto py-8 md:py-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div
              onClick={() => setCategory("")}
              className="cursor-pointer w-40 md:w-60 h-15 shrink-0 pt-4.5 text-center p-2 bg-gray rounded-xl"
              key="all"
            >
              Все
            </div>
            {filteredCategories.map((item) => (
              <div
                onClick={() => setCategory(item.name)}
                className="cursor-pointer w-40 md:w-60 h-15 shrink-0 pt-4.5 text-center p-2 bg-gray rounded-xl"
                key={item.id}
              >
                {item.name}
              </div>
            ))}
          </div>
          <motion.div variants={itemVariants}>
            <Suspense
              fallback={
                <div className="py-12 text-center">Загрузка товаров...</div>
              }
            >
              <ProductsCatalog category={category} query="" />
            </Suspense>
          </motion.div>
        </div>
      </motion.main>
    );
  }

  //  -------------МОБИЛЬНЫЙ ВАРИАНТ КАТАЛОГА----------------

  if (isTouchDevice) {
    return <CatalogReels isCategories items={filteredCategories} />;
  }
}
