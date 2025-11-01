import Link from "next/link";
import clsx from "clsx";

const IMG =
  "https://i.pinimg.com/1200x/dc/28/77/dc2877f08ba923ba34c8fa70bae94128.jpg";

type Product = {
  id: string;
  name: string;
  price: number;
  href: string;
  image?: string;
};

const CURRENCY = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    n
  );

const SAMPLE: Product[] = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i + 1),
  name: `Essential T-Shirt ${i + 1}`,
  price: 899000 + i * 50000,
  href: `/product/${i + 1}`,
  image: IMG,
}));

export default function NewArrival({ items = SAMPLE }: { items?: Product[] }) {
  return (
    <section className="mx-auto container md:px-4 py-16 md:py-20 bg-white">
      {/* Header Section: Black & White Styling */}
      <div className="flex items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl uppercase">
            New Arrivals
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            The latest collection, crafted for you.
          </p>
        </div>
        
        {/* CTA Button: Black Solid */}
        <Link
          href="/product?sort=new"
          className="rounded-lg bg-black px-5 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-gray-800 border-2 border-black"
        >
          Shop All
        </Link>
      </div>

      <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <Link
            key={p.id}
            href={p.href}
            // Card Style: Minimalis, tanpa border tebal/shadow berlebihan. Fokus pada hover state.
            className="group block transition-all duration-300 relative"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[3/4] bg-gray-50 border border-gray-100">
              <img
                src={p.image ?? IMG}
                alt={p.name}
                // Styling gambar: grayscale tipis, scale-up on hover
                className="h-full w-full object-cover grayscale-[10%] transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* 'New' Tag: Black & White Styling */}
              <span className="absolute left-0 top-0 inline-flex items-center rounded-br-lg bg-black px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                New
              </span>
            </div>
            
            {/* Product Details */}
            <div className="mt-4 flex flex-col">
              <h3 className="line-clamp-1 text-base font-semibold text-black uppercase tracking-wide">
                {p.name}
              </h3>
              {/* Price: Black and Bold */}
              <p className="mt-1 text-lg font-extrabold text-black">
                {CURRENCY(p.price)}
              </p>
            </div>
            
             {/* Subtle Underline Hover Effect */}
             <span className="absolute bottom-0 left-0 h-[1px] w-full bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}