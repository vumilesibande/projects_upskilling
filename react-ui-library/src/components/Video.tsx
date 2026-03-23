"use client";

export type VideoType = "mp4" | "youtube";

export interface VideoProps {
  type: VideoType;
  src: string;
  title: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
}

function getYoutubeEmbedUrl(src: string) {
  if (src.includes("/embed/")) {
    return src;
  }

  try {
    const url = new URL(src);
    const videoId =
      url.searchParams.get("v") ??
      url.pathname.split("/").filter(Boolean).pop() ??
      "";

    if (!videoId) return src;

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return `https://www.youtube.com/embed/${src}`;
  }
}

export function Video({
  type,
  src,
  title,
  poster,
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
  className = "",
}: VideoProps) {
  if (type === "youtube") {
    const embedUrl = getYoutubeEmbedUrl(src);

    return (
      <div className={`overflow-hidden rounded-2xl bg-slate-950 ${className}`}>
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl bg-slate-950 ${className}`}>
      <video
        className="aspect-video w-full"
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        poster={poster}
        playsInline
      >
        <source src={src} type="video/mp4" />
        Your browser does not support MP4 playback.
      </video>
    </div>
  );
}
