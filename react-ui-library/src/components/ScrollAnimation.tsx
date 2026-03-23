"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

export type ScrollAnimationVariant =
  | "fadeIn"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp";

export interface ScrollAnimationProps {
  /** Content to animate into view */
  children: ReactNode;
  /** Animation style when element enters viewport */
  variant?: ScrollAnimationVariant;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Duration of the transition (ms) */
  duration?: number;
  /** How much of the element must be visible to trigger (0–1). Default 0.1 */
  threshold?: number;
  /** Root margin for the observer (e.g. "0px 0px -50px 0px" to trigger 50px early) */
  rootMargin?: string;
  /** Run animation only once (default true) */
  once?: boolean;
  /** Optional class for the wrapper */
  className?: string;
}

const variantStyles: Record<
  ScrollAnimationVariant,
  { initial: string; visible: string }
> = {
  fadeIn: {
    initial: "opacity-0",
    visible: "opacity-100",
  },
  slideUp: {
    initial: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  slideDown: {
    initial: "opacity-0 -translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  slideLeft: {
    initial: "opacity-0 translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  slideRight: {
    initial: "opacity-0 -translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  scaleUp: {
    initial: "opacity-0 scale-95",
    visible: "opacity-100 scale-100",
  },
};

export function ScrollAnimation({
  children,
  variant = "slideUp",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  rootMargin = "0px 0px -24px 0px",
  once = true,
  className = "",
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimatedRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  const { initial, visible } = variantStyles[variant];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (!once) setIsVisible(false);
          return;
        }
        if (once && hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        if (delay > 0) {
          timeoutId = setTimeout(() => setIsVisible(true), delay);
        } else {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [threshold, rootMargin, once, delay]);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      <div
        className={`transition-all ease-out ${
          isVisible ? visible : initial
        }`}
        style={{ transitionDuration: `${duration}ms` }}
      >
        {children}
      </div>
    </div>
  );
}
