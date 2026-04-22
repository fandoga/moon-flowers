"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { useAddressSuggestions, useSavedAddressForm } from "@/entities/address";
import { useLoyalityCardData } from "@/entities/loyaliti";
import {
  buildDeliveryDoc,
  buildDocSalesOrder,
  getOrderEnvDefaults,
  resolveDeliveryUnix,
  useCreateContragent,
  useCreateOrder,
  useFindContragentByPhone,
  useSendDeliveryInfo,
} from "@/entities/order";
import SuccesOrderModal from "@/widgets/order/SuccesOrderModal";

// Вынесенные компоненты
import { useCart } from "../../entities/order/hooks/useCart";
import CartItemsList from "../../widgets/order/CartItemsList";
import RecipientForm from "../../widgets/order/RecipientForm";
import DeliveryForm from "../../widgets/order/DeliveryForm";
import OrderSummary from "../../widgets/order/OrderSummary";

/**
 * Главная страница оформления заказа
 * Все UI компоненты вынесены отдельно
 * Здесь только главная бизнес логика и состояние
 */
export default function OrderPage() {
  // Хук корзины
  const { cartItems, total, removeItemFromCart, writeCart } = useCart();

  // Форма
  const [name, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("10:30");
  const [deliveryPreferSoon, setDeliveryPreferSoon] = useState(true);
  const [apartment, setApartment] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [comment, setComment] = useState("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [orderId, setOrderId] = useState("");
  const [suggOpen, setSuggOpen] = useState(false);
  const [activeInput, setActiveInput] = useState<"From" | "To">("From");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: boolean;
    phone?: boolean;
  }>({});

  // Внешние хуки
  const { data } = useAddressSuggestions(addressQuery);
  const savedAddress = useSavedAddressForm();
  const createOrder = useCreateOrder();
  const createContragent = useCreateContragent();
  const findContragentByPhone = useFindContragentByPhone();
  const sendDelivery = useSendDeliveryInfo();
  const { syncBalance, currentCard, points, escrow, balanceEscrow } =
    useLoyalityCardData();

  const suggestions = useMemo(
    () => data?.suggestions ?? [],
    [data?.suggestions],
  );

  const balanceSyncDone = useRef(false);

  // Синхронизация баланса один раз
  useEffect(() => {
    if (balanceSyncDone.current) return;
    if (!currentCard || points === undefined) return;
    syncBalance();
    balanceSyncDone.current = true;
  }, [currentCard, points, syncBalance]);

  // Подставка сохраненного адреса
  useEffect(() => {
    if (savedAddress) {
      setTimeout(() => {
        setAddressQuery(savedAddress.address);
        setApartment(savedAddress.apartment);
        setEntrance(savedAddress.entrance);
        setFloor(savedAddress.floor);
      });
    }
  }, [savedAddress]);

  // Списание баллов
  const handleEscrow = () => {
    if (!currentCard) {
      toast.error("Для списания бонусов подключите карту лояльности");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    balanceEscrow(total);
  };

  // Создание контрагента
  const handleContragent = async (): Promise<number | null> => {
    const normalizedName = name.trim();
    const normalizedPhone = phone.trim();

    if (!normalizedName) {
      toast.error("Введите имя отправителя");
      return null;
    }

    if (normalizedPhone.replace(/\D/g, "").length < 10) {
      toast.error("Введите корректный номер телефона отправителя");
      return null;
    }

    try {
      const existingContragentId = await findContragentByPhone.mutateAsync({
        phone: normalizedPhone,
      });
      if (existingContragentId) {
        return existingContragentId;
      }

      const result = await createContragent.mutateAsync({
        name: normalizedName,
        phone: normalizedPhone,
      });
      if (result.success && result.contragent_id) {
        const createdId = Number(result.contragent_id);
        return Number.isFinite(createdId) && createdId > 0 ? createdId : null;
      }

      toast.error(
        result.error ?? "Не удалось создать контрагента, попробуйте позже",
      );
      return null;
    } catch {
      toast.error("Ошибка при создании контрагента");
      return null;
    }
  };

  // Расчеты
  const deliveryPrice = cartItems.length > 0 ? 897 : 0;
  const grandTotal = total + deliveryPrice - (escrow ?? 0);
  const hasEscrow = (escrow ?? 0) > 0;

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    const newErrors: { name?: boolean; phone?: boolean } = {};
    if (phoneDigits.length < 10) newErrors.phone = true;
    if (name.length === 0) newErrors.name = true;
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }
    setFieldErrors({});
    if (!addressQuery.trim()) {
      toast.error("Укажите адрес доставки");
      return;
    }

    const envDefaults = getOrderEnvDefaults();
    let contragentId: number | null =
      currentCard && currentCard.contragent_id > 0
        ? currentCard.contragent_id
        : null;

    if (!contragentId) {
      contragentId = await handleContragent();
      if (!contragentId) {
        toast.error("Контрагент не создан, оформление заказа остановлено");
        return;
      }
    }

    const document = buildDocSalesOrder({
      cartLines: cartItems,
      deliveryPrice,
      escrowRub: escrow ?? 0,
      loyalityCardId: currentCard ? currentCard.id : null,
      contragentId,
      organization: envDefaults.organization,
      warehouse: envDefaults.warehouse,
      defaultUnit: envDefaults.goodsUnit,
      deliveryNomenclatureId: envDefaults.deliveryNomenclatureId,
    });

    const addressLine = [
      addressQuery.trim(),
      apartment.trim() && `кв. ${apartment.trim()}`,
      entrance.trim() && `подъезд ${entrance.trim()}`,
      floor.trim() && `эт. ${floor.trim()}`,
    ]
      .filter(Boolean)
      .join(", ");

    const deliveryPayload = buildDeliveryDoc({
      address: addressLine,
      delivery_date: resolveDeliveryUnix({
        preferSoon: deliveryPreferSoon,
        date,
        time,
      }),
      delivery_price: deliveryPrice,
      recipient: {
        name: recipientName.trim() || name.trim(),
        phone: recipientPhone.trim() || phone.trim(),
      },
      note: [
        apartment.trim() && `кв. ${apartment.trim()}`,
        entrance.trim() && `подъезд ${entrance.trim()}`,
        floor.trim() && `этаж ${floor.trim()}`,
        comment.trim(),
      ]
        .filter(Boolean)
        .join(". "),
    });

    setIsSubmitting(true);
    try {
      const result = await createOrder.mutateAsync([document]);
      if (!result.success) {
        toast.error(result.error ?? "Не удалось создать заказ");
        return;
      }

      if (!result.order_id) {
        toast.error(
          "Заказ создан, но сервер не вернул номер — доставку сохранить нельзя",
        );
        writeCart({ items: {} });
        return;
      }

      const deliveryResult = await sendDelivery.mutateAsync({
        orderId: result.order_id,
        ...deliveryPayload,
      });

      if (!deliveryResult.success) {
        toast.error(
          deliveryResult.error ??
            "Заказ создан, но не удалось сохранить доставку",
        );
      } else {
        toast.success(`Заказ №${result.order_id} оформлен`);
        setOrderId(result.order_id);
        setModalOpen(true);
      }

      writeCart({ items: {} });
    } catch {
      toast.error("Не удалось создать заказ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="py-8 md:py-10 bg-background min-h-screen">
      <div className="container mx-auto max-w-[1440px]">
        <h1 className="h text-3xl md:text-5xl mb-8">Корзина</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8"
        >
          <div className="space-y-7">
            {/* Список товаров */}
            <CartItemsList
              cartItems={cartItems}
              removeItemFromCart={removeItemFromCart}
            />

            {/* Форма получателя и доставка */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2">
              <RecipientForm
                activeInput={activeInput}
                setActiveInput={setActiveInput}
                name={name}
                setName={setFirstName}
                phone={phone}
                setPhone={setPhone}
                recipientName={recipientName}
                setRecipientName={setRecipientName}
                recipientPhone={recipientPhone}
                setRecipientPhone={setRecipientPhone}
                errors={fieldErrors}
              />

              <DeliveryForm
                addressQuery={addressQuery}
                setAddressQuery={setAddressQuery}
                apartment={apartment}
                setApartment={setApartment}
                entrance={entrance}
                setEntrance={setEntrance}
                floor={floor}
                setFloor={setFloor}
                suggOpen={suggOpen}
                setSuggOpen={setSuggOpen}
                suggestions={suggestions}
                date={date}
                setDate={setDate}
                time={time}
                setComment={setComment}
                comment={comment}
                setTime={setTime}
                deliveryPreferSoon={deliveryPreferSoon}
                setDeliveryPreferSoon={setDeliveryPreferSoon}
              />
            </section>
          </div>

          {/* Итоги заказа */}
          <OrderSummary
            cartItemsCount={cartItems.length}
            total={total}
            deliveryPrice={deliveryPrice}
            grandTotal={grandTotal}
            points={points}
            escrow={escrow}
            hasEscrow={hasEscrow}
            isSubmitting={isSubmitting}
            handleEscrow={handleEscrow}
          />
        </form>
      </div>
      <SuccesOrderModal orderId={orderId} setOpen={setModalOpen} open={modalOpen} />
    </main>
  );
}
