"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ContactsModal } from "../contacts-modal/ContactsModal";

const mockProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: [
    "Ель обыкновенная",
    "Можжевельник",
    "Сосна",
    "Туя",
    "Лиственница",
    "Кедр",
    "Пихта",
  ][i % 7],
  image: `/popular/img${(i % 5) + 1}.png`,
  price: 9970 + i * 2000,
}));

const Recomended = () => {
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [products, setProducts] = useState(mockProducts.slice(0, 10));
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "200px",
  });

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const nextPage = mockProducts.slice(page * 10, (page + 1) * 10);
    if (nextPage.length === 0) {
      setHasMore(false);
    } else {
      setProducts((prev) => [...prev, ...nextPage]);
      setPage((prev) => prev + 1);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (inView) loadMore();
  }, [inView]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="py-12 md:py-16 bg-[#F8F9FB] mt-10 hidden sm:block">
      <div className="container mx-auto">
        
        <div className="flex items-center justify-between mb-6 md:mb-15 text-center">
          <h2
            className="
            text-3xl sm:text-4xl md:text-5xl 
            font-playfair font-bold text-[#394426] 
            leading-tight flex
          "
          >
            Рекомендуем  <span className="text-[15px] text-gray-500 pl-1 pt-2">({mockProducts.length})</span>
          </h2>
          
          <div className="hidden md:flex items-center gap-4 mr-20">
            <button
              onClick={scrollLeft}
              className="
                w-12 h-12 flex items-center justify-center 
                bg-white border-2 border-[#394426] rounded-md 
                text-[#394426] hover:bg-[#102902] hover:text-white 
                transition-colors cursor-pointer
              "
              aria-label="Предыдущие"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={scrollRight}
              className="
                w-12 h-12 flex items-center justify-center 
                bg-white border-2 border-[#394426] rounded-md  
                text-[#394426] hover:bg-[#102902] hover:text-white 
                transition-colors cursor-pointer
              "
              aria-label="Следующие"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="
              flex overflow-x-auto sm:overflow-x-hidden gap-4 md:gap-6 lg:gap-8 
              pb-4 md:pb-6 scrollbar-hide snap-x snap-mandatory
            "
            style={{ scrollSnapType: "x mandatory" }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="
                  flex-shrink-0 w-[250px] lg:w-[285px]
                  snap-start
                "
              >
                <div
                  className="
                  bg-white rounded-2xl overflow-hidden 
                  shadow-md hover:shadow-xl transition-shadow duration-300
                  border border-[#394426]
                "
                >
                  
                  <div className="relative aspect-square w-[235px] h-[235px] mx-6 mt-6 rounded-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  
                  <div className="p-4 md:p-5 text-center">
                    <h3
                      className="
                      text-lg md:text-xl font-manrope font-bold 
                      text-[#394426] mb-3 md:mb-4
                    "
                    >
                      {product.name}
                    </h3>

                    <div className="flex flex-col gap-2.5 items-center">
                      <Link href="/catalog" className=" w-[200px]">
                        <button
                          className="
                          bg-[#394426] text-white 
                          py-3 px-4 text-[12px] md:text-base rounded-lg
                          w-full max-w-[200px] mx-auto
                          hover:bg-[#102902] transition-colors cursor-pointer w-[200px]
                          
                        "
                        >
                          Подобрать растение
                        </button>
                      </Link>

                      <button
                        className="
                        bg-white border-2 border-[#394426] 
                        text-[#394426] py-3 px-4 text-sm md:text-sm rounded-lg
                        font-manrope font-medium
                        w-full max-w-[200px] mx-auto
                        hover:bg-[#102902] hover:text-white transition-colors cursor-pointer
                      "
                        onClick={() => setIsContactsOpen(true)}
                      >
                        Заказать консультацию
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            
            {hasMore && (
              <div
                ref={ref}
                className="flex-shrink-0 w-80 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-pulse text-[#394426]">
                    Загрузка...
                  </div>
                ) : (
                  <div className="h-1 w-full bg-transparent" />
                )}
              </div>
            )}
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
