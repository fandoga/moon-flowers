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
  writeLogoPoints,
} from "@/entities/loyaliti/lib/pointsStorage";
import {
  readStoredLoyalityCard,
  subscribeLoyalityCard,
  writeStoredLoyalityCard,
} from "@/entities/loyaliti/lib/cardStorage";

/**
 * Хук для работы с картой лояльности
 * Включает всю логику: загрузка карт, проверка существующей, создание новой, сохранение в localStorage
 */
export const useLoyalityCardData = () => {
  const [currentCard, setCurrentCard] = useState<LoyalityCard | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [points, setPoints] = useState<number>();
  const [escrow, setEscrow] = useState<number>();

  const { data, isLoading } = useLoyalityCards();
  const createCardMutation = useCreateLoyalityCard();
  const createBalanceMutation = useAddLoyalityTransactionAccrual();

  // Загружаем локальные бонусы при инициализации
  useEffect(() => {
    setEscrow(0);
    setPoints(readLogoPoints());

    const unsubscribe = subscribeLogoPoints((nextPoints) => {
      setPoints(nextPoints);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Загружаем карту из localStorage при инициализации
  useEffect(() => {
    setCurrentCard(readStoredLoyalityCard());
    setIsInitialized(true);
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

  // Сохраняем карту в localStorage при изменении
  useEffect(() => {
    if (currentCard) {
      writeStoredLoyalityCard(currentCard);
    }
  }, [currentCard]);

  // Обновляем данные когда приходят карты с сервера
  useEffect(() => {
    if (!data?.result || !currentCard) return;

    const actualCard = data.result.find((item) => item.id === currentCard.id);
    if (actualCard) {
      setCurrentCard(actualCard);
    }
  }, [data, currentCard]);

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
   * Создать новую карту или вернуть существующую
   */
  const createOrGetCard = useCallback(
    async (params: { phone_number: string; contragent_name: string }) => {
      const existingCard = findExistingCard(parseInt(params.phone_number));

      if (existingCard) {
        setCurrentCard(existingCard);
        return existingCard;
      }

      const result = await createCardMutation.mutateAsync(params);

      if (result && !result.error) {
        const newCard = Array.isArray(result) ? result[0] : result;
        setCurrentCard(newCard);
        return newCard;
      }

      throw new Error(result?.error || "Ошибка при создании карты лояльности");
    },
    [findExistingCard, createCardMutation],
  );

  /**
   * Синхронизировать баланс карты с локальными баллами!
   */
  const syncBalance = useCallback(() => {
    if (!currentCard || points === undefined) return;

    if (points > currentCard.balance) {
      const addValue = points - currentCard.balance;

      createBalanceMutation.mutate({
        loyality_card_number: currentCard.card_number,
        amount: addValue,
      });
    } else {
      const removeValue = currentCard.balance - points;
      createBalanceMutation.mutate({
        loyality_card_number: currentCard.card_number,
        amount: removeValue,
        type: "withdraw",
      });
    }
  }, [currentCard, points, createBalanceMutation]);

  const balanceEscrow = useCallback(
    (cartBalance: number) => {
      if (!currentCard || points === undefined) return;

      syncBalance();

      if (cartBalance > currentCard.balance) {
        // Если запрашиваем больше чем есть на карте - списываем весь доступный баланс карты
        createBalanceMutation.mutate({
          loyality_card_number: currentCard.card_number,
          amount: -Math.abs(currentCard.balance),
          type: "withdraw",
        });

        const newLocalPoints = points - currentCard.balance;
        const nextPoints = writeLogoPoints(Math.max(0, newLocalPoints));
        setEscrow(Math.abs(currentCard.balance));
        setPoints(nextPoints);
      } else {
        // Списываем ровно запрошенную сумму
        createBalanceMutation.mutate({
          loyality_card_number: currentCard.card_number,
          amount: -Math.abs(cartBalance),
          type: "withdraw",
        });
        const newLocalPoints = points - cartBalance;
        const nextPoints = writeLogoPoints(Math.max(0, newLocalPoints));
        setEscrow(Math.abs(cartBalance));
        setPoints(nextPoints);
      }
    },
    [currentCard, points, syncBalance, createBalanceMutation],
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
    setCard(readStoredLoyalityCard());

    const unsubscribe = subscribeLoyalityCard((nextCard) => {
      setCard(nextCard);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return card;
};
