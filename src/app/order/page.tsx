"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import Breadcrumb from "@/widgets/breadcrumb/Breadcrumb";
import { useCartProducts, useCart } from "@/entities/cart/hooks/hooks";
import { useCreateOrder } from "@/entities/order/hooks/hooks";
import { YookassaPaymentRequest } from "@/shared/types/api/types";
import { formatPrice } from "@/lib/utils/formatPrice";
import { payments } from "@/shared/api/api";
import { NomenclatureItem } from "@/entities/product/types/types";

type CartItemWithProduct = {
  nomenclature_id: number;
  quantity: number;
  product?: NomenclatureItem;
  addedAt?: number;
};

interface YookassaPaymentResponse {
  confirmation?: {
    confirmation_url: string;
    type: string;
  };
  id?: string;
  status?: string;
}

const STORAGE_KEY = "order_form_data";

export default function OrderPage() {
  const router = useRouter();
  const { data: cartItems = [], isLoading, error } = useCartProducts();
  const { data: cartData } = useCart();
  const createOrder = useCreateOrder();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState(cartData?.contragent_phone || "");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [address, setAddress] = useState({
    index: "",
    city: "",
    street: "",
    house: "",
  });
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const [addressQuery, setAddressQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setDeliveryMethod(data.deliveryMethod || "delivery");
        setPaymentMethod(data.paymentMethod || "cash");
        setAddress(
          data.address || { index: "", city: "", street: "", house: "" },
        );
        setComment(data.comment || "");
      } catch (e) {
        console.error("Failed to load form data from localStorage", e);
      }
    }
  }, []);

  
  useEffect(() => {
    const data = {
      firstName,
      lastName,
      deliveryMethod,
      paymentMethod,
      address,
      comment,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [firstName, lastName, deliveryMethod, paymentMethod, address, comment]);

  
  useEffect(() => {
    if (cartData?.contragent_phone) {
      setPhone(cartData.contragent_phone);
    }
  }, [cartData]);

  
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!addressQuery.trim() || addressQuery.length < 3) {
        setSuggestions([]);
        return;
      }
      setLoadingSuggestions(true);
      try {
        
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressQuery)}&format=json&addressdetails=1&limit=5`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "YourAppName/1.0 (your@email.com)", 
          },
        });
        const data = await res.json();
        
        const suggestions = data.map((item: any) => ({
          value: item.display_name,
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
        setSuggestions(suggestions);
      } catch (error) {
        console.error("Failed to fetch address suggestions:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const handler = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(handler);
  }, [addressQuery]);

  const handleSelectAddress = useCallback((suggestion: any) => {
    const data = suggestion.data;
    setAddress({
      index: data.postal_code || "",
      city: data.city || "",
      street: data.street || "",
      house: data.house || "",
    });
    setAddressQuery(suggestion.value);
    setSuggestions([]);
  }, []);

  const total = cartItems.reduce(
    (sum: number, item: CartItemWithProduct) =>
      sum + (item.product?.prices?.[0]?.price || 0) * item.quantity,
    0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartData?.contragent_phone) {
      toast.error("Не удалось определить телефон получателя");
      return;
    }

    setIsSubmitting(true);
    try {
      const goods = cartItems.map((item: CartItemWithProduct) => ({
        nomenclature_id: item.nomenclature_id,
        quantity: item.quantity,
      }));

      const deliveryInfo = {
        address: `${address.index}, ${address.city}, ${address.street}, ${address.house}`,
        delivery_date: Math.floor(Date.now() / 1000) + 86400 * 2,
        delivery_price: 0,
        recipient: {
          name: firstName,
          surname: lastName,
          phone,
        },
        note: comment,
      };

      const orderData = {
        goods,
        delivery: deliveryInfo,
        contragent_phone: cartData.contragent_phone,
      };

      const orderResponse = (await createOrder.mutateAsync(orderData)) as {
        id?: number;
        message?: string;
      };
      console.log("Ответ от создания заказа:", orderResponse);

      
      
      

      toast.success("Заказ успешно оформлен");
      router.push("/order/success");
    } catch (err: unknown) {
      console.error("Ошибка создания заказа:", err);
      let errorMessage = "Произошла ошибка";
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(`Ошибка: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="py-8 md:py-12 bg-[#F8F9FB] min-h-screen font-manrope">
      <div className="container mx-auto max-w-[1440px]">
        <Breadcrumb
          paths={[
            { url: "/", name: "Главная" },
            { url: "/cart", name: "Корзина" },
            { url: "/order", name: "Оформление заказа" },
          ]}
        />

        <h1 className="mt-6 text-3xl md:text-4xl font-bold text-[#394426] mb-8 md:mb-12">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  onChange={(e) => setPhone(e.target.value)}
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
                <div className="bg-white w-full md:w-auto md:flex-1 rounded-sm p-4">
                  <label className="flex flex-col gap-1 cursor-pointer">
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
                    <p className="pl-2 text-sm text-gray-600 ml-7">
                      курьерская служба
                    </p>
                  </label>
                </div>
                <div className="bg-white w-full md:w-auto md:flex-1 rounded-sm p-4">
                  <label className="flex flex-col gap-1 cursor-pointer">
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
                    <p className="pl-2 text-sm text-gray-600 ml-7">
                      бесплатно, со склада
                    </p>
                  </label>
                </div>
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
                      {suggestions.map((s, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => handleSelectAddress(s)}
                        >
                          {s.value}
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
                    className="col-span-1 px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black"
                  />
                  <input
                    type="text"
                    placeholder="Населенный пункт"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    required
                    className="col-span-1 px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black"
                  />
                  <input
                    type="text"
                    placeholder="Улица"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    required
                    className="col-span-1 px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black"
                  />
                  <input
                    type="text"
                    placeholder="Дом"
                    value={address.house}
                    onChange={(e) =>
                      setAddress({ ...address, house: e.target.value })
                    }
                    required
                    className="col-span-1 px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#394426] placeholder-gray-400 text-black"
                  />
                </div>
              </div>
            )}

            
            <div className="bg-gray-200 p-6 rounded-xl">
              <h2 className="text-xl md:text-2xl font-bold text-[#394426] mb-4">
                Способ оплаты
              </h2>
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="bg-white w-full md:w-auto md:flex-1 rounded-sm p-4">
                  <label className="flex flex-col gap-1 cursor-pointer">
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
                    <p className="text-sm pl-2 text-gray-600 ml-7">
                      оплата при получении
                    </p>
                  </label>
                </div>
                <div className="bg-white w-full md:w-auto md:flex-1 rounded-sm p-4">
                  <label className="flex flex-col gap-1 cursor-pointer">
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
                    <p className="pl-2 text-sm text-gray-600 ml-7">
                      100% предоплата
                    </p>
                  </label>
                </div>
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
                disabled={isSubmitting}
                className="w-full bg-[#394426] text-white px-6 py-4 rounded-sm font-medium text-lg hover:bg-[#102902] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Оформление..." : "Оформить заказ"}
              </button>
              <p className="mt-3 text-sm text-gray-500 text-center">
                Нажимая на кнопку, вы даёте согласие на{" "}
                <span className="underline">обработку персональных данных</span>
              </p>
            </div>
          </div>

          
          <div className="w-full lg:w-2/5 bg-white rounded-xl p-8 shadow-lg lg:sticky lg:top-24 h-fit lg:order-none order-1">
            <h2 className="text-2xl font-bold text-[#394426] mb-6">Ваш заказ</h2>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {cartItems.map((item: CartItemWithProduct) => {
                const photo = item.product?.photos?.[0];
                let imageSrc = "/placeholder.jpg";
                if (
                  photo &&
                  typeof photo === "object" &&
                  "url" in photo &&
                  typeof photo.url === "string"
                ) {
                  imageSrc = photo.url.includes("pictures/")
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${photo.url}`
                    : `${process.env.NEXT_PUBLIC_API_URL}/photos/${photo.url}`;
                }

                return (
                  <div
                    key={item.nomenclature_id}
                    className="flex items-start gap-4"
                  >
                    <div className="relative w-15 h-15 sm:w-20 sm:h-20 rounded-sm overflow-hidden flex-shrink-0">
                      <Image
                        src={imageSrc}
                        alt={item.product?.name || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-md font-bold text-[#394426]">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.product?.prices?.[0]?.price || 0)} x{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm sm:text-md font-bold text-[#394426]">
                      {formatPrice(
                        (item.product?.prices?.[0]?.price || 0) * item.quantity,
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-300 flex justify-between items-center text-lg">
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