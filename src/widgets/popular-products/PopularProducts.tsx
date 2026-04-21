"use client";

import React, { useEffect, useState } from "react";
import ProductsCatalog from "../products-catalog/ProductsCatalog";
import Categories from "../categories/Categories";
import { useCategories } from "@/entities/category";

const PopularProducts = () => {
  const [category, setCategory] = useState<number>();
  const categoriesQuery = useCategories();
  const categories = categoriesQuery.data?.result;

  useEffect(() => {
    if (typeof window === "undefined" || !categories) return;

    const baseTitle = "Moon Flowers - цветы";

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
      <Categories setter={setCategory} />
      <ProductsCatalog category={category} loadMore={false} query="" size={8} />
    </div>
  );
};

export default PopularProducts;
