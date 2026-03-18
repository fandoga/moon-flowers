"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounceSearch";
import { getProducts } from "@/entities/product/api/api";
import { formatPrice } from "@/lib/utils/formatPrice";
import { log } from "console";

interface SearchInputProps {
  onSuggestionClick?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSuggestionClick,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      console.log("отправка запроса")
      const params: any = { limit: 5, with_photos: true, with_prices: true };
      if (searchQuery.trim()) {
        params.name = searchQuery;
      }
      const data = await getProducts(params);
      console.log("пришел запрос")
      console.log(data.result)
      setSuggestions(data.result);
    } catch (error) {
      console.error("Ошибка загрузки подсказок:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  useEffect(() => {
    if (debouncedQuery.trim()) {
      fetchProducts(debouncedQuery);
    }
  }, [debouncedQuery, fetchProducts]);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
    console.log("пустой клик")
    if (!isLoading) {
      console.log("загрузка продуктов")
      fetchProducts("");
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowSuggestions(true);
    if (!newQuery.trim() && !isLoading) {
      fetchProducts("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(true);
    fetchProducts("");
  }

  const handleSuggestionClick = (
    productId: number,
    name: string,
    category: number,
  ) => {
    const normalizedName = name.replace(/\s*\(.*?\)\s*/g, "").trim();
    const params = new URLSearchParams({
      category: category.toString(),
      name: normalizedName,
      variantId: productId.toString(),
    });
    console.log("данные продукта")
    console.log(params)
    router.push(`/product?${params.toString()}`);
    console.log("перевод на страницу")
    setShowSuggestions(false);
    setQuery("");
    if (onSuggestionClick) {
      onSuggestionClick();
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="search"
          placeholder="Поиск"
          value={query}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className="w-full pl-4 sm:pl-15 pr-6 py-2 sm:py-4 bg-white border border-gray-200 rounded-xs sm:rounded-lg focus:outline-none focus:border-[#2E5B2E] text-gray-700"
          style={{
            WebkitAppearance: "none",
            appearance: "none",
          }}
        />

        <button
          type="submit"
          className="absolute sm:w-11.5 right-2 md:left-2 top-1/2 -translate-y-1/2 p-2 md:p-3.5 rounded-sm bg-[#F3F3F3] hover:bg-gray-200 transition-colors cursor-pointer"
          aria-label="Поиск"
        >
          <Search className="text-black" size={18} />
        </button>

        {(isFocused || query !== "") && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 sm:w-11.5 md:left-2 top-1/2 -translate-y-1/2 p-2 md:p-3.5 rounded-sm bg-[#F3F3F3] hover:bg-gray-200 transition-colors cursor-pointer"
            aria-label="Очистить"
          >
            <X className="text-black" size={18} />
          </button>
        )}
      </form>

      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-gray-500">Загрузка...</div>
          )}
          {!isLoading && suggestions.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              {query.trim()
                ? "Ничего не найдено"
                : "Нет товаров для отображения"}
            </div>
          )}
          {suggestions.map((product) => {
            const imageUrl =
              product.photos?.length && "url" in product.photos[0]
                ? product.photos[0].url.includes("pictures/")
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${product.photos[0].url}`
                  : `${process.env.NEXT_PUBLIC_API_URL}/photos/${product.photos[0].url}`
                : "/placeholder.jpg";

            return (
              <button
                key={product.id}
                onClick={() => {
                  console.log("клик на продукт")
                  handleSuggestionClick(
                    product.id,
                    product.name,
                    product.category,
                  )
                  
                }
                }
                className="w-full text-left p-3 hover:bg-gray-100 flex items-center gap-3 border-b last:border-b-0 cursor-pointer"
              >
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div>
                  <div className="font-medium text-[#394426]">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {product.prices?.[0]?.price
                      ? formatPrice(product.prices[0].price)
                      : ""}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
