import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductsByCategoryAndName } from '../api/api';
import { NomenclatureQueryParams } from '../types/types';
import { getProductsPicturesBatch } from '../api/api';

export const useProductsPicturesBatch = (entityIds: number[]) => {
  return useQuery({
    queryKey: ['products', 'pictures', 'batch', entityIds],
    queryFn: () => getProductsPicturesBatch(entityIds),
    enabled: entityIds.length > 0,   // запрос выполняется только если есть ID
    staleTime: 5 * 60 * 1000,        // данные считаются свежими 5 минут (по желанию)
  });
};

export const useProducts = (params?: NomenclatureQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  });
};

export const useProductsByCategory = (categoryId: number, limit = 20, offset = 0) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId, limit, offset],
    queryFn: () => getProducts({ 
      category: categoryId, 
      limit, 
      offset, 
      has_photos: true,
      with_prices: true,
      with_photos: true,
      with_attributes: true,
    }),
  });
};

export const useProductsByCategoryAndName = (categoryId: number, name: string) => {
  return useQuery({
    queryKey: ['products', 'byCategoryAndName', categoryId, name],
    queryFn: () => getProductsByCategoryAndName(categoryId, name),
    enabled: !!categoryId && !!name,
  });
};