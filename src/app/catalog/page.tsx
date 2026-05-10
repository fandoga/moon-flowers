// app/catalog/page.tsx
"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductsCatalog from "@/widgets/products-catalog/ProductsCatalog";
import CatalogReels from "@/widgets/catalog-reels/CatalogReels";
import Categories from "@/widgets/categories/Categories";
import { useCategoriesWithData } from "@/entities/category";
import { FullScreenLoader } from "@/widgets/initial-loader.tsx/InitialLoader";

export interface CatalogItemType {
  id: string | number;
  name?: string | "";
  price?: number;
  image?: string | "";
  count?: number;
  categoryId?: number;
}

function CatalogPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = useMemo(() => {
    const v = searchParams.get("category");
    return v ? Number(v) : undefined;
  }, [searchParams]);

  const {
    filteredCategories: categories,
    isEnrichmentFetching,
    isLoading,
  } = useCategoriesWithData();

  const [isTouchDevice, setIsTouchDevice] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!categories) return;
    const baseTitle = "Moon Flowers - каталог";
    if (!category) {
      document.title = baseTitle;
      return;
    }
  }, [categories, category]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = requestAnimationFrame(() => {
      setIsTouchDevice(
        window.matchMedia("(hover: none), (pointer: coarse)").matches,
      );
    });
    return () => cancelAnimationFrame(id);
  }, []);

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
              const params = new URLSearchParams(searchParams.toString());
              if (id) params.set("category", String(id));
              else params.delete("category");
              router.replace(`/catalog?${params.toString()}`, {
                scroll: false,
              });
              const cat = categories?.find((c) => c.id === id);
              setTimeout(() => {
                document.title = cat
                  ? `${cat.name} - Moon Flowers`
                  : "Moon Flowers - каталог";
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
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <CatalogPageInner />
    </Suspense>
  );
}
