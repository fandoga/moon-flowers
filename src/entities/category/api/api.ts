// entities/category/api/api.ts
import api from '@/shared/api/axios';
import {
  CategoryListResponse,
  CategoryQueryParams,
  CategoryTreeResponse,
  CategoryTreeParams,
  PicturesResponse,
  Category
} from '../types/types';

export const getCategories = async (params?: CategoryQueryParams) => {
  const response = await api.get<CategoryListResponse>('/categories/', { params });
  return response.data;
};

export const getCategoryTree = async (params?: CategoryTreeParams) => {
  const response = await api.get<CategoryTreeResponse>('/categories_tree/', { params });
  return response.data;
};

export const getCategoryPictures = async (entity_id: number) => {
  const response = await api.get<PicturesResponse>('/pictures/', {
    params: {
      entity: 'categories',
      entity_id,
    },
  });
  return response.data;
};
export const getCategoryById = async (id: number) => {
  const response = await api.get<Category>(`/categories/${id}/`);
  return response.data;
};