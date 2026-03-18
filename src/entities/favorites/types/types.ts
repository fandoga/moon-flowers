// entities/favorites/types/types.ts
export interface Favorite {
  id: number;
  nomenclature_id: number;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface FavoritesListResponse {
  result: Favorite[];
  count: number;
  page: number;
  size: number;
}

export interface AddFavoriteRequest {
  nomenclature_id: number;
  contragent_phone: string;
  utm_term?: string;
  ref_user?: string;
}