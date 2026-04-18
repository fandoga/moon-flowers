// app/catalog/page.tsx
"use client";
import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import ProductsCatalog from "@/widgets/products-catalog/ProductsCatalog";
import { useEnrichedMpProducts, useMpProducts } from "@/entities/mp-product";
import Logo from "@/components/ui/logo";
import CatalogReels from "@/widgets/catalog-reels/CatalogReels";

export interface CatalogItemType {
  id: string | number;
  name?: string | "";
  price?: number;
  image?: string | "";
  count?: number;
  categoryId?: number;
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
  const [category, setCategory] = useState<number | undefined>();
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>();

  // Загружаем товары для каждой категории отдельно
  const monoProducts = useMpProducts({
    limit: 1,
    category: "5092",
  });
  const weddingProducts = useMpProducts({
    limit: 1,
    global_category_name: "Свадебные",
  });
  const autorProducts = useMpProducts({
    limit: 1,
    global_category_name: "Авторские",
  });
  const dryProducts = useMpProducts({
    limit: 1,
    global_category_name: "Сухоцветы",
  });
  const basketProducts = useMpProducts({
    limit: 1,
    global_category_name: "Корзины",
  });

  const categoriesQueries = [
    { id: 5092, key: "mono", name: "Моно-букеты", query: monoProducts },
    { id: 5093, key: "wedding", name: "Свадебные", query: weddingProducts },
    { id: 5094, key: "autor", name: "Авторские", query: autorProducts },
    { id: 5095, key: "dry", name: "Сухоцветы", query: dryProducts },
    { id: 5096, key: "basket", name: "Корзины", query: basketProducts },
  ] as const;
  const { enrichedItems: monoEnriched } = useEnrichedMpProducts(
    monoProducts.data?.result ?? [],
  );
  const { enrichedItems: weddingEnriched } = useEnrichedMpProducts(
    weddingProducts.data?.result ?? [],
  );
  const { enrichedItems: autorEnriched } = useEnrichedMpProducts(
    autorProducts.data?.result ?? [],
  );
  const { enrichedItems: dryEnriched } = useEnrichedMpProducts(
    dryProducts.data?.result ?? [],
  );
  const { enrichedItems: basketEnriched } = useEnrichedMpProducts(
    basketProducts.data?.result ?? [],
  );
  const firstProductByCategory: Record<
    string,
    (typeof monoEnriched)[number] | undefined
  > = {
    mono: monoEnriched[0],
    wedding: weddingEnriched[0],
    autor: autorEnriched[0],
    dry: dryEnriched[0],
    basket: basketEnriched[0],
  };

  const isLoading = categoriesQueries.some((q) => q.query.isLoading);

  // Собираем категории с реальными данными
  const mobileCategories = categoriesQueries.map((cat) => {
    const firstProduct = firstProductByCategory[cat.key];
    const resolvedPrice = Number(
      firstProduct?.price ?? firstProduct?.prices?.[0]?.price ?? 0,
    );
    const resolvedImage =
      firstProduct?.images?.[0] || firstProduct?.photos?.[0] || "";

    return {
      id: cat.id,
      name: cat.name,
      price: Number.isFinite(resolvedPrice) ? resolvedPrice : 0,
      image: resolvedImage,
      count: cat.query.data?.count || 0,
      categoryId: Number(firstProduct?.category ?? cat.id),
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
          <div className="flex items-center gap-2 py-8 md:py-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div
              onClick={() => setCategory(undefined)}
              className="cursor-pointer w-40 md:w-60 h-15 shrink-0 pt-4.5 text-center p-2 bg-gray rounded-xl"
              key="all"
            >
              Все
            </div>
            {filteredCategories.map((item) => (
              <div
                onClick={() => setCategory(item.categoryId)}
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
