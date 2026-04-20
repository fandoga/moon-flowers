"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils/formatPrice";
import { AddToCartButton } from "@/features/add-to-cart/AddToCartButton";
import ActionButton from "@/components/ui/action-button";
import LoyalitiModal from "@/widgets/loyaliti-modal/LoyalitiModal";
import { useAddressSuggestions, useSavedAddressForm } from "@/entities/address";
import DatePicker from "@/widgets/time-picker/TimePicker";
import { useLoyalityCardData } from "@/entities/loyaliti";
import { formatPhone } from "@/lib/utils/formatPhone";
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
import Link from "next/link";
import SuccesOrderModal from "@/widgets/succes-order-modal/SuccesOrderModal";

const CART_LOCAL_KEY = "cart_local";
const CART_EVENT_NAME = "cart-local-updated";

export type LocalCartItem = {
  price: number;
  id: number;
  name: string;
  imageUrl?: string;
  quantity: number;
};

export type LocalCart = {
  items: Record<string, LocalCartItem>;
};

const readCart = (): LocalCart => {
  try {
    if (typeof window === "undefined") return { items: {} };
    const raw = window.localStorage.getItem(CART_LOCAL_KEY);
    if (!raw) return { items: {} };
    const parsed = JSON.parse(raw) as Partial<LocalCart>;
    return { items: parsed.items ?? {} };
  } catch {
    return { items: {} };
  }
};

const writeCart = (next: LocalCart) => {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CART_LOCAL_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
  } catch {}
};

export default function OrderPage() {
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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [floor, setFloor] = useState("");
  const { data } = useAddressSuggestions(addressQuery);
  const [suggOpen, setSuggOpen] = useState(false);
  const createOrder = useCreateOrder();
  const createContragent = useCreateContragent();
  const findContragentByPhone = useFindContragentByPhone();
  const sendDelivery = useSendDeliveryInfo();
  const { syncBalance, currentCard, points, escrow, balanceEscrow } =
    useLoyalityCardData();

  const [activeInput, setActiveInput] = useState<"From" | "To">("From");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const savedAddress = useSavedAddressForm();

  const suggestions = useMemo(
    () => data?.suggestions ?? [],
    [data?.suggestions],
  );

  // Keep initial SSR/CSR markup identical; hydrate cart from localStorage in effect.
  const [cart, setCart] = useState<LocalCart>({ items: {} });
  const balanceSyncDone = React.useRef(false);

  useEffect(() => {
    // Гарантия 100% что выполнится только один раз
    if (balanceSyncDone.current) return;
    if (!currentCard || points === undefined) return;

    syncBalance();

    balanceSyncDone.current = true;
  }, [currentCard, points, syncBalance]);

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

  useEffect(() => {
    const syncCart = () => setCart(readCart());

    syncCart();
    window.addEventListener(CART_EVENT_NAME, syncCart);
    window.addEventListener("storage", (e) => {
      if (e.key === CART_LOCAL_KEY) syncCart();
    });

    return () => {
      window.removeEventListener(CART_EVENT_NAME, syncCart);
    };
  }, []);

  const removeItemFromCart = (productId: number) => {
    const next = readCart();
    delete next.items[String(productId)];
    writeCart(next);
    setCart(next);
  };

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

  const cartItems = Object.values(cart.items);

  const total = cartItems.reduce(
    (sum, item) => sum + (item?.price || 0) * item.quantity,
    0,
  );
  const deliveryPrice = cartItems.length > 0 ? 897 : 0;
  const grandTotal = total + deliveryPrice - (escrow || 0);
  const hasEscrow = (escrow ?? 0) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      toast.error("Введите номер телефона отправителя");
      return;
    }

    if (recipientPhone.length < 8) {
      toast.error("Введите номер телефона получателя");
      return;
    }

    if (name.length === 0) {
      toast.error("Введите имя отправителя");
      return;
    }

    if (recipientName.length === 0) {
      toast.error("Введите имя получателя");
      return;
    }

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

    const recipientNameRaw = currentCard?.contragent?.trim()
      ? currentCard.contragent.trim()
      : recipientName.trim() || currentCard?.contragent?.trim() || "Клиент";

    const deliveryPayload = buildDeliveryDoc({
      address: addressLine,
      delivery_date: resolveDeliveryUnix({
        preferSoon: deliveryPreferSoon,
        date,
        time,
      }),
      delivery_price: deliveryPrice,
      recipient: {
        name: recipientNameRaw,
        phone: recipientPhone.trim(),
      },
      note: [
        apartment.trim() && `кв. ${apartment.trim()}`,
        entrance.trim() && `подъезд ${entrance.trim()}`,
        floor.trim() && `этаж ${floor.trim()}`,
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
        setCart({ items: {} });
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
        setModalOpen(true);
      }

      writeCart({ items: {} });
      setCart({ items: {} });
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
            <section>
              <div className="hidden md:grid grid-cols-[1fr_210px_210px] px-4 py-3 text-sm border-b border-[#E7E7E7]">
                <span>Продукт</span>
                <span>Количество</span>
                <span>Стоимость</span>
              </div>
              {cartItems.length === 0 ? (
                <p className="text-gray-500 px-4 py-6">Корзина пуста</p>
              ) : (
                cartItems.map((item) => {
                  const imageUrl = item.imageUrl;

                  const price = item.price || 0;
                  return (
                    <div
                      key={item.id}
                      className="cursor-pointer grid grid-cols-1 md:grid-cols-[1fr_210px_210px] gap-4 px-4 py-4 border-b border-[#E7E7E7]"
                    >
                      <Link
                        href={`/catalog${item.id}`}
                        className="flex items-center gap-3 min-w-0"
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={imageUrl || "/placeholder.jpg"}
                            alt={item.name || "Товар"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-base font-medium truncate">
                          {item.name || `Товар #${item.id}`}
                        </p>
                      </Link>

                      <div className="flex items-center gap-3">
                        <AddToCartButton
                          price={item.price}
                          productId={item.id}
                          productName={item.name}
                          imageUrl={imageUrl}
                          className="!w-[120px]"
                        />
                        <button
                          type="button"
                          onClick={() => removeItemFromCart(item.id)}
                          className="p-2 rounded-md hover:bg-red-50 text-red-500 cursor-pointer"
                          aria-label={`Удалить ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center text-xl font-semibold">
                        {formatPrice(price * item.quantity)}
                      </div>
                    </div>
                  );
                })
              )}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h3 className="mb-3">Получатель</h3>
                <div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gray w-full max-h-12 flex items-center justify-between rounded-lg p-1">
                      <button
                        onClick={() => {
                          setActiveInput("From");
                        }}
                        type="button"
                        className={`cursor-pointer w-1/2 rounded-lg p-2 ${activeInput === "From" && "bg-background"}`}
                      >
                        От кого
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveInput("To")}
                        className={`cursor-pointer w-1/2 rounded-lg p-2 ${activeInput === "To" && "bg-background"}`}
                      >
                        Кому
                      </button>
                    </div>
                    <input
                      value={activeInput === "From" ? name : recipientName}
                      onChange={(e) => {
                        if (activeInput === "From") {
                          setFirstName(e.target.value);
                        } else {
                          setRecipientName(e.target.value);
                        }
                      }}
                      className="bg-gray rounded-lg p-3 w-full"
                      placeholder={"Имя"}
                      type="text"
                    />
                    <input
                      value={activeInput === "From" ? phone : recipientPhone}
                      onChange={(e) => {
                        if (activeInput === "From") {
                          setPhone(formatPhone(e.target.value));
                        } else {
                          setRecipientPhone(formatPhone(e.target.value));
                        }
                      }}
                      className="bg-gray rounded-lg p-3 w-full"
                      placeholder={"+7 (000) 000-00-00"}
                      type="tel"
                    />
                    <LoyalitiModal phone={phone} name={name} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Доставка</h3>
                <div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-3 relative">
                      <input
                        onInput={() => setSuggOpen(true)}
                        className="text-center outline-none rounded-lg p-3 bg-gray col-span-3 w-full"
                        placeholder="Начните вводить адрес"
                        type="text"
                        value={addressQuery}
                        onChange={(e) => setAddressQuery(e.target.value)}
                      />
                      {suggestions.length > 0 && suggOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-lg bg-white shadow-lg border border-[#E5E5E5] overflow-hidden z-10">
                          {suggestions.map((item, index) => {
                            return (
                              <button
                                key={`${item}-${index}`}
                                type="button"
                                onClick={() => {
                                  setAddressQuery(item);
                                  setSuggOpen(false);
                                }}
                                className="block w-full text-left px-4 py-3 text-sm hover:bg-[#F5F5F5]"
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <input
                      placeholder="Квартира"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="c text-center outline-none rounded-lg p-3 bg-gray"
                    />
                    <input
                      placeholder="Подьезд"
                      value={entrance}
                      onChange={(e) => setEntrance(e.target.value)}
                      className=" text-center outline-none rounded-lg p-3 bg-gray"
                    />

                    <input
                      placeholder="Этаж"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      className="text-center outline-none rounded-lg p-3 bg-gray"
                    />
                    <DatePicker
                      date={date}
                      onDateChange={setDate}
                      time={time}
                      onTimeChange={setTime}
                      preferSoon={deliveryPreferSoon}
                      onPreferSoonChange={setDeliveryPreferSoon}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-xl bg-white/40 space-y-3">
              <div
                onClick={() => handleEscrow()}
                className="flex items-center cursor-pointer"
              >
                <button
                  disabled={points === 0}
                  type="button"
                  className={`${hasEscrow ? "!text-muted-foreground" : ""} cursor-pointer flex-1 h-12 rounded-xl bg-black text-white`}
                >
                  {hasEscrow
                    ? "Баллы применены"
                    : points === 0
                      ? "Нечего списывать"
                      : "Списать баллы"}
                </button>
                <div
                  className={`${hasEscrow ? "!text-muted-foreground" : ""} min-w-10 h-12 px-2 rounded-xl bg-black flex text-white items-center justify-center font-semibold`}
                >
                  {points}
                </div>
              </div>
              <div className="space-y-2 text-base">
                <div className="flex items-center justify-between">
                  <span>
                    {cartItems.length > 0 && cartItems.length}
                    {cartItems.length === 0
                      ? "Товаров нет"
                      : cartItems.length === 1
                        ? " товар"
                        : " товаров"}
                  </span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex items-center pt-2 border-t border-[#DCDCDC] justify-between">
                  <span>Доставка</span>
                  <span>{formatPrice(deliveryPrice)}</span>
                </div>
                {hasEscrow && (
                  <div className="flex items-center pt-2 border-t border-[#DCDCDC] justify-between">
                    <span>Выгода</span>
                    <span>-{formatPrice(escrow ?? 0)}</span>
                  </div>
                )}
                <div className="flex items-center pt-2 border-t border-[#DCDCDC] justify-between">
                  <span>Общая стоимость</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>
              <ActionButton
                text="Перейти к оплате"
                type="submit"
                fullWidth
                loading={isSubmitting}
                disabled={cartItems.length === 0}
                className="px-4 py-2 cursor-pointer"
              />
            </div>
          </aside>
        </form>
      </div>
      <SuccesOrderModal setOpen={setModalOpen} open={modalOpen} />
    </main>
  );
}
