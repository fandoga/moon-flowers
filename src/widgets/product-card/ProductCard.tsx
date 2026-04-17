"use client";

import { MpProduct } from "@/entities/mp-product";
import { AddToCartButton } from "@/features/add-to-cart/AddToCartButton";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useRouter } from "next/navigation";

const ProductCard: React.FC<{ product: MpProduct }> = ({ product }) => {
  const router = useRouter();
  const productId = Number(product.id);

  const imageUrl = [3, 2, 1, 0]
    .map((index) => product.images?.[index])
    .find((url) => Boolean(url));
  const price = Number(product.price) || 0;

  return (
    <div
      className="relative rounded-xl overflow-hidden relative flex flex-col h-full cursor-pointer hover:scale-[1.02] transition-transform duration-200"
      role="button"
      tabIndex={0}
      onClick={() => {
        const params = new URLSearchParams({
          category: "0",
          name: product.name ? String(product.name) : "",
          variantId: String(productId),
        });
        router.push(`/catalog?${params.toString()}`);
      }}
    >
      <div className="w-full h-full aspect-[5/6]">
        {/* Next Image не настроен на домен tablecrm, поэтому fallback через <img> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl || "/placeholder.jpg"}
          alt={product.name ? String(product.name) : "Товар"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="absolute z-20 p-3 flex flex-col flex-1">
        <h3 className="bg-gray p-2 rounded-lg mb-3 ">
          {product.name ? String(product.name) : "Товар"}
        </h3>
      </div>

      <div className="absolute flex items-center z-20 bottom-5 right-5">
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
