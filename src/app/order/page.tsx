"use client";

import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useAddressSuggestions, useSavedAddressForm } from "@/entities/address";
import { useLoyalityCardData } from "@/entities/loyaliti";
import { writeLogoPoints } from "@/entities/loyaliti/lib/pointsStorage";
import {
  buildDeliveryDoc,
  buildDocSalesOrder,
  getOrderEnvDefaults,
  PaymentRequest,
  resolveDeliveryUnix,
  useCreateContragent,
  useCreateOrder,
  useFindContragentByPhone,
  useSendDeliveryInfo,
} from "@/entities/order";
import { tableCrmApi } from "@/shared/api/clients";
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
  const [isApplyingPoints, setIsApplyingPoints] = useState(false);
  const [offertaConfirmed, setOffertaConfirmed] = useState(false);
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
  const { currentCard, points, escrow, balanceEscrow, accruePointsToApi } =
    useLoyalityCardData();

  const suggestions = useMemo(
    () => data?.suggestions ?? [],
    [data?.suggestions],
  );

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
  const handleEscrow = async () => {
    if (isApplyingPoints) return;
    if (hasEscrow) return;

    if (!currentCard) {
      toast.error("Для списания бонусов подключите карту лояльности");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    try {
      setIsApplyingPoints(true);
      await accruePointsToApi();
      await balanceEscrow(total);
    } catch {
      toast.error("Не удалось списать бонусы, попробуйте позже");
    } finally {
      setIsApplyingPoints(false);
    }
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
  const deliveryPrice = cartItems.length > 0 ? 0 : 0;
  const grandTotal = total + deliveryPrice - (escrow ?? 0);
  const hasEscrow = (escrow ?? 0) > 0;

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (cartItems.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    if (!offertaConfirmed) {
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
    let createdOrderId: string | null = null;
    let submitStage: "order" | "payment" = "order";

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
        return;
      }

      createdOrderId = result.order_id;
      setOrderId(createdOrderId);

      const deliveryResult = await sendDelivery.mutateAsync({
        orderId: createdOrderId,
        ...deliveryPayload,
      });

      if (!deliveryResult.success) {
        toast.error(
          deliveryResult.error ??
            "Заказ создан, но не удалось сохранить доставку",
        );
        return;
      }

      submitStage = "payment";

      const amountToPay = Math.max(0, grandTotal);

      if (amountToPay <= 0) {
        writeLogoPoints(0);
        writeCart({ items: {} });
        toast.success(`Заказ №${createdOrderId} оформлен`);
        setModalOpen(true);
        return;
      }

      const vatCode = 1;
      const goodsSum = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      const loyaltySubtraction = Math.min(escrow ?? 0, goodsSum);

      const paymentData: PaymentRequest = {
        amount: { value: amountToPay.toFixed(2), currency: "RUB" },
        capture: true,
        receipt: {
          customer: { phone: phoneDigits, full_name: name.trim() },
          items: [],
        },
        confirmation: {
          type: "redirect",
          return_url: `https://moon-flowers.ru/order?order_id=${createdOrderId}`,
        },
      };

      cartItems.forEach((item) => {
        const discountPerUnit =
          goodsSum > 0 ? (item.price / goodsSum) * loyaltySubtraction : 0;
        const itemPrice = Math.max(0, item.price - discountPerUnit);

        paymentData.receipt?.items.push({
          description: item.name,
          id: item.id.toString(),
          quantity: item.quantity,
          vat_code: vatCode,
          amount: {
            value: itemPrice.toFixed(2),
            currency: "RUB",
          },
        });
      });

      if (deliveryPrice > 0) {
        paymentData.receipt?.items.push({
          description: "Доставка",
          id: envDefaults.deliveryNomenclatureId.toString(),
          quantity: 1,
          vat_code: vatCode,
          amount: { value: deliveryPrice.toFixed(2), currency: "RUB" },
        });
      }

      const paymentRes = await tableCrmApi.post<{
        confirmation?: { confirmation_url?: string };
      }>("/yookassa/payments", paymentData, {
        params: {
          warehouse: envDefaults.warehouse,
          doc_sales_id: createdOrderId,
        },
      });
      const confirmationUrl = paymentRes.data.confirmation?.confirmation_url;

      if (!confirmationUrl) {
        throw new Error("Missing YooKassa confirmation URL");
      }

      writeLogoPoints(0);
      writeCart({ items: {} });
      window.location.href = confirmationUrl;
    } catch {
      toast.error(
        submitStage === "payment"
          ? "Ошибка создания платежа"
          : "Не удалось создать заказ",
      );
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
            isApplyingPoints={isApplyingPoints}
            handleEscrow={handleEscrow}
            isAgreed={offertaConfirmed}
            setIsAgreed={setOffertaConfirmed}
          />
        </form>
      </div>
      <SuccesOrderModal
        orderId={orderId}
        setOpen={setModalOpen}
        open={modalOpen}
      />
    </main>
  );
}
