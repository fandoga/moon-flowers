"use client";

import React from "react";
import { formatPrice } from "@/lib/utils/formatPrice";
import ActionButton from "@/components/ui/action-button";

interface OrderSummaryProps {
  cartItemsCount: number;
  total: number;
  deliveryPrice: number;
  grandTotal: number;
  points: number | undefined;
  escrow: number | undefined | null;
  hasEscrow: boolean;
  isSubmitting: boolean;
  handleEscrow: () => void;
}

/**
 * Сайдбар с итогами заказа
 */
const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItemsCount,
  total,
  deliveryPrice,
  grandTotal,
  points,
  escrow,
  hasEscrow,
  isSubmitting,
  handleEscrow,
}) => {
  return (
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
                ? "Баллов нет"
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
              {cartItemsCount > 0 && cartItemsCount}
              {cartItemsCount === 0
                ? "Товаров нет"
                : cartItemsCount === 1
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
          disabled={cartItemsCount === 0}
          className="px-4 py-2 cursor-pointer"
        />
      </div>
    </aside>
  );
};

export default OrderSummary;
