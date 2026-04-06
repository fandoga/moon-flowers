"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounceSearch";
import { getProducts } from "@/entities/product/api/api";
import { formatPrice } from "@/lib/utils/formatPrice";

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
  const [isNavigating, setIsNavigating] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const initialFetchDone = useRef(false);

  const fetchProducts = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const params: any = {
        limit: 5,
        has_photos: true,
        with_prices: true,
        with_photos: true,
      };
      if (searchQuery.trim()) {
        params.name = searchQuery;
      }
      const data = await getProducts(params);
      setSuggestions(data.result);
    } catch (error) {
      console.error("Ошибка загрузки подсказок:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Preload 5 products on mount (no need to wait for focus)
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchProducts("");
    }
  }, [fetchProducts]);

  // Load when query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      fetchProducts(debouncedQuery);
    }
  }, [debouncedQuery, fetchProducts]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!isNavigating) {
        setIsFocused(false);
      }
    }, 150);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowSuggestions(true);
    // If user clears query, show preloaded products
    if (!newQuery.trim() && suggestions.length === 0) {
      fetchProducts("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search");
    }
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery("");
    setShowSuggestions(true);
    fetchProducts("");
  };

  const handleSuggestionClick = (
    productId: number,
    name: string,
    category: number | null
  ) => {
    if (isNavigating) return;
    setIsNavigating(true);

    const categoryStr =
      category !== null && category !== undefined ? category.toString() : "0";
    const normalizedName = name.replace(/\s*\(.*?\)\s*/g, "").trim();
    const params = new URLSearchParams({
      category: categoryStr,
      name: normalizedName,
      variantId: productId.toString(),
    });

    if (onSuggestionClick) {
      onSuggestionClick();
    }

    router.push(`/product?${params.toString()}`);

    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

  const renderContent = () => {
    if (isNavigating) {
      return (
        <div className="p-8 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mb-2"></div>
          <div>Переход к товару...</div>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className="p-4 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500 mr-2"></div>
          Загрузка...
        </div>
      );
    }
    if (suggestions.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          {query.trim() ? "Ничего не найдено" : "Нет товаров для отображения"}
        </div>
      );
    }
    return suggestions.map((product) => {
      const imageUrl =
        product.photos?.length && "url" in product.photos[0]
          ? product.photos[0].url.includes("pictures/")
            ? `${process.env.NEXT_PUBLIC_API_URL}/${product.photos[0].url}`
            : `${process.env.NEXT_PUBLIC_API_URL}/photos/${product.photos[0].url}`
          : "/placeholder.jpg";

      return (
        <button
          key={product.id}
          onClick={() =>
            handleSuggestionClick(product.id, product.name, product.category)
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
            <div className="font-medium text-[#394426]">{product.name}</div>
            <div className="text-sm text-gray-600">
              {product.prices?.[0]?.price
                ? formatPrice(product.prices[0].price)
                : ""}
            </div>
          </div>
        </button>
      );
    });
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
          style={{ WebkitAppearance: "none", appearance: "none" }}
        />

        {!query && (
          <button
            type="submit"
            className="absolute sm:w-11.5 right-2 md:left-2 top-1/2 -translate-y-1/2 p-2 md:p-3.5 rounded-sm bg-[#F3F3F3] hover:bg-gray-200 transition-colors cursor-pointer"
            aria-label="Поиск"
          >
            <Search className="text-black" size={18} />
          </button>
        )}

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute sm:w-11.5 right-2 md:left-2 top-1/2 -translate-y-1/2 p-2 md:p-3.5 rounded-sm bg-[#F3F3F3] hover:bg-gray-200 transition-colors cursor-pointer"
            aria-label="Очистить"
          >
            <X className="text-black" size={18} />
          </button>
        )}
      </form>

      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {renderContent()}
        </div>
      )}
    </div>
  );
};