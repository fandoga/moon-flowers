import { useState, useEffect, useCallback, useRef } from "react";
import {
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

/**
 * Хук для работы с картой лояльности
 * Включает всю логику: загрузка карт, проверка существующей, создание новой, сохранение в localStorage
 */
export const useLoyalityCardData = () => {
  const [currentCard, setCurrentCard] = useState<LoyalityCard | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [points, setPoints] = useState<number>();
  const [escrow, setEscrow] = useState<number>();
  const [canSync, setCanSync] = useState(true);
  const [pendingCardId, setPendingCardId] = useState<number | null>(null);
  const [searchPhone, setSearchPhone] = useState<string | undefined>(undefined);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_POINTS = 500;

  const { data, isLoading } = useLoyalityCards(searchPhone);
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
      try {
        const response = await fetch(
          `/api/loyality/loyality_cards?card_number=${cardNumber}`,
        );
        const data = await response.json();

        if (data?.result && Array.isArray(data.result)) {
          const freshCard = data.result.find(
            (item: LoyalityCard) => item.card_number === cardNumber,
          );
          if (freshCard) {
            setCurrentCard(freshCard);
            return freshCard;
          }
        }
        return null;
      } catch (error) {
        console.error("[refetchCard] Failed to fetch card:", error);
        return null;
      }
    },
    [],
  );

  /**
   * Синхронизировать баланс карты с локальными баллами!
   */
  const syncBalance = useCallback(
    async (cardOverride?: LoyalityCard) => {
      const initialCard = cardOverride || currentCard;
      if (!initialCard || points === undefined || !canSync) return;

      setCanSync(false);

      try {
        // Получаем актуальные данные карты перед синхронизацией
        const freshCard = await refetchCard(initialCard.card_number);
        const card = freshCard || initialCard;

        const currentBalance = card.balance || 0;

        if (points > currentBalance) {
          const addValue = points - currentBalance;
          createBalanceMutation.mutate({
            loyality_card_number: card.card_number,
            amount: addValue,
          });
        } else if (points < currentBalance) {
          const removeValue = currentBalance - points;
          createBalanceMutation.mutate({
            loyality_card_number: card.card_number,
            amount: removeValue,
            type: "withdraw",
          });
        }
      } finally {
        // Очищаем старый таймер если есть
        if (syncTimerRef.current) {
          clearTimeout(syncTimerRef.current);
        }

        // Разблокируем через 1 секунду в любом случае (даже если была ошибка)
        syncTimerRef.current = setTimeout(() => {
          setCanSync(true);
          syncTimerRef.current = null;
        }, 1000);
      }
    },
    [currentCard, points, createBalanceMutation, canSync, refetchCard],
  );

  // Cleanup таймера при размонтировании
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, []);

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
        console.log(result);
        setPendingCardId(newCard.id);
        setCurrentCard(newCard);
        syncBalance(newCard);
        return newCard;
      }

      throw new Error(result?.error || "Ошибка при создании карты лояльности");
    },
    [createCardMutation, syncBalance],
  );

  const balanceEscrow = useCallback(
    async (cartBalance: number) => {
      if (!currentCard || points === undefined) return;

      await syncBalance();

      // Получаем актуальные данные после синхронизации
      const freshCard = await refetchCard(currentCard.card_number);
      const card = freshCard || currentCard;

      if (cartBalance > card.balance) {
        // Если запрашиваем больше чем есть на карте - списываем весь доступный баланс карты
        createBalanceMutation.mutate({
          loyality_card_number: card.card_number,
          amount: Math.abs(card.balance),
          type: "withdraw",
        });

        const newLocalPoints = points - card.balance;
        const nextPoints = writeLogoPoints(Math.max(0, newLocalPoints));
        setEscrow(Math.abs(card.balance));
        setPoints(nextPoints);
      } else {
        // Списываем ровно запрошенную сумму
        createBalanceMutation.mutate({
          loyality_card_number: card.card_number,
          amount: -Math.abs(cartBalance),
          type: "withdraw",
        });
        const newLocalPoints = points - cartBalance;
        const nextPoints = writeLogoPoints(Math.max(0, newLocalPoints));
        setEscrow(Math.abs(cartBalance));
        setPoints(nextPoints);
      }
    },
    [currentCard, points, syncBalance, createBalanceMutation, refetchCard],
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
