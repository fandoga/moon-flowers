"use client";

import React, { useState } from "react";
import ProductsCatalog from "../products-catalog/ProductsCatalog";
import Categories from "../categories/Categories";

const PopularProducts = () => {
  const [category, setCategory] = useState<number>();

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
