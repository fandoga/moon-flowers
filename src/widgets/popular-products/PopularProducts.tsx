"use client";

import React, { useState } from "react";
import ProductsCatalog from "../products-catalog/ProductsCatalog";

const PopularProducts = () => {
  const [category, setCategory] = useState<number>();

  const categories = [
    {
      category_id: null,
      name: "Все",
    },
    {
      category_id: 5092,
      name: "Моно-букеты",
    },
    {
      category_id: 5093,
      name: "Свадебные",
    },
    {
      category_id: 5094,
      name: "Авторские",
    },
    {
      category_id: 5095,
      name: "Сухоцветы",
    },
    {
      category_id: 5096,
      name: "Корзины",
    },
  ];

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
      <div className="flex items-center gap-2 overflow-x-auto py-8 md:py-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((item) => (
          <div
            onClick={() => {
              if (item.category_id === null) {
                setCategory(undefined);
                return;
              }
              setCategory(item.category_id);
            }}
            className="cursor-pointer w-40 md:w-60 h-15 shrink-0 pt-4.5 text-center p-2 bg-gray rounded-xl"
            key={item.name}
          >
            {item.name}
          </div>
        ))}
      </div>
      <ProductsCatalog category={category} loadMore={false} query="" size={8} />
    </div>
  );
};

export default PopularProducts;
