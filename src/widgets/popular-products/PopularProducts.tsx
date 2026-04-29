"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductsCatalog from "../products-catalog/ProductsCatalog";
import Categories from "../categories/Categories";
import { useCategories } from "@/entities/category";

const PopularProducts = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState<number | undefined>(() => {
    const v = searchParams.get("category");
    return v ? Number(v) : undefined;
  });
  const categoriesQuery = useCategories();
  const categories = categoriesQuery.data?.result;

  useEffect(() => {
    if (!categories) return;
    const baseTitle = "Moon Flowers - цветы";
    if (!category) {
      document.title = baseTitle;
      return;
    }
    const cat = categories.find((c) => c.id === category);
    document.title = cat ? `${cat.name} - Moon Flowers` : baseTitle;
  }, [category, categories, searchParams]); 

  return (
    <div>
      <div className="lg:pr-80 flex flex-col items-end">
        <h2 className="h !text-right">
          <span className="pr-6">Найди свой</span>
          <br />
          идеальный букет
        </h2>
        <p className="p !w-fit">
          Подберём композицию под настроение, <br /> случай и ваши пожелания
        </p>
      </div>
      <Categories
        setter={(id) => {
          setCategory(id);
          const params = new URLSearchParams(searchParams.toString());
          if (id) params.set("category", String(id));
          else params.delete("category");
          router.replace(`/?${params.toString()}`, { scroll: false });
          const cat = categories?.find((c) => c.id === id);
          setTimeout(() => {
            document.title = cat
              ? `${cat.name} - Moon Flowers`
              : "Moon Flowers - цветы";
          });
        }}
      />
      <ProductsCatalog category={category} loadMore={false} query="" size={8} />
    </div>
  );
};

export default PopularProducts;
