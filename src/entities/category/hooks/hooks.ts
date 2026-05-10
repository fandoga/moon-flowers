// entities/category/hooks/hooks.ts

import { useQueries, useQuery } from "@tanstack/react-query";
import { getCategories, getCategoryById } from "../api/api";
import { useParams } from "next/navigation";
import {
  getMpProducts,
  MpProduct,
  useEnrichedMpProducts,
  useMpProducts,
} from "@/entities/mp-product";
import { CatalogItemType } from "@/app/catalog/page";
import { useMemo } from "react";

type CategoriesWithDataResult = [
  normalizedItems: CatalogItemType[],
  isEnrichmentFetching: boolean,
  isLoading: boolean,
  hasCategoryParam: boolean,
];

type CategoriesDataResult = {
  filteredCategories: CatalogItemType[];
  isEnrichmentFetching: boolean;
  isLoading: boolean;
};

const TECH_CARD_TAG = "Тех_Карта";

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

export const useCategories = (limit = 100, offset = 0, includePhoto = true) => {
  return useQuery({
    queryKey: ["categories", limit, offset, includePhoto],
    queryFn: () =>
      getCategories({ limit, offset, include_photo: includePhoto }),
  });
};

export const useCategory = (id: number, includePhoto = true) => {
  return useQuery({
    queryKey: ["category", id, includePhoto],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
};

export const useProductsFromCategories = (): CategoriesWithDataResult => {
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

  const filteredItems = useMemo<CatalogItemType[]>(
    () =>
      normalizedItems.filter(
        (item) => item.image && item.image !== "/placeholder.jpg",
      ),
    [normalizedItems],
  );

  return [filteredItems, isEnrichmentFetching, isLoading, hasCategoryParam];
};

export const useCategoriesWithData = (): CategoriesDataResult => {
  const categoriesQuery = useCategories();
  const categories = categoriesQuery.data?.result;

  const previewQueries = useQueries({
    queries: (categories ?? []).map((cat) => ({
      queryKey: ["mp-products", "category-preview", cat.id, TECH_CARD_TAG],
      queryFn: () =>
        getMpProducts({
          limit: 1,
          offset: 2,
          category: String(cat.id),
          tags: TECH_CARD_TAG,
        }),
      enabled: !!cat.id,
    })),
  });

  const productsToEnrich = useMemo((): MpProduct[] => {
    if (!categories?.length) return [];
    const out: MpProduct[] = [];
    for (let i = 0; i < categories.length; i++) {
      const p = previewQueries[i]?.data?.result?.[0];
      if (p) out.push(p);
    }
    return out;
  }, [categories, previewQueries]);

  const { enrichedItems, isEnrichmentFetching } =
    useEnrichedMpProducts(productsToEnrich);

  const enrichedByProductId = useMemo(() => {
    const m = new Map<number, MpProduct>();
    for (const p of enrichedItems) {
      m.set(Number(p.id), p);
    }
    return m;
  }, [enrichedItems]);

  const mobileCategories: CatalogItemType[] = useMemo(() => {
    if (!categories?.length) return [];
    return categories.map((cat, i) => {
      const q = previewQueries[i];
      const raw = q?.data?.result?.[0];
      const enriched = raw
        ? enrichedByProductId.get(Number(raw.id))
        : undefined;
      const resolvedPrice = Number(
        enriched?.price ?? enriched?.prices?.[0]?.price ?? 0,
      );
      const resolvedImage =
        enriched?.images?.[0] || enriched?.photos?.[0] || "";

      return {
        id: cat.id,
        name: cat.name,
        price: Number.isFinite(resolvedPrice) ? resolvedPrice : 0,
        image: resolvedImage,
        count: q?.data?.count ?? 0,
        categoryId: Number(enriched?.category ?? cat.id),
      };
    });
  }, [categories, previewQueries, enrichedByProductId]);

  const filteredCategories: CatalogItemType[] = useMemo(() => {
    return mobileCategories.filter((item, i) => {
      const q = previewQueries[i];
      return q?.isFetched && (item.count ?? 0) > 0 && Boolean(item.image);
    });
  }, [mobileCategories, previewQueries]);

  return {
    filteredCategories,
    isEnrichmentFetching,
    isLoading:
      categoriesQuery.isLoading ||
      previewQueries.some((query) => query.isLoading || query.isFetching),
  };
};
