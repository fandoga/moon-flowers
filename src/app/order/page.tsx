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
  const [addressQuery, setAddressQuery] = useState("");
  const [apartment, setApartment] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const { data } = useAddressSuggestions(addressQuery);
  const [suggOpen, setSuggOpen] = useState(false);
  const { syncBalance, currentCard, points, escrow, balanceEscrow } =
    useLoyalityCardData();

  const suggestions = useMemo(
    () => data?.suggestions ?? [],
    [data?.suggestions],
  );

  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"ToMe" | "ToOther">(
    "ToMe",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const savedAddress = useSavedAddressForm();

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
    balanceEscrow(total);
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
    if (!phone) {
      toast.error("Введите номер телефона");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    setIsSubmitting(true);
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
                      className="grid grid-cols-1 md:grid-cols-[1fr_210px_210px] gap-4 px-4 py-4 border-b border-[#E7E7E7]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
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
                      </div>

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
                        onClick={() => setDeliveryMethod("ToMe")}
                        type="button"
                        className={`cursor-pointer w-1/2 rounded-lg p-2 ${deliveryMethod === "ToMe" && "bg-background"}`}
                      >
                        Я Получатель
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("ToOther")}
                        className={`cursor-pointer w-1/2 rounded-lg p-2 ${deliveryMethod === "ToOther" && "bg-background"}`}
                      >
                        Вручить не мне
                      </button>
                    </div>
                    <input
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-gray rounded-lg p-3 w-full"
                      placeholder={currentCard?.contragent || "Имя"}
                      type="text"
                    />
                    <input
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-gray rounded-lg p-3 w-full"
                      placeholder={
                        formatPhone(currentCard?.card_number || "") ||
                        "+7 (000) 000-00-00"
                      }
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
                    <DatePicker />
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
    </main>
  );
}
