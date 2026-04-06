import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductsByCategoryAndName } from '../api/api';
import { NomenclatureQueryParams } from '../types/types';
import { getProductsPicturesBatch } from '../api/api';

const MAX_VISIBLE_PRICE = 2000;

export const useProductsPicturesBatch = (entityIds: number[]) => {
  return useQuery({
    queryKey: ['products', 'pictures', 'batch', entityIds],
    queryFn: () => getProductsPicturesBatch(entityIds),
    enabled: entityIds.length > 0,   // запрос выполняется только если есть ID
    staleTime: 5 * 60 * 1000,        // данные считаются свежими 5 минут (по желанию)
  });
};

export const useProducts = (params?: NomenclatureQueryParams) => {
  const queryParams: NomenclatureQueryParams = {
    ...params,
    max_price: params?.max_price ?? (params?.min_price ? undefined : MAX_VISIBLE_PRICE),
  };
  
  return useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => getProducts(queryParams),
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
      max_price: MAX_VISIBLE_PRICE,
    }),
  });
};

export const useProductsByCategoryAndName = (categoryId: number, name: string) => {
  return useQuery({
    queryKey: ['products', 'byCategoryAndName', categoryId, name, MAX_VISIBLE_PRICE],
    queryFn: () =>
      getProductsByCategoryAndName(categoryId, name, 50),
    enabled: !!categoryId && !!name,
  });
};