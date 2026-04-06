"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Maximize2,
  ChevronUp,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { NomenclatureItem } from "@/entities/product/types/types";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useAddToCart } from "@/entities/cart";
import { FavoriteButton } from "@/features/favorites/FavoriteButton";
import { useCartStore } from "@/entities/cart/store/cartStore";

interface Props {
  initialProduct: NomenclatureItem;
  allProducts: NomenclatureItem[];
}

const ProductPageContent: React.FC<Props> = ({
  initialProduct,
  allProducts,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const idx = allProducts.findIndex((p) => p.id === initialProduct.id);
    return idx >= 0 ? idx : 0;
  });
  const selectedProduct = allProducts[selectedIndex];
  const hasVariants = allProducts.length > 1;
  const [activeTab, setActiveTab] = useState(0);
  const photos = selectedProduct.photos || [];
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
  const mainPhoto = photos[mainPhotoIndex];
  const mainImageUrl = mainPhoto
    ? `${process.env.NEXT_PUBLIC_API_URL}/photos/${mainPhoto.url}`
    : "/placeholder-product.jpg";
  const [quantity, setQuantity] = useState(1);
  const price = selectedProduct.prices?.[0]?.price || 0;
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    setMainPhotoIndex(0);
  }, [selectedIndex]);

  const getVariantLabel = (p: NomenclatureItem) => {
    const lengthAttr = p.attributes?.find((attr) => attr.attribute_id === 1);
    if (lengthAttr?.value) return lengthAttr.value;
    const match = p.name.match(/\((.*?)\)/);
    if (match) return match[1];
    return formatPrice(p.prices?.[0]?.price || 0);
  };

  const attributes = selectedProduct.attributes || [];

  const handlePrevPhoto = () => {
    setMainPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextPhoto = () => {
    setMainPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const addToCart = useAddToCart();
  const { openCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart.mutate(
      {
        nomenclature_id: selectedProduct.id,
        quantity,
      },
      {
        onSuccess: () => {
          openCart();
        },
      }
    );
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalImage(
      `${process.env.NEXT_PUBLIC_API_URL}/photos/${photos[index].url}`
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  const modalPrev = () => {
    const newIndex = (modalIndex - 1 + photos.length) % photos.length;
    setModalIndex(newIndex);
    setModalImage(
      `${process.env.NEXT_PUBLIC_API_URL}/photos/${photos[newIndex].url}`
    );
  };

  const modalNext = () => {
    const newIndex = (modalIndex + 1) % photos.length;
    setModalIndex(newIndex);
    setModalImage(
      `${process.env.NEXT_PUBLIC_API_URL}/photos/${photos[newIndex].url}`
    );
  };

  const isAddingToCart = addToCart.isPending;

  return (
    <>
      <div className="mt-6 md:mt-10 flex flex-col lg:flex-row gap-8 xl:gap-12">
        <div className="w-full lg:w-[65%] flex flex-row sm:flex-col-reverse lg:flex-row gap-4 items-start">
          <div className="relative flex lg:flex-col items-center order-2 lg:order-1">
            <div
              ref={thumbnailsRef}
              className="flex flex-col gap-3 lg:gap-4 max-h-[500px] overflow-x-hidden overflow-y-auto lg:max-h-none scrollbar-thin scrollbar-thumb-gray-300"
            >
              {photos.map((photo, idx) => {
                const url = `${process.env.NEXT_PUBLIC_API_URL}/photos/${photo.url}`;
                return (
                  <div
                    key={photo.id != null ? photo.id : idx}
                    className={`
                      relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28
                      rounded-lg overflow-hidden border-2
                      ${idx === mainPhotoIndex ? "border-[#394426]" : "border-transparent"}
                      cursor-pointer hover:border-[#394426]/70 transition-all
                    `}
                    onClick={() => setMainPhotoIndex(idx)}
                  >
                    <Image
                      src={url}
                      alt={`${selectedProduct.name} - ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                );
              })}
              {photos.length > 1 && (
                <div className="flex gap-2 w-full mt-0 lg:mt-2 justify-between">
                  <button
                    onClick={handlePrevPhoto}
                    className="px-2 py-2 sm:px-3 sm:py-3 text-sm bg-white text-black border-gray-700 border rounded-md hover:bg-[#102902] hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronDown size={20} />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="px-2 py-2 sm:px-3 sm:py-3 text-sm bg-[#394426] text-white rounded-md hover:bg-[#102902] transition-colors cursor-pointer"
                  >
                    <ChevronUp size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="relative w-full h-[60dvh] rounded-2xl overflow-hidden shadow-xl order-1 lg:order-2">
            <Image
              src={mainImageUrl}
              alt={selectedProduct.name}
              fill
              className="object-cover cursor-pointer"
              priority
              quality={90}
              onClick={() => openModal(mainPhotoIndex)}
            />
            <button
              className="absolute bottom-4 right-4 bg-white/80 hover:bg-white text-[#394426] p-2 rounded-full cursor-pointer"
              onClick={() => openModal(mainPhotoIndex)}
            >
              <Maximize2 size={24} />
            </button>
          </div>
        </div>
        <div className="w-full lg:w-[32%] flex flex-col h-auto">
          <h1 className="text-xl lg:text-4xl font-playfair font-bold text-[#394426] leading-tight mb-6 md:mb-8">
            {selectedProduct.name}
          </h1>
          {hasVariants && (
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-10">
              <p className="text-lg">Рост растения м.</p>
              <div className="lg:hidden flex flex-wrap gap-2">
                {allProducts.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-manrope rounded-xs border transition-colors cursor-pointer ${
                      idx === selectedIndex
                        ? "bg-[#E3E4E7] text-black border-[#E3E4E7] hover:bg-[#E3E4E7]"
                        : "bg-white text-[#394426] border-[#394426]/40 hover:bg-[#E3E4E7] hover:border-[#E3E4E7]"
                    }`}
                  >
                    {getVariantLabel(p)}
                  </button>
                ))}
              </div>
              <div className="hidden lg:block space-y-3">
                {allProducts.map((p, idx) => (
                  <label
                    key={p.id}
                    className={`
                      flex flex-col items-left justify-between p-4 md:p-5 rounded-xl border-2 cursor-pointer transition-all
                      ${idx === selectedIndex ? "border-[#394426] bg-[#394426]/5" : "border-gray-200 hover:border-[#394426]/50"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="size"
                        checked={idx === selectedIndex}
                        onChange={() => setSelectedIndex(idx)}
                        className="w-5 h-5 accent-[#394426]"
                      />
                      <span className="text-base md:text-lg font-manrope text-[#394426]">
                        {getVariantLabel(p)}
                      </span>
                    </div>
                    <span className="pl-8 text-sm md:text-md text-gray-400">
                      От {formatPrice(p.prices?.[0]?.price || 0)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="">
            <p className="text-2xl lg:text-4xl font-bold text-[#394426] mb-4">
              От {formatPrice(price)} / шт.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 md:gap-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray rounded-sm overflow-hidden w-38">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 text-xl font-bold text-[#394426] hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    –
                  </button>
                  <span className="px-6 py-2.5 text-xl font-medium w-14 text-left">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 py-2.5 text-xl font-bold text-[#394426] w-full h-full hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <p className="w-full h-full">+</p>
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex items-center gap-2 bg-[#394426] text-white px-4 py-3 md:py-3 rounded-md text-md md:text-lg hover:bg-[#102902] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg
                      viewBox="0 0 16 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-6 sm:w-4 sm:h-3"
                    >
                      <path
                        d="M0 0.65625C0 0.292578 0.299764 0 0.672368 0H1.94707C2.5634 0 3.1097 0.35 3.36464 0.875H14.879C15.6158 0.875 16.1537 1.55859 15.9603 2.25312L14.8117 6.41758C14.5736 7.27617 13.7751 7.875 12.8646 7.875H4.78222L4.9335 8.6543C4.99514 8.96328 5.27249 9.1875 5.59467 9.1875H13.6715C14.0441 9.1875 14.3439 9.48008 14.3439 9.84375C14.3439 10.2074 14.0441 10.5 13.6715 10.5H5.59467C4.62533 10.5 3.79328 9.82734 3.61398 8.90039L2.16839 1.49023C2.14878 1.38633 2.05633 1.3125 1.94707 1.3125H0.672368C0.299764 1.3125 0 1.01992 0 0.65625ZM3.58596 12.6875C3.58596 12.5151 3.62075 12.3445 3.68833 12.1852C3.75591 12.026 3.85496 11.8813 3.97983 11.7594C4.1047 11.6375 4.25294 11.5409 4.41609 11.4749C4.57924 11.4089 4.75411 11.375 4.9307 11.375C5.10729 11.375 5.28216 11.4089 5.44531 11.4749C5.60846 11.5409 5.7567 11.6375 5.88157 11.7594C6.00644 11.8813 6.1055 12.026 6.17308 12.1852C6.24066 12.3445 6.27544 12.5151 6.27544 12.6875C6.27544 12.8599 6.24066 13.0305 6.17308 13.1898C6.1055 13.349 6.00644 13.4937 5.88157 13.6156C5.7567 13.7375 5.60846 13.8341 5.44531 13.9001C5.28216 13.9661 5.10729 14 4.9307 14C4.75411 14 4.57924 13.9661 4.41609 13.9001C4.25294 13.8341 4.1047 13.7375 3.97983 13.6156C3.85496 13.4937 3.75591 13.349 3.68833 13.1898C3.62075 13.0305 3.58596 12.8599 3.58596 12.6875ZM12.9991 11.375C13.3558 11.375 13.6978 11.5133 13.95 11.7594C14.2022 12.0056 14.3439 12.3394 14.3439 12.6875C14.3439 13.0356 14.2022 13.3694 13.95 13.6156C13.6978 13.8617 13.3558 14 12.9991 14C12.6425 14 12.3004 13.8617 12.0482 13.6156C11.7961 13.3694 11.6544 13.0356 11.6544 12.6875C11.6544 12.3394 11.7961 12.0056 12.0482 11.7594C12.3004 11.5133 12.6425 11.375 12.9991 11.375Z"
                        fill="white"
                      />
                    </svg>
                  )}
                  <span className="hidden sm:block">
                    {isAddingToCart ? "Добавление..." : "В корзину"}
                  </span>
                </button>
                <FavoriteButton
                  productId={selectedProduct.id}
                  className="border border-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 md:mt-12 ml-0 sm:ml-40">
        <div className="flex bg-gray-200 rounded-lg gap-2 sm:gap-3 p-2 w-[94vw] sm:w-full ml-[calc(-48vw+50%)] sm:ml-0 sm:py-2 sm:p-2">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-4 py-3 md:px-8 md:py-4 text-md md:text-xl transition-colors cursor-pointer rounded-md ${
              activeTab === 0
                ? "bg-[#394426] text-white"
                : "bg-white hover:bg-[#102902] hover:text-white"
            }`}
          >
            Описание
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`px-4 py-3 md:px-8 md:py-4 text-md md:text-xl transition-colors cursor-pointer rounded-md ${
              activeTab === 1
                ? "bg-[#394426] text-white"
                : "bg-white hover:bg-[#102902] hover:text-white"
            }`}
          >
            Характеристики
          </button>
        </div>
        <div className="mt-6 md:mt-8 prose prose-lg max-w-none text-[#394426]">
          {activeTab === 0 && (
            <>
              {selectedProduct.description_short && (
                <p className="text-base md:text-lg leading-relaxed mb-4">
                  {selectedProduct.description_short}
                </p>
              )}
              {selectedProduct.description_long && (
                <p className="text-base md:text-lg leading-relaxed">
                  {selectedProduct.description_long}
                </p>
              )}
              {!selectedProduct.description_short &&
                !selectedProduct.description_long && (
                  <p className="text-base md:text-lg leading-relaxed">
                    Описание отсутствует.
                  </p>
                )}
            </>
          )}
          {activeTab === 1 && (
            <>
              {attributes.length > 0 ? (
                <ul className="space-y-2">
                  {attributes.map((attr) => (
                    <li
                      key={attr.id}
                      className="text-base md:text-lg text-[#394426]"
                    >
                      <span className="font-medium">{attr.name}</span> –{" "}
                      {attr.value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-base md:text-lg leading-relaxed">
                  Характеристики отсутствуют.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {modalOpen && modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeModal}
        >
          <div className="relative w-[80vw] sm:w-[30vw] h-[85vh] flex items-center justify-center">
            <Image
              src={modalImage}
              alt="Увеличенное изображение"
              fill
              className="object-cover"
              quality={95}
            />
            <button
              className="absolute top-0 right-1 bg-black/80 hover:bg-white/80 hover:text-black text-white p-3 rounded-full cursor-pointer"
              onClick={closeModal}
            >
              <X size={24} />
            </button>
            {photos.length > 1 && (
              <>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    modalPrev();
                  }}
                  className="absolute left-1 h-[80%] z-100 w-30 cursor-pointer"
                >
                  <button
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-white/80 text-white hover:text-black p-3 rounded-full cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      modalPrev();
                    }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    modalNext();
                  }}
                  className="absolute right-1 h-[80%] z-100 w-30 cursor-pointer"
                >
                  <button
                    className="absolute top-1/2 right-1 -translate-y-1/2 bg-black/80 hover:bg-white/80 hover:text-black text-white p-3 rounded-full cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      modalNext();
                    }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </>
            )}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
              {modalIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPageContent;