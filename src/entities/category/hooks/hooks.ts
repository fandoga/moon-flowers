// entities/category/hooks/hooks.ts

import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryTree,
  getCategoryById,
  getCategoriesPicturesBatch,
} from "../api/api";
import { CategoryListResponse, CategoryTreeParams } from "../types/types";

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

export const useCategoryTree = (params?: CategoryTreeParams) => {
  const includePhoto = params?.include_photo ?? true;
  return useQuery({
    queryKey: ["categoryTree", params],
    queryFn: () => getCategoryTree({ ...params, include_photo: includePhoto }),
  });
};

export const useCategoriesWithPictures = (
  limit = 100,
  offset = 0,
  onlyWithPhotos = true,
) => {
  const categoriesQuery = useCategories(limit, offset);

  // Получаем список id категорий
  const categoryIds = categoriesQuery.data?.result.map((c) => c.id) || [];

  const picturesQuery = useQuery({
    queryKey: ["categories-pictures-batch", categoryIds],
    queryFn: () => getCategoriesPicturesBatch(categoryIds),
    enabled: categoriesQuery.isSuccess && categoryIds.length > 0,
  });

  const isLoading = categoriesQuery.isLoading || picturesQuery.isLoading;
  const error = categoriesQuery.error || picturesQuery.error;

  const categoriesWithPictures = categoriesQuery.data?.result.map(
    (category) => {
      const pictures = picturesQuery.data?.result[category.id] || [];
      const mainPicture = pictures.find((p) => p.is_main) || pictures[0];
      const imageUrl = mainPicture
        ? `${process.env.NEXT_PUBLIC_API_URL}/${mainPicture.url}`
        : "/placeholder-category.jpg";
      return { ...category, imageUrl, hasPhoto: !!mainPicture };
    },
  );

  const filtered = onlyWithPhotos
    ? categoriesWithPictures?.filter((cat) => cat.hasPhoto)
    : categoriesWithPictures;

  return {
    data: filtered,
    count: categoriesQuery.data?.count || 0,
    isLoading,
    error,
  };
};

export const useCategoryWithPicture = (id: number) => {
  const categoryQuery = useCategory(id);

  const picturesQuery = useQuery({
    queryKey: ["category-picture", id],
    queryFn: () => getCategoriesPicturesBatch([id]),
    enabled: !!id && !!categoryQuery.data,
  });

  const isLoading = categoryQuery.isLoading || picturesQuery.isLoading;
  const error = categoryQuery.error || picturesQuery.error;

  const category = categoryQuery.data;
  const imageUrl = (() => {
    if (!category || !picturesQuery.data) return "/placeholder-category.jpg";
    const pictures = picturesQuery.data.result[id] || [];
    const mainPicture = pictures.find((p) => p.is_main) || pictures[0];
    return mainPicture
      ? `${process.env.NEXT_PUBLIC_API_URL}/${mainPicture.url}`
      : "/placeholder-category.jpg";
  })();

  return {
    data: category ? { ...category, imageUrl } : undefined,
    isLoading,
    error,
  };
};
