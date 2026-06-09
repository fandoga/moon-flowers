"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getMpProducts,
  getMpProductById,
  getPicturesBatchByIds,
  getPicturesById,
  getPricesById,
} from "../api/api";
import {
  MpProductsQueryParams,
  MpProductsResponse,
  MpProduct,
  Pictures,
  Prices,
} from "../types/types";

export const useMpProducts = (
  params?: MpProductsQueryParams,
  options?: { enabled?: boolean },
) => {
  return useQuery<MpProductsResponse>({
    queryKey: ["mp-products", params],
    queryFn: () => getMpProducts(params),
    enabled: options?.enabled ?? true,
  });
};

export const useMpProduct = (productId: number | string | null | undefined) => {
  return useQuery<MpProduct | null>({
    queryKey: ["mp-product", productId],
    queryFn: () => (productId ? getMpProductById(productId) : null),
    enabled: !!productId,
  });
};

export const usePictures = (productId: number | string | null | undefined) => {
  return useQuery<Pictures | null>({
    queryKey: ["mp-product-pictures", productId],
    queryFn: () => (productId ? getPicturesById(productId) : null),
    enabled: !!productId,
  });
};

export const usePrices = () => {
  return useQuery<Prices | null>({
    queryKey: ["mp-product-prices"],
    queryFn: () => getPricesById(),
  });
};

export const useEnrichedMpProducts = (items: MpProduct[]) => {
  const { data: allPrices } = usePrices();

  const productIds = useMemo(() => {
    const ids = items
      .map((product) => Number(product.id))
      .filter((id) => Number.isFinite(id) && id > 0);
    return Array.from(new Set(ids));
  }, [items]);

  const picturesBatchQuery = useQuery({
    queryKey: ["mp-product-pictures-batch", productIds],
    queryFn: () => getPicturesBatchByIds(productIds),
    enabled: productIds.length > 0,
    staleTime: 60_000,
  });

  const enrichedItems = useMemo(() => {
    const picturesBatch = picturesBatchQuery.data ?? {};
    const picturesByProductId = new Map<number, string[]>();
    for (const productId of productIds) {
      const pictures = picturesBatch[productId];
      if (!pictures?.length) continue;

      const sorted = [...pictures].sort((a, b) => {
        const am = a?.is_main ? 1 : 0;
        const bm = b?.is_main ? 1 : 0;
        return bm - am;
      });

      const urls = sorted
        .map((p) => p.public_url || p.url)
        .filter(Boolean) as string[];

      if (urls.length) {
        picturesByProductId.set(productId, urls);
      }
    }

    const priceByProductId = new Map<number, number>();
    const pricesList = Array.isArray(allPrices?.result)
      ? allPrices.result
      : allPrices?.result
        ? [allPrices.result]
        : [];
    for (const price of pricesList) {
      const productId = Number(price.nomenclature_id);
      const amount = Number(price.price);
      if (!Number.isFinite(productId) || !Number.isFinite(amount)) continue;
      if (!priceByProductId.has(productId)) {
        priceByProductId.set(productId, amount);
      }
    }

    return items.map((product) => {
      const current = product as MpProduct & {
        images?: string[];
        photos?: string[] | null;
        prices?: Array<{ price?: number }>;
        price?: number;
      };
      const productId = Number(current.id);

      const fallbackImage =
        current.photos?.[0] || current.images?.[0] || "/placeholder.jpg";
      const resolvedPhotos = picturesByProductId.get(productId);
      const resolvedImage = resolvedPhotos?.[0] || fallbackImage;
      const fallbackPrice = Number(
        current.prices?.[0]?.price ?? current.price ?? 0,
      );
      const resolvedPrice = priceByProductId.get(productId) ?? fallbackPrice;

      return {
        ...current,
        images: [resolvedImage],
        photos: resolvedPhotos?.length ? resolvedPhotos : current.photos,
        price: resolvedPrice,
      } as MpProduct;
    });
  }, [items, productIds, picturesBatchQuery.data, allPrices]);

  return {
    enrichedItems,
    isEnrichmentFetching: picturesBatchQuery.isFetching,
  };
};
