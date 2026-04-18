import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getMpProducts,
  getMpProductById,
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

export const useMpProducts = (params?: MpProductsQueryParams) => {
  return useQuery<MpProductsResponse>({
    queryKey: ["mp-products", params],
    queryFn: () => getMpProducts(params),
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

  const productIds = useMemo(
    () =>
      items
        .map((product) => Number(product.id))
        .filter((id) => Number.isFinite(id) && id > 0),
    [items],
  );

  const picturesQueries = useQueries({
    queries: productIds.map((productId) => ({
      queryKey: ["mp-product-pictures", productId],
      queryFn: () => getPicturesById(productId),
      staleTime: 60_000,
    })),
  });

  const enrichedItems = useMemo(() => {
    const pictureByProductId = new Map<number, string>();
    for (const query of picturesQueries) {
      const picture = query.data;
      if (!picture) continue;
      const productId = Number(picture.entity_id);
      const url = picture.public_url || picture.url;
      if (Number.isFinite(productId) && url) {
        pictureByProductId.set(productId, url);
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
      const resolvedImage = pictureByProductId.get(productId) || fallbackImage;
      const fallbackPrice = Number(
        current.prices?.[0]?.price ?? current.price ?? 0,
      );
      const resolvedPrice = priceByProductId.get(productId) ?? fallbackPrice;

      return {
        ...current,
        images: [resolvedImage],
        price: resolvedPrice,
      } as MpProduct;
    });
  }, [items, picturesQueries, allPrices]);

  return {
    enrichedItems,
    isEnrichmentFetching: picturesQueries.some((query) => query.isFetching),
  };
};
