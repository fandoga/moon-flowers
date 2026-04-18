export interface LoyalityCard {
  id: 0;
  card_number: 0;
  tags: string;
  balance: 0;
  income: 0;
  outcome: 0;
  contragent_id: 0;
  organization_id: 0;
  contragent: string;
  organization: string;
  cashback_percent: 0;
  minimal_checque_amount: 0;
  max_withdraw_percentage: 0;
  start_period: 0;
  end_period: 0;
  max_percentage: 0;
  lifetime: 0;
  apple_wallet_advertisement: string;
  status_card: true;
  is_deleted: true;
  created_at: 0;
  updated_at: 0;
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

export type LoyalityTransactionType = "accrual" | "withdraw";

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
  loyality_card_number: number;
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
