import { useState, useEffect, useCallback } from "react";
import {
  CreateLoyalityCardResponse,
  LoyalityCard,
  useLoyalityCards,
  useCreateLoyalityCard,
  useAddLoyalityTransactionAccrual,
} from "@/entities/loyaliti";
import {
  readLogoPoints,
  subscribeLogoPoints,
  writeLogoPoints,
} from "@/entities/loyaliti/lib/pointsStorage";
import {
  readStoredLoyalityCard,
  subscribeLoyalityCard,
  writeStoredLoyalityCard,
} from "@/entities/loyaliti/lib/cardStorage";
import { createOrGetContragent } from "@/entities/order/api/api";

const RECENT_ACCRUAL_TTL_MS = 3000;
const RECENT_CARD_PERSIST_TTL_MS = 30000;
const pointsAccrualRequests = new Map<string, Promise<LoyalityCard | null>>();
const recentPointsAccruals = new Map<string, number>();
const recentlyPersistedCards = new Map<number, number>();

const getPointsAccrualKey = (cardNumber: number, pointsToAccrue: number) =>
  `${cardNumber}:${pointsToAccrue}`;

const persistLoyalityCard = (card: LoyalityCard) => {
  recentlyPersistedCards.set(card.card_number, Date.now());
  writeStoredLoyalityCard(card);
};

const resolveCreatedCard = (
  result: CreateLoyalityCardResponse | LoyalityCard | LoyalityCard[],
): LoyalityCard | null => {
  if (Array.isArray(result)) return result[0] ?? null;
  if ("result" in result) return result.result ?? null;
  if ("id" in result && "card_number" in result) return result;
  return null;
};

type BackendCardLookup =
  | { status: "found"; card: LoyalityCard }
  | { status: "missing" }
  | { status: "error"; error: unknown };

const fetchBackendCard = async (
  cardNumber: number,
): Promise<BackendCardLookup> => {
  try {
    const fetchCardByParam = async (
      paramName: "card_number" | "phone_number",
    ): Promise<LoyalityCard | null> => {
      const response = await fetch(
        `/api/loyality/loyality_cards?${paramName}=${cardNumber}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch loyalty card: ${response.status}`);
      }

      const data = await response.json();

      if (data?.result && Array.isArray(data.result)) {
        return (
          data.result.find(
            (item: LoyalityCard) => item.card_number === cardNumber,
          ) ?? null
        );
      }

      return null;
    };

    const freshCard =
      (await fetchCardByParam("card_number")) ??
      (await fetchCardByParam("phone_number"));

    if (freshCard) return { status: "found", card: freshCard };

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

    const recentlyPersistedAt = recentlyPersistedCards.get(
      currentCard.card_number,
    );
    if (
      recentlyPersistedAt &&
      Date.now() - recentlyPersistedAt < RECENT_CARD_PERSIST_TTL_MS
    ) {
      return;
    }

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
        const storedCard = readStoredLoyalityCard();
        if (storedCard?.card_number !== currentCard.card_number) return;

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
   * Начислить локальные баллы на карту перед применением скидки
   */
  const accruePointsToApi = useCallback(
    async (cardOverride?: LoyalityCard): Promise<LoyalityCard | null> => {
      const initialCard = cardOverride || currentCard;
      if (!initialCard || points === undefined) return null;
      if (points <= 0) return initialCard;

      const accrualKey = getPointsAccrualKey(initialCard.card_number, points);
      const recentAccrualAt = recentPointsAccruals.get(accrualKey);

      if (
        recentAccrualAt &&
        Date.now() - recentAccrualAt < RECENT_ACCRUAL_TTL_MS
      ) {
        return initialCard;
      }

      const activeRequest = pointsAccrualRequests.get(accrualKey);
      if (activeRequest) {
        return activeRequest;
      }

      const request = (async () => {
        // Получаем актуальные данные карты перед начислением
        const freshCard = await refetchCard(initialCard.card_number);
        const card = freshCard || initialCard;

        const currentBalance = card.balance || 0;

        const result = await createBalanceMutation.mutateAsync({
          loyality_card_number: card.card_number,
          amount: points,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        const updatedCard = { ...card, balance: currentBalance + points };

        setCurrentCard(updatedCard);
        recentPointsAccruals.set(accrualKey, Date.now());
        return updatedCard;
      })();

      pointsAccrualRequests.set(accrualKey, request);

      try {
        return await request;
      } finally {
        pointsAccrualRequests.delete(accrualKey);
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
          persistLoyalityCard(existingCard);
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
        const newCard = resolveCreatedCard(result);
        if (!newCard) {
          throw new Error("Сервер не вернул данные карты лояльности");
        }

        setPendingCardId(newCard.id);
        setCurrentCard(newCard);
        persistLoyalityCard(newCard);
        return newCard;
      }

      throw new Error(result?.error || "Ошибка при создании карты лояльности");
    },
    [createCardMutation],
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
      const nextPoints = Math.max(0, availablePoints - withdrawAmount);
      setPoints(nextPoints);
      writeLogoPoints(nextPoints);
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
    accruePointsToApi,
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
