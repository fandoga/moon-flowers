import api from '@/shared/api/axios';
import { NomenclatureListResponse, NomenclatureQueryParams, NomenclatureItem, PicturesResponse } from '../types/types';

export const getProducts = async (params?: NomenclatureQueryParams) => {
  const response = await api.get<NomenclatureListResponse>('/nomenclature/', { params });
  return response.data;
};

export const getProductsByCategoryAndName = async (categoryId: number, name: string, limit = 50) => {
  const response = await api.get<NomenclatureListResponse>('/nomenclature/', {
    params: {
      category: categoryId,
      name: name,
      limit,
      with_attributes: true,
      with_photos: true,
      with_prices: true,
    },
  });
  return response.data;
};

export const getProductPictures = async (entity_id: number) => {
  const response = await api.get<PicturesResponse>('/pictures/', {
    params: {
      entity: 'nomenclature',
      entity_id,
    },
  });
  return response.data;
};

export const getProductById = async (id: number) => {
  // Получаем основные данные товара
  const productResponse = await api.get<NomenclatureItem>(`/nomenclature/${id}/`, {
    params: {
      with_prices: true,
      with_attributes: true,
      // with_photos можно не включать, так как мы загрузим их отдельно
    },
  });
  
  // Загружаем фотографии
  const picturesResponse = await getProductPictures(id);
  
  // Объединяем данные
  const product = productResponse.data;
  
  // Преобразуем ответ с картинками в формат NomenclaturePhoto
  const photos = picturesResponse.result.map(pic => ({
    id: pic.id,
    url: pic.url,
    is_main: pic.is_main,
    created_at: pic.created_at,
    updated_at: pic.updated_at,
    public_url: pic.public_url,
  }));
  
  return {
    ...product,
    photos, // заменяем или дополняем поле photos
  };
};