"use client";

import { CatalogItemType } from "@/app/catalog/page";
import Logo from "@/components/ui/logo";
import { useMpProducts } from "@/entities/mp-product";
import { normalizeCategory } from "@/lib/utils/normalizeCategory";
import CatalogReels from "@/widgets/catalog-reels/CatalogReels";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const MobileProcutCatalog = () => {
  const params = useParams();
  const paramsValue = Array.isArray(params) ? params[0] : params.category;
  // Декодируем URL encoded строку (кириллица)
  const decodedCategory = decodeURIComponent(paramsValue as string);
  const category = normalizeCategory(decodedCategory);
  const { data, isLoading } = useMpProducts({ category });
  const result = data?.result;
  const [normalizedItems, setNormalizedItems] = useState<CatalogItemType[]>([]);

  useEffect(() => {
    if (!result) return;

    // Преобразуем MpProduct[] в CatalogItemType[]
    const items: CatalogItemType[] = result.map((product) => ({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      count: result.length,
    }));

    setTimeout(() => setNormalizedItems(items));
  }, [data, category, result]);

  if (!normalizedItems || !result || isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Logo alwaysEnabled />
      </div>
    );

  return <CatalogReels items={normalizedItems} />;
};

export default MobileProcutCatalog;
