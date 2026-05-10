"use client";

import type { FC, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { StoryVideo } from "@/entities/video";

interface VideoProductInfoProps {
  video: Pick<
    StoryVideo,
    "productId" | "productName" | "productPhoto" | "productPrice" | "title"
  >;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const VideoProductInfo: FC<VideoProductInfoProps> = ({
  video,
  className,
  onClick,
}) => {
  if (!video.productPhoto || video.productId === undefined) {
    return null;
  }

  return (
    <Link
      href={`/catalog/${video.productId}`}
      onClick={onClick}
      className={cn(
        "flex w-[80%] max-w-full min-w-0 items-center justify-center",
        className,
      )}
    >
      <div className="min-w-0 flex-1 flex items-center text-white">
        <Image
          src={video.productPhoto}
          alt={video.productName ?? video.title}
          width={64}
          height={64}
          className="w-14 h-14 rounded-md object-cover bg-skeleton shrink-0"
        />
        <div className="w-full h-14 flex flex-col items-start overflow-hidden gap-1 rounded-md bg-black px-2 py-2">
          <p className="text-sm truncate max-w-42 font-light leading-tight">
            {video.productName ?? video.title}
          </p>
          {video.productPrice !== undefined && (
            <p className="text-sm text font-light leading-tight">
              {video.productPrice} ₽
            </p>
          )}
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
  );
};

export default VideoProductInfo;
