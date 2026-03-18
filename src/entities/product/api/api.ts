import api from '@/shared/api/axios';
import { NomenclatureListResponse, NomenclatureQueryParams, NomenclatureItem, NomenclaturePrice, NomenclaturePhoto } from '../types/types';


interface MpProductResponse {
  id: number;
  name: string;
  type?: string;
  description_short?: string | null;
  description_long?: string | null;
  code?: string | null;
  unit_name?: string | null;
  price?: number;
  price_type?: string;
  images?: string[];
  attributes?: any[];
  tags?: string[];
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[];
  production_time_min_from?: number | null;
  production_time_min_to?: number | null;
  barcodes?: string[];
  available_warehouses?: Array<{ name: string; amount: number }>;
  updated_at?: string;
  created_at?: string;
  
}

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

export const getProductById = async (id: number) => {
  const response = await api.get<MpProductResponse>(`/mp/products/${id}`);
  const product = response.data;

  
  const adapted: NomenclatureItem = {
    id: product.id,
    name: product.name,
    type: product.type || 'product',
    description_short: product.description_short || '',
    description_long: product.description_long || '',
    code: product.code || '',
    unit: 0, 
    category: 0, 
    manufacturer: 0,
    global_category_id: 0,
    chatting_percent: 0,
    cashback_type: '',
    cashback_value: 0,
    external_id: '',
    tags: product.tags || [],
    seo_title: product.seo_title || '',
    seo_description: product.seo_description || '',
    seo_keywords: product.seo_keywords || [],
    production_time_min_from: product.production_time_min_from || 0,
    production_time_min_to: product.production_time_min_to || 0,
    address: '',
    latitude: 0,
    longitude: 0,
    video_link: '',
    unit_name: product.unit_name || '',
    barcodes: product.barcodes || [],
    prices: product.price ? [{ price: product.price, price_type: product.price_type || '' }] : [],
    balances: product.available_warehouses
      ? product.available_warehouses.map(w => ({
          warehouse_name: w.name,
          current_amount: w.amount,
        }))
      : [],
    attributes: product.attributes || [],
    photos: product.images?.map((url: string, idx: number) => {
      const match = url.match(/\/api\/v1\/(.+)$/);
      const relativePath = match ? match[1] : url;
      return {
        id: idx, 
        url: relativePath,
        is_main: idx === 0,
        created_at: 0,
        updated_at: 0,
      };
    }) || [],
    group_id: 0,
    group_name: '',
    is_main: false,
    qr_hash: '',
    qr_url: '',
    updated_at: product.updated_at ? new Date(product.updated_at).getTime() / 1000 : 0,
    created_at: product.created_at ? new Date(product.created_at).getTime() / 1000 : 0,
  };

  return adapted;
};