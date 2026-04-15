// shared/types/types.ts (обновлённый)
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
  client_id?: number;
  client_secret?: string;
  custom_token?: string;
}

export interface RefreshRequest {
  refresh_token: string;
  client_id: number;
}

export interface DeliveryRecipient {
  name: string;
  surname: string;
  phone: string;
}

export interface DeliveryInfo {
  address: string;
  delivery_date: number;
  delivery_price: number;
  recipient: DeliveryRecipient;
  note: string;
}

export interface BlogFolder {
  id: number;
  cashbox_id: number;
  name: string;
  slug: string;
  parent_id: number;
  path: string;
  settings: Record<string, unknown>;
  is_active: boolean;
}

export interface BlogPost {
  id: number;
  cashbox_id: number;
  folder_id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  description: string;
  status: string;
  published_at: string;
  meta: Record<string, unknown>;
  is_deleted: boolean;
  tags: string[];
  pictures: string[];
}

export interface PaymentAmount {
  value: string;
  currency: string;
}

export interface PaymentCustomer {
  full_name?: string;
  inn?: string;
  email?: string;
  phone?: string;
}

export interface PaymentReceiptItem {
  description: string;
  amount: PaymentAmount;
  vat_code: number;
  quantity: number;
  measure?: string;
  mark_quantity?: {
    numerator: number;
    denominator: number;
  };
  payment_subject?: string;
  payment_mode?: string;
  id?: number;
}

export interface PaymentReceipt {
  customer: PaymentCustomer;
  items: PaymentReceiptItem[];
}

export interface PaymentMethodDataCard {
  number: string;
  expiry_year: string;
  expiry_month: string;
}

export interface PaymentMethodData {
  type: string;
  card?: PaymentMethodDataCard;
}

export interface PaymentConfirmation {
  type: string;
  return_url: string;
}

export interface YookassaPaymentRequest {
  amount: PaymentAmount;
  description: string;
  receipt?: PaymentReceipt;
  tax_system_code?: number;
  capture?: boolean;
  merchant_customer_id?: string;
  payment_method_data?: PaymentMethodData;
  test?: boolean;
  confirmation?: PaymentConfirmation;
}

export interface PaymentRepeat {
  repeat_parent_id?: number;
  repeat_period?: string;
  repeat_weekday?: string;
  repeat_day?: number;
  repeat_month?: number;
  repeat_first?: number;
  repeat_last?: number;
  repeat_seconds?: number;
  repeat_number?: number;
}

export interface Payment {
  id: number;
  contragent: number;
  type: string;
  name: string;
  external_id: string;
  tags: string;
  amount_without_tax: number;
  article: string;
  article_id: number;
  project_id: number;
  amount: number;
  description: string;
  paybox: number;
  paybox_to: number;
  source_account_name: string;
  source_account_id: number;
  date: number;
  repeat_freq: number;
  repeat: PaymentRepeat;
  status: boolean;
  stopped: boolean;
  tax: number;
  tax_type: string;
  deb_cred: boolean;
  raspilen: boolean;
  parent_id: number;
  contragent_name: string;
  cheque: number;
  docs_sales_id: number;
  docs_purchases_id: number;
  created_at: number;
  updated_at: number;
  can_be_deleted_or_edited: boolean;
}

export interface PaymentListResponse {
  result: Payment[];
  count: number;
  errors?: Record<string, unknown>;
}

export interface PaymentCreateRequest {
  contragent: number;
  type: string;
  name?: string;
  external_id?: string;
  tags?: string;
  amount_without_tax?: number;
  article?: string;
  article_id?: number;
  project_id?: number;
  amount: number;
  description?: string;
  paybox?: number;
  paybox_to?: number;
  date?: number;
  repeat_freq?: number;
  repeat?: PaymentRepeat;
  status?: boolean;
  stopped?: boolean;
  tax?: number;
  tax_type?: string;
  deb_cred?: boolean;
  cheque?: number;
  docs_sales_id?: number;
  docs_purchases_id?: number;
  contract_id?: number;
  preamount?: number;
  percentamount?: number;
}

export interface Contragent {
  name: string;
  phone: string;
  inn: string;
  description?: string;
  contragent_type?: string;
  birth_date?: string;
  data?: Record<string, unknown>;
  gender?: string;
  type?: string;
  additional_phones?: string;
  external_id?: string;
  tags_id?: number[];
  id?: number;
  created_at?: number;
  updated_at?: number;
}

export interface ContragentListResponse {
  result: Contragent[];
  count: number;
}

export interface ContragentQueryParams {
  limit?: number;
  offset?: number;
  sort?: string;
  add_tags?: boolean;
  name?: string;
  inn?: number;
  phone?: string;
  external_id?: string;
  updated_at__gte?: number;
  updated_at__lte?: number;
  created_at__gte?: number;
  created_at__lte?: number;
}