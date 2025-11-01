// components/sections/AboutStore.tsx
import Image from "next/image";
import { ShieldCheck, Truck, Sparkles, Diamond } from "lucide-react"; // Mengganti Sparkles dengan Diamond untuk kesan premium

// Gunakan gambar yang lebih sesuai dengan B&W jika memungkinkan
const IMG =
  "https://i.pinimg.com/1200x/dc/28/77/dc2877f08ba923ba34c8fa70bae94128.jpg";

export default function AboutStore() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background: Clean White/Off-White */}
      <div className="absolute inset-0 -z-10 bg-white" />
      
      <div className="mx-auto container md:px-4 py-12 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Kolom Kiri: Teks & Value Propositions */}
          <div>
            {/* Tagline - B&W Style: Abu-abu gelap, border hitam tipis */}
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-700 ring-1 ring-gray-300">
              <Diamond className="h-3.5 w-3.5 text-black" />
              OUR COMMITMENT
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
              Blackboxinc — Timeless Style, Uncompromised Quality.
            </h2>
            <p className="mt-5 text-base text-gray-700 md:text-lg">
              We meticulously curate fashion products with high quality standards and **timeless design**. Our mission is simple: empower you to feel confident every day, effortlessly.
            </p>
            
            {/* Value Propositions - Clean List */}
            <ul className="mt-8 grid gap-4 text-base font-medium text-black sm:grid-cols-2">
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-black" />
                Guaranteed quality & authenticity
              </li>
              <li className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-black" />
                Fast & secure worldwide shipping
              </li>
              <li className="flex items-center gap-3">
                <Diamond className="h-5 w-5 text-black" />
                Curated new arrivals weekly
              </li>
            </ul>
          </div>
          
          {/* Kolom Kanan: Gambar */}
          <div className="relative order-first md:order-last">
            {/* Background blur/shadow dihilangkan. Ganti dengan border hitam/shadow tegas */}
            
            <div className="overflow-hidden rounded-2xl border-4 border-black shadow-2xl">
              <Image
                src={IMG}
                alt="Tentang Blackboxinc Fashion Store"
                width={1200}
                height={900}
                className="h-[380px] w-full object-cover md:h-[500px] grayscale-[10%]" // Tambahkan grayscale untuk efek B&W
                priority
              />
            </div>
            
            {/* Detail tambahan/overlay jika diperlukan */}
            <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-2 backdrop-blur-sm text-sm font-semibold text-black shadow-md">
                Est. 2024
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}