"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useCategoriesWithPictures } from "@/entities/category/hooks/hooks";
import { ContactsModal } from "../contacts-modal/ContactsModal";

const LoadingCategoryCard = () => {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#F8F9FB] shadow-lg shadow-black/10 border-2 border-[#394426] sm:border sm:border-gray-200 flex flex-col h-full">
      <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#394426] animate-spin" />
        </div>
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      </div>
      <div className="sm:hidden p-4 flex flex-col flex-1">
        <div className="h-5 mb-4" />
        <div className="flex flex-col gap-2.5 mt-auto">
          <div className="bg-[#394426] text-white text-sm font-manrope font-medium py-2.5 rounded-md w-full text-center opacity-70 pointer-events-none">
            Подобрать растение
          </div>
          <div className="bg-white text-[#394426] text-sm font-manrope font-medium py-2 rounded-md border border-[#394426]/40 w-full text-center opacity-70 pointer-events-none">
            Заказать консультацию
          </div>
        </div>
      </div>
      <div className="hidden sm:block absolute inset-x-0 top-4 px-3 sm:px-4 text-left mt-7" />
      <div className="hidden sm:block absolute w-60 left-1/2 -translate-x-1/2 bottom-4 px-3 sm:px-4 flex flex-col gap-2.5">
        <div className="bg-[#394426] text-white text-xs sm:text-sm md:text-base font-manrope font-medium py-2.5 sm:py-3 rounded-md w-full text-center opacity-70 pointer-events-none">
          Подобрать растение
        </div>
        <div className="bg-white/90 backdrop-blur-sm text-[#394426] text-xs sm:text-sm md:text-base font-manrope font-medium py-2 sm:py-2.5 rounded-md border border-[#394426]/40 w-full text-center opacity-70 pointer-events-none">
          Заказать консультацию
        </div>
      </div>
    </div>
  );
};

const PopularCategories = () => {
  const [isContactsOpen, setIsContactsOpen] = useState(false);

  // Запрашиваем все категории (100)
  const { data: allCategories, isLoading, error } = useCategoriesWithPictures(100);

  // Показываем только первые 6
  const categoriesToShow = useMemo(() => {
    if (!allCategories) return [];
    return allCategories.slice(0, 6);
  }, [allCategories]);

  if (error) {
    console.error("Error loading categories:", error);
    return (
      <div className="py-0 sm:py-12 text-center text-red-600">
        Ошибка загрузки категорий
      </div>
    );
  }

  return (
    <section className="py-12 pb-0 md:py-16 md:pb-16 bg-[#F8F9FB]">
      <div className="container mx-auto">
        <h2 className="text-left mb-10 md:mb-18">
          <span className="font-[600] text-[clamp(24px,5vw,60px)] leading-[1] tracking-normal text-[#394426]">
            Подберите растение <br className="block sm:hidden" /> для своего сада:{" "}
            <br className="hidden sm:block" /> более 5000{" "}
          </span>
          <span className="italic font-[400] text-[clamp(28px,6vw,70px)] leading-[1] tracking-[-0.02em] text-[#394426]">
            акклиматизированных сортов
          </span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-[25px]">
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <LoadingCategoryCard key={idx} />
              ))
            : categoriesToShow.length > 0
              ? categoriesToShow.map((category) => (
                  <div
                    key={category.id}
                    className="group relative rounded-lg sm:rounded-2xl overflow-hidden bg-white border-2 border-[#394426] sm:border sm:border-gray-200 hover:border-[#394426]/30 transition-all duration-300 hover:shadow-xl flex flex-col h-full"
                  >
                    <Link
                      href={`/catalog/${category.id}`}
                      className="block relative h-[190px] sm:h-[600px] w-full"
                    >
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover p-2 sm:p-0 rounded-xl bg-white relative"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                      <div className="absolute hidden sm:block inset-0 bg-black/30 group-hover:bg-black/20 transition-colors pointer-events-none" />

                      {/* Кнопки для десктопа */}
                      <div className="hidden mx-auto mt-[94%] sm:block w-70 flex flex-col gap-2.5 z-30 relative">
                        <Link href={`/catalog/${category.id}`}>
                          <button
                            className="bg-[#394426] mb-5 text-white text-xs sm:text-xl font-manrope font-medium py-2.5 sm:py-4.5 rounded-md hover:bg-[#102902] transition-colors w-full cursor-pointer"
                          >
                            Подобрать растение
                          </button>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsContactsOpen(true);
                          }}
                          className="bg-white/90 backdrop-blur-sm text-[#394426] text-xs sm:text-xl font-manrope font-medium py-2 sm:py-4.25 rounded-md border border-[#394426]/40 hover:bg-[#102902] hover:text-white hover:border-[#394426] transition-all duration-200 w-full cursor-pointer"
                        >
                          Заказать консультацию
                        </button>
                      </div>
                    </Link>

                    {/* Мобильная версия */}
                    <div className="sm:hidden px-2 pb-5 flex flex-col flex-1">
                      <h3 className="text-base font-manrope font-bold text-[#394426] leading-tight mb-4 text-center">
                        {category.name}
                      </h3>
                      <div className="flex flex-col gap-2.5 mt-auto">
                        <Link href={`/catalog/${category.id}`}>
                          <button
                            className="bg-[#394426] text-white text-[12px] font-manrope font-medium py-2.5 rounded-md hover:bg-[#102902] transition-colors shadow-md w-full cursor-pointer"
                          >
                            Подобрать растение
                          </button>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsContactsOpen(true);
                          }}
                          className="bg-white text-[#394426] whitespace-nowrap text-[12px] font-manrope font-medium py-2 rounded-md border border-[#394426]/40 hover:bg-[#102902] hover:text-white hover:border-[#394426] transition-all duration-200 w-full cursor-pointer"
                        >
                          Заказать консультацию
                        </button>
                      </div>
                    </div>

                    {/* Название категории на десктопе */}
                    <div className="hidden sm:block absolute inset-x-0 top-4 px-3 sm:px-12 text-left mt-7 z-20">
                      <h3 className="sm:text-base md:text-lg lg:text-2xl font-manrope font-bold text-white leading-tight">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                ))
              : !isLoading && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    Нет доступных категорий
                  </div>
                )}
        </div>
      </div>

      <ContactsModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
      />
    </section>
  );
};

export default PopularCategories;