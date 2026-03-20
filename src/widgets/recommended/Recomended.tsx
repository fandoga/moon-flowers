"use client";

import React, { useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ContactsModal } from "../contacts-modal/ContactsModal";
import { useCategoriesWithPictures } from "@/entities/category/hooks/hooks";

const Recomended = () => {
  const [isContactsOpen, setIsContactsOpen] = React.useState(false);
  const { data: categories, isLoading, error } = useCategoriesWithPictures(100, 0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  }, []);

  if (error) {
    console.error("Ошибка загрузки категорий:", error);
    return null;
  }

  if (isLoading) {
    return <div className="py-12 text-center text-gray-500">Загрузка...</div>;
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-[#F8F9FB] mt-10 hidden sm:block">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-15 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#394426] leading-tight flex">
            Рекомендуем{" "}
            <span className="text-[15px] text-gray-500 pl-1 pt-2">
              ({categories.length})
            </span>
          </h2>
          <div className="hidden md:flex items-center gap-4 mr-20">
            <button
              onClick={scrollLeft}
              className="w-12 h-12 flex items-center justify-center bg-white border-2 border-[#394426] rounded-md text-[#394426] hover:bg-[#102902] hover:text-white transition-colors cursor-pointer"
              aria-label="Предыдущие"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollRight}
              className="w-12 h-12 flex items-center justify-center bg-white border-2 border-[#394426] rounded-md text-[#394426] hover:bg-[#102902] hover:text-white transition-colors cursor-pointer"
              aria-label="Следующие"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto sm:overflow-x-hidden gap-4 md:gap-6 lg:gap-8 pb-4 md:pb-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-shrink-0 w-[250px] lg:w-[285px] snap-start"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-[#394426]">
                  <div className="relative aspect-square w-[235px] h-[235px] mx-6 mt-6 rounded-lg">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover rounded-md"
                      unoptimized
                    />
                  </div>
                  <div className="p-4 md:p-5 text-center">
                    <h3 className="text-lg md:text-xl font-manrope font-bold text-[#394426] mb-3 md:mb-4">
                      {category.name}
                    </h3>
                    <div className="flex flex-col gap-2.5 items-center">
                      <Link href={`/catalog/${category.id}`} className="w-[200px]">
                        <button className="bg-[#394426] text-white py-3 px-4 text-[12px] md:text-base rounded-lg w-full max-w-[200px] mx-auto hover:bg-[#102902] transition-colors cursor-pointer">
                          Подобрать растение
                        </button>
                      </Link>
                      <button
                        onClick={() => setIsContactsOpen(true)}
                        className="bg-white border-2 border-[#394426] text-[#394426] py-3 px-4 text-sm md:text-sm rounded-lg font-manrope font-medium w-full max-w-[200px] mx-auto hover:bg-[#102902] hover:text-white transition-colors cursor-pointer"
                      >
                        Заказать консультацию
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ContactsModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
      />
    </section>
  );
};

export default Recomended;