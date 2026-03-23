"use client";

import { useState, useEffect, useCallback, ReactNode, Children } from "react";

export interface CarouselProps {
  /** Slide content (each child is one slide) */
  children: ReactNode;
  /** Auto-advance interval in ms; 0 = no autoplay */
  autoplayInterval?: number;
  /** Show prev/next arrow buttons */
  showArrows?: boolean;
  /** Show dot indicators */
  showDots?: boolean;
  /** Optional class for the carousel container */
  className?: string;
  /** Optional class for each slide wrapper */
  slideClassName?: string;
}

export function Carousel({
  children,
  autoplayInterval = 0,
  showArrows = true,
  showDots = true,
  className = "",
  slideClassName = "",
}: CarouselProps) {
  const slides = Children.toArray(children);
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((prev) => {
        if (index < 0) return total - 1;
        if (index >= total) return 0;
        return index;
      });
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (autoplayInterval <= 0 || total <= 1) return;

    const intervalId = window.setInterval(() => {
      setCurrent((previous) => (previous + 1) % total);
    }, autoplayInterval);

    return () => window.clearInterval(intervalId);
  }, [autoplayInterval, total]);

  if (total === 0) return null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-slate-100 ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      {/* Slides */}
      <div className="relative flex h-full min-h-[200px] w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${total}`}
            className={`absolute inset-0 flex w-full flex-shrink-0 items-center justify-center transition-all duration-300 ease-out ${slideClassName} ${
              index === current
                ? "translate-x-0 opacity-100"
                : index < current
                  ? "-translate-x-full opacity-0"
                  : "translate-x-full opacity-0"
            }`}
            style={{ visibility: index === current ? "visible" : "hidden" }}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Prev button */}
      {showArrows && total > 1 && (
        <button
          type="button"
          onClick={prev}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-800 shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          aria-label="Previous slide"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Next button */}
      {showArrows && total > 1 && (
        <button
          type="button"
          onClick={next}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-800 shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          aria-label="Next slide"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Dots */}
      {showDots && total > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? "w-6 bg-slate-700"
                  : "w-2 bg-white/70 hover:bg-white/90"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
