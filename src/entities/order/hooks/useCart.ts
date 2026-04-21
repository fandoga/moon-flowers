"use client";

import { useState, useEffect } from "react";

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

export const readCart = (): LocalCart => {
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

export const writeCart = (next: LocalCart) => {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CART_LOCAL_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
  } catch {}
};

/**
 * Хук для работы с локальной корзиной
 * Вся логика корзины вынесена в отдельный модуль
 */
export const useCart = () => {
  // Инициализируем всегда пустой корзиной для корректной гидратации
  const [cart, setCart] = useState<LocalCart>({ items: {} });

  const cartItems = Object.values(cart.items);
  const total = cartItems.reduce(
    (sum, item) => sum + (item?.price || 0) * item.quantity,
    0,
  );

  const removeItemFromCart = (productId: number) => {
    const next = readCart();
    delete next.items[String(productId)];
    writeCart(next);
    setCart(next);
  };

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

  return {
    cart,
    cartItems,
    total,
    removeItemFromCart,
    writeCart,
    readCart,
  };
};