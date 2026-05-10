// entities/category/api/api.ts
import api from "@/shared/api/axios";
import {
  CategoryListResponse,
  CategoryQueryParams,
  Category,
  BatchPicturesResponse,
} from "../types/types";
import { tableCrmApi } from "@/shared/api/clients";

export const getCategoriesPicturesBatch = async (entity_ids: number[]) => {
  const response = await tableCrmApi.post<BatchPicturesResponse>(
    "/pictures/batch/",
    {
      entity: "categories",
      entity_ids,
    },
  );
  return response.data;
};

export const getCategories = async (params?: CategoryQueryParams) => {
  const needPhotos = params?.include_photo === true;
  const queryParams = needPhotos ? { ...params, include_photo: false } : params;

  const response = await tableCrmApi.get<CategoryListResponse>("/categories/", {
    params: queryParams,
  });
  const categories = response.data.result;

  if (needPhotos && categories.length > 0) {
    const entityIds = categories.map((c) => c.id);
    const picturesBatch = await getCategoriesPicturesBatch(entityIds);

    const categoriesWithPhotos = categories.map((category) => {
      const categoryPictures = picturesBatch.result[category.id] || [];
      const mainPicture =
        categoryPictures.find((p) => p.is_main) || categoryPictures[0];
      const pictureUrl = mainPicture
        ? `${process.env.NEXT_PUBLIC_API_URL}/${mainPicture.url}`
        : null;
      return {
        ...category,
        picture: pictureUrl, // заполняем поле picture, которое ожидается в Category
        hasPhoto: !!mainPicture, // опционально, можно добавить
      };
    });

    return { ...response.data, result: categoriesWithPhotos };
  }

  return response.data;
};

export const getCategoryById = async (id: number) => {
  const response = await api.get<Category>(`/categories/${id}/`);
  return response.data;
};
