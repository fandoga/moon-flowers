// components/cart/CartItemsList.tsx
import React, { useState } from "react";
import Image from "next/image";
import { useCartProducts, useRemoveFromCart } from "@/entities/cart/hooks/hooks";
import { formatPrice } from "@/lib/utils/formatPrice";
import { AddToCartButton } from "@/features/add-to-cart/AddToCartButton";

interface CartItemsListProps {
  showTotal?: boolean;          // показывать ли итоговую сумму
  className?: string;
}

export const CartItemsList: React.FC<CartItemsListProps> = ({
  showTotal = true,
  className = "",
}) => {
  const { data: items, isLoading, error } = useCartProducts();
  const removeFromCart = useRemoveFromCart();
  const [updatingItems, setUpdatingItems] = useState<Record<number, boolean>>({});

  if (error) console.error("Cart error:", error);

  const handleRemove = (item: any) => {
    setUpdatingItems((prev) => ({ ...prev, [item.nomenclature_id]: true }));
    removeFromCart.mutate(
      { nomenclature_id: item.nomenclature_id },
      {
        onSettled: () => {
          setUpdatingItems((prev) => ({ ...prev, [item.nomenclature_id]: false }));
        },
      }
    );
  };

  const total = items.reduce(
    (sum: number, item: any) =>
      sum + (item.product?.prices?.[0]?.price || 0) * item.quantity,
    0
  );

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Загрузка...</div>;
  }

  if (items.length === 0) {
    return <div className="text-center py-12 text-gray-500">Ваша корзина пуста</div>;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {items.map((item: any) => {
        const product = item.product!;
        const imageUrl =
          product.photos?.length && "url" in product.photos[0]
            ? `${process.env.NEXT_PUBLIC_API_URL}/${product.photos[0].url}`
            : "/placeholder.jpg";
        const price = product.prices?.[0]?.price || 0;
        const isUpdating = updatingItems[item.nomenclature_id];

        return (
          <div
            key={`${item.nomenclature_id}-${item.warehouse_id}`}
            className="flex gap-4 border-b pb-5 w-full"
          >
            <div className="relative w-15 h-16 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-[#394426] mb-1">{product.name}</h3>
              <div className="mt-7 items-center justify-start gap-4">
                <div className="flex items-center justify-start gap-4">
                  <AddToCartButton
                    productId={item.nomenclature_id}
                    currentQuantity={item.quantity}
                  />
                  <div className="text-right">
                    <p className="font-bold text-[#394426]">
                      {formatPrice(price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRemove(item)}
              disabled={isUpdating}
              className="bg-[#F8F8F8] hover:bg-[#394426] group hover:text-white p-3 mr-[3px] rounded-sm w-10 self-start mt-1 disabled:opacity-50 cursor-pointer"
            >
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                <path
                  d="M4.82857 0.622266C5.02143 0.239063 5.41786 0 5.85 0H10.15C10.5821 0 10.9786 0.239063 11.1714 0.622266L11.4286 1.125H14.8571C15.4893 1.125 16 1.62773 16 2.25C16 2.87227 15.4893 3.375 14.8571 3.375H1.14286C0.510714 3.375 0 2.87227 0 2.25C0 1.62773 0.510714 1.125 1.14286 1.125H4.57143L4.82857 0.622266ZM1.14286 4.5H14.8571V15.75C14.8571 16.991 13.8321 18 12.5714 18H3.42857C2.16786 18 1.14286 16.991 1.14286 15.75V4.5ZM4.57143 6.75C4.25714 6.75 4 7.00313 4 7.3125V15.1875C4 15.4969 4.25714 15.75 4.57143 15.75C4.88571 15.75 5.14286 15.4969 5.14286 15.1875V7.3125C5.14286 7.00313 4.88571 6.75 4.57143 6.75ZM8 6.75C7.68571 6.75 7.42857 7.00313 7.42857 7.3125V15.1875C7.42857 15.4969 7.68571 15.75 8 15.75C8.31429 15.75 8.57143 15.4969 8.57143 15.1875V7.3125C8.57143 7.00313 8.31429 6.75 8 6.75ZM11.4286 6.75C11.1143 6.75 10.8571 7.00313 10.8571 7.3125V15.1875C10.8571 15.4969 11.1143 15.75 11.4286 15.75C11.7429 15.75 12 15.4969 12 15.1875V7.3125C12 7.00313 11.7429 6.75 11.4286 6.75Z"
                  fill="#394426"
                  className="group-hover:fill-white"
                />
              </svg>
            </button>
          </div>
        );
      })}
      {showTotal && (
        <div className="flex justify-end gap-3 items-center mb-5">
          <span className="text-2xl font-medium">Итого:</span>
          <span className="text-2xl font-bold text-[#394426]">{formatPrice(total)}</span>
        </div>
      )}
    </div>
  );
};