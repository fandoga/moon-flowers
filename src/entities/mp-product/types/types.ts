export interface MpProduct {
  id: 0;
  name: "string";
  description_short: "string";
  description_long: "string";
  code: "string";
  unit_name: "string";
  cashbox_id: 0;
  category_name: "string";
  manufacturer_name: "string";
  price: 0;
  price_type: "string";
  price_address: "string";
  price_latitude: 0;
  price_longitude: 0;
  created_at: "2026-04-16T09:17:56.876Z";
  updated_at: "2026-04-16T09:17:56.876Z";
  images: ["string"];
  videos: [];
  barcodes: ["string"];
  type: "string";
  distance: 0;
  listing_pos: 0;
  listing_page: 0;
  is_ad_pos: false;
  tags: ["string"];
  current_amount: 0;
  seller_name: "string";
  seller_photo: "string";
  seller_description: "string";
  user_admin: [
    {
      recipient_id: "string";
      username: "string";
    },
  ];
  total_sold: 0;
  rating: 0;
  global_rating: 0;
  reviews_count: 0;
  button_text: "string";
  button_logic: "string";
  available_warehouses: [
    {
      warehouse_id: 0;
      organization_id: 0;
      warehouse_name: "string";
      warehouse_address: "string";
      latitude: 0;
      longitude: 0;
      distance_to_client: 0;
      current_amount: 0;
    },
  ];
  production_time_min_from: 0;
  production_time_min_to: 0;
}

export interface MpProductsResponse {
  result: MpProduct[];
  count?: number;
  size?: number;
  page?: number;
  error?: string;
}

export interface MpProductsQueryParams {
  seller_id?: number;
  size?: number;
  page?: number;
  search?: string;
  category_id?: number | string;
}
