// components/sections/CTA.tsx
"use client";

import { useTranslation } from "@/hooks/use-translation";
import en from "@/translations/home/en"; // Asumsi file ini ada
import id from "@/translations/home/id"; // Asumsi file ini ada
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Translations (Placeholder untuk contoh)
const PLACEHOLDER_TRANSLATIONS = {
  id: {
    "cta-title-1": "Temukan Koleksi Eksklusif",
    "cta-title-2": "Yang Mendefinisikan Gaya Anda.",
    "cta-subtitle": "Waktunya merevolusi lemari pakaian Anda. Desain premium menanti.",
    "cta-btn": "Telusuri Koleksi",
  },
  en: {
    "cta-title-1": "Discover the Exclusive Collection",
    "cta-title-2": "That Defines Your Style.",
    "cta-subtitle": "It's time to revolutionize your wardrobe. Premium designs await.",
    "cta-btn": "Shop The Collection",
  },
};

// Mengganti useTranslation dengan placeholder sederhana jika hook tidak tersedia
const useTranslationPlaceholder = ({ id, en }: { id: any; en: any }) => {
  // Dalam lingkungan nyata, ini akan mengambil bahasa aktif
  return PLACEHOLDER_TRANSLATIONS.id; // Default ke ID untuk demo
};


export default function CTA() {
  // Menggunakan placeholder jika hook useTranslation asli tidak diimpor/didefinisikan
  // Jika hook asli Anda berfungsi, hapus baris di bawah dan ganti `useTranslationPlaceholder` kembali ke `useTranslation`
  const t = useTranslationPlaceholder({ id, en }); 

  return (
    <section className="relative bg-white py-12 md:py-32">
      {/* Background: Clean White */}
      
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-6 uppercase tracking-tight"
        >
          {t["cta-title-1"]} <br className="hidden sm:inline" />
          <span className="text-black border-b-4 border-black/80 pb-1">
            {t["cta-title-2"]}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-700 text-lg md:text-xl font-medium mb-10 max-w-3xl mx-auto"
        >
          {t["cta-subtitle"]}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/product"
            // Button Style: Black Solid, rounded, uppercase
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-black text-white text-lg font-bold rounded-lg shadow-xl hover:bg-gray-800 transition-all uppercase tracking-wider"
          >
            {t["cta-btn"]}
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          {/* Optional: Tambahkan secondary CTA */}
          <Link
            href="/about"
            className="mt-4 md:mt-0 md:ml-6 block md:inline-block px-10 py-4 text-black text-lg font-semibold rounded-lg hover:text-gray-700 transition"
          >
            Pelajari Lebih Lanjut
          </Link>

        </motion.div>
      </div>
    </section>
  );
}