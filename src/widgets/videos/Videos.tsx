import { AnimatePresence, motion } from "framer-motion";
import { StoryVideo, VideosMyResponse } from "@/entities/video";
import Image from "next/image";

import React, { useEffect, useMemo, useRef, useState } from "react";
import StarsIcon from "@/components/ui/stars-icon";

interface VideosProps {
  data: VideosMyResponse;
  isReviews?: boolean;
}

const Videos: React.FC<VideosProps> = ({ data, isReviews }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeVideo, setActiveVideo] = useState<StoryVideo | null>(null);
  const [hoveredVideoId, setHoveredVideoId] = useState<number | null>(null);
  const [activeProgress, setActiveProgress] = useState(0);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
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

  const pauseActive = () => {
    if (!isTouchDevice) return;
    activeVideoRef.current?.pause();
  };

  const playActive = () => {
    if (!isTouchDevice) return;
    activeVideoRef.current?.play().catch(() => undefined);
  };

  return (
    <>
      {renderedVideos.map((video) => {
        const showInfo = isTouchDevice || hoveredVideoId === video.id;
        return (
          <button
            key={video.id}
            type="button"
            onMouseEnter={() => handleMouseEnter(video.id)}
            onMouseLeave={() => handleMouseLeave(video.id)}
            onClick={() => {
              setActiveProgress(0);
              setActiveVideo(video);
            }}
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
              src={
                "https://static.vecteezy.com/system/resources/previews/018/761/261/mp4/white-flowers-at-sunset-in-summer-free-video.mp4"
              }
              poster={video.poster}
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover rounded-t-2xl"
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

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-[1px] py-6 sm:py-10"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto w-full h-full flex items-center">
            <div
              className="relative w-full overflow-hidden bg-black"
              onClick={(event) => event.stopPropagation()}
            >
              {/* progress bar (stories-style) */}
              <div className="pointer-events-none absolute left-3 right-3 top-3 z-10 h-1 rounded-full bg-white/25 overflow-hidden">
                <div
                  className="h-full bg-white transition-[width] duration-150 ease-linear"
                  style={{
                    width: `${Math.min(1, Math.max(0, activeProgress)) * 100}%`,
                  }}
                />
              </div>
              <video
                key={activeVideo.id}
                ref={activeVideoRef}
                src={
                  "https://static.vecteezy.com/system/resources/previews/018/761/261/mp4/white-flowers-at-sunset-in-summer-free-video.mp4"
                }
                poster={activeVideo.poster}
                autoPlay
                playsInline
                muted
                loop
                preload="metadata"
                onLoadedMetadata={() => {
                  setActiveProgress(0);
                  // autoplay on mobile can be flaky; retry play
                  playActive();
                }}
                onTimeUpdate={(e) => {
                  const el = e.currentTarget;
                  const duration = Number.isFinite(el.duration)
                    ? el.duration
                    : 0;
                  if (!duration) return;
                  setActiveProgress(el.currentTime / duration);
                }}
                onTouchStart={pauseActive}
                onTouchEnd={playActive}
                onTouchCancel={playActive}
                className="w-full max-h-[100vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Videos;
