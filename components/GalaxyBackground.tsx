"use client";

import { useMemo } from "react";

function randomStars(count: number, size: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${size}-${index}`,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 2.4 + Math.random() * 3.2,
    opacity: 0.4 + Math.random() * 0.6,
  }));
}

export default function GalaxyBackground() {
  const near = useMemo(() => randomStars(70, 2), []);
  const mid = useMemo(() => randomStars(140, 1), []);
  const far = useMemo(() => randomStars(220, 0), []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#000000]" />
      <div className="absolute left-[-8%] top-[18%] h-[70%] w-[46%] rounded-full bg-[radial-gradient(circle,_rgba(255,210,90,0.28)_0%,_rgba(255,160,40,0.1)_32%,_transparent_70%)] blur-2xl" />
      <div className="absolute right-[8%] top-[12%] h-[36%] w-[40%] rotate-[14deg] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.07)_0%,_transparent_68%)] blur-3xl" />

      {far.map((star) => (
        <span
          key={star.id}
          className="galaxy-twinkle absolute h-[1px] w-[1px] rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
      {mid.map((star) => (
        <span
          key={star.id}
          className="galaxy-twinkle absolute h-[2px] w-[2px] rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
      {near.map((star) => (
        <span
          key={star.id}
          className="galaxy-twinkle absolute h-[3px] w-[3px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      <span className="galaxy-shoot absolute h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent" />
      <span className="galaxy-shoot galaxy-shoot-delay absolute h-px w-32 bg-gradient-to-r from-transparent via-amber-100 to-transparent" />
    </div>
  );
}
