"use client";

import { CatalogItemType } from "@/app/catalog/page";
import Logo from "@/components/ui/logo";
import { useEnrichedMpProducts, useMpProducts } from "@/entities/mp-product";
import CatalogReels from "@/widgets/catalog-reels/CatalogReels";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

function buildCategoryQueryParam(
  raw: string | string[] | undefined,
): Record<string, string> {
  const segment = Array.isArray(raw) ? raw[0] : raw;
  if (segment == null || segment === "") return {};
  const decoded = decodeURIComponent(segment);
  if (/^\d+$/.test(decoded)) {
    return { category: decoded };
  }
  return { global_category_name: decoded };
}

const MobileProcutCatalog = () => {
  const params = useParams();
  const queryParams = buildCategoryQueryParam(params?.category);
  const hasCategoryParam = Object.keys(queryParams).length > 0;
  const { data, isLoading } = useMpProducts(queryParams, {
    enabled: hasCategoryParam,
  });
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

  if (!hasCategoryParam) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="p">Категория не указана</p>
      </div>
    );
  }

  if (isLoading || isEnrichmentFetching || result === undefined)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Logo alwaysEnabled />
      </div>
    );

  return <CatalogReels items={normalizedItems} />;
};

export default MobileProcutCatalog;
