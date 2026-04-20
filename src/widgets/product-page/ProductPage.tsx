"use client";
import { motion } from "framer-motion";
import { MpProduct } from "@/entities/mp-product";
import { useMemo, useState } from "react";
import Image from "next/image";
import { AddToCartButton } from "@/features/add-to-cart/AddToCartButton";
import { Check } from "lucide-react";
import ProductsCatalog from "@/widgets/products-catalog/ProductsCatalog";
import ProductImgModal from "../product-card/ProductImgModal";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface ProductPageProps {
  enrichedProduct: MpProduct;
}

export default function ProductPage({ enrichedProduct }: ProductPageProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [cartClicked, setCartClicked] = useState(false);
  const [openImg, setOpenImg] = useState(false);

  const productPhotos = useMemo(() => {
    const p = enrichedProduct as
      | (MpProduct & {
          images?: string[];
          photos?: string[] | null;
        })
      | null;

    return p?.photos?.length ? p.photos : p?.images?.length ? p.images : [];
  }, [enrichedProduct]);

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Блок с изображениями */}
        <motion.div variants={itemVariants}>
          <div className="flex gap-4">
            {/* Основное изображение */}
            <div
              onClick={() => setOpenImg(true)}
              className="flex-1 relative aspect-square rounded-3xl overflow-hidden"
            >
              <Image
                src={productPhotos[activeImage] || productPhotos[0] || ""}
                alt={enrichedProduct.name}
                fill
                className="cursor-pointer object-cover"
                priority
              />
            </div>
            {/* Галерея миниатюр */}
            <div className="hidden md:flex flex-col gap-3">
              {productPhotos.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === index ? "border-black" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <Image
                    src={img}
                    alt={`Фото ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Блок с информацией */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center md:items-start pt-4"
        >
          <div>
            <h1 className="h text-4xl md:text-5xl font-medium">
              {enrichedProduct?.name}
            </h1>

            <div className="h !text-3xl !my-6">{enrichedProduct?.price} ₽</div>

            <div
              onClick={() => {
                // При клике сразу меняем состояние на нашей кнопке
                setCartClicked(true);

                // Напрямую вызываем логику добавления в корзину как это делает внутренняя кнопка
                const cart = JSON.parse(
                  localStorage.getItem("cart_local") || '{"items":{}}',
                );
                const key = String(enrichedProduct.id);

                if (!cart.items[key]) {
                  cart.items[key] = {
                    id: enrichedProduct?.id,
                    price: enrichedProduct?.price,
                    name: enrichedProduct?.name,
                    imageUrl: productPhotos?.[0],
                    quantity: 0,
                  };
                }

                cart.items[key].quantity += 1;
                localStorage.setItem("cart_local", JSON.stringify(cart));
                window.dispatchEvent(new Event("cart-local-updated"));
              }}
              className="cursor-pointer bg-black border-1 border-black text-white p-2 pl-6 h-12 rounded-lg w-fit flex items-center gap-3 group hover:bg-white hover:text-black transition-colors"
            >
              <p className="max-w-40">Добавить в корзину</p>
              <div className="bg-white rounded-lg group-hover:bg-black group-hover:text-white p-3 text-black flex items-center justify-center">
                {cartClicked ? (
                  <Check size={12} />
                ) : (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.8994 0.999965L0.999884 10.8995M10.8994 0.999965V9.48525M10.8994 0.999965H2.4141"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              {/*  Скрытая кнопка остается для синхронизации состояния */}
              <AddToCartButton
                productId={enrichedProduct?.id}
                productName={enrichedProduct?.name}
                imageUrl={productPhotos?.[0]}
                price={enrichedProduct?.price}
                hideControls
                className="absolute w-60 opacity-0 pointer-events-none"
              />
            </div>

            <div className="text-base leading-relaxed mb-8 pt-8 space-y-3">
              <p>{enrichedProduct?.description_short}</p>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div
        variants={itemVariants}
        className="hidden xl:flex items-end w-full gap-12 h-150 pt-30 justify-between pt-4"
      >
        <div className="flex flex-col h-full justify-between">
          <h2 className="h">
            Может <br /> заинтересовать
          </h2>
          <p className="hidden md:block p">
            Наши букеты собраны из свежих цветов, аккуратно <br /> оформлены с
            оттенками, которые формируют композицию.
          </p>
        </div>
        <div className="h-80 w-fit flex">
          <ProductsCatalog
            category={enrichedProduct.category}
            displayInfo={false}
            loadMore={false}
            query=""
            size={3}
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="xl:hidden w-full pt-8">
        <div className="mb-4">
          <h2 className="h">Может заинтересовать</h2>
        </div>
        <div className="w-full">
          <ProductsCatalog
            category={enrichedProduct.category}
            loadMore={false}
            query=""
            size={2}
          />
        </div>
      </motion.div>
      <ProductImgModal
        open={openImg}
        setOpen={setOpenImg}
        src={productPhotos[activeImage]}
      />
    </div>
  );
}
