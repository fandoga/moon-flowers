"use client";

import { AnimatePresence, motion } from "framer-motion";
import { StoryVideo, VideosMyResponse } from "@/entities/video";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import StarsIcon from "@/components/ui/stars-icon";
import { ArrowDown, ArrowUp } from "lucide-react";
import Logo from "@/components/ui/logo";

interface VideosProps {
  data: VideosMyResponse;
  isReviews?: boolean;
}

const SLIDE_HEIGHT = 70; // vh

const Videos: React.FC<VideosProps> = ({ data, isReviews }) => {
  const [currentPage] = useState(0);
  const [activeVideo, setActiveVideo] = useState<StoryVideo | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredVideoId, setHoveredVideoId] = useState<number | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const desktopModalVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const wheelLockedRef = useRef(false);

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

  const videos = useMemo<StoryVideo[]>(() => {
    const raw = data?.items ?? [];
    return raw.reduce<StoryVideo[]>((acc, item) => {
      const id = Number(item.video_id);
      if (!id || !item.seo_url) return acc;

      acc.push({
        id,
        title: item.title || `Видео #${id}`,
        src: item.seo_url,
        avatar: item.channel_avatar || "",
        poster: item.preview_url || item.post_image || undefined,
      });
      return acc;
    }, []);
  }, [data]);

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

  const renderedVideos = isTouchDevice
    ? videos
    : videos.slice(currentPage * 4, currentPage * 4 + 4);

  const closeModal = () => setActiveVideo(null);

  /* =========================
     Desktop navigation
  ========================== */

  const goNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(prev + 1, videos.length - 1));
  }, [videos.length]);

  const goPrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (!isTouchDevice) return;

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
    };
  }, [isTouchDevice, renderedVideos]);

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
      setIsVideoLoading(true);
    });
  }, [activeIndex, activeVideo, videos]);

  return (
    <>
      {renderedVideos.slice(2, 6).map((video) => (
        <button
          key={video.id}
          onClick={() => {
            const index = videos.findIndex((v) => v.id === video.id);
            setActiveIndex(index);
            setActiveVideo(video);
          }}
          onMouseEnter={() => handleMouseEnter(video.id)}
          onMouseLeave={() => handleMouseLeave(video.id)}
          className={`group cursor-pointer relative overflow-hidden rounded-2xl bg-background w-screen sm:w-full ${isReviews && !isTouchDevice ? "aspect-[10/14] pt-10" : "aspect-[9/14]"} text-left shrink-0 snap-start sm:w-auto sm:max-w-none`}
          aria-label={`Открыть видео: ${video.title}`}
        >
          {isReviews &&
            (isTouchDevice ? (
              <div className="flex items-center justify-between w-full px-3 absolute top-6">
                <div className="flex items-center gap-3">
                  <Image
                    width={10}
                    height={10}
                    className="w-8 h-8 rounded-full"
                    src={video.avatar}
                    alt="avatar_img"
                  />
                  <p className="font-sans text-white">Александра М.</p>
                </div>
                <StarsIcon color={"white"} />
              </div>
            ) : (
              <div className="w-full flex justify-between items-center mb-2 px-3">
                <div className="flex items-center gap-3">
                  <Image
                    width={10}
                    height={10}
                    className="w-8 h-8 rounded-full"
                    src={video.avatar}
                    alt="avatar_img"
                  />
                  <p className="font-sans">Александра М.</p>
                </div>
                <StarsIcon />
              </div>
            ))}

          <video
            ref={(node) => {
              videoRefs.current[video.id] = node;
            }}
            src={`https://interesnoitochka.ru/api/v1/videos/video/${video.id}/hls/playlist.m3u8`}
            poster={video.poster}
            muted
            loop
            playsInline
            className="h-full w-full cursor-pointer object-cover"
          />
          <AnimatePresence>
            {hoveredVideoId === video.id && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute bottom-10 flex items-center justify-center w-full"
              >
                <div className="flex items-center justify-center w-[80%]">
                  <div className="min-w-0 flex-1 h-12 rounded-lg bg-black px-4 py-1 text-white">
                    <p className="pt-2 text-md leading-tight">{video.title}</p>
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      ))}

      {/* ================= MODAL ================= */}

      {activeVideo && (
        <div
          className="fixed inset-0 z-2000 bg-black/90 backdrop-blur-xl flex items-center justify-center overflow-hidden"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="cursor-pointer hidden md:flex absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white items-center justify-center"
          >
            ✕
          </button>

          <div
            className="relative w-full h-[80%] flex items-center justify-center"
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
              <div className="relative h-[70vh] w-full max-w-[420px]">
                {/* Фиксированный лоадер по центру */}
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-50">
                    <div className="animate-pulse">
                      <Logo color="white" alwaysEnabled />
                    </div>
                  </div>
                )}

                <motion.div
                  animate={{
                    y: `-${activeIndex * SLIDE_HEIGHT}vh`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 20,
                  }}
                  className="absolute top-0 left-0 w-full"
                >
                  {videos.map((video, index) => (
                    <div
                      key={video.id}
                      className="h-[70vh] w-full flex items-center justify-center py-6"
                    >
                      <video
                        ref={(node) => {
                          desktopModalVideoRefs.current[index] = node;
                        }}
                        src={`https://interesnoitochka.ru/api/v1/videos/video/${video.id}/hls/playlist.m3u8`}
                        poster={video.poster}
                        autoPlay={index === activeIndex}
                        loop
                        playsInline
                        onLoadedData={() =>
                          index === activeIndex && setIsVideoLoading(false)
                        }
                        onCanPlay={() =>
                          index === activeIndex && setIsVideoLoading(false)
                        }
                        className={`rounded-2xl w-full object-contain transition-opacity duration-300 ${
                          index === activeIndex
                            ? "opacity-100"
                            : "opacity-50 scale-[0.95]"
                        }`}
                      />
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
                  className="rounded-xl w-full object-contain select-none"
                />

                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="animate-pulse">
                      <Logo color="white" alwaysEnabled />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Videos;
