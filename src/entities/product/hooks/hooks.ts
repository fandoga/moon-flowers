import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductsByCategoryAndName } from '../api/api';
import { NomenclatureQueryParams } from '../types/types';

export const useProducts = (params?: NomenclatureQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts({ ...params, has_photos: true }), // добавлено
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