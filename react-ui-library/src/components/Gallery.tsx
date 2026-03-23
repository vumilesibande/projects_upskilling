"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Video, VideoType } from "./Video";

export interface GalleryImageItem {
  id: string;
  type: "image";
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface GalleryVideoItem {
  id: string;
  type: "video";
  videoType: VideoType;
  src: string;
  title: string;
  poster?: string;
  thumbnailSrc?: string;
}

export type GalleryItem = GalleryImageItem | GalleryVideoItem;

export interface GalleryProps {
  items: GalleryItem[];
  initialIndex?: number;
  className?: string;
  thumbnailClassName?: string;
}

function getYoutubeThumbnail(src: string) {
  try {
    const url = new URL(src);
    const videoId =
      url.searchParams.get("v") ??
      url.pathname.split("/").filter(Boolean).pop() ??
      "";

    if (!videoId) return "";
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  } catch {
    if (!src) return "";
    return `https://img.youtube.com/vi/${src}/hqdefault.jpg`;
  }
}

export function Gallery({
  items,
  initialIndex = 0,
  className = "",
  thumbnailClassName = "",
}: GalleryProps) {
  const safeIndex = useMemo(() => {
    if (!items.length) return 0;
    return Math.min(Math.max(initialIndex, 0), items.length - 1);
  }, [initialIndex, items.length]);
  const [activeIndex, setActiveIndex] = useState(safeIndex);

  if (!items.length) return null;

  const activeItem = items[activeIndex] ?? items[0];
  const activeVideoPoster =
    activeItem.type === "video"
      ? activeItem.poster ||
        (activeItem.videoType === "youtube"
          ? getYoutubeThumbnail(activeItem.src)
          : "")
      : "";

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-100">
          {activeItem.type === "image" ? (
            <Image
              src={activeItem.src}
              alt={activeItem.alt}
              width={activeItem.width}
              height={activeItem.height}
              className="h-full w-full rounded-xl object-cover"
            />
          ) : (
            <Video
              type={activeItem.videoType}
              src={activeItem.src}
              title={activeItem.title}
              poster={activeVideoPoster || undefined}
              className="w-full"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-xl border bg-white text-left transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isActive
                  ? "border-sky-500 ring-2 ring-sky-200"
                  : "border-slate-200 hover:border-slate-300"
              } ${thumbnailClassName}`}
              aria-pressed={isActive}
              aria-label={`Show media item ${index + 1}`}
            >
              <div className="relative aspect-video bg-slate-100">
                {item.type === "image" ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    className="h-full w-full object-cover"
                  />
                ) : item.thumbnailSrc ? (
                  <Image
                    src={item.thumbnailSrc}
                    alt={item.title}
                    width={640}
                    height={360}
                    className="h-full w-full object-cover"
                  />
                ) : item.poster ? (
                  <Image
                    src={item.poster}
                    alt={item.title}
                    width={640}
                    height={360}
                    className="h-full w-full object-cover"
                  />
                ) : item.videoType === "youtube" ? (
                  <Image
                    src={getYoutubeThumbnail(item.src)}
                    alt={item.title}
                    width={640}
                    height={360}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-900 px-3 text-center text-sm font-medium text-white">
                    MP4 video
                  </div>
                )}
                {item.type === "video" ? (
                  <span className="absolute bottom-2 left-2 rounded-full bg-slate-950/80 px-2 py-1 text-xs font-medium text-white">
                    Video
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
