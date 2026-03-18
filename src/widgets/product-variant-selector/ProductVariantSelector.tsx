'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCartIcon, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { NomenclatureItem } from '@/entities/product/types/types';
import { formatPrice } from '@/lib/utils/formatPrice';
import { normalizeProductName } from '@/lib/utils/normalizeName';

interface Props {
  product: NomenclatureItem;
  variants: NomenclatureItem[];
}

const ProductVariantSelector: React.FC<Props> = ({ product, variants }) => {
  const hasVariants = variants.length > 1;
  const allProducts = hasVariants ? variants : [product];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedProduct = allProducts[selectedIndex];

  
  const [activeTab, setActiveTab] = useState(0);

  const photos = selectedProduct.photos || [];
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
  const mainPhoto = photos[mainPhotoIndex];
  
  const mainImageUrl = mainPhoto
    ? `${process.env.NEXT_PUBLIC_API_URL}/photos/${mainPhoto.url}`
    : '/placeholder-product.jpg';

  const [quantity, setQuantity] = useState(1);
  const price = selectedProduct.prices?.[0]?.price || 0;

  const handlePrevPhoto = () => {
    setMainPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextPhoto = () => {
    setMainPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const getVariantLabel = (p: NomenclatureItem) => {
    const lengthAttr = p.attributes?.find(attr => attr.attribute_id === 1);
    if (lengthAttr?.value) return lengthAttr.value;
    const match = p.name.match(/\((.*?)\)/);
    if (match) return match[1];
    return formatPrice(p.prices?.[0]?.price || 0);
  };

  const attributes = selectedProduct.attributes || [];

  return (
    <>
      <div className="mt-6 md:mt-10 flex flex-col lg:flex-row gap-8 xl:gap-12">
        
        <div className="w-full lg:w-[65%] flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex lg:flex-col gap-3 lg:gap-4 order-2 lg:order-1 max-h-[500px] overflow-y-auto lg:max-h-none scrollbar-thin scrollbar-thumb-gray-300">
            {photos.map((photo, idx) => {
              const url = `${process.env.NEXT_PUBLIC_API_URL}/${photo.url}`;
              return (
                <div
                  key={photo.id || idx}
                  className={`
                    relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 
                    rounded-lg overflow-hidden border-2 
                    ${idx === mainPhotoIndex ? 'border-[#394426]' : 'border-transparent'} 
                    cursor-pointer hover:border-[#394426]/70 transition-all
                  `}
                  onClick={() => setMainPhotoIndex(idx)}
                >
                  <Image src={url} alt={`${selectedProduct.name} - ${idx + 1}`} fill className="object-cover" />
                </div>
              );
            })}
          </div>

          <div className="relative w-full h-180 rounded-2xl overflow-hidden shadow-xl order-1 lg:order-2">
            <Image src={mainImageUrl} alt={selectedProduct.name} fill className="object-cover" priority quality={90} />
            <button
              className="absolute bottom-4 right-4 bg-white/80 hover:bg-white text-[#394426] p-2 rounded-full"
              onClick={() => window.open(mainImageUrl, '_blank')}
            >
              <Maximize2 size={24} />
            </button>
            {photos.length > 1 && (
              <>
                <button onClick={handlePrevPhoto} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#394426] p-2 rounded-full">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={handleNextPhoto} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#394426] p-2 rounded-full">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>

        
        <div className="w-full lg:w-[35%]">
          <h1 className="text-3xl lg:text-4xl font-playfair font-bold text-[#394426] leading-tight mb-6 md:mb-8">
            {selectedProduct.name}
          </h1>

          {hasVariants && (
            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
              <div className="lg:hidden flex flex-wrap gap-2">
                {allProducts.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-manrope rounded-md border transition-colors ${
                      idx === selectedIndex
                        ? 'bg-[#394426] text-white border-[#394426]'
                        : 'bg-white text-[#394426] border-[#394426]/40 hover:bg-gray-100'
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
                      ${idx === selectedIndex ? 'border-[#394426] bg-[#394426]/5' : 'border-gray-200 hover:border-[#394426]/50'}
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
                      <span className="text-base md:text-lg font-manrope text-[#394426]">{getVariantLabel(p)}</span>
                    </div>
                    <span className="pl-8 text-sm md:text-md text-gray-400">{formatPrice(p.prices?.[0]?.price || 0)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <p className="text-2xl lg:text-4xl font-bold text-[#394426] leading-none mb-6">{formatPrice(price)}</p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 md:gap-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray rounded-sm overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2.5 text-xl font-bold text-[#394426] hover:bg-gray-100 transition-colors cursor-pointer">–</button>
                <span className="px-6 py-2.5 text-xl font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2.5 text-xl font-bold text-[#394426] hover:bg-gray-100 transition-colors cursor-pointer">+</button>
              </div>

              <button className="flex gap-2 bg-[#394426] text-white px-4 py-3 md:py-3 rounded-md text-md md:text-lg hover:bg-[#102902] transition-colors cursor-pointer">
                <ShoppingCartIcon fill="white" />
                <span className="hidden sm:block">В корзину</span>
              </button>

              <button className="w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center border-1 border-[#394426] rounded-sm hover:bg-[#394426]/10 transition-colors cursor-pointer">
                <Heart size={32} className="text-[#394426]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <div className="mt-10 md:mt-12 ml-0 sm:ml-20">
        <div className="flex border-b border-[#394426]/30">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-6 py-3 md:px-8 md:py-4 font-manrope font-medium text-lg md:text-xl border-b-4 transition-colors cursor-pointer ${
              activeTab === 0
                ? 'border-[#394426] text-[#394426]'
                : 'border-transparent text-gray-500 hover:text-[#394426]'
            }`}
          >
            Описание
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`px-6 py-3 md:px-8 md:py-4 font-manrope font-medium text-lg md:text-xl border-b-4 transition-colors cursor-pointer ${
              activeTab === 1
                ? 'border-[#394426] text-[#394426]'
                : 'border-transparent text-gray-500 hover:text-[#394426]'
            }`}
          >
            Характеристики
          </button>
        </div>

        <div className="mt-6 md:mt-8 prose prose-lg max-w-none text-[#394426]">
          {activeTab === 0 && (
            <>
              {selectedProduct.description_short && (
                <p className="text-base md:text-lg leading-relaxed mb-4">{selectedProduct.description_short}</p>
              )}
              {selectedProduct.description_long && (
                <p className="text-base md:text-lg leading-relaxed">{selectedProduct.description_long}</p>
              )}
              {!selectedProduct.description_short && !selectedProduct.description_long && (
                <p className="text-base md:text-lg leading-relaxed">Описание отсутствует.</p>
              )}
            </>
          )}

          {activeTab === 1 && (
            <>
              {attributes.length > 0 ? (
                <ul className="space-y-2">
                  {attributes.map(attr => (
                    <li key={attr.id} className="text-base md:text-lg text-[#394426]">
                      <span className="font-medium">{attr.name}</span> – {attr.value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-base md:text-lg leading-relaxed">Характеристики отсутствуют.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductVariantSelector;