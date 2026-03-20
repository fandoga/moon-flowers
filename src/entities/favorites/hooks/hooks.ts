import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { getFavorites, addFavorite, removeFavorite } from '../api/api';
import { getProductById } from '@/entities/product/api/api';
import { useContragentPhone } from '@/shared/hooks/useContragentPhone';
import { NomenclatureItem } from '@/entities/product/types/types';

export const useFavorites = (page = 1, size = 20) => {
  return useQuery({
    queryKey: ['favorites', page, size],
    queryFn: () => getFavorites(page, size),
  });
};

export const useFavoritesMap = () => {
  const { data } = useFavorites();
  const map = (data?.result || []).reduce((acc, fav) => {
    acc[fav.nomenclature_id] = fav.id;
    return acc;
  }, {} as Record<number, number>);
  return map;
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nomenclature_id: number) => addFavorite(nomenclature_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (favorite_id: number) => removeFavorite(favorite_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useFavoriteProducts = (page = 1, size = 20) => {
  const { data: favData, isLoading: favLoading, error: favError } = useFavorites(page, size);
  const favoriteItems = favData?.result || [];

  const productQueries = useQueries({
    queries: favoriteItems.map(item => ({
      queryKey: ['product', item.nomenclature_id],
      queryFn: () => getProductById(item.nomenclature_id),
      enabled: !favLoading,
    })),
  });

  const isLoading = favLoading || productQueries.some(q => q.isLoading);
  const error = favError || productQueries.find(q => q.error)?.error;
  const products = productQueries.map(q => q.data).filter(Boolean) as NomenclatureItem[];

  return {
    data: products,
    favoriteItems,
    isLoading,
    error,
  };
};

export const useIsFavorite = (nomenclature_id: number) => {
  const contragentPhone = useContragentPhone();
  const { data: favorites, isLoading, isFetching } = useFavorites(1, 20);

  if (!contragentPhone) {
    return { isFavorite: false, favoriteId: undefined, isLoading: false };
  }

  const favoriteItem = favorites?.result?.find(
    (item) => item.nomenclature_id === nomenclature_id
  );

  return {
    isFavorite: !!favoriteItem,
    favoriteId: favoriteItem?.id,
    isLoading: isLoading || isFetching,
  };
};