"use client";

import { useState, useId, ReactNode } from "react";

export interface AccordionItemProps {
  /** Header label */
  title: string;
  /** Body content */
  content: ReactNode;
}

export interface AccordionProps {
  /** List of items: each has title and content */
  items: AccordionItemProps[];
  /** Allow multiple panels open at once */
  allowMultiple?: boolean;
  /** Index (or indices if allowMultiple) of initially open panel(s). 0-based. */
  defaultOpenIndex?: number | number[];
  /** Optional class for the accordion container */
  className?: string;
  /** Optional class for each item wrapper */
  itemClassName?: string;
  /** Optional class for headers */
  headerClassName?: string;
  /** Optional class for content panels */
  panelClassName?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIndex,
  className = "",
  itemClassName = "",
  headerClassName = "",
  panelClassName = "",
}: AccordionProps) {
  const baseId = useId();
  const getDefaultOpen = (): Set<number> => {
    if (defaultOpenIndex === undefined) return new Set();
    if (Array.isArray(defaultOpenIndex)) return new Set(defaultOpenIndex);
    return new Set([defaultOpenIndex]);
  };
  const [openSet, setOpenSet] = useState<Set<number>>(getDefaultOpen);

  const toggle = (index: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) next.clear();
        next.add(index);
      }
      return next;
    });
  };

  if (!items.length) return null;

  return (
    <div
      className={`divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white ${className}`}
      role="region"
      aria-label="Accordion"
    >
      {items.map((item, index) => {
        const isOpen = openSet.has(index);
        const id = `${baseId}-${index}`;
        const headerId = `${id}-header`;
        const panelId = `${id}-panel`;

        return (
          <div
            key={index}
            className={`accordion-item ${itemClassName}`}
            data-state={isOpen ? "open" : "closed"}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className={`flex w-full items-center justify-between gap-3 border-0 bg-transparent px-4 py-3 text-left text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-400 ${headerClassName}`}
              >
                <span className="font-medium">{item.title}</span>
                <span
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-slate-500 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={`overflow-hidden transition-all duration-200 ease-out ${
                isOpen ? "visible opacity-100" : "invisible h-0 opacity-0"
              }`}
            >
              <div
                className={`border-t border-slate-100 px-4 py-3 text-slate-600 ${panelClassName}`}
              >
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
