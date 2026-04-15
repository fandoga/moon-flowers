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


export interface IGoods {
  price: number;
  quantity: number;
  nomenclature: number;
  discount?: number;
}

export interface IOrder {
  id?: number;
  dated: number;
  operation: string;
  comment: string;
  contragent: number;
  tax_included: boolean;
  tax_active: boolean;
  goods: IGoods[];
  warehouse: number;
  organization: number;
  tags: string;
  paid_rubles: number;
  paid_lt: number;
  status: boolean;
  sum: number;
  loyality_card_id?: number;
}

export interface IRecipient {
  name: string;
  surname: string;
  phone: string;
}

export interface IDeliveryInfo {
  address: string;
  delivery_date: number;
  recipient: IRecipient;
  note: string;
}

export interface IContragent {
  id: number;
  name: string;
  phone: string;
  // другие поля
}

export interface PaymentRequest {
  amount: { value: string; currency: string };
  capture: boolean;
  receipt?: {
    customer: { phone: string };
    items: Array<{
      description: string;
      quantity: number;
      vat_code: number;
      amount: { value: string; currency: string };
    }>;
  };
  confirmation?: {
    type: 'redirect';
    return_url: string;
  };
}