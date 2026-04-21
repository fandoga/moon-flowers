export interface LoyalityCard {
  id: number;
  card_number: number;
  tags: string;
  balance: number;
  income: number;
  outcome: number;
  contragent_id: number;
  organization_id: number;
  contragent: string;
  organization: string;
  cashback_percent: number;
  minimal_checque_amount: number;
  max_withdraw_percentage: number;
  start_period: number;
  end_period: number;
  max_percentage: number;
  lifetime: number;
  apple_wallet_advertisement: string;
  status_card: boolean;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
}

export interface LoyalityCardsResponse {
  result: LoyalityCard[];
  count?: number;
  error?: string;
}

export interface CreateLoyalityCardRequest {
  contragent_name: string;
  phone_number: string;
  contragent_id?: number;
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
