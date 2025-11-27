// components/sections/ProductSale.tsx
"use client";

import { useMemo } from "react"; // Hapus useEffect, useRef, useState
import Link from "next/link";
import {
  Star,
  Truck,
  ShieldCheck,
  Heart,
  ShoppingCart, // Tambahkan ShoppingCart jika diperlukan di tempat lain
} from "lucide-react";
import { useGetProductListQuery } from "@/services/product.service";
import { Product } from "@/types/admin/product";

// Hapus Swal dan useCart imports, karena modal dan checkout dihapus
// import useCart from "@/hooks/use-cart";
// import Swal from "sweetalert2";

const FALLBACK_IMG = "https://placehold.co/800x1066/efefef/444?text=Product";

// --- Salin definisi SaleItem, CURRENCY, helper functions (tidak diubah) ---

type SaleItem = {
  id: string;
  name: string;
  price: number; // after discount/current price
  was?: number; // original/compare-at (optional)
  href: string;
  image?: string;
  images?: string[];
  desc?: string;
  rating?: number; // 0..5
  reviews?: number; // jumlah ulasan
  stock?: number; // stok tersedia
  sku?: string;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
};

const CURRENCY = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (d: Date) =>
  d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

const etaRange = () => {
  const a = new Date();
  const b = new Date();
  a.setDate(a.getDate() + 2);
  b.setDate(b.getDate() + 5);
  return `${formatDate(a)} – ${formatDate(b)}`;
};

const DEF_COLORS = [
  { name: "Navy", hex: "#1f2937" },
  { name: "Black", hex: "#111827" },
  { name: "White", hex: "#F9FAFB" },
  { name: "Grey", hex: "#6b7280" },
];

const DEF_SIZES = ["S", "M", "L", "XL", "XXL"];

/* ================= Helpers mapping ================= */
function getProductImage(p: Product): string | undefined {
  const maybe = p as unknown as {
    image?: string | null;
    images?: string[] | null;
    media?: { original_url?: string }[] | null;
    thumbnail?: string | null;
  };
  return (
    maybe?.image ??
    maybe?.thumbnail ??
    (maybe?.images && maybe.images[0]) ??
    (maybe?.media && maybe.media[0]?.original_url) ??
    undefined
  );
}

function getProductSlug(p: Product): string {
  const maybe = p as unknown as { slug?: string; id?: number | string };
  return maybe?.slug ?? String(maybe?.id ?? "");
}

function getProductName(p: Product): string {
  const maybe = p as unknown as { name?: string; title?: string };
  return maybe?.name ?? maybe?.title ?? "Product";
}

function getPrices(p: Product): { price: number; was?: number } {
  const maybe = p as unknown as {
    price?: number;
    selling_price?: number;
    final_price?: number;
    compare_at_price?: number;
    original_price?: number;
    normal_price?: number;
    base_price?: number;
    was?: number;
  };
  const price =
    maybe.price ??
    maybe.selling_price ??
    maybe.final_price ??
    maybe.base_price ??
    0;

  const was =
    maybe.compare_at_price ??
    maybe.original_price ??
    maybe.normal_price ??
    maybe.was ??
    undefined;

  // Jangan tampilkan diskon bogus: jika was <= price, treat as undefined
  const safeWas = typeof was === "number" && was > price ? was : undefined;

  return { price, was: safeWas };
}

function toSaleItem(p: Product): SaleItem {
  const { price, was } = getPrices(p);
  const slug = getProductSlug(p);
  return {
    id: String((p as unknown as { id?: number | string })?.id ?? slug),
    name: getProductName(p),
    price,
    was,
    // Pastikan href mengarah ke halaman detail produk yang benar
    href: `/products/${slug}`,
    image: getProductImage(p) ?? FALLBACK_IMG,
    images: undefined,
    desc: (p as unknown as { description?: string })?.description,
    rating: (p as unknown as { rating?: number })?.rating ?? undefined,
    reviews:
      (p as unknown as { reviews_count?: number })?.reviews_count ?? undefined,
    stock: (p as unknown as { stock?: number })?.stock ?? undefined,
    sku: (p as unknown as { sku?: string })?.sku ?? undefined,
    colors: DEF_COLORS,
    sizes: DEF_SIZES,
  };
}

/* ================= Star Rating (B&W) ================= */
function StarRating({ value = 0 }: { value?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5 text-gray-800">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            className={`h-4 w-4 ${
              filled
                ? "fill-black text-black"
                : "fill-transparent text-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
}

/* ================= Component Utama ================= */
export default function ProductSale() {
  // Hapus semua state yang berhubungan dengan modal (active, activeImg, color, size, qty, refs)
  // Hapus semua useEffect yang berhubungan dengan modal

  const { data, isLoading, isError } = useGetProductListQuery({
    page: 1,
    paginate: 8,
    orderBy: "products.sales",
    order: "desc",
  });

  const items: SaleItem[] = useMemo(
    () => (data?.data ?? []).slice(0, 8).map(toSaleItem),
    [data?.data]
  );

  // Hapus total useMemo

  if (isLoading) {
    return (
      <section className="mx-auto container md:px-4 py-12 md:py-20 bg-white">
        <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-4">
          <div>
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-black md:text-4xl uppercase">
              Best Sellers
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Loading top-selling products…
            </p>
          </div>
          <div className="h-9 w-28 rounded-lg bg-gray-200" />
        </div>

        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] rounded-lg bg-gray-100" />
              <div className="mt-4 h-4 w-3/4 bg-gray-200" />
              <div className="mt-2 h-4 w-1/2 bg-gray-200" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto container md:px-4 py-12 md:py-20 bg-white">
        <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-4">
          <div>
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-black md:text-4xl uppercase">
              Best Sellers
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Gagal memuat produk terlaris. Coba muat ulang.
            </p>
          </div>
          <Link
            href="/product?sale=true"
            className="rounded-lg bg-black px-5 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-gray-800 border-2 border-black"
          >
            Lihat Semua
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto container md:px-4 py-12 md:py-20 bg-white">
      {/* Header Section */}
      <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-4">
        <div>
          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-black md:text-4xl uppercase">
            New Arrivals
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            {`Just Landed. Get Yours Before It's Gone`}
          </p>
        </div>
        <Link
          href="/product?sale=true"
          className="rounded-lg bg-black px-5 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-gray-800 border-2 border-black"
        >
          Lihat Semua
        </Link>
      </div>

      {/* Product Cards Grid */}
      <div className="mt-8 grid gap-2 md:gap-x-6 md:gap-y-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => {
          const hasDiscount = typeof p.was === "number" && p.was > p.price;
          const disc = hasDiscount
            ? Math.max(0, Math.round(((p.was! - p.price) / p.was!) * 100))
            : 0;
          return (
            // Ganti <button> menjadi <Link> dan gunakan p.href yang sudah disiapkan
            <Link
              key={p.id}
              href={p.href} // Mengarah ke /products/[slug]
              className="group text-left block focus:outline-none transition-all duration-300 relative"
            >
              <div className="relative overflow-hidden aspect-[3/4] bg-gray-50 border border-gray-100">
                <img
                  src={p.image ?? FALLBACK_IMG}
                  alt={p.name}
                  className="h-full w-full object-cover grayscale-[10%] transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {hasDiscount && (
                  <span className="absolute left-0 top-0 inline-flex items-center rounded-br-lg bg-black px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    -{disc}%
                  </span>
                )}
                {/* Hapus tombol wishlist agar tidak mengganggu Link */}
              </div>

              <div className="mt-4 flex flex-col">
                <h3 className="line-clamp-1 text-base font-semibold text-black uppercase tracking-wide">
                  {p.name}
                </h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-black">
                    {CURRENCY(p.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-500 line-through">
                      {CURRENCY(p.was!)}
                    </span>
                  )}
                </div>
              </div>

              <span className="absolute bottom-0 left-0 h-[1px] w-full bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}