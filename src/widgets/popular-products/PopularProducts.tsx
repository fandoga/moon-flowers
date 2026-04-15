import React from "react";
import ProductsCatalog from "../products-catalog/ProductsCatalog";

const PopularProducts = () => {
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
      name: "Коризны",
    },
  ];

  return (
    <div>
      <div>
        <h2 className="h !text-right">
          Найди свой <br />
          идеальный букет
        </h2>
        <p className="p !text-right">
          Подберём композицию под настроение, <br /> случай и ваши пожелания
        </p>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto py-8 md:py-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((item) => (
          <div
            className="w-40 md:w-60 h-15 shrink-0 pt-4.5 text-center p-2 bg-gray rounded-xl"
            key={item.id}
          >
            {item.name}
          </div>
        ))}
      </div>
      <ProductsCatalog loadMore={false} query="" limit={4} />
    </div>
  );
};

export default PopularProducts;
