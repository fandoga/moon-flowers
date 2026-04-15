import { Suspense } from "react";
import Breadcrumb from "@/widgets/breadcrumb/Breadcrumb";
import SearchResults from "@/widgets/products-catalog/ProductsCatalog";

export default function ActionsPage() {
  return (
    <main className="py-8 md:py-12 bg-[#F8F9FB]">
      <div className="container mx-auto max-w-[1440px]">
        <Breadcrumb
          paths={[
            { url: "/", name: "Главная" },
            { url: "/actions", name: "Акции" },
          ]}
        />
        <h1 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-[#394426] mb-8">
          Акции
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Специальные предложения на популярные растения – успейте купить с
          выгодой!
        </p>
        <Suspense
          fallback={
            <div className="py-12 text-center">Загрузка товаров...</div>
          }
        >
          <SearchResults query="" />
        </Suspense>
      </div>
    </main>
  );
}
