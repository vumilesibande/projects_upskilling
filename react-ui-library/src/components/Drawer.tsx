"use client";

import { ReactNode, useEffect, useId, useRef } from "react";

export type DrawerSide = "left" | "right";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
}

const sideClasses: Record<DrawerSide, string> = {
  left: "mr-auto",
  right: "ml-auto",
};

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  description,
  children,
  className = "",
  closeOnOverlayClick = true,
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex bg-slate-950/60"
      onClick={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={`flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl focus:outline-none ${sideClasses[side]} ${className}`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title ? (
              <h2 id={titleId} className="text-xl font-semibold text-slate-900">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p id={descriptionId} className="text-sm text-slate-600">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Close drawer"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
