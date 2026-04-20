/** Строка товара для POST /docs_sales/ (TableCRM). */
export interface DocSalesGoodItem {
  price: number;
  quantity: number;
  unit: number;
  discount: number;
  sum_discounted: number;
  nomenclature: number;
}

/** Один документ продажи в теле массива для /docs_sales/. */
export interface DocSalesCreateItem {
  priority: number;
  dated: number;
  operation: "Заказ";
  tax_included: boolean;
  tax_active: boolean;
  goods: DocSalesGoodItem[];
  settings: Record<string, unknown>;
  loyality_card_id: number;
  warehouse: number;
  contragent: number;
  organization: number;
  status: boolean;
  paid_rubles: number;
  paid_lt: number;
  sum: number;
}

export interface CreateOrderRequest {
  number: "string";
  dated: number;
  operation: "Заказ";
  tags: "";
  parent_docs_sales: number;
  comment: "string";
  track_number: "string";
  delivery_company: "string";
  order_source: "string";
  client: number;
  contragent: number;
  contract: number;
  organization: number;
  loyality_card_id: number;
  warehouse: number;
  paybox: number;
  tax_included: true;
  tax_active: true;
  settings: {
    repeatability_period: "minutes";
    repeatability_value: number;
    date_next_created: number;
    transfer_from_weekends: true;
    skip_current_month: true;
    repeatability_count: number;
    default_payment_status: false;
    repeatability_tags: false;
    repeatability_status: true;
  };
  sales_manager: number;
  paid_rubles: number;
  paid_lt: number;
  status: true;
  tech_card_operation_uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6";
  goods: [
    {
      price_type: number;
      price: number;
      quantity: number;
      unit: number;
      unit_name: "string";
      tax: number;
      discount: number;
      sum_discounted: number;
      status: "string";
      nomenclature: "string";
      nomenclature_name: "string";
    },
  ];
  priority: number;
  is_marketplace_order: false;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: string;
  error?: string;
}

/** Получатель в теле delivery_info. */
export interface DeliveryRecipient {
  name: string;
  surname: string;
  phone: string;
}

/** Тело PATCH /docs_sales/:id/delivery_info/ */
export interface DeliveryInfoPayload {
  address: string;
  delivery_date: number;
  delivery_price: number;
  recipient: DeliveryRecipient;
  note: string;
}

/** Аргумент мутации: id заказа + тело PATCH. */
export type DeliveryInfoRequest = DeliveryInfoPayload & {
  orderId: string;
};

export interface DeliveryInfoResponse {
  success: boolean;
  error?: string;
}

// Создание контрагента

export interface CreateContragentRequest {
  name?: string;
  phone?: string;
  inn?: string;
  description?: string;
  contragent_type?: string;
  birth_date?: string;
  gender?: string;
  type?: string;
  additional_phones?: string;
  external_id?: string;
  tags_id?: number[];
}

export interface CreateContragentResponse {
  success: boolean;
  contragent_id: string;
  error?: string;
}

export interface ContragentItem {
  id?: number;
  phone?: string;
  additional_phones?: string;
}

export interface GetContragentsParams {
  phone?: string;
  limit?: number;
  offset?: number;
}

export interface GetContragentsResponse {
  result: ContragentItem[];
  count?: number;
  error?: string;
}
