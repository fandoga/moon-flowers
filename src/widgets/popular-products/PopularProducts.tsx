"use client";

import React, { useState } from "react";
import ProductsCatalog from "../products-catalog/ProductsCatalog";

const PopularProducts = () => {
  const [category, setCategory] = useState("");

  const categories = [
    {
      id: "all",
      name: "Все",
    },
    {
      id: "mono",
      name: "Моно-букеты",
    },
    {
      id: "wedding",
      name: "Свадебные",
    },
    {
      id: "autor",
      name: "Авторские",
    },
    {
      id: "dry",
      name: "Сухоцветы",
    },
    {
      id: "basket",
      name: "Корзины",
    },
  ];

  return (
    <div>
      <div className="md:pr-80 flex flex-col items-end">
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
              if (item.id === "all") {
                setCategory("");
                return;
              }
              setCategory(item.name);
            }}
            className="cursor-pointer w-40 md:w-60 h-15 shrink-0 pt-4.5 text-center p-2 bg-gray rounded-xl"
            key={item.id}
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
