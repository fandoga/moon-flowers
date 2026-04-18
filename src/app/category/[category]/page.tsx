"use client";

import { CatalogItemType } from "@/app/catalog/page";
import Logo from "@/components/ui/logo";
import { useEnrichedMpProducts, useMpProducts } from "@/entities/mp-product";
import CatalogReels from "@/widgets/catalog-reels/CatalogReels";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

const MobileProcutCatalog = () => {
  const params = useParams();
  const paramsValue = Array.isArray(params) ? params[0] : params.category;
  const { data, isLoading } = useMpProducts({ category: paramsValue });
  const result = data?.result;
  const { enrichedItems, isEnrichmentFetching } = useEnrichedMpProducts(
    result ?? [],
  );

  const normalizedItems = useMemo<CatalogItemType[]>(
    () =>
      enrichedItems.map((product) => ({
        id: String(product.id),
        name: product.name,
        price: Number(product.price ?? product.prices?.[0]?.price ?? 0),
        image: product.images?.[0] || product.photos?.[0] || "",
        count: enrichedItems.length,
      })),
    [enrichedItems],
  );

  if (!result || isLoading || isEnrichmentFetching)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Logo alwaysEnabled />
      </div>
    );

  return <CatalogReels items={normalizedItems} />;
};

export default MobileProcutCatalog;
