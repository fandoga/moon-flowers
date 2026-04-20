"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { CatalogItemType } from "@/app/catalog/page";
import ActionButton from "@/components/ui/action-button";
import { AddToCartButton } from "@/features/add-to-cart/AddToCartButton";
import Logo from "@/components/ui/logo";

interface CatalogReelsProps {
  items: CatalogItemType[];
  isCategories?: boolean;
  /** Вызывается, когда карточка категории попадает в зону видимости (ленивая подгрузка превью). */
  onCategoryVisible?: (categoryId: number) => void;
}

const CatalogReels: React.FC<CatalogReelsProps> = ({
  items,
  isCategories = false,
  onCategoryVisible,
}) => {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  useLayoutEffect(() => {
    if (!isCategories || !onCategoryVisible || items.length === 0) return;
    const root = scrollRootRef.current;
    if (!root) return;

    itemRefs.current = itemRefs.current.slice(0, items.length);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idAttr = entry.target.getAttribute("data-category-id");
          if (idAttr == null) continue;
          const id = Number(idAttr);
          if (Number.isFinite(id)) onCategoryVisible(id);
        }
      },
      {
        root,
        rootMargin: "0px 0px 40% 0px",
        threshold: 0.15,
      },
    );

    for (const node of itemRefs.current) {
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [isCategories, onCategoryVisible, items]);

  return (
    <div
      ref={scrollRootRef}
      className="fixed inset-0 -top-5 w-screen h-[100vh + 20px] bg-black/90 z-500 overflow-y-scroll snap-y snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item, index) => (
        <Link
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          data-category-id={isCategories ? String(item.id) : undefined}
          href={isCategories ? `/category/${item.id}` : `/catalog/${item.id}`}
          key={String(item.id)}
          className="relative w-screen h-full max-h-200 snap-start block overflow-hidden"
        >
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="absolute inset-0 py-2 w-full h-full"
          >
            <div
              className="w-full h-full rounded-2xl object-cover bg-center bg-cover bg-neutral-800"
              style={
                item.image !== "/placeholder.jpg"
                  ? { backgroundImage: `url(${item.image})` }
                  : { backgroundColor: "var(--background)" }
              }
            />
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            className={`absolute top-30 w-full flex justify-around z-10`}
          >
            <div className="bg-gray/80 backdrop-blur-xs p-2 max-w-[90%] !px-4 rounded-xl">
              <h2 className="p !text-2xl mb-2">{item.name}</h2>
              <p className="h !mb-0 !text-lg">
                {isCategories && <span>от</span>}{" "}
                <span className="p">{item.price}</span> ₽
              </p>
            </div>
            {isCategories && (
              <div className="bg-gray/80 backdrop-blur-xs p-1 !px-4 rounded-xl flex items-center">
                <p className="p !mb-0 !text-xl">
                  {item.count} {item.count === 1 ? "Вид" : "Видов"}
                </p>
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
                  href={`/category/${item.id}`}
                />
              ) : (
                <AddToCartButton
                  productId={Number(item.id)}
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
