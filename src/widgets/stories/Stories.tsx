"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { StoryVideo, useMyVideos } from "@/entities/video";
import Videos from "../videos/Videos";
import Logo from "@/components/ui/logo";

const Stories = () => {
  const { data } = useMyVideos({ limit: 15 });
  const [currentPage, setCurrentPage] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(
    (typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches) ||
      false,
  );
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(hover: none), (pointer: coarse)");

    const handleChange = (event: MediaQueryListEvent) => {
      setIsTouchDevice(event.matches);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const videos = useMemo<StoryVideo[]>(() => {
    const raw = data?.items ?? [];
    const normalized = raw.reduce<StoryVideo[]>((acc, item) => {
      const id = Number(item.video_id);
      const srcCandidate = item.seo_url;

      if (!id || !srcCandidate) return acc;

      acc.push({
        id,
        title: typeof item.title === "string" ? item.title : `Видео #${id}`,
        src: srcCandidate,
        avatar: item.channel_avatar || "",
        poster:
          typeof item.preview_url === "string"
            ? item.preview_url
            : typeof item.post_image === "string"
              ? item.post_image
              : undefined,
      });
      return acc;
    }, []);

    return normalized;
  }, [data]);

  const pageSize = 4;
  const totalPages = Math.ceil(videos.length / pageSize);
  const visibleVideos = useMemo(
    () =>
      videos.slice(currentPage * pageSize, currentPage * pageSize + pageSize),
    [videos, currentPage, pageSize],
  );
  const renderedVideos = isTouchDevice ? videos : visibleVideos;

  useEffect(() => {
    if (!isTouchDevice) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => undefined);
            return;
          }
          video.pause();
          video.currentTime = 0;
        });
      },
      { threshold: 0.65 },
    );

    renderedVideos.forEach((video) => {
      const element = videoRefs.current[video.id];
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isTouchDevice, renderedVideos]);

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
        ) : renderedVideos.length === 0 ? (
          <div className="w-full py-16 text-center text-lg text-[#394426]">
            {data?.error || "Видео пока недоступны"}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="-mx-4 flex sm:mx-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory pb-2 sm:pb-0"
          >
            <Videos data={data} />
          </motion.div>
        )}

        {/* {!isTouchDevice && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <button
                key={pageIndex}
                type="button"
                onClick={() => setCurrentPage(pageIndex)}
                className={`h-2.5 w-2.5 cursor-pointer rounded-full transition-colors ${
                  pageIndex === currentPage ? "bg-[#394426]" : "bg-[#394426]/30"
                }`}
                aria-label={`Перейти на страницу ${pageIndex + 1}`}
              />
            ))}
          </div>
        )} */}
      </div>
    </section>
  );
};

export default Stories;
