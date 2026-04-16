export interface LoyalityCard {
  id?: number | string;
  card_number?: string;
  phone?: string;
  name?: string;
  balance?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LoyalityCardsResponse {
  result: LoyalityCard[];
  count?: number;
  error?: string;
}

export interface CreateLoyalityCardRequest {
  contragent_name: string;
  phone_number: string;
}

export interface CreateLoyalityCardResponse {
  result?: LoyalityCard;
  error?: string;
}

export type LoyalityTransactionType = "accrual" | string;

export interface LoyalityTransaction {
  id?: number;
  type?: LoyalityTransactionType;
  dated?: number;
  amount?: number;
  loyality_card_number?: string;
  tags?: string;
  name?: string;
  description?: string;
  status?: boolean;
  external_id?: string;
  cashier_name?: string;
  percentamount?: number;
  preamount?: number;
  dead_at?: number;
  is_deleted?: boolean;
  autoburned?: boolean;
  // some API responses may include these additional fields
  loyality_card_id?: number;
  cashier_id?: number;
  docs_sales_id?: number;
  created_at?: number;
  updated_at?: number;
}

export interface LoyalityTransactionCreate {
  type?: LoyalityTransactionType;
  dated?: number;
  amount?: number;
  loyality_card_number: string;
  tags?: string;
  name?: string;
  description?: string;
  status?: boolean;
  external_id?: string;
  cashier_name?: string;
  percentamount?: number;
  preamount?: number;
  dead_at?: number;
  is_deleted?: boolean;
  autoburned?: boolean;
}

export interface LoyalityTransactionsResponse {
  result: LoyalityTransaction[];
  count?: number;
  error?: string;
}

export interface AddLoyalityTransactionResponse {
  result?: LoyalityTransaction | LoyalityTransaction[];
  error?: string;
}

export interface LoyalityTransactionsQueryParams {
  limit?: number;
  offset?: number;
  sort?: string;
  type?: LoyalityTransactionType;
  amount?: number;
  loyality_card_number?: string;
  tags?: string;
  name?: string;
  description?: string;
  dated_from?: number;
  dated_to?: number;
  status?: boolean;
  updated_at__gte?: number;
  updated_at__lte?: number;
}
