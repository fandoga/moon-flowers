"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { NomenclatureItem } from "@/entities/product/types/types";
import { formatPrice } from "@/lib/utils/formatPrice";
import { normalizeProductName } from "@/lib/utils/normalizeName";
import { FavoriteButton } from "@/features/favorites/FavoriteButton";
import { AddToCartButton } from "@/features/add-to-cart/AddToCartButton";
import { useCartItemQuantity } from "@/entities/cart/hooks/hooks";

interface ProductCardProps {
  product: NomenclatureItem;
  onClick?: () => void;
  isLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  isLoading: externalLoading,
}) => {
  const router = useRouter();
  const [internalNavigating, setInternalNavigating] = useState(false);
  const quantityInCart = useCartItemQuantity(product.id);

  const imageUrl =
    product.photos?.length && "url" in product.photos[0]
      ? product.photos[0].url.includes("pictures/")
        ? `${process.env.NEXT_PUBLIC_API_URL}/${product.photos[0].url}`
        : `${process.env.NEXT_PUBLIC_API_URL}/photos/${product.photos[0].url}`
      : "/placeholder.jpg";

  const price = product.prices?.[0]?.price || 0;
  const normalizedName = normalizeProductName(product.name);

  const handleCardClick = () => {
    if (onClick) {
      setInternalNavigating(true);
      onClick();
    } else {
      setInternalNavigating(true);
      const params = new URLSearchParams({
        category: product.category != null ? product.category.toString() : "0",
        name: normalizedName,
        variantId: product.id.toString(),
      });
      router.push(`/product?${params.toString()}`);
    }
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      setInternalNavigating(true);
      onClick();
    } else {
      setInternalNavigating(true);
      const params = new URLSearchParams({
        category: product.category != null ? product.category.toString() : "0",
        name: normalizedName,
        variantId: product.id.toString(),
      });
      router.push(`/product?${params.toString()}`);
    }
  };

  const showLoader = externalLoading || internalNavigating;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl overflow-hidden relative flex flex-col h-full cursor-pointer hover:scale-[1.02] transition-transform duration-200"
    >
      {showLoader && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <Loader2 className="animate-spin h-10 w-10 text-[#394426]" />
        </div>
      )}

      <div className="relative aspect-[5/6]">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
        />
        <div className="absolute top-3 right-3">
          <FavoriteButton productId={product.id} />
        </div>
      </div>

      <div className="p-3 sm:p-3 flex flex-col flex-1">
        <h3 className="text-lg md:text-xl font-manrope font-bold text-[#394426] mb-3">
          {product.name}
        </h3>

        <div className="mt-auto">
          {/* <p className="text-xl md:text-2xl font-bold text-[#394426] mb-3">
            от {formatPrice(price)}
          </p> */}

          <div className="flex w-full gap-2 sm:gap-4">
            <div className="block sm:hidden">
              <AddToCartButton productId={product.id} hideControls />
            </div>
            <div className="hidden sm:block">
              {quantityInCart > 0 ? (
                <AddToCartButton
                  productId={product.id}
                  currentQuantity={quantityInCart}
                />
              ) : (
                <AddToCartButton productId={product.id} hideControls />
              )}
            </div>
            <button
              onClick={handleDetailsClick}
              disabled={showLoader}
              className="flex-1 border-2 w-[125px] w-full text-xs border-[#394426] text-[#394426] px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-[15px] sm:text-[17px] hover:bg-[#102902] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            >
              {showLoader ? (
                <Loader2 className="animate-spin mr-2 " size={18} />
              ) : <span className="text-sm sm:text-[17px]">Подробнее</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;