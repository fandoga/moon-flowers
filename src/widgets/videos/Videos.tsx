"use client";

import { AnimatePresence, motion } from "framer-motion";
import { StoryVideo, VideosMyResponse } from "@/entities/video";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import StarsIcon from "@/components/ui/stars-icon";
import { ArrowDown, ArrowUp, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GridVideoSkeleton,
  ModalDesktopSlideFrame,
  ModalDesktopSlideSkeleton,
  ModalTouchVideoSkeleton,
} from "@/widgets/videos/video-skeleton-ui";
import Link from "next/link";

interface VideosProps {
  data?: VideosMyResponse;
  isReviews?: boolean;
  currentPage?: number;
  pageSize?: number;
  videos?: StoryVideo[];
}

const Videos: React.FC<VideosProps> = ({
  data,
  isReviews,
  currentPage = 0,
  pageSize = 4,
  videos: propVideos,
}) => {
  const [activeVideo, setActiveVideo] = useState<StoryVideo | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredVideoId, setHoveredVideoId] = useState<number | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const desktopModalVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const desktopSlideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [desktopSlideHeights, setDesktopSlideHeights] = useState<number[]>([]);
  const wheelLockedRef = useRef(false);

  const [gridVideoReady, setGridVideoReady] = useState<Record<number, boolean>>(
    {},
  );
  const [modalDesktopReady, setModalDesktopReady] = useState<
    Record<number, boolean>
  >({});
  const [desktopVideoIntrinsic, setDesktopVideoIntrinsic] = useState<
    Record<number, { w: number; h: number }>
  >({});

  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isTouchDevice, setIsTouchDevice] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches,
  );

  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(hover: none), (pointer: coarse)");
    const handleChange = (e: MediaQueryListEvent) =>
      setIsTouchDevice(e.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!activeVideo) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [activeVideo]);

  const videos = useMemo<StoryVideo[]>(() => {
    // Use propVideos if provided (from Stories with product data), otherwise build from data
    if (propVideos && propVideos.length > 0) {
      return propVideos;
    }

    const raw = data?.items ?? [];
    return raw.reduce<StoryVideo[]>((acc, item) => {
      const id = Number(item.video_id);
      if (!id || !item.seo_url) return acc;

      acc.push({
        id,
        title: item.title || `Видео #${id}`,
        avatar: item.channel_avatar || "",
        poster: item.preview_url || item.post_image || undefined,
        user: item.channel_username || "",
      });
      return acc;
    }, []);
  }, [data, propVideos]);

  const renderedVideos = videos;

  const isVideoVisible = useCallback(
    (index: number) => {
      if (isTouchDevice) return true;
      return (
        index >= currentPage * pageSize &&
        index < currentPage * pageSize + pageSize
      );
    },
    [isTouchDevice, currentPage, pageSize],
  );

  const closeModal = () => {
    setActiveVideo(null);
    setModalDesktopReady({});
    setDesktopVideoIntrinsic({});
  };

  const markGridVideoReady = useCallback((id: number) => {
    setGridVideoReady((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  }, []);

  const markDesktopSlideReady = useCallback((index: number) => {
    setModalDesktopReady((prev) =>
      prev[index] ? prev : { ...prev, [index]: true },
    );
  }, []);

  /* =========================
     Desktop navigation
  ========================== */

  const goNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(prev + 1, videos.length - 1));
  }, [videos.length]);

  const goPrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const desktopScrollOffsetPx = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < activeIndex; i++) {
      sum += desktopSlideHeights[i] ?? 0;
    }
    return sum;
  }, [activeIndex, desktopSlideHeights]);

  useLayoutEffect(() => {
    if (!activeVideo || isTouchDevice) {
      return;
    }

    const measureSlides = () => {
      const heights = videos.map((_, index) => {
        const el = desktopSlideRefs.current[index];
        if (!el) return 0;
        return el.getBoundingClientRect().height;
      });
      setDesktopSlideHeights(heights);
    };

    measureSlides();

    const observers: ResizeObserver[] = [];
    for (let i = 0; i < videos.length; i++) {
      const el = desktopSlideRefs.current[i];
      if (!el) continue;
      const ro = new ResizeObserver(() => {
        measureSlides();
      });
      ro.observe(el);
      observers.push(ro);
    }

    window.addEventListener("resize", measureSlides);
    return () => {
      window.removeEventListener("resize", measureSlides);
      observers.forEach((o) => o.disconnect());
      setDesktopSlideHeights([]);
    };
  }, [activeVideo, isTouchDevice, videos]);

  useEffect(() => {
    if (!isTouchDevice) return;

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const hasAction = localStorage.getItem("video_swiped_hint");
            if (!hasAction) {
              setShowSwipeHint(true);
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      scrollObserver.observe(containerRef.current);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target as HTMLVideoElement;

          if (entry.isIntersecting) {
            videoElement.play().catch(() => undefined);
            return;
          }

          videoElement.pause();
          videoElement.currentTime = 0;
        });
      },
      {
        threshold: 0.6,
      },
    );

    Object.values(videoRefs.current).forEach((node) => {
      if (!node) return;
      observer.observe(node);
    });

    return () => {
      observer.disconnect();
      scrollObserver.disconnect();
    };
  }, [isTouchDevice, videos]);

  useEffect(() => {
    if (!activeVideo || isTouchDevice) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (wheelLockedRef.current) return;
      wheelLockedRef.current = true;

      if (e.deltaY > 0) goNext();
      else goPrev();

      setTimeout(() => (wheelLockedRef.current = false), 600);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeVideo, isTouchDevice, goNext]);

  useEffect(() => {
    if (!activeVideo || isTouchDevice) return;

    desktopModalVideoRefs.current.forEach((videoNode, index) => {
      if (!videoNode) return;

      if (index === activeIndex) {
        videoNode.currentTime = 0;
        videoNode.play().catch(() => undefined);
        return;
      }

      videoNode.pause();
      videoNode.currentTime = 0;
    });
  }, [activeIndex, activeVideo, isTouchDevice]);

  useEffect(() => {
    if (!activeVideo) return;
    setTimeout(() => {
      setActiveVideo(videos[activeIndex]);
      if (isTouchDevice) {
        setIsVideoLoading(true);
      }
    });
  }, [activeIndex, activeVideo, videos, isTouchDevice]);

  const handleUserAction = () => {
    if (showSwipeHint) {
      setShowSwipeHint(false);
      localStorage.setItem("video_swiped_hint", "true");
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="pointer-events-none absolute top-0 left-0 h-full w-full"
      >
        <AnimatePresence>
          {isTouchDevice && showSwipeHint && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100,
                delay: 0.5,
              }}
              className="pointer-events-none fixed right-6 top-1/2 z-[3000] -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-md"
            >
              <ChevronRight className="h-10 w-10 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {renderedVideos.map((video, videoIndex) => (
        <button
          key={video.id}
          data-video-card
          onScroll={handleUserAction}
          onTouchMove={handleUserAction}
          onMouseEnter={() => !isTouchDevice && setHoveredVideoId(video.id)}
          onMouseLeave={() => !isTouchDevice && setHoveredVideoId(null)}
          onClick={(e) => {
            e.stopPropagation();
            const index = videos.findIndex((v) => v.id === video.id);
            setModalDesktopReady({});
            setDesktopVideoIntrinsic({});
            setActiveIndex(index);
            setActiveVideo(video);
            handleUserAction();
          }}
          style={{ display: isVideoVisible(videoIndex) ? undefined : "none" }}
          className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-background text-left sm:w-full ${isReviews && !isTouchDevice ? "aspect-[10/14]" : "aspect-[9/14]"} w-screen shrink-0 snap-start sm:snap-align-none [scroll-snap-stop:always] sm:[scroll-snap-stop:normal] sm:w-auto sm:max-w-none`}
          aria-label={`Открыть видео: ${video.title}`}
        >
          {isReviews &&
            (isTouchDevice ? (
              <div className="absolute top-6 z-20 flex w-full items-center justify-between px-3">
                <div className="flex items-center gap-3">
                  <Image
                    width={10}
                    height={10}
                    className="w-8 h-8 rounded-full"
                    src={video.avatar}
                    alt="avatar_img"
                  />
                  <p className="font-sans text-white">{video.user}</p>
                </div>
                <StarsIcon color={"white"} />
              </div>
            ) : (
              <div className="relative z-20 mb-2 flex w-full items-center justify-between px-3">
                <div className="flex items-center gap-3">
                  <Image
                    width={10}
                    height={10}
                    className="w-8 h-8 rounded-full"
                    src={video.avatar}
                    alt="avatar_img"
                  />
                  <p className="font-sans">{video.user}</p>
                </div>
                <StarsIcon />
              </div>
            ))}

          <div className="relative min-h-0 w-full flex-1">
            {!gridVideoReady[video.id] && <GridVideoSkeleton />}
            <video
              ref={(node) => {
                videoRefs.current[video.id] = node;
              }}
              src={`https://interesnoitochka.ru/api/v1/videos/video/${video.id}/hls/playlist.m3u8`}
              poster={video.poster}
              muted
              loop
              autoPlay
              playsInline
              onLoadedData={() => markGridVideoReady(video.id)}
              onCanPlay={() => markGridVideoReady(video.id)}
              className={cn(
                "relative z-[2] h-full w-full cursor-pointer rounded-2xl bg-skeleton object-cover transition-opacity duration-300",
                gridVideoReady[video.id] ? "opacity-100" : "opacity-0",
              )}
            />
          </div>
          <AnimatePresence>
            {(isTouchDevice || (hoveredVideoId === video.id && !isReviews)) && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-x-0 bottom-10 z-[3] flex max-w-full items-center justify-center px-1"
              >
                {!isReviews && video.productPhoto && (
                  <Link
                    href={"/catalog/" + video.productId}
                    onClick={(e) => e.stopPropagation()}
                    className="flex w-[80%] max-w-full min-w-0 items-center justify-center"
                  >
                    <div className="min-w-0 flex-1 flex items-center text-white">
                      {/* Фотография товара */}

                      <Image
                        src={video.productPhoto}
                        alt="Product"
                        width={64}
                        height={64}
                        className="w-14 h-14 rounded-md object-cover bg-skeleton shrink-0"
                      />
                      <div className="w-full h-14 flex flex-col items-start overflow-hidden gap-1 rounded-md bg-black px-2 py-2">
                        <p className="text-sm truncate max-w-42 font-light  leading-tight">
                          {video.productName ? video.productName : video.title}
                        </p>
                        <p className="text-sm text font-light leading-tight">
                          {video.productPrice && video.productPrice + " ₽"}
                        </p>
                      </div>
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 9 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.59967 0.999814L1 7.59948M7.59967 0.999814L7.59967 6.65667M7.59967 0.999814L1.94281 0.999814"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      ))}

      {/* ================= MODAL ================= */}

      {activeVideo && (
        <div
          className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex items-center justify-center overflow-hidden"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="cursor-pointer hidden md:flex absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white items-center justify-center"
          >
            ✕
          </button>

          <div
            className="relative flex h-[80%] w-full items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              // closeModal();
            }}
          >
            {/* Desktop arrows */}
            {!isTouchDevice && (
              <div className="hidden md:flex absolute right-[25%] flex-col gap-3 z-40">
                <button
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl bg-white disabled:opacity-40"
                >
                  <ArrowUp />
                </button>
                <button
                  onClick={goNext}
                  disabled={activeIndex === videos.length - 1}
                  className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl bg-white disabled:opacity-40"
                >
                  <ArrowDown />
                </button>
              </div>
            )}

            {/* REELS STACK */}
            {!isTouchDevice ? (
              <div className="relative flex h-full w-full min-h-0 max-w-[min(52vh,100vw)] flex-col items-center">
                <motion.div
                  animate={{
                    y: -desktopScrollOffsetPx,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 20,
                  }}
                  className="absolute top-0 left-0 w-full flex flex-col items-stretch will-change-transform"
                >
                  {videos.map((video, index) => (
                    <div
                      key={video.id}
                      ref={(node) => {
                        desktopSlideRefs.current[index] = node;
                      }}
                      className="flex w-full shrink-0 justify-center px-2 pb-8 box-border"
                    >
                      <motion.div
                        animate={{
                          opacity: index === activeIndex ? 1 : 0.5,
                          scale:
                            index === activeIndex
                              ? 1
                              : modalDesktopReady[index]
                                ? 0.95
                                : 1,
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.33, 1, 0.68, 1],
                        }}
                        className="origin-center will-change-transform"
                      >
                        <ModalDesktopSlideFrame
                          intrinsic={
                            modalDesktopReady[index]
                              ? (desktopVideoIntrinsic[index] ?? null)
                              : null
                          }
                        >
                          {!modalDesktopReady[index] && (
                            <ModalDesktopSlideSkeleton />
                          )}
                          <video
                            ref={(node) => {
                              desktopModalVideoRefs.current[index] = node;
                            }}
                            src={`https://interesnoitochka.ru/api/v1/videos/video/${video.id}/hls/playlist.m3u8`}
                            poster={video.poster}
                            autoPlay={index === activeIndex}
                            loop
                            playsInline
                            onLoadedMetadata={(e) => {
                              const el = e.currentTarget;
                              const w = el.videoWidth;
                              const h = el.videoHeight;
                              if (w > 0 && h > 0) {
                                setDesktopVideoIntrinsic((prev) => ({
                                  ...prev,
                                  [index]: { w, h },
                                }));
                              }
                            }}
                            onLoadedData={() => {
                              markDesktopSlideReady(index);
                            }}
                            onCanPlay={() => {
                              markDesktopSlideReady(index);
                            }}
                            className={cn(
                              "relative z-[2] h-full w-full object-cover transition-opacity duration-300",
                              modalDesktopReady[index]
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </ModalDesktopSlideFrame>
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </div>
            ) : (
              <>
                {/* Левая зона клика на предыдущее видео */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-0 top-0 w-[30%] h-full z-20 bg-transparent"
                />

                {/* Правая зона клика на следующее видео */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-0 top-0 w-[30%] h-full z-20 bg-transparent"
                />

                <div className="relative w-full max-w-full">
                  {isVideoLoading && <ModalTouchVideoSkeleton />}
                  <video
                    key={activeVideo.id}
                    ref={activeVideoRef}
                    src={`https://interesnoitochka.ru/api/v1/videos/video/${activeVideo.id}/hls/playlist.m3u8`}
                    poster={activeVideo.poster}
                    autoPlay
                    loop
                    playsInline
                    onLoadedData={() => setIsVideoLoading(false)}
                    onCanPlay={() => setIsVideoLoading(false)}
                    onWaiting={() => setIsVideoLoading(true)}
                    onMouseDown={() => activeVideoRef.current?.pause()}
                    onMouseUp={() => activeVideoRef.current?.play()}
                    onMouseLeave={() => activeVideoRef.current?.play()}
                    onTouchStart={() => activeVideoRef.current?.pause()}
                    onTouchEnd={() => activeVideoRef.current?.play()}
                    className={cn(
                      "relative z-[5] w-full rounded-xl object-contain select-none",
                      isVideoLoading && "opacity-0",
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Videos;
