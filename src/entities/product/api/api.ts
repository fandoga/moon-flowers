import api from "@/shared/api/axios";
import {
  NomenclatureListResponse,
  NomenclatureQueryParams,
  NomenclatureItem,
  PicturesResponse,
  NomenclaturePhoto,
  BatchPicturesResponse,
} from "../types/types";

export const getProducts = async (params?: NomenclatureQueryParams) => {
  const needPhotos = params?.with_photos === true;
  const queryParams = needPhotos ? { ...params, with_photos: false } : params;
  
  const response = await api.get<NomenclatureListResponse>('/nomenclature/', { params: queryParams });
  const products = response.data.result;
  
  if (needPhotos && products.length > 0) {
    const entityIds = products.map(p => p.id);
    const picturesBatch = await getProductsPicturesBatch(entityIds);
    
    const productsWithPhotos = products.map(product => {
      const productPictures = picturesBatch.result[product.id] || [];
      const photos: NomenclaturePhoto[] = productPictures.map(pic => ({
        id: pic.id,
        url: pic.url,
        is_main: pic.is_main,
        created_at: pic.created_at,
        updated_at: pic.updated_at,
        public_url: pic.public_url,
      }));
      return { ...product, photos };
    });
    
    return { ...response.data, result: productsWithPhotos };
  }
  
  return response.data;
};

export const getProductsByCategoryAndName = async (
  categoryId: number,
  name: string,
  limit = 50,
) => {
  const response = await api.get<NomenclatureListResponse>('/nomenclature/', {
    params: {
      category: categoryId,
      name: name,
      limit,
      with_attributes: true,
      has_photos: true,
      with_prices: true,
      with_photos: false,
    },
  });

  const products = response.data.result;

  if (products.length > 0) {
    const entityIds = products.map(p => p.id);
    const picturesBatch = await getProductsPicturesBatch(entityIds);

    const productsWithPhotos = products.map(product => {
      const productPictures = picturesBatch.result[product.id] || [];
      const photos: NomenclaturePhoto[] = productPictures.map(pic => ({
        id: pic.id,
        url: pic.url,
        is_main: pic.is_main,
        created_at: pic.created_at,
        updated_at: pic.updated_at,
        public_url: pic.public_url,
      }));
      return { ...product, photos };
    });

    return { ...response.data, result: productsWithPhotos };
  }

  return response.data;
};

export const getProductsPicturesBatch = async (entity_ids: number[]) => {
  const response = await api.post<BatchPicturesResponse>('/pictures/batch/', {
    entity: 'nomenclature',
    entity_ids,
  });
  return response.data;
};

export const getProductById = async (id: number) => {
  const productResponse = await api.get<NomenclatureItem>(`/nomenclature/${id}/`, {
    params: {
      with_prices: true,
      with_attributes: true,
      with_photos: false,
    },
  });

  const product = productResponse.data;
  const picturesBatch = await getProductsPicturesBatch([id]);
  const productPictures = picturesBatch.result[id] || [];

  const photos: NomenclaturePhoto[] = productPictures.map(pic => ({
    id: pic.id,
    url: pic.url,
    is_main: pic.is_main,
    created_at: pic.created_at,
    updated_at: pic.updated_at,
    public_url: pic.public_url,
  }));

  return {
    ...product,
    photos,
  };
};