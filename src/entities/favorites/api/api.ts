import { FavoritesListResponse, AddFavoriteRequest, Favorite } from '../types/types';
import { USER_PHONE } from '@/shared/config/user';

// Ключ для хранения в localStorage с учётом телефона пользователя
const getStorageKey = () => `favorites_${USER_PHONE}`;

// Вспомогательные функции для работы с localStorage
const getFavoritesFromStorage = (): Favorite[] => {
  if (typeof window === 'undefined') return []; // защита для SSR
  const data = localStorage.getItem(getStorageKey());
  if (!data) return [];
  try {
    return JSON.parse(data) as Favorite[];
  } catch {
    return [];
  }
};

const saveFavoritesToStorage = (favorites: Favorite[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getStorageKey(), JSON.stringify(favorites));
};

// Получение списка избранного с пагинацией
export const getFavorites = async (page = 1, size = 20) => {
  const all = getFavoritesFromStorage();
  const start = (page - 1) * size;
  const end = start + size;
  const paginated = all.slice(start, end);

  const response: FavoritesListResponse = {
    result: paginated,
    count: all.length,
    page,
    size,
  };
  return response;
};

// Добавление в избранное
export const addFavorite = async (nomenclature_id: number) => {
  const favorites = getFavoritesFromStorage();

  // Проверка на дубликат
  const existing = favorites.find(f => f.nomenclature_id === nomenclature_id);
  if (existing) {
    return existing; // можно вернуть существующий или выбросить ошибку
  }

  const now = new Date().toISOString();
  const newFavorite: Favorite = {
    id: Date.now() + Math.floor(Math.random() * 1000), // простой уникальный id
    nomenclature_id,
    phone: USER_PHONE,
    created_at: now,
    updated_at: now,
  };

  favorites.push(newFavorite);
  saveFavoritesToStorage(favorites);
  return newFavorite;
};

// Удаление из избранного
export const removeFavorite = async (favorite_id: number) => {
  const favorites = getFavoritesFromStorage();
  const updated = favorites.filter(f => f.id !== favorite_id);
  saveFavoritesToStorage(updated);
};