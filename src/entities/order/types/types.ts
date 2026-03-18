export interface MpOrderGood {
  nomenclature_id: number;
  warehouse_id?: number;
  quantity: number;
  is_from_cart?: boolean;
}

export interface MpOrderDelivery {
  address?: string;
  delivery_date?: number;
  delivery_price?: number;
  recipient?: {
    name?: string;
    surname?: string;
    phone?: string;
  };
  note?: string;
}

export interface MpOrderRequest {
  goods: MpOrderGood[];
  delivery?: MpOrderDelivery;
  contragent_phone: string;
  client_lat?: number;
  client_lon?: number;
  ref_user?: string;
  additional_data?: any[];
}

export interface MpOrderResponse {
  message: string;
  processing_time_ms: number;
  cart_cleared: boolean;
}