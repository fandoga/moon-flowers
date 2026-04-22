"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { MpProduct } from "@/entities/mp-product";
import { AddToCartButton } from "@/features/add-to-cart/AddToCartButton";
import { formatPrice } from "@/lib/utils/formatPrice";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductCard: React.FC<{
  product: MpProduct;
  displayOnHover?: boolean;
}> = ({ product, displayOnHover = false }) => {
  const router = useRouter();
  const productId = Number(product.id);

  const imageUrl = product.images?.[0] || product.photos?.find(Boolean);
  const price = Number(product.prices?.[0]?.price) || product.price || 0;

  if (!imageUrl || imageUrl === "/placeholder.jpg") {
    return (
      <div
        role="button"
        tabIndex={0}
        className="relative rounded-xl overflow-hidden flex flex-col w-full md:h-full"
      >
        <div className="relative w-full aspect-[5/6] md:h-full">
          <Skeleton className="absolute inset-0 w-full h-full bg-skeleton animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-xl overflow-hidden flex flex-col w-full md:h-full cursor-pointer hover:scale-[1.02] transition-transform duration-200 group"
      role="button"
      tabIndex={0}
      onClick={() => {
        if (!Number.isFinite(productId)) return;
        router.push(`/catalog/${productId}`);
      }}
    >
      <div className="relative w-full aspect-[5/6] md:h-full bg-skeleton">
        <Image
          fill
          loading="lazy"
          src={imageUrl}
          alt={product.name ? String(product.name) : "Товар"}
          className="absolute inset-0 w-full h-full object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div
        className={`absolute z-20 p-3 flex flex-col flex-1 transition-all duration-300 ${displayOnHover ? "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0" : ""}`}
      >
        <h3 className="bg-gray p-2 rounded-lg mb-3">
          {product.name ? String(product.name) : "Товар"}
        </h3>
      </div>

      <div
        className={`absolute flex items-center z-20 bottom-5 right-5 transition-all duration-300 ${displayOnHover ? "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0" : ""}`}
      >
        <div className="bg-gray rounded-lg p-3 whitespace-nowrap">
          {formatPrice(price)}
        </div>
        <AddToCartButton
          price={product.price}
          productId={productId}
          productName={product.name ? String(product.name) : undefined}
          imageUrl={imageUrl}
          hideControls
        />
      </div>
    </div>
  );
};

export default ProductCard;
