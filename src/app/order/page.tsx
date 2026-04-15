"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LoaderCircle, Trash2 } from "lucide-react";
import Breadcrumb from "@/widgets/breadcrumb/Breadcrumb";
import {
  useCartProducts,
  useRemoveFromCart,
} from "@/entities/cart/hooks/hooks";
import { clearCartMeta } from "@/lib/cartLocalStorage";
import { formatPrice } from "@/lib/utils/formatPrice";
import { applyPhoneMask } from "@/lib/utils/phoneMask";
import { AddToCartButton } from "@/features/add-to-cart/AddToCartButton";

const FORM_STORAGE_KEY = "order_form_data";
const LOCAL_ORDERS_STORAGE_KEY = "orders_local";

type Address = {
  index: string;
  city: string;
  street: string;
  house: string;
};

type AddressSuggestion = {
  value: string;
  data: {
    postal_code: string;
    city: string;
    street: string;
    house: string;
  };
};

type LocalOrder = {
  id: number;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  delivery: {
    method: "delivery" | "pickup";
    address?: string;
  };
  paymentMethod: "cash" | "card";
  comment: string;
  total: number;
  goods: Array<{
    nomenclature_id: number;
    quantity: number;
    price: number;
    title: string;
  }>;
};

const getLocalOrders = (): LocalOrder[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LocalOrder[];
  } catch {
    return [];
  }
};

export default function OrderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const removeFromCart = useRemoveFromCart();
  const { data: cartItems = [], isLoading: isCartLoading } = useCartProducts();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [address, setAddress] = useState<Address>({
    index: "",
    city: "",
    street: "",
    house: "",
  });
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(FORM_STORAGE_KEY);
    if (!stored) return;
    try {
      const data = JSON.parse(stored) as {
        firstName?: string;
        lastName?: string;
        phone?: string;
        deliveryMethod?: "delivery" | "pickup";
        paymentMethod?: "cash" | "card";
        address?: Address;
        comment?: string;
      };
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setPhone(data.phone || "");
      setDeliveryMethod(data.deliveryMethod || "delivery");
      setPaymentMethod(data.paymentMethod || "cash");
      setAddress(
        data.address || { index: "", city: "", street: "", house: "" },
      );
      setComment(data.comment || "");
    } catch {
      // ignore invalid saved payload
    }
  }, []);

  useEffect(() => {
    const payload = {
      firstName,
      lastName,
      phone,
      deliveryMethod,
      paymentMethod,
      address,
      comment,
    };
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(payload));
  }, [
    firstName,
    lastName,
    phone,
    deliveryMethod,
    paymentMethod,
    address,
    comment,
  ]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!addressQuery.trim() || addressQuery.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoadingSuggestions(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          addressQuery,
        )}&format=json&addressdetails=1&limit=5`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "MoonFlowers/1.0",
          },
        });
        const data: Array<{
          display_name?: string;
          address?: {
            postcode?: string;
            city?: string;
            town?: string;
            village?: string;
            road?: string;
            house_number?: string;
          };
        }> = await res.json();

        const mapped: AddressSuggestion[] = data.map((item) => ({
          value: item.display_name || "",
          data: {
            postal_code: item.address?.postcode || "",
            city:
              item.address?.city ||
              item.address?.town ||
              item.address?.village ||
              "",
            street: item.address?.road || "",
            house: item.address?.house_number || "",
          },
        }));
        setSuggestions(mapped.filter((item) => item.value.length > 0));
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [addressQuery]);

  const handleSelectAddress = useCallback((suggestion: AddressSuggestion) => {
    const parsed = suggestion.data;
    setAddress({
      index: parsed.postal_code,
      city: parsed.city,
      street: parsed.street,
      house: parsed.house,
    });
    setAddressQuery(suggestion.value);
    setSuggestions([]);
  }, []);

  const total = cartItems.reduce(
    (sum, item) =>
      sum + (item.product?.prices?.[0]?.price || 0) * item.quantity,
    0,
  );

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
    if (deliveryMethod === "delivery") {
      const hasAddress =
        address.index && address.city && address.street && address.house;
      if (!hasAddress) {
        toast.error("Заполните адрес доставки");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const orderId = Date.now();
      const deliveryAddress =
        deliveryMethod === "delivery"
          ? `${address.index}, ${address.city}, ${address.street}, ${address.house}`
          : "Самовывоз";

      const localOrder: LocalOrder = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: { firstName, lastName, phone },
        delivery: { method: deliveryMethod, address: deliveryAddress },
        paymentMethod,
        comment,
        total,
        goods: cartItems.map((item) => ({
          nomenclature_id: item.nomenclature_id,
          quantity: item.quantity,
          price: item.product?.prices?.[0]?.price || 0,
          title: item.product?.name || `Товар #${item.nomenclature_id}`,
        })),
      };

      const existingOrders = getLocalOrders();
      localStorage.setItem(
        LOCAL_ORDERS_STORAGE_KEY,
        JSON.stringify([localOrder, ...existingOrders]),
      );

      localStorage.removeItem("cart");
      clearCartMeta();
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.success("Заказ сохранен");
      router.push(`/order/success?order_id=${orderId}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось оформить заказ";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="py-8 md:py-12 bg-background min-h-screen">
      <div className="container mx-auto max-w-[1440px]">
        <Breadcrumb
          paths={[
            { url: "/", name: "Главная" },
            { url: "/order", name: "Оформление заказа" },
          ]}
        />

        <h1 className="mt-6 text-3xl md:text-4xl font-bold mb-8 md:mb-12">
          Оформление заказа
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-8 sm:gap-6"
        >
          <div className="w-full lg:w-3/5 space-y-5 lg:order-none order-2">
            <div className="bg-gray-200 p-6 rounded-xl">
              <h2 className="text-xl md:text-2xl font-bold text-[#394426] mb-6">
                Данные пользователя
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
                <input
                  type="text"
                  placeholder="Имя"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black"
                />
                <input
                  type="text"
                  placeholder="Фамилия"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black"
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={phone}
                  onChange={(e) => setPhone(applyPhoneMask(e.target.value))}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black"
                />
              </div>
            </div>

            <div className="bg-gray-200 p-6 rounded-xl">
              <h2 className="text-xl md:text-2xl font-bold text-[#394426] mb-4">
                Способ получения
              </h2>
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <label className="bg-white w-full md:flex-1 rounded-sm p-4 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="delivery"
                      value="delivery"
                      checked={deliveryMethod === "delivery"}
                      onChange={() => setDeliveryMethod("delivery")}
                      className="w-5 h-5 accent-[#394426]"
                    />
                    <span className="pl-2 text-base md:text-lg text-[#394426] font-bold">
                      Доставка
                    </span>
                  </div>
                  <p className="pl-9 text-sm text-gray-600">
                    курьерская служба
                  </p>
                </label>

                <label className="bg-white w-full md:flex-1 rounded-sm p-4 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={deliveryMethod === "pickup"}
                      onChange={() => setDeliveryMethod("pickup")}
                      className="w-5 h-5 accent-[#394426]"
                    />
                    <span className="pl-2 text-base md:text-lg text-[#394426] font-bold">
                      Самовывоз
                    </span>
                  </div>
                  <p className="pl-9 text-sm text-gray-600">
                    бесплатно, со склада
                  </p>
                </label>
              </div>
            </div>

            {deliveryMethod === "delivery" && (
              <div className="bg-gray-200 p-6 rounded-xl">
                <h2 className="text-xl md:text-2xl font-bold text-[#394426] mb-4">
                  Адрес доставки
                </h2>
                <div className="mb-4 relative">
                  <input
                    type="text"
                    placeholder="Введите адрес для быстрого заполнения (с подсказками)"
                    value={addressQuery}
                    onChange={(e) => setAddressQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black"
                  />
                  {loadingSuggestions && (
                    <div className="absolute right-3 top-3 text-gray-400 text-sm">
                      Загрузка...
                    </div>
                  )}
                  {suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-sm mt-1 max-h-60 overflow-y-auto">
                      {suggestions.map((item, idx) => (
                        <li
                          key={`${item.value}-${idx}`}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => handleSelectAddress(item)}
                        >
                          {item.value}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Индекс"
                    value={address.index}
                    onChange={(e) =>
                      setAddress({ ...address, index: e.target.value })
                    }
                    required
                    className="px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black"
                  />
                  <input
                    type="text"
                    placeholder="Населенный пункт"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    required
                    className="px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black"
                  />
                  <input
                    type="text"
                    placeholder="Улица"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    required
                    className="px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black"
                  />
                  <input
                    type="text"
                    placeholder="Дом"
                    value={address.house}
                    onChange={(e) =>
                      setAddress({ ...address, house: e.target.value })
                    }
                    required
                    className="px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black"
                  />
                </div>
              </div>
            )}

            <div className="bg-gray-200 p-6 rounded-xl">
              <h2 className="text-xl md:text-2xl font-bold text-[#394426] mb-4">
                Способ оплаты
              </h2>
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <label className="bg-white w-full md:flex-1 rounded-sm p-4 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="w-5 h-5 accent-[#394426]"
                    />
                    <span className="font-bold text-base pl-2 md:text-lg text-[#394426]">
                      Наличными при получении
                    </span>
                  </div>
                  <p className="text-sm pl-9 text-gray-600">
                    оплата при получении
                  </p>
                </label>
                <label className="bg-white w-full md:flex-1 rounded-sm p-4 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="w-5 h-5 accent-[#394426]"
                    />
                    <span className="font-bold pl-2 text-base md:text-lg text-[#394426]">
                      Банковская карта
                    </span>
                  </div>
                  <p className="pl-9 text-sm text-gray-600">100% предоплата</p>
                </label>
              </div>
            </div>

            <div className="bg-gray-200 p-6 rounded-xl">
              <textarea
                placeholder="Комментарий к заказу"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black resize-none"
              />
            </div>

            <div className="mt-6 border-t border-gray-300 pt-6">
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full bg-[#394426] text-white px-6 py-4 rounded-sm font-medium text-lg hover:bg-[#102902] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="animate-spin h-5 w-5" />
                    Оформление...
                  </>
                ) : (
                  "Оформить заказ"
                )}
              </button>
              <p className="mt-3 text-sm text-gray-500 text-center">
                Нажимая на кнопку, вы даёте согласие на{" "}
                <span className="underline">обработку персональных данных</span>
              </p>
            </div>
          </div>

          <div className="w-full lg:w-2/5 bg-white rounded-xl p-4 sm:p-8 shadow-lg lg:sticky lg:top-24 h-fit lg:order-none order-1">
            <h2 className="text-2xl font-bold text-[#394426] mb-6">
              Ваш заказ
            </h2>
            {isCartLoading ? (
              <div className="py-8 flex justify-center">
                <LoaderCircle className="animate-spin h-6 w-6 text-[#394426]" />
              </div>
            ) : cartItems.length === 0 ? (
              <p className="text-gray-500">Корзина пуста</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const imageUrl =
                    item.product?.photos?.[0]?.url &&
                    (item.product.photos[0].url.includes("pictures/")
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${item.product.photos[0].url}`
                      : `${process.env.NEXT_PUBLIC_API_URL}/photos/${item.product.photos[0].url}`);

                  const price = item.product?.prices?.[0]?.price || 0;
                  return (
                    <div
                      key={item.nomenclature_id}
                      className="rounded-lg border border-gray-200 p-3 flex gap-3"
                    >
                      <div className="relative w-18 h-18 rounded-md overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={imageUrl || "/placeholder.jpg"}
                          alt={item.product?.name || "Товар"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#394426] truncate">
                          {item.product?.name ||
                            `Товар #${item.nomenclature_id}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(price)} x {item.quantity}
                        </p>
                        <p className="font-semibold mt-1">
                          {formatPrice(price * item.quantity)}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <AddToCartButton
                            productId={item.nomenclature_id}
                            currentQuantity={item.quantity}
                            className="!w-[120px]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart.mutate({
                                nomenclature_id: item.nomenclature_id,
                              })
                            }
                            className="p-2 rounded-md hover:bg-red-50 text-red-500 cursor-pointer"
                            aria-label={`Удалить ${item.product?.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-6 border-t pt-4 flex justify-between items-center text-lg">
              <span className="font-medium">Итого:</span>
              <span className="font-bold text-[#394426] text-xl sm:text-2xl">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
