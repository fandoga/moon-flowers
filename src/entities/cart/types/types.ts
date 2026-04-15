export interface CartGood {
  nomenclature_id: number;
  quantity: number;
  is_from_cart?: boolean;
}

export interface Cart {
  contragent_phone: string;
  goods: CartGood[];
  total_count: number;
}

export interface AddToCartRequest {
  contragent_phone: string;
  good: CartGood;
}

export interface RemoveFromCartRequest {
  contragent_phone: string;
  nomenclature_id: number;
  warehouse_id?: number;
}