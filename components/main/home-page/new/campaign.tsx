// Campaign.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Sparkles,
  Tag,
  Zap,
  Truck,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import clsx from "clsx"; // Tambahkan ini untuk class conditional

function useCountdown(target: Date) {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, finished: diff === 0 } as const;
}

export default function Campaign({
  end,
  code = "BLACKBOX20",
  percentClaimed = 52,
}: {
  end?: string | Date;
  code?: string;
  percentClaimed?: number;
}) {
  const target = useMemo(() => {
    if (end) return new Date(end);
    const d = new Date();
    d.setDate(d.getDate() + 5);
    d.setHours(23, 59, 59, 0);
    return d;
  }, [end]);

  const { days, hours, minutes, seconds, finished } = useCountdown(target);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const safePercent = Math.max(0, Math.min(100, Math.round(percentClaimed)));

  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      {/* Background - Minimalist, dark gradient for depth */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90" />
      {/* Subtle radial gradient for spotlight effect */}
      <div className="absolute inset-x-0 -top-24 -z-10 h-48 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(255,255,255,0.08),transparent)]" />

      <div className="mx-auto container px-4 py-10 sm:py-12 md:py-16 lg:py-20">
        {/* Headline */}
        <div className="flex items-center justify-center gap-2">
          {/* Sparkles icon with a subtle gold/silver touch */}
          <Sparkles className="h-5 w-5 text-gray-400" /> 
          <p className="rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-300">
            Blackboxinc Exclusive
          </p>
          <Sparkles className="h-5 w-5 text-gray-400" />
        </div>

        <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Seasonal Sale — Save Up To{" "}
          <span className="underline decoration-gray-400/50">20% Off</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-gray-400 sm:text-lg">
          Elevate your style with our limited-time offer. Use the code below at checkout.
        </p>

        {/* Grid: countdown + coupon + progress */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 max-w-5xl mx-auto">
          {/* Countdown */}
          <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-5 backdrop-blur-sm shadow-lg">
            <div className="mb-3 flex items-center gap-2 text-gray-300">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wide uppercase">
                Ends In
              </span>
            </div>
            <div className="flex items-center justify-between text-white">
              {[
                { label: "Days", value: days },
                { label: "Hours", value: hours },
                { label: "Minutes", value: minutes },
                { label: "Seconds", value: seconds },
              ].map((seg) => (
                <div key={seg.label} className="flex flex-col items-center">
                  <div className="min-w-[60px] md:min-w-[68px] rounded-lg bg-gray-800 px-3 py-2 text-center text-2xl md:text-3xl font-bold leading-none shadow-inner">
                    {String(seg.value).padStart(2, "0")}
                  </div>
                  <span className="mt-1 text-[10px] uppercase tracking-wider text-gray-500">
                    {seg.label}
                  </span>
                </div>
              ))}
            </div>
            {finished && (
              <p className="mt-4 text-center text-sm text-gray-400">
                Campaign has ended.
              </p>
            )}
          </div>

          {/* Coupon */}
          <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-5 backdrop-blur-sm shadow-lg">
            <div className="mb-3 flex items-center gap-2 text-gray-300">
              <Tag className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wide uppercase">
                Coupon Code
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-lg bg-gray-800 px-4 py-2 font-mono text-lg font-bold tracking-wider text-white select-all">
                {code}
              </span>
              <button
                onClick={onCopy}
                className={clsx(
                    "inline-flex items-center gap-2 rounded-lg border",
                    "border-gray-600 bg-gray-700 px-4 py-2 text-sm font-semibold text-white",
                    "transition-colors hover:bg-gray-600 hover:border-gray-500",
                    {"bg-black border-black": copied} // Efek saat disalin
                )}
                aria-label="Copy coupon code"
              >
                <Zap className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Apply at checkout. Terms & conditions apply.
            </p>
          </div>

          {/* Progress */}
          <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-5 backdrop-blur-sm shadow-lg">
            <div className="mb-3 flex items-center gap-2 text-gray-300">
              <Sparkles className="h-5 w-5" /> {/* Ganti Truck ke Sparkles untuk kesan 'limited' */}
              <span className="text-sm font-medium tracking-wide uppercase">
                Limited Stock
              </span>
            </div>
            <div className="relative h-10 overflow-hidden rounded-lg border border-gray-600 bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-gray-500 to-gray-400" // Gradasi abu-abu
                style={{ width: `${safePercent}%` }}
                aria-hidden
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                {safePercent}% Claimed
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Hurry! Offers are selling out fast. Don't miss out.
            </p>
          </div>
        </div>

        {/* Perks / Value Propositions */}
        <div className="mt-12 grid grid-cols-1 gap-4 text-gray-300 sm:grid-cols-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium uppercase tracking-wide">30-Day Guarantee</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-3">
            <Truck className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium uppercase tracking-wide">Worldwide Shipping</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-3">
            <Headphones className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium uppercase tracking-wide">24/7 Support</span>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/product?campaign=mid-season"
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-bold text-black transition hover:bg-gray-200 uppercase tracking-wide shadow-lg"
          >
            Shop Now
          </Link>
          <Link
            href="/how-to-order"
            className="inline-flex items-center justify-center rounded-lg border border-gray-600 bg-transparent px-8 py-3 text-base font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white uppercase tracking-wide"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}