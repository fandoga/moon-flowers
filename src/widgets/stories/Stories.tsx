"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMyVideos } from "@/entities/video";
import Image from "next/image";

type StoryVideo = {
  id: number;
  title: string;
  src: string;
  poster?: string;
};

const Stories = () => {
  const { data } = useMyVideos({ limit: 15 });
  console.log(data);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeVideo, setActiveVideo] = useState<StoryVideo | null>(null);
  const [hoveredVideoId, setHoveredVideoId] = useState<number | null>(null);
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

  const handleMouseEnter = (id: number) => {
    if (isTouchDevice) return;
    setHoveredVideoId(id);
    const element = videoRefs.current[id];
    element?.play().catch(() => undefined);
  };

  const handleMouseLeave = (id: number) => {
    if (isTouchDevice) return;
    setHoveredVideoId((current) => (current === id ? null : current));
    const element = videoRefs.current[id];
    if (!element) return;
    element.pause();
    element.currentTime = 0;
  };

  const closeModal = () => setActiveVideo(null);

  return (
    <section className="pt-30 pb-5 pb-20  bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-left mb-5 md:mb-12"
        >
          <h2 className="h !text-right pb-4">
            Тот самый
            <br />
            букет из сторис
          </h2>
          <p className="p !text-right pb-12">
            Собрали все букеты из видео — теперь <br />
            вы легко найдёте и закажете в пару кликов
          </p>
        </motion.div>

        {renderedVideos.length === 0 ? (
          <div className="w-full py-16 text-center text-lg text-[#394426]">
            {data?.error || "Видео пока недоступны"}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-2 sm:pb-0"
          >
            {renderedVideos.map((video) => {
              const showInfo = isTouchDevice || hoveredVideoId === video.id;
              return (
                <button
                  key={video.id}
                  type="button"
                  onMouseEnter={() => handleMouseEnter(video.id)}
                  onMouseLeave={() => handleMouseLeave(video.id)}
                  onClick={() => setActiveVideo(video)}
                  className="group cursor-pointer relative overflow-hidden rounded-2xl bg-black/90 w-full aspect-[9/14] text-left shrink-0 snap-start sm:w-auto sm:max-w-none"
                  aria-label={`Открыть видео: ${video.title}`}
                >
                  <video
                    ref={(node) => {
                      videoRefs.current[video.id] = node;
                    }}
                    src={video.src}
                    poster={video.poster}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                  <AnimatePresence>
                    {showInfo && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="pointer-events-none absolute left-3 right-3 bottom-3 flex items-center"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/20">
                          <Image
                            src={video.poster || "/hero/background.png"}
                            alt={video.title}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1 h-12 rounded-lg bg-black px-4 py-1 text-white">
                          <p className="truncate text-md leading-tight">
                            {video.title}
                          </p>
                        </div>

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 9 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.59967 0.999814L1 7.59948M7.59967 0.999814L7.59967 6.65667M7.59967 0.999814L1.94281 0.999814"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </motion.div>
        )}

        {!isTouchDevice && totalPages > 1 && (
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
        )}
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[1px] px-4 py-6 sm:py-10"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto h-full max-w-[420px] flex items-center">
            <div
              className="relative w-full rounded-2xl overflow-hidden bg-black"
              onClick={(event) => event.stopPropagation()}
            >
              <video
                key={activeVideo.id}
                src={activeVideo.src}
                poster={activeVideo.poster}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[85vh] object-contain"
              />
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-3 right-3 rounded-full bg-black/55 px-2.5 py-1.5 text-xs text-white"
                aria-label="Закрыть видео"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Stories;
