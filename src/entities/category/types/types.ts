// entities/category/types/types.ts
export interface Category {
  name: string;
  description: string;
  code: number;
  parent: number;
  status: boolean;
  photo_id: number;
  external_id: string;
  id: number;
  updated_at: number;
  created_at: number;
  picture: string;
}

export interface CategoryListResponse {
  result: Category[];
  count: number;
}

export interface CategoryQueryParams {
  limit?: number;
  offset?: number;
  include_photo?: boolean;
}

export interface BatchPicturesResponse {
  result: Record<number, Picture[]>;
  count: number;
  processing_time_ms: number;
}

export interface CategoryTreeItem {
  key: number;
  name: string;
  nom_count: number;
  description: string;
  code: number;
  status: boolean;
  parent: number;
  children: CategoryTreeItem[];
  expanded_flag: boolean;
  picture: string;
  updated_at: number;
  created_at: number;
}

export interface CategoryTreeResponse {
  result: CategoryTreeItem[];
  count: number;
}

export interface Picture {
  id: number;
  entity: string;
  entity_id: number;
  is_main: boolean;
  url: string;
  public_url: string;
  size: number;
  updated_at: number;
  created_at: number;
}

export interface PicturesResponse {
  result: Picture[];
  count: number;
}

export interface CategoryTreeParams {
  nomenclature_name?: string;
  offset?: number;
  limit?: number;
  include_photo?: boolean;
  request?: string;
}