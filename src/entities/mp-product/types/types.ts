export interface MpProduct {
  name: "string";
  type: "product";
  description_short: "string";
  description_long: "string";
  code: "string";
  unit: 0;
  category: 0;
  manufacturer: 0;
  global_category_id: 0;
  chatting_percent: 100;
  cashback_type: "lcard_cashback";
  cashback_value: 0;
  external_id: "string";
  tags: [];
  seo_title: "string";
  seo_description: "string";
  seo_keywords: [];
  production_time_min_from: 0;
  production_time_min_to: 0;
  address: "string";
  latitude: 0;
  longitude: 0;
  video_link: "string";
  id: 0;
  unit_name: "string";
  barcodes: ["string"];
  price: 0;
  prices: [
    {
      price: 0;
      price_type: "string";
    },
  ];
  balances: [
    {
      warehouse_name: "string";
      current_amount: 0;
    },
  ];
  attributes: [
    {
      id: 0;
      attribute_id: 0;
      name: "string";
      alias: "string";
      value: "string";
    },
  ];
  photos: [string] | null;
  images: [string];
  videos: [
    {
      id: 0;
      nomenclature_id: 0;
      url: "string";
      description: "string";
      tags: [];
      created_at: "2026-04-18T12:14:46.942Z";
      updated_at: "2026-04-18T12:14:46.942Z";
    },
  ];
  group_id: 0;
  group_name: "string";
  is_main: true;
  qr_hash: "string";
  qr_url: "string";
  updated_at: 0;
  created_at: 0;
}

export interface Pictures {
  id: 0;
  entity: "string";
  entity_id: 0;
  is_main: true;
  url: "string";
  public_url: "string";
  size: 0;
  updated_at: 0;
  created_at: 0;
}

export interface Prices {
  result: {
    id: 0;
    nomenclature_id: 0;
    nomenclature_name: "string";
    type: "string";
    warehouse_id: 0;
    address: "string";
    latitude: 0;
    longitude: 0;
    description_short: "string";
    description_long: "string";
    code: "string";
    unit: 0;
    unit_name: "string";
    category: 0;
    category_name: "string";
    manufacturer: 0;
    manufacturer_name: "string";
    price: 0;
    price_type: "string";
    date_from: 0;
    date_to: 0;
    radius: 0;
    hide_outside_radius: true;
    photos: [];
    updated_at: 0;
    created_at: 0;
  };
}

export interface MpProductsResponse {
  result: MpProduct[];
  count?: number;
  limit?: number;
  offset?: number;
  error?: string;
}

export interface MpProductsQueryParams {
  global_category_name?: string;
  limit?: number;
  offset?: number;
  search?: string;
  category_id?: number | string;
}
