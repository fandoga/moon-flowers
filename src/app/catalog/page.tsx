// app/catalog/page.tsx
"use client";
import { motion } from "framer-motion";
import { useQueries } from "@tanstack/react-query";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import ProductsCatalog from "@/widgets/products-catalog/ProductsCatalog";
import {
  getMpProducts,
  useEnrichedMpProducts,
  type MpProduct,
} from "@/entities/mp-product";
import Logo from "@/components/ui/logo";
import CatalogReels from "@/widgets/catalog-reels/CatalogReels";
import Categories from "@/widgets/categories/Categories";
import { useCategories } from "@/entities/category";
import InitialLoader, {
  FullScreenLoader,
} from "@/widgets/initial-loader.tsx/InitialLoader";

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
  const [visibleCategoryIds, setVisibleCategoryIds] = useState<Set<number>>(
    () => new Set(),
  );

  const categoriesQuery = useCategories();
  const categories = categoriesQuery.data?.result;

  useEffect(() => {
    if (typeof window === "undefined" || !categories) return;

    const baseTitle = "Moon Flowers - каталог";

    if (!category) {
      document.title = baseTitle;
      return;
    }

    const selectedCategory = categories.find((c) => c.id === category);
    if (selectedCategory) {
      document.title = `${selectedCategory.name} - Moon Flowers`;
    } else {
      document.title = baseTitle;
    }
  }, [category, categories]);

  const effectiveVisibleCategoryIds = useMemo(() => {
    if (!categories?.length || isTouchDevice !== true) return new Set<number>();
    const validIds = new Set(categories.map((c) => c.id));
    const next = new Set<number>();
    for (const id of visibleCategoryIds) {
      if (validIds.has(id)) next.add(id);
    }
    if (next.size === 0) {
      next.add(categories[0].id);
      if (categories[1]) next.add(categories[1].id);
    }
    return next;
  }, [categories, isTouchDevice, visibleCategoryIds]);

  const previewQueries = useQueries({
    queries: (categories ?? []).map((cat) => ({
      queryKey: ["mp-products", "category-preview", cat.id],
      queryFn: () => getMpProducts({ limit: 1, category: String(cat.id) }),
      enabled:
        isTouchDevice === true &&
        effectiveVisibleCategoryIds.has(cat.id) &&
        !!cat.id,
    })),
  });

  const productsToEnrich = useMemo((): MpProduct[] => {
    if (!categories?.length) return [];
    const out: MpProduct[] = [];
    for (let i = 0; i < categories.length; i++) {
      const p = previewQueries[i]?.data?.result?.[0];
      if (p) out.push(p);
    }
    return out;
  }, [categories, previewQueries]);

  const { enrichedItems } = useEnrichedMpProducts(productsToEnrich);

  const enrichedByProductId = useMemo(() => {
    const m = new Map<number, MpProduct>();
    for (const p of enrichedItems) {
      m.set(Number(p.id), p);
    }
    return m;
  }, [enrichedItems]);

  const mobileCategories: CatalogItemType[] = useMemo(() => {
    if (!categories?.length) return [];
    return categories.map((cat, i) => {
      const q = previewQueries[i];
      const raw = q?.data?.result?.[0];
      const enriched = raw
        ? enrichedByProductId.get(Number(raw.id))
        : undefined;
      const resolvedPrice = Number(
        enriched?.price ?? enriched?.prices?.[0]?.price ?? 0,
      );
      const resolvedImage =
        enriched?.images?.[0] || enriched?.photos?.[0] || "";

      return {
        id: cat.id,
        name: cat.name,
        price: Number.isFinite(resolvedPrice) ? resolvedPrice : 0,
        image: resolvedImage,
        count: q?.data?.count ?? 0,
        categoryId: Number(enriched?.category ?? cat.id),
      };
    });
  }, [categories, previewQueries, enrichedByProductId]);

  const filteredCategories: CatalogItemType[] = useMemo(() => {
    return mobileCategories.filter((item, i) => {
      const q = previewQueries[i];
      if (!q?.isFetched) return true;
      return (item.count ?? 0) > 0;
    });
  }, [mobileCategories, previewQueries]);

  const onCategoryVisible = useCallback(
    (categoryId: number) => {
      if (isTouchDevice !== true) return;
      setVisibleCategoryIds((prev) => {
        const next = new Set(prev);
        next.add(categoryId);
        const idx = categories?.findIndex((c) => c.id === categoryId) ?? -1;
        if (idx >= 0 && categories && categories[idx + 1]) {
          next.add(categories[idx + 1].id);
        }
        return next;
      });
    },
    [categories, isTouchDevice],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = requestAnimationFrame(() => {
      setIsTouchDevice(
        window.matchMedia("(hover: none), (pointer: coarse)").matches,
      );
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (categoriesQuery.isLoading) {
    return <FullScreenLoader />;
  }

  if (!isTouchDevice) {
    return (
      <motion.main
        className=" md:py-2 bg-background max-w-[1440px] m-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto">
          <motion.div variants={itemVariants}></motion.div>
          <motion.h1 variants={itemVariants} className="h !mb-0">
            Каталог
          </motion.h1>
          <Categories setter={setCategory} />
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

  return (
    <CatalogReels
      isCategories
      items={filteredCategories}
      onCategoryVisible={onCategoryVisible}
    />
  );
}
