import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addLoyalityTransactionAccrual,
  createLoyalityCard,
  getLoyalityAccruals,
  getLoyalityCards,
} from "../api/api";
import {
  CreateLoyalityCardRequest,
  LoyalityTransactionCreate,
  LoyalityCardsResponse,
  LoyalityTransactionsResponse,
} from "../types/types";

export const useLoyalityCards = (phone_number?: string) => {
  return useQuery<LoyalityCardsResponse>({
    queryKey: ["loyality-cards", phone_number],
    queryFn: () => getLoyalityCards(phone_number),
  });
};

export const useCreateLoyalityCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLoyalityCardRequest) => createLoyalityCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyality-cards"] });
    },
  });
};

export const useLoyalityAccruals = (loyality_card_number?: string) => {
  return useQuery<LoyalityTransactionsResponse>({
    queryKey: ["loyality-acc", loyality_card_number],
    queryFn: () => {
      if (!loyality_card_number)
        return Promise.resolve({ result: [], count: 0 });
      return getLoyalityAccruals(loyality_card_number);
    },
    enabled: !!loyality_card_number,
  });
};

export const useAddLoyalityTransactionAccrual = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoyalityTransactionCreate) =>
      addLoyalityTransactionAccrual(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyality-acc"] });
    },
  });
};
