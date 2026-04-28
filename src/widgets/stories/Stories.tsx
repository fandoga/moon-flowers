"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StoryVideo, useMyVideos } from "@/entities/video";
import {
  MpProduct,
  getProductsWithVideos,
  getPicturesById,
  usePrices,
} from "@/entities/mp-product";
import Videos from "../videos/Videos";
import Logo from "@/components/ui/logo";

// Извлечение video_id из обьекта товара
const extractVideoId = (product: MpProduct): number | null => {
  if (!product.videos || !Array.isArray(product.videos)) {
    return null;
  }

  const videoUrl = product.videos[0]?.url;
  if (!videoUrl || typeof videoUrl !== "string") {
    return null;
  }

  const match = videoUrl.match(/(\d+)(?!.*\d)/);
  if (!match) {
    return null;
  }

  const videoId = parseInt(match[1], 10);
  return videoId > 0 ? videoId : null;
};

const Stories = () => {
  const { data } = useMyVideos({ limit: 16 });
  const { data: allPrices } = usePrices();
  const [currentPage, setCurrentPage] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(
    (typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches) ||
      false,
  );
  const [productsWithVideos, setProductsWithVideos] = useState<MpProduct[]>([]);
  const [enrichedVideos, setEnrichedVideos] = useState<StoryVideo[]>([]);

  // Fetch products with videos on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProductsWithVideos({ limit: 16 });
      setProductsWithVideos(response.result);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(hover: none), (pointer: coarse)");

    const handleChange = (event: MediaQueryListEvent) => {
      setIsTouchDevice(event.matches);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  // Собираем видео из товаров
  useEffect(() => {
    const buildVideosFromProducts = async () => {
      if (productsWithVideos.length === 0) {
        setEnrichedVideos([]);
        return;
      }

      // Собираем цены
      const priceByProductId = new Map<number, number>();
      const pricesList = Array.isArray(allPrices?.result)
        ? allPrices.result
        : allPrices?.result
          ? [allPrices.result]
          : [];
      for (const price of pricesList) {
        const productId = Number(price.nomenclature_id);
        const amount = Number(price.price);
        if (!Number.isFinite(productId) || !Number.isFinite(amount)) continue;
        if (!priceByProductId.has(productId)) {
          priceByProductId.set(productId, amount);
        }
      }

      const videosFromProducts: StoryVideo[] = [];

      for (const product of productsWithVideos) {
        const videoId = extractVideoId(product);
        if (videoId === null) continue;

        // Find matching video data from API
        const videoData = data?.items?.find(
          (item) => Number(item.video_id) === videoId,
        );

        if (!videoData || !videoData.seo_url) continue;

        const picture = await getPicturesById(product.id);

        const productId = Number(product.id);
        const fallbackPrice = Number(product.price ?? 0);
        const resolvedPrice = priceByProductId.get(productId) ?? fallbackPrice;

        videosFromProducts.push({
          id: videoId,
          title: product.name,
          avatar: videoData.channel_avatar || "",
          poster: videoData.preview_url || videoData.post_image || undefined,
          productId: productId,
          productName: product.name,
          productPhoto: picture?.public_url || picture?.url || undefined,
          productPrice: resolvedPrice > 0 ? resolvedPrice : undefined,
        });
      }

      setEnrichedVideos(videosFromProducts);
    };

    buildVideosFromProducts();
  }, [productsWithVideos, data, allPrices]);

  const displayVideos = enrichedVideos;

  const pageSize = 4;
  const totalPages = Math.ceil(displayVideos.length / pageSize);
  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages - 1) : 0;

  return (
    <section className="pt-30 pb-5 pb-20  bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-left mb-5 md:mb-12 flex flex-col items-end lg:pr-80"
        >
          <h2 className="h !text-right pb-4">
            <span className="pr-6"> Тот самый</span>
            <br />
            букет из сторис
          </h2>
          <p className="p !w-fit pb-12">
            Собрали все букеты из видео — теперь <br />
            вы легко найдёте и закажете в пару кликов
          </p>
        </motion.div>

        {!data ? (
          <section className="w-full flex items-center justify-center h-100">
            <Logo alwaysEnabled />
          </section>
        ) : (
          <>
            {!isTouchDevice && totalPages > 1 && (
              <div className="mb-4 hidden md:flex items-center justify-end">
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, pageIndex) => (
                    <button
                      key={pageIndex}
                      type="button"
                      onClick={() => setCurrentPage(pageIndex)}
                      className={`h-3 w-3 cursor-pointer rounded-full border transition-colors ${
                        pageIndex === safeCurrentPage
                          ? "border-black bg-black"
                          : "border-skeleton bg-skeleton"
                      }`}
                      aria-label={`Перейти к странице видео ${pageIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="-mx-4 flex sm:mx-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory pb-2 sm:pb-0"
            >
              <Videos
                data={data}
                currentPage={safeCurrentPage}
                pageSize={pageSize}
                videos={displayVideos}
              />
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default Stories;
