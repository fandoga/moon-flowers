import api from '@/shared/api/axios';
import { FavoritesListResponse, AddFavoriteRequest, Favorite } from '../types/types';
import { USER_PHONE } from '@/shared/config/user';

export const getFavorites = async (page = 1, size = 20) => {
  const response = await api.get<FavoritesListResponse>('/mp/favorites', {
    params: { phone: USER_PHONE, page, size },
  });
  return response.data;
};

export const addFavorite = async (nomenclature_id: number) => {
  const data: AddFavoriteRequest = {
    nomenclature_id,
    contragent_phone: USER_PHONE,
  };
  const response = await api.post<Favorite>('/mp/favorites', data);
  return response.data;
};

export const removeFavorite = async (favorite_id: number) => {
  await api.delete(`/mp/favorites/${favorite_id}`, {
    params: { phone: USER_PHONE },
  });
};