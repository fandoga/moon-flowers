"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Check, LoaderCircle, Minus } from "lucide-react";

const MAX_QUANTITY = 50;
const LOCAL_CART_KEY = "cart_local";
const CART_EVENT_NAME = "cart-local-updated";

interface AddToCartButtonProps {
  productId: number;
  productName?: string;
  price: number;
  imageUrl?: string;
  className?: string;
  hideControls?: boolean;
}

type LocalCartItem = {
  id: number;
  name?: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

type LocalCartState = {
  items: Record<string, LocalCartItem>;
};

const readCart = (): LocalCartState => {
  try {
    if (typeof window === "undefined") return { items: {} };
    const raw = window.localStorage.getItem(LOCAL_CART_KEY);
    if (!raw) return { items: {} };
    const parsed = JSON.parse(raw) as LocalCartState;
    if (!parsed?.items || typeof parsed.items !== "object")
      return { items: {} };
    return parsed;
  } catch {
    return { items: {} };
  }
};

const writeCart = (next: LocalCartState) => {
  try {
    window.localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
  } catch {
    // ignore write errors
  }
};

const getQuantity = (productId: number) => {
  const cart = readCart();
  return cart.items[String(productId)]?.quantity ?? 0;
};

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName,
  imageUrl,
  className = "",
  price,
  hideControls = false,
}) => {
  const [quantity, setQuantity] = useState(() => getQuantity(productId));
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasClicked, setClicked] = useState(false);

  const syncFromStorage = useCallback(() => {
    setQuantity(getQuantity(productId));
  }, [productId]);

  useEffect(() => {
    setTimeout(() => {
      syncFromStorage();
    });
  }, [syncFromStorage]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onCustom = () => syncFromStorage();
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_CART_KEY) syncFromStorage();
    };

    window.addEventListener(CART_EVENT_NAME, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CART_EVENT_NAME, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [syncFromStorage]);

  const updateQuantity = useCallback(
    (nextQty: number) => {
      const clamped = Math.max(0, Math.min(MAX_QUANTITY, nextQty));
      setIsUpdating(true);
      setQuantity(clamped);

      const cart = readCart();
      const key = String(productId);

      if (clamped <= 0) {
        delete cart.items[key];
      } else {
        cart.items[key] = {
          id: productId,
          price: price,
          name: productName,
          imageUrl,
          quantity: clamped,
        };
      }

      writeCart(cart);
      setIsUpdating(false);
    },
    [productId, productName, imageUrl, price],
  );

  const handleImmediateAdd = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setClicked(true);
      updateQuantity(quantity + 1);
    },
    [quantity, updateQuantity],
  );

  const handleIncrement = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateQuantity(quantity + 1);
    },
    [quantity, updateQuantity],
  );

  const handleDecrement = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateQuantity(quantity - 1);
    },
    [quantity, updateQuantity],
  );

  if (hideControls) {
    return (
      <button
        type="button"
        onClick={handleImmediateAdd}
        disabled={isUpdating || hasClicked || quantity >= MAX_QUANTITY}
        className="cursor-pointer bg-gray rounded-lg p-2 w-12 h-12 flex items-center justify-center"
      >
        {hasClicked ? (
          <Check />
        ) : (
          <>
            <svg
              width="14"
              height="15"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.22102 0.8C4.43825 0.328 4.90684 0 5.44836 0H8.55164C9.09316 0 9.56097 0.328 9.77898 0.8C10.3089 0.8048 10.7224 0.8296 11.0917 0.9784C11.5325 1.15622 11.9159 1.45841 12.198 1.8504C12.4827 2.2456 12.6169 2.752 12.8 3.4488L13.3757 5.6264L13.5929 6.2992L13.6115 6.3232C14.3105 7.2464 13.9777 8.6192 13.3121 11.364C12.8885 13.1104 12.6774 13.9832 12.0459 14.492C11.4144 15 10.5416 15 8.79602 15H5.20398C3.45839 15 2.5856 15 1.95408 14.492C1.32257 13.9832 1.11077 13.1104 0.687947 11.364C0.0222953 8.6192 -0.310531 7.2464 0.388481 6.3232L0.407101 6.2992L0.62433 5.6264L1.19999 3.4488C1.38386 2.752 1.51807 2.2448 1.80202 1.8496C2.08421 1.4579 2.46759 1.156 2.90834 0.9784C3.27763 0.8296 3.69036 0.804 4.22102 0.8ZM4.22257 2.0024C3.70898 2.008 3.50261 2.028 3.33193 2.0968C3.09451 2.19254 2.88802 2.35529 2.73611 2.5664C2.59956 2.756 2.51888 3.0208 2.29389 3.8744L1.85167 5.5456C2.64301 5.4 3.7245 5.4 5.20321 5.4H8.79602C10.2755 5.4 11.3562 5.4 12.1476 5.544L11.7061 3.8728C11.4811 3.0192 11.4004 2.7544 11.2639 2.5648C11.112 2.35369 10.9055 2.19094 10.6681 2.0952C10.4974 2.0264 10.291 2.0064 9.77743 2.0008C9.66727 2.23988 9.49364 2.44186 9.27669 2.58331C9.05973 2.72477 8.80832 2.7999 8.55164 2.8H5.44836C5.19176 2.79997 4.94041 2.72496 4.72346 2.58365C4.50651 2.44234 4.33284 2.24133 4.22257 2.0024Z"
                fill="black"
              />
            </svg>
          </>
        )}
      </button>
    );
  }

  return (
    <div
      className={`flex items-center h-[40px] sm:h-[48px] w-[100px] sm:w-[140px] ${className}`}
    >
      <div className="flex w-full h-full items-center justify-between border-2 border-gray rounded-sm overflow-hidden">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= 0 || isUpdating}
          className="p-2 sm:p-4 text-xl font-bold text-[#394426] hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
        >
          <Minus className="size-[12px] sm:size-[16px]" />
        </button>
        <span className="sm:px-3 py-2 text-sm sm:text-lg text-base font-medium w-10 text-center flex items-center justify-center">
          {isUpdating ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            quantity
          )}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={isUpdating || quantity >= MAX_QUANTITY}
          className="px-2 sm:px-4 py-2 text-xl text-[#394426] hover:bg-gray-100 cursor-pointer disabled:opacity-40"
          title={
            quantity >= MAX_QUANTITY
              ? `Максимум ${MAX_QUANTITY} шт.`
              : undefined
          }
        >
          +
        </button>
      </div>
    </div>
  );
};
