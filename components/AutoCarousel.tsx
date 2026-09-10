"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AutoCarousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const childCount = Array.isArray(children) ? children.length : 1;

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const card = track.querySelector("a, article");
    const amount = ((card as HTMLElement | null)?.offsetWidth ?? 320) + 24;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    if (direction === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  useEffect(() => {
    if (!childCount || paused) {
      return;
    }
    const timer = window.setInterval(() => scrollByCard(1), 3200);
    return () => window.clearInterval(timer);
  }, [childCount, paused]);

  return (
    <div className="relative mt-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-slate-50 to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-slate-50 to-transparent sm:w-16" />
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-900 hover:text-white"
          aria-label="Previous"
        >
          <FaChevronLeft />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-900 hover:text-white"
          aria-label="Next"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
