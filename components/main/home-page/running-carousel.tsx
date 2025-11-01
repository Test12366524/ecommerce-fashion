// components/sections/RunningCarousel.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx"; // Tambahkan ini untuk class conditional

type RunningCarouselProps = {
  images?: string[];
  heightClass?: string; // e.g. "h-[320px]"
  intervalMs?: number;
  showArrows?: boolean;
  showDots?: boolean;
};

// Default images, updated to be more neutral/fashion-like if possible
// Anda bisa mengganti URL ini dengan gambar B&W Anda sendiri
const DEFAULT_IMAGES = [
  "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brtBHsuFex0OYVvL2QeijZs4TN9tB6HcnbPodI",
  "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brTTHbttWk2QS9m61VxOA4hqLglEHIpdXWi8wU",
  "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brlooWQpHmgY8fkG9iJeAzFQyqLh5pudMZH7l2",
] as const;

export default function RunningCarousel({
  images,
  heightClass = "h-[60vh]",
  intervalMs = 3500,
  showArrows = true,
  showDots = true,
}: RunningCarouselProps) {
  const items = useMemo<string[]>(() => {
    const cleaned = (images ?? []).filter(Boolean);
    return cleaned.length ? cleaned : [...DEFAULT_IMAGES];
  }, [images]);

  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  // reset index jika jumlah slide berubah
  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  // autoplay
  useEffect(() => {
    if (paused) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [items.length, intervalMs, paused]);

  const go = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + items.length) % items.length);

  return (
    <div
      className={clsx(
        `relative w-full overflow-hidden rounded-3xl ${heightClass} bg-gray-100`, // Background netral
        "shadow-xl" // Tambahkan shadow untuk kesan premium
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* slides */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((src, i) => (
          <div key={i} className="relative min-w-full">
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="h-full w-full object-cover grayscale-[20%]" // Tambahkan grayscale untuk kesan B&W
              draggable={false}
              loading="lazy"
            />
            {/* Dark overlay for mood and text readability */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* arrows */}
      {showArrows && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => go(-1)}
            // Styling panah: hitam dengan border putih, shadow lebih kuat
            className="group absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 shadow-lg ring-1 ring-white/20 backdrop-blur-sm transition-all hover:bg-black"
          >
            <ChevronLeft className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => go(1)}
            // Styling panah: hitam dengan border putih, shadow lebih kuat
            className="group absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 shadow-lg ring-1 ring-white/20 backdrop-blur-sm transition-all hover:bg-black"
          >
            <ChevronRight className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* dots */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={clsx(
                "h-2.5 w-2.5 rounded-full transition-all duration-300",
                {
                  "bg-white shadow-md ring-2 ring-gray-400": i === index, // Titik aktif: putih dengan ring abu-abu
                  "bg-gray-400/60 hover:bg-gray-300": i !== index, // Titik non-aktif: abu-abu
                }
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}