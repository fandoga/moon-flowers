import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";
import { CatalogItemType } from "@/app/catalog/page";
import ActionButton from "@/components/ui/action-button";
import { AddToCartButton } from "@/features/add-to-cart/AddToCartButton";

interface CatalogReelsProps {
  items: CatalogItemType[];
  isCategories?: boolean;
}

const CatalogReels: React.FC<CatalogReelsProps> = ({
  items,
  isCategories = false,
}) => {
  return (
    <div className="fixed inset-0 -top-5 w-screen h-[100vh + 20px] bg-black/90 z-500 overflow-y-scroll snap-y snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item, index) => (
        <Link
          href={`${isCategories ? `/category/${item.name}` : `/catalog/${item.id}`}`}
          key={item.id}
          className="relative w-screen h-full max-h-200 snap-start block overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="absolute inset-0 py-2 w-full h-full"
          >
            <div
              className="w-full h-full rounded-2xl object-cover bg-center bg-cover"
              style={{
                backgroundImage: `url(${item.image})`,
              }}
            />
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            className={`absolute top-30 w-full flex justify-around z-10`}
          >
            <div className="bg-gray/90 p-2 max-w-[90%] !px-4 rounded-xl">
              <h2 className="p !text-2xl mb-2">{item.name}</h2>
              <p className="h !mb-0 !text-lg">
                {isCategories && <span>от</span>}{" "}
                <span className="p">{item.price}</span> ₽
              </p>
            </div>
            {isCategories && (
              <div className="bg-gray/90 p-1 !px-4 rounded-xl flex items-center">
                <p className="p !mb-0 !text-xl">{item.count} Видов</p>
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="absolute bottom-6 right-6">
              {isCategories ? (
                <ActionButton
                  text="Показать еще"
                  href={`/category/${item.name}`}
                />
              ) : (
                <AddToCartButton
                  productId={parseInt(item.id)}
                  productName={item.name}
                  price={item.price ?? 0}
                  imageUrl={item.image}
                  hideControls
                />
              )}
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default CatalogReels;
