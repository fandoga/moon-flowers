"use client";

import Logo from "@/components/ui/logo";
import { useProductsFromCategories } from "@/entities/category";
import CatalogReels from "@/widgets/catalog-reels/CatalogReels";

const MobileProcutCatalog = () => {
  const [filteredItems, isEnrichmentFetching, isLoading, hasCategoryParam] =
    useProductsFromCategories();

  console.log(filteredItems);

  if (!hasCategoryParam) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="p">Категория не указана</p>
      </div>
    );
  }

  if (isLoading || isEnrichmentFetching === undefined)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Logo alwaysEnabled />
      </div>
    );

  return <CatalogReels items={filteredItems} />;
};

export default MobileProcutCatalog;
