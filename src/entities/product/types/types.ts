// entities/product/types/types.ts
export interface NomenclaturePrice {
  price: number;
  price_type: string;
}

export interface NomenclatureBalance {
  warehouse_name: string;
  current_amount: number;
}

export interface NomenclatureAttribute {
  id: number;
  attribute_id: number;
  name: string;
  alias: string;
  value: string;
}

export interface NomenclaturePhoto {
  id: number;
  url: string;
  is_main: boolean;
  created_at: number;
  updated_at: number;
  public_url?: string;
}

export interface NomenclatureItem {
  name: string;
  type: string;
  description_short: string;
  description_long: string;
  code: string;
  unit: number;
  category: number;
  manufacturer: number;
  global_category_id: number;
  chatting_percent: number;
  cashback_type: string;
  cashback_value: number;
  external_id: string;
  tags: unknown[];
  seo_title: string;
  seo_description: string;
  seo_keywords: unknown[];
  production_time_min_from: number;
  production_time_min_to: number;
  address: string;
  latitude: number;
  longitude: number;
  video_link: string;
  id: number;
  unit_name: string;
  barcodes: string[];
  prices: NomenclaturePrice[];
  balances: NomenclatureBalance[];
  attributes: NomenclatureAttribute[];
  photos: NomenclaturePhoto[];
  group_id: number;
  group_name: string;
  is_main: boolean;
  qr_hash: string;
  qr_url: string;
  updated_at: number;
  created_at: number;
}

export interface NomenclatureListResponse {
  result: NomenclatureItem[];
  count: number;
}

export interface NomenclatureQueryParams {
  name?: string;
  barcode?: string;
  category?: number;
  global_category_id?: number;
  global_category_name?: string;
  description_long?: string;
  description_short?: string;
  has_photos?: boolean;
  chatting_percent?: number;
  limit?: number;
  offset?: number;
  with_prices?: boolean;
  with_balance?: boolean;
  with_attributes?: boolean;
  with_photos?: boolean;
  with_hash?: boolean;
  only_main_from_group?: boolean;
  min_price?: number;
  max_price?: number;
  sort?: string;
  updated_at__gte?: number;
  updated_at__lte?: number;
  created_at__gte?: number;
  created_at__lte?: number;
}

export type Product = NomenclatureItem;
export type ProductFilters = NomenclatureQueryParams;

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