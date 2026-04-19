// entities/category/api/api.ts
import api from "@/shared/api/axios";
import {
  CategoryListResponse,
  CategoryQueryParams,
  CategoryTreeResponse,
  CategoryTreeParams,
  PicturesResponse,
  Category,
  BatchPicturesResponse,
  CategoryTreeItem,
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
  // Убираем include_photo из параметров, чтобы не передавать его на бэкенд (или можно оставить, если бэкенд его игнорирует)
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

export const getCategoryTree = async (params?: CategoryTreeParams) => {
  const needPhotos = params?.include_photo === true;
  const queryParams = needPhotos ? { ...params, include_photo: false } : params;

  const response = await tableCrmApi.get<CategoryTreeResponse>(
    "/categories_tree/",
    {
      params: queryParams,
    },
  );
  const tree = response.data.result;

  if (needPhotos && tree.length > 0) {
    // Собираем все id категорий из дерева (рекурсивно)
    const collectIds = (items: CategoryTreeItem[]): number[] => {
      const ids: number[] = [];
      for (const item of items) {
        ids.push(item.key);
        if (item.children?.length) ids.push(...collectIds(item.children));
      }
      return ids;
    };
    const entityIds = collectIds(tree);
    if (entityIds.length) {
      const picturesBatch = await getCategoriesPicturesBatch(entityIds);

      // Рекурсивно обходим дерево и добавляем picture
      const enrichWithPhotos = (
        items: CategoryTreeItem[],
      ): CategoryTreeItem[] => {
        return items.map((item) => {
          const categoryPictures = picturesBatch.result[item.key] || [];
          const mainPicture =
            categoryPictures.find((p) => p.is_main) || categoryPictures[0];
          const pictureUrl = mainPicture
            ? `${process.env.NEXT_PUBLIC_API_URL}/${mainPicture.url}`
            : null;
          return {
            ...item,
            picture: pictureUrl || item.picture, // сохраняем существующую picture, если есть
            children: item.children ? enrichWithPhotos(item.children) : [],
          };
        });
      };

      return { ...response.data, result: enrichWithPhotos(tree) };
    }
  }

  return response.data;
};

export const getCategoryPictures = async (entity_id: number) => {
  const response = await api.get<PicturesResponse>("/pictures/", {
    params: {
      entity: "categories",
      entity_id,
    },
  });
  return response.data;
};
export const getCategoryById = async (id: number) => {
  const response = await api.get<Category>(`/categories/${id}/`);
  return response.data;
};
