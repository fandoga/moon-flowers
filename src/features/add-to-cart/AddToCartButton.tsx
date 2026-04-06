"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { Plus, Minus, LoaderCircle } from "lucide-react";
import { useAddToCart, useRemoveFromCart } from "@/entities/cart/hooks/hooks";
import { useCartStore } from "@/entities/cart/store/cartStore";
import toast from "react-hot-toast";

const MAX_QUANTITY = 50;

interface AddToCartButtonProps {
  productId: number;
  currentQuantity?: number;
  className?: string;
  hideControls?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  currentQuantity,
  className = "",
  hideControls = false,
}) => {
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const deltaRef = useRef(0);
  const loadingStartTimeRef = useRef<number | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const [optimisticQuantity, setOptimisticQuantity] = useState(
    currentQuantity ?? 0
  );
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const newValue = currentQuantity ?? 0;
    if (optimisticQuantity !== newValue) {
      setOptimisticQuantity(newValue);
    }
  }, [currentQuantity]);

  useEffect(() => {
    const isLoading = addToCart.isPending || removeFromCart.isPending;

    if (isLoading) {
      if (!loadingStartTimeRef.current) {
        loadingStartTimeRef.current = Date.now();
        setShowLoader(true);
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = undefined;
      }
    } else {
      if (loadingStartTimeRef.current) {
        const elapsed = Date.now() - loadingStartTimeRef.current;
        const remaining = Math.max(0, 500 - elapsed);
        if (remaining > 0) {
          hideTimerRef.current = setTimeout(() => {
            setShowLoader(false);
            loadingStartTimeRef.current = null;
            hideTimerRef.current = undefined;
          }, remaining);
        } else {
          setShowLoader(false);
          loadingStartTimeRef.current = null;
        }
      }
    }
  }, [addToCart.isPending, removeFromCart.isPending]);

  const handleImmediateAdd = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if ((currentQuantity ?? 0) >= MAX_QUANTITY) {
        toast.error(`Максимальное количество: ${MAX_QUANTITY} шт.`);
        return;
      }
      addToCart.mutate(
        { nomenclature_id: productId, quantity: 1 },
        {
          onSuccess: () => {
            useCartStore.getState().openCart();
          },
        }
      );
    },
    [addToCart, productId, currentQuantity]
  );

  const scheduleUpdate = useCallback(
    (delta: number) => {
      const newQty = optimisticQuantity + delta;

      // ✅ Enforce max 50 limit
      if (newQty > MAX_QUANTITY) {
        toast.error(`Максимальное количество товара: ${MAX_QUANTITY} шт.`);
        return;
      }

      setOptimisticQuantity(Math.max(0, newQty));
      deltaRef.current += delta;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        if (deltaRef.current !== 0) {
          const finalQuantity = (currentQuantity ?? 0) + deltaRef.current;
          if (finalQuantity <= 0) {
            removeFromCart.mutate({ nomenclature_id: productId });
          } else {
            addToCart.mutate(
              { nomenclature_id: productId, quantity: deltaRef.current },
              {
                onSettled: () => {
                  deltaRef.current = 0;
                },
              }
            );
          }
        }
        timeoutRef.current = undefined;
      }, 300);
    },
    [addToCart, removeFromCart, productId, currentQuantity, optimisticQuantity]
  );

  const handleIncrement = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      scheduleUpdate(1);
    },
    [scheduleUpdate]
  );

  const handleDecrement = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (optimisticQuantity > 0) scheduleUpdate(-1);
    },
    [optimisticQuantity, scheduleUpdate]
  );

  if (hideControls) {
    return (
      <button
        onClick={handleImmediateAdd}
        disabled={showLoader}
        className={`
          bg-[#394426] h-full cursor-pointer flex gap-2 items-center justify-center 
          text-white px-2 py-2 sm:px-4 sm:py-3 rounded-md text-sm font-manrope font-medium 
          hover:bg-[#102902] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-[140px] 
          ${className}
        `}
      >
        {showLoader ? (
          <LoaderCircle className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <svg
              viewBox="0 0 16 14"
              fill="none"
              className="w-6 h-4 sm:w-5 sm:h-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0.65625C0 0.292578 0.299764 0 0.672368 0H1.94707C2.5634 0 3.1097 0.35 3.36464 0.875H14.879C15.6158 0.875 16.1537 1.55859 15.9603 2.25312L14.8117 6.41758C14.5736 7.27617 13.7751 7.875 12.8646 7.875H4.78222L4.9335 8.6543C4.99514 8.96328 5.27249 9.1875 5.59467 9.1875H13.6715C14.0441 9.1875 14.3439 9.48008 14.3439 9.84375C14.3439 10.2074 14.0441 10.5 13.6715 10.5H5.59467C4.62533 10.5 3.79328 9.82734 3.61398 8.90039L2.16839 1.49023C2.14878 1.38633 2.05633 1.3125 1.94707 1.3125H0.672368C0.299764 1.3125 0 1.01992 0 0.65625ZM3.58596 12.6875C3.58596 12.5151 3.62075 12.3445 3.68833 12.1852C3.75591 12.026 3.85496 11.8813 3.97983 11.7594C4.1047 11.6375 4.25294 11.5409 4.41609 11.4749C4.57924 11.4089 4.75411 11.375 4.9307 11.375C5.10729 11.375 5.28216 11.4089 5.44531 11.4749C5.60846 11.5409 5.7567 11.6375 5.88157 11.7594C6.00644 11.8813 6.1055 12.026 6.17308 12.1852C6.24066 12.3445 6.27544 12.5151 6.27544 12.6875C6.27544 12.8599 6.24066 13.0305 6.17308 13.1898C6.1055 13.349 6.00644 13.4937 5.88157 13.6156C5.7567 13.7375 5.60846 13.8341 5.44531 13.9001C5.28216 13.9661 5.10729 14 4.9307 14C4.75411 14 4.57924 13.9661 4.41609 13.9001C4.25294 13.8341 4.1047 13.7375 3.97983 13.6156C3.85496 13.4937 3.75591 13.349 3.68833 13.1898C3.62075 13.0305 3.58596 12.8599 3.58596 12.6875ZM12.9991 11.375C13.3558 11.375 13.6978 11.5133 13.95 11.7594C14.2022 12.0056 14.3439 12.3394 14.3439 12.6875C14.3439 13.0356 14.2022 13.3694 13.95 13.6156C13.6978 13.8617 13.3558 14 12.9991 14C12.6425 14 12.3004 13.8617 12.0482 13.6156C11.7961 13.3694 11.6544 13.0356 11.6544 12.6875C11.6544 12.3394 11.7961 12.0056 12.0482 11.7594C12.3004 11.5133 12.6425 11.375 12.9991 11.375Z"
                fill="white"
              />
            </svg>
            <span className="hidden sm:block sm:text-[16px]">В корзину</span>
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
          onClick={handleDecrement}
          disabled={optimisticQuantity <= 0 || showLoader}
          className="p-2 sm:p-4 text-xl font-bold text-[#394426] hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
        >
          <Minus className="size-[12px] sm:size-[16px]" />
        </button>
        <span className="sm:px-3 py-2 text-sm sm:text-lg text-base font-medium w-10 text-center flex items-center justify-center">
          {showLoader ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            optimisticQuantity
          )}
        </span>
        <button
          onClick={handleIncrement}
          disabled={showLoader || optimisticQuantity >= MAX_QUANTITY}
          className="px-2 sm:px-4 py-2 text-xl text-[#394426] hover:bg-gray-100 cursor-pointer disabled:opacity-40"
          title={optimisticQuantity >= MAX_QUANTITY ? `Максимум ${MAX_QUANTITY} шт.` : undefined}
        >
          +
        </button>
      </div>
    </div>
  );
};