"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductsCatalog from "@/widgets/products-catalog/ProductsCatalog";
import CatalogReels from "@/widgets/catalog-reels/CatalogReels";
import Categories from "@/widgets/categories/Categories";
import { useCategoriesWithData } from "@/entities/category";
import { Suspense, useEffect, useMemo, useState } from "react";
import { FullScreenLoader } from "../initial-loader.tsx/InitialLoader";

export interface CatalogItemType {
  id: string | number;
  name?: string | "";
  price?: number;
  image?: string | "";
  count?: number;
  categoryId?: number;
}

const CatalogPageInner = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState<number | undefined>(() => {
    const v = searchParams.get("category");
    return v ? Number(v) : undefined;
  });

  const {
    filteredCategories: categories,
    isEnrichmentFetching,
    isLoading,
  } = useCategoriesWithData(false);

  const [isTouchDevice, setIsTouchDevice] = useState<boolean | undefined>(
    undefined,
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

  useEffect(() => {
    if (!categories) return;
    const baseTitle = "Moon Flowers - Каталог";
    if (!category) {
      document.title = baseTitle;
      return;
    }
    const cat = categories.find((c) => c.id === category);
    document.title = cat ? `${cat.name} - Moon Flowers` : baseTitle;
  }, [category, categories]);

  if (isTouchDevice === undefined || isEnrichmentFetching || isLoading) {
    return <FullScreenLoader />;
  }

  if (!isTouchDevice) {
    return (
      <main className=" md:py-2 bg-background max-w-[1440px] m-auto">
        <div className="container mx-auto">
          <h1 className="h !mb-0">Каталог</h1>
          <Categories
            setter={(id) => {
              setCategory(id);
              const params = new URLSearchParams(searchParams.toString());
              if (id) params.set("category", String(id));
              else params.delete("category");
              router.replace(`/catalog/?${params.toString()}`, {
                scroll: false,
              });
            }}
          />
          <div>
            <Suspense
              fallback={
                <div className="py-12 text-center">Загрузка товаров...</div>
              }
            >
              <ProductsCatalog category={category} query="" />
            </Suspense>
          </div>
        </div>
      </main>
    );
  }

  return <CatalogReels isCategories items={categories} />;
};

export default CatalogPageInner;
