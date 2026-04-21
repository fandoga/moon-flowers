"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils/formatPrice";
import { AddToCartButton } from "@/features/add-to-cart/AddToCartButton";
import type { LocalCartItem } from "../../entities/order/hooks/useCart";

interface CartItemsListProps {
  cartItems: LocalCartItem[];
  removeItemFromCart: (productId: number) => void;
}

/**
 * Компонент списка товаров в корзине
 */
const CartItemsList: React.FC<CartItemsListProps> = ({
  cartItems,
  removeItemFromCart,
}) => {
  if (cartItems.length === 0) {
    return (
      <section>
        <div className="hidden md:grid grid-cols-[1fr_210px_210px] px-4 py-3 text-sm border-b border-[#E7E7E7]">
          <span>Продукт</span>
          <span>Количество</span>
          <span>Стоимость</span>
        </div>
        <p className="text-gray-500 px-4 py-6">Корзина пуста</p>
      </section>
    );
  }

  return (
    <section>
      <div className="hidden md:grid grid-cols-[1fr_210px_210px] px-4 py-3 text-sm border-b border-[#E7E7E7]">
        <span>Продукт</span>
        <span>Количество</span>
        <span>Стоимость</span>
      </div>

      {cartItems.map((item) => {
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
                  alt={item.name || `Товар #${item.id}`}
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
      })}
    </section>
  );
};

export default CartItemsList;
