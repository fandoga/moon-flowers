// entities/category/hooks/hooks.ts
import { useQuery, useQueries } from '@tanstack/react-query';
import { getCategories, getCategoryPictures, getCategoryTree, getCategoryById } from '../api/api';
import { CategoryTreeParams } from '../types/types';

export const useCategories = (limit = 100, offset = 0) => {
  return useQuery({
    queryKey: ['categories', limit, offset],
    queryFn: () => getCategories({ limit, offset }),
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
};

export const useCategoryWithPicture = (id: number) => {
  const categoryQuery = useCategory(id);
  const picturesQuery = useQuery({
    queryKey: ['category-picture', id],
    queryFn: () => getCategoryPictures(id),
    enabled: !!id && !!categoryQuery.data,
  });

  const isLoading = categoryQuery.isLoading || picturesQuery.isLoading;
  const error = categoryQuery.error || picturesQuery.error;

  const category = categoryQuery.data;
  const imageUrl = (() => {
    if (!category || !picturesQuery.data) return '/placeholder-category.jpg';
    const pictures = picturesQuery.data.result;
    const mainPicture = pictures.find(p => p.is_main) || pictures[0];
    return mainPicture ? `${process.env.NEXT_PUBLIC_API_URL}/${mainPicture.url}` : '/placeholder-category.jpg';
  })();

  return {
    data: category ? { ...category, imageUrl } : undefined,
    isLoading,
    error,
  };
};

export const useCategoriesWithPictures = (limit = 100, offset = 0) => {
  const categoriesQuery = useCategories(limit, offset);

  const pictureQueries = useQueries({
    queries: (categoriesQuery.data?.result || []).map((category) => ({
      queryKey: ['category-picture', category.id],
      queryFn: () => getCategoryPictures(category.id),
      enabled: !!categoriesQuery.data,
    })),
  });

  const isLoading = categoriesQuery.isLoading || pictureQueries.some((q) => q.isLoading);
  const error = categoriesQuery.error || pictureQueries.find((q) => q.error)?.error;

  const categoriesWithPictures = categoriesQuery.data?.result.map((category, index) => {
    const pictures = pictureQueries[index]?.data?.result || [];
    const mainPicture = pictures.find((p) => p.is_main) || pictures[0];
    const imageUrl = mainPicture
      ? `${process.env.NEXT_PUBLIC_API_URL}/${mainPicture.url}`
      : '/placeholder-category.jpg';
    return { ...category, imageUrl };
  });

  return {
    data: categoriesWithPictures,
    count: categoriesQuery.data?.count || 0,
    isLoading,
    error,
  };
};

export const useCategoryTree = (params?: CategoryTreeParams) => {
  return useQuery({
    queryKey: ['categoryTree', params],
    queryFn: () => getCategoryTree(params),
  });
};