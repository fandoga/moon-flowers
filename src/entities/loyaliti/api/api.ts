import { tableCrmApi } from "@/shared/api/clients";
import {
  CreateLoyalityCardRequest,
  CreateLoyalityCardResponse,
  LoyalityCardsResponse,
  AddLoyalityTransactionResponse,
  LoyalityTransactionCreate,
  LoyalityTransactionsQueryParams,
  LoyalityTransactionsResponse,
} from "../types/types";

export const getLoyalityCards = async (): Promise<LoyalityCardsResponse> => {
  try {
    const response = await tableCrmApi.get<LoyalityCardsResponse>(
      "/loyality_cards/",
      {},
    );

    return response.data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load loyality cards";

    return {
      result: [],
      count: 0,
      error: message,
    };
  }
};

export const createLoyalityCard = async (
  params: CreateLoyalityCardRequest,
): Promise<CreateLoyalityCardResponse> => {
  const card_number = crypto.randomUUID();

  try {
    const response = await tableCrmApi.post<CreateLoyalityCardResponse>(
      "/loyality_cards/",
      [
        {
          card_number,
          tags: "",
          phone_number: params.phone_number,
          contragent_id: 0,
          contragent_name: params.contragent_name,
          organization_id: 275, // ⚠️ скорее всего ОБЯЗАТЕЛЬНО
          cashback_percent: 0,
          minimal_checque_amount: 0,
          max_withdraw_percentage: 0,
          start_period: 0,
          end_period: 0,
          max_percentage: 0,
          lifetime: 0,
          status_card: true,
          is_deleted: false,
          apple_wallet_advertisement: "TableCRM",
        },
      ],
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create loyality card";

    return {
      error: message,
    };
  }
};

export const addLoyalityTransactionAccrual = async (
  params: LoyalityTransactionCreate | LoyalityTransactionCreate[],
): Promise<AddLoyalityTransactionResponse> => {
  try {
    const payload = Array.isArray(params) ? params : [params];

    const response = await tableCrmApi.post<AddLoyalityTransactionResponse>(
      "/loyality_transactions/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to add loyality transaction accrual";

    return { error: message };
  }
};

export const getLoyalityTransactions = async (
  params: LoyalityTransactionsQueryParams = {},
): Promise<LoyalityTransactionsResponse> => {
  try {
    const response = await tableCrmApi.get<LoyalityTransactionsResponse>(
      "/loyality_transactions/",
      {
        params,
      },
    );

    return response.data;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load loyality transactions";

    return { result: [], count: 0, error: message };
  }
};

export const getLoyalityAccruals = async (
  loyality_card_number: string,
): Promise<LoyalityTransactionsResponse> => {
  return getLoyalityTransactions({
    loyality_card_number,
    type: "accrual",
  });
};
