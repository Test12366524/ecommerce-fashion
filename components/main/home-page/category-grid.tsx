// components/sections/ProductCategories.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react"; // Ikon tambahan jika diperlukan

const IMG =
  "https://i.pinimg.com/1200x/dc/28/77/dc2877f08ba923ba34c8fa70bae94128.jpg";

type Category = { label: string; slug: string };

const CATS: Category[] = [
  { label: "footwear & socks", slug: "footwear-socks" },
  { label: "jackets & vests", slug: "jacket-vest" }, 
  { label: "hoodies & crewnecks", slug: "hoodie-crewneck" },
  { label: "long pants", slug: "long-pants" },
  { label: "short pants", slug: "short-pants" },
  { label: "backpacks", slug: "backpack" },
  { label: "bags", slug: "duffle-sling" },
  { label: "caps & hats", slug: "cap" },
  { label: "t-shirts", slug: "tshirt" },
  { label: "shirts & polos", slug: "shirts" },
  { label: "all women", slug: "all-women" },
];

export default function ProductCategories({
  categories = CATS,
}: {
  categories?: Category[];
}) {
  return (
    <section className="mx-auto container md:px-4 py-12 md:py-20 bg-white">
      {/* Header Section: Black & White Styling */}
      <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl uppercase">
        Shop By Category
      </h2>
      <p className="text-base text-gray-600 mt-1">
        Explore our curated collections.
      </p>

      {/* Category Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/product?category=${encodeURIComponent(c.slug)}`}
            // Card Style: Minimalis, border halus abu-abu
            className="group relative overflow-hidden rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-black"
          >
            {/* Image */}
            <img
              src={IMG}
              alt={c.label}
              // Efek gambar: grayscale, scale-up on hover
              className="h-48 w-full object-cover grayscale-[15%] transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Dark Overlay for Text Contrast (Black & White style) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Category Label */}
            <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between">
              <span className="text-lg font-extrabold uppercase tracking-widest text-white drop-shadow-md">
                {c.label}
              </span>
              {/* Ikon panah putih untuk navigasi */}
              <ChevronRight className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
      
      {/* CTA Bottom (Optional: jika ada kategori lebih banyak) */}
      <div className="mt-10 text-center">
        <Link
          href="/product"
          className="inline-flex items-center gap-2 rounded-lg border border-black bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
        >
          Lihat Semua Kategori
        </Link>
      </div>
    </section>
  );
}