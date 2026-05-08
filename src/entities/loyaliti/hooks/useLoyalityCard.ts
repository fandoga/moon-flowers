import { useState, useEffect, useCallback } from "react";
import {
  LoyalityCard,
  useLoyalityCards,
  useCreateLoyalityCard,
  useAddLoyalityTransactionAccrual,
} from "@/entities/loyaliti";
import {
  readLogoPoints,
  subscribeLogoPoints,
} from "@/entities/loyaliti/lib/pointsStorage";
import {
  readStoredLoyalityCard,
  subscribeLoyalityCard,
  writeStoredLoyalityCard,
} from "@/entities/loyaliti/lib/cardStorage";
import { createOrGetContragent } from "@/entities/order/api/api";

const RECENT_SYNC_TTL_MS = 3000;
const balanceSyncRequests = new Map<string, Promise<LoyalityCard | null>>();
const recentBalanceSyncs = new Map<string, number>();

const getBalanceSyncKey = (cardNumber: number, targetPoints: number) =>
  `${cardNumber}:${targetPoints}`;

type BackendCardLookup =
  | { status: "found"; card: LoyalityCard }
  | { status: "missing" }
  | { status: "error"; error: unknown };

const fetchBackendCard = async (
  cardNumber: number,
): Promise<BackendCardLookup> => {
  try {
    const response = await fetch(
      `/api/loyality/loyality_cards?card_number=${cardNumber}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch loyalty card: ${response.status}`);
    }

    const data = await response.json();

    if (data?.result && Array.isArray(data.result)) {
      const freshCard = data.result.find(
        (item: LoyalityCard) => item.card_number === cardNumber,
      );

      if (freshCard) {
        return { status: "found", card: freshCard };
      }
    }

    return { status: "missing" };
  } catch (error) {
    return { status: "error", error };
  }
};

/**
 * Хук для работы с картой лояльности
 * Включает всю логику: загрузка карт, проверка существующей, создание новой, сохранение в localStorage
 */
export const useLoyalityCardData = () => {
  const [currentCard, setCurrentCard] = useState<LoyalityCard | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [points, setPoints] = useState<number>();
  const [escrow, setEscrow] = useState<number>();
  const [pendingCardId, setPendingCardId] = useState<number | null>(null);

  const MAX_POINTS = 500;

  const { data, isLoading } = useLoyalityCards();
  const createCardMutation = useCreateLoyalityCard();
  const createBalanceMutation = useAddLoyalityTransactionAccrual();

  // Загружаем локальные бонусы при инициализации
  useEffect(() => {
    setTimeout(() => {
      setEscrow(0);
      setPoints(Math.min(readLogoPoints(), MAX_POINTS));
    });

    const unsubscribe = subscribeLogoPoints((nextPoints) => {
      setPoints(Math.min(nextPoints, MAX_POINTS));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Загружаем карту из localStorage при инициализации
  useEffect(() => {
    setTimeout(() => {
      setCurrentCard(readStoredLoyalityCard());
      setIsInitialized(true);
    });
  }, []);

  // Подписываемся на изменения карты между компонентами/вкладками
  useEffect(() => {
    const unsubscribe = subscribeLoyalityCard((nextCard) => {
      setCurrentCard(nextCard);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Если сохраненная карта больше не существует на бэке, удаляем ее локально
  useEffect(() => {
    if (!isInitialized || !currentCard || pendingCardId) return;

    let cancelled = false;

    void fetchBackendCard(currentCard.card_number).then((result) => {
      if (cancelled) return;

      if (result.status === "found") {
        if (JSON.stringify(result.card) !== JSON.stringify(currentCard)) {
          setCurrentCard(result.card);
        }
        return;
      }

      if (result.status === "missing") {
        setCurrentCard(null);
        writeStoredLoyalityCard(null);
        return;
      }

      console.error(
        "[loyalityCard] Failed to validate stored card:",
        result.error,
      );
    });

    return () => {
      cancelled = true;
    };
  }, [currentCard, isInitialized, pendingCardId]);

  // Обновляем данные когда приходят карты с сервера
  useEffect(() => {
    if (!data?.result || !currentCard || pendingCardId) return;

    const actualCard = data.result.find((item) => item.id === currentCard.id);

    if (actualCard) {
      // Обновляем карту только если есть реальные изменения
      if (JSON.stringify(actualCard) !== JSON.stringify(currentCard)) {
        setTimeout(() => {
          setCurrentCard(actualCard);
        });
      }
      return;
    }
  }, [data, currentCard, pendingCardId]);

  // Сохраняем карту в localStorage при изменении
  useEffect(() => {
    if (!currentCard) return;
    writeStoredLoyalityCard(currentCard);
  }, [currentCard]);

  /**
   * Проверить существует ли карта с таким именем
   */
  const findExistingCard = useCallback(
    (phone: number): LoyalityCard | undefined => {
      return data?.result?.find((item) => item.card_number === phone);
    },
    [data],
  );
  /**
   * Получить актуальные данные карты с сервера
   */
  const refetchCard = useCallback(
    async (cardNumber: number): Promise<LoyalityCard | null> => {
      const result = await fetchBackendCard(cardNumber);

      if (result.status === "found") {
        setCurrentCard(result.card);
        return result.card;
      }

      if (result.status === "error") {
        console.error("[refetchCard] Failed to fetch card:", result.error);
      }

      if (result.status === "missing") {
        console.warn("[refetchCard] Loyalty card was not found:", cardNumber);
      }

      return null;
    },
    [],
  );

  useEffect(() => {
    if (!pendingCardId) return;

    const timer = setTimeout(() => {
      setPendingCardId(null);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [pendingCardId]);

  /**
   * Синхронизировать баланс карты с локальными баллами
   */
  const syncBalance = useCallback(
    async (cardOverride?: LoyalityCard): Promise<LoyalityCard | null> => {
      const initialCard = cardOverride || currentCard;
      if (!initialCard || points === undefined) return null;

      const syncKey = getBalanceSyncKey(initialCard.card_number, points);
      const recentSyncAt = recentBalanceSyncs.get(syncKey);

      if (recentSyncAt && Date.now() - recentSyncAt < RECENT_SYNC_TTL_MS) {
        return initialCard;
      }

      const activeRequest = balanceSyncRequests.get(syncKey);
      if (activeRequest) {
        return activeRequest;
      }

      const request = (async () => {
        // Получаем актуальные данные карты перед синхронизацией
        const freshCard = await refetchCard(initialCard.card_number);
        const card = freshCard || initialCard;

        const currentBalance = card.balance || 0;
        let updatedCard = card;

        if (points > currentBalance) {
          const addValue = points - currentBalance;
          const result = await createBalanceMutation.mutateAsync({
            loyality_card_number: card.card_number,
            amount: addValue,
          });

          if (result?.error) {
            throw new Error(result.error);
          }

          updatedCard = { ...card, balance: currentBalance + addValue };
        } else if (points < currentBalance) {
          const removeValue = currentBalance - points;
          const result = await createBalanceMutation.mutateAsync({
            loyality_card_number: card.card_number,
            amount: removeValue,
            type: "withdraw",
          });

          if (result?.error) {
            throw new Error(result.error);
          }

          updatedCard = { ...card, balance: currentBalance - removeValue };
        }

        setCurrentCard(updatedCard);
        recentBalanceSyncs.set(syncKey, Date.now());
        return updatedCard;
      })();

      balanceSyncRequests.set(syncKey, request);

      try {
        return await request;
      } finally {
        balanceSyncRequests.delete(syncKey);
      }
    },
    [currentCard, points, createBalanceMutation, refetchCard],
  );

  /**
   * Создать новую карту или вернуть существующую
   */
  const createOrGetCard = useCallback(
    async (params: { phone_number: string; contragent_name: string }) => {
      const directResponse = await fetch(
        `/api/loyality/loyality_cards?phone_number=${encodeURIComponent(params.phone_number)}`,
      );
      const directData = await directResponse.json();

      if (directData?.result && Array.isArray(directData.result)) {
        const existingCard = directData.result.find(
          (item: LoyalityCard) =>
            item.card_number === parseInt(params.phone_number),
        );

        if (existingCard) {
          setCurrentCard(existingCard);
          return existingCard;
        }
      }

      // Если карта не найдена - создаем новую

      const contragentResp = await createOrGetContragent({
        name: params.contragent_name,
        phone: params.phone_number,
      });

      if (!contragentResp.success || !contragentResp.contragent_id) {
        throw new Error(
          contragentResp.error || "Не удалось создать контрагента",
        );
      }

      const result = await createCardMutation.mutateAsync({
        ...params,
        contragent_id: parseInt(contragentResp.contragent_id),
        contragent_name: params.contragent_name,
        phone_number: params.phone_number,
      });

      if (result && !result.error) {
        const newCard = Array.isArray(result) ? result[0] : result;
        setPendingCardId(newCard.id);
        setCurrentCard(newCard);
        await syncBalance(newCard);
        return newCard;
      }

      throw new Error(result?.error || "Ошибка при создании карты лояльности");
    },
    [createCardMutation, syncBalance],
  );

  const balanceEscrow = useCallback(
    async (cartBalance: number) => {
      if (!currentCard || points === undefined) return;
      if ((escrow ?? 0) > 0) return;

      const availablePoints = Math.max(0, points);
      const withdrawAmount = Math.min(cartBalance, availablePoints);

      if (withdrawAmount <= 0) {
        setEscrow(0);
        return;
      }

      setEscrow(withdrawAmount);
      setPoints(Math.max(0, availablePoints - withdrawAmount));
    },
    [currentCard, points, escrow],
  );

  /**
   * Выйти из карты лояльности
   */
  const logout = useCallback(() => {
    setCurrentCard(null);
    writeStoredLoyalityCard(null);
  }, []);

  return {
    currentCard,
    points,
    escrow,
    isLoading: isLoading || createCardMutation.isPending,
    isInitialized,
    error: createCardMutation.error,
    findExistingCard,
    syncBalance,
    balanceEscrow,
    createOrGetCard,
    logout,
  };
};

/**
 * Хук только для получения сохраненной карты из localStorage
 * Без запросов на сервер
 */
export const useSavedLoyaltyCard = () => {
  const [card, setCard] = useState<LoyalityCard | null>(null);

  useEffect(() => {
    setTimeout(() => setCard(readStoredLoyalityCard()));

    const unsubscribe = subscribeLoyalityCard((nextCard) => {
      setCard(nextCard);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return card;
};
