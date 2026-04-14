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

interface ProductCardGroupProps {
  products: NomenclatureItem[];
  onClick?: () => void;
  isLoading?: boolean;
}

const ProductCardGroup: React.FC<ProductCardGroupProps> = ({
  products,
  onClick,
  isLoading: externalLoading,
}) => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [internalNavigating, setInternalNavigating] = useState(false);
  const selectedProduct = products[selectedIndex];
  const displayName = normalizeProductName(selectedProduct.name);
  const quantityInCart = useCartItemQuantity(selectedProduct.id);

  const getVariantLabel = (product: NomenclatureItem) => {
    const lengthAttr = product.attributes?.find(
      (attr) => attr.attribute_id === 1,
    );
    if (lengthAttr?.value) return lengthAttr.value;
    const match = product.name.match(/\((.*?)\)/);
    if (match) return match[1];
    return `${formatPrice(product.prices?.[0]?.price || 0)}`;
  };

  const imageUrl =
    selectedProduct.photos?.length && "url" in selectedProduct.photos[0]
      ? `${process.env.NEXT_PUBLIC_API_URL}/photos/${selectedProduct.photos[0].url}`
      : "/placeholder.jpg";

  const selectedPrice = selectedProduct.prices?.[0]?.price || 0;

  // ✅ Find the minimum price among all variants for "от" display
  const minPrice = products.reduce((min, p) => {
    const p_price = p.prices?.[0]?.price || 0;
    return p_price > 0 && p_price < min ? p_price : min;
  }, selectedPrice || Infinity);

  const hasMultipleVariants = products.length > 1;
  const visibleProducts = products.slice(0, 3);

  const handleCardClick = () => {
    if (onClick) {
      setInternalNavigating(true);
      onClick();
    } else {
      setInternalNavigating(true);
      const params = new URLSearchParams({
        category: selectedProduct.category.toString(),
        name: displayName,
        variantId: selectedProduct.id.toString(),
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
        category: selectedProduct.category.toString(),
        name: displayName,
        variantId: selectedProduct.id.toString(),
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
          alt={displayName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
        />
        <div className="absolute top-3 right-3">
          <FavoriteButton productId={selectedProduct.id} />
        </div>
      </div>

      <div className="p-2 sm:p-4 flex flex-col flex-1">
        <h3 className="text-lg md:text-xl font-manrope font-bold text-[#394426] mb-1">
          {displayName}
        </h3>

        {visibleProducts.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4 pt-5">
            <p className="w-full text-sm sm:text-lg">Рост растения, м.</p>
            {visibleProducts.map((product, idx) => (
              <button
                key={product.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(idx);
                }}
                className={`sm:px-3 sm:py-1.5 px-1.5 py-1 text-xs sm:text-[14px] sm:w-auto w-[69px] rounded-xs border transition-colors cursor-pointer ${
                  idx === selectedIndex
                    ? "bg-[#E3E4E7] text-black border-[#E3E4E7] hover:bg-[#E3E4E7]"
                    : "bg-white text-[#394426] border-[#394426]/40 hover:bg-[#E3E4E7] hover:border-[#E3E4E7]"
                }`}
              >
                {getVariantLabel(product)}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto">
          {/* ✅ Show "от X ₽" when multiple variants, else just the price */}
          {/* <p className="text-xl md:text-2xl font-bold text-[#394426] mb-3">
            {hasMultipleVariants
              ? `от ${formatPrice(minPrice === Infinity ? selectedPrice : minPrice)}`
              : `от ${formatPrice(selectedPrice)}`}
          </p> */}

          <div className="flex w-full gap-2 sm:gap-4">
            <div className="block sm:hidden">
              <AddToCartButton productId={selectedProduct.id} hideControls />
            </div>
            <div className="hidden sm:block">
              {quantityInCart > 0 ? (
                <AddToCartButton
                  productId={selectedProduct.id}
                  currentQuantity={quantityInCart}
                />
              ) : (
                <AddToCartButton productId={selectedProduct.id} hideControls />
              )}
            </div>
            <button
              onClick={handleDetailsClick}
              disabled={showLoader}
              className="flex-1 border-2 w-[125px] w-full text-xs border-[#394426] text-[#394426] px-3 py-2 sm:px-4 sm:py-2.5 rounded-md text-[15px] sm:text-[17px] hover:bg-[#102902] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            >
              {showLoader ? (
                <Loader2 className="animate-spin mr-2 " size={18} />
              ) : (
                <span className="text-sm sm:text-[17px]">Подробнее</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardGroup;
