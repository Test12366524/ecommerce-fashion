"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Calendar,
  HelpCircle,
  FileQuestion,
  SearchX,
  Info,
} from "lucide-react";

import { fredoka, sniglet } from "@/lib/fonts";
import DotdLoader from "@/components/loader/3dot";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { getEncryptedTransactionId } from "@/app/actions/security";

// Importing the service hook to fetch data from the API
import { useGetPublicTransactionByReferenceQuery } from "@/services/public-transactions.service";

// --- TIPE DATA ---
type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSED"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

interface TrackResult {
  id: number;
  reference: string;
  status: OrderStatus;
  created_at: string;
  grand_total: number;
  resi_number?: string;
  courier: string;
  service: string;
  buyer_name: string;
  buyer_address: string;
  items: {
    id: number;
    name: string;
    image: string;
    qty: number;
    price: number;
  }[];
  history: {
    status: OrderStatus;
    description: string;
    date: string;
  }[];
}

interface Product {
  id: number;
  name: string;
  image: string;
}

interface TransactionDetail {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export default function TrackOrderPage() {
  const router = useRouter();

  // --- STATE ---
  const [searchCode, setSearchCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // New state untuk mendeteksi apakah sudah pernah mencari
  const [result, setResult] = useState<TrackResult | null>(null);
  const [encryptedPaymentId, setEncryptedPaymentId] = useState<string | null>(
    null
  );

  // Service hook
  const {
    data: transactionData,
    isLoading: isFetching,
    isError,
  } = useGetPublicTransactionByReferenceQuery(searchCode, {
    skip: !searchCode,
  });

  // Efek samping untuk generate encrypted ID setiap kali result berubah
  useEffect(() => {
    const generateEncryptedId = async () => {
      if (result && result.id) {
        const res = await getEncryptedTransactionId(result.id);
        if (res.success && res.data) {
          setEncryptedPaymentId(res.data);
        }
      }
    };

    generateEncryptedId();
  }, [result]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchCode.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Masukkan kode transaksi terlebih dahulu!",
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true); // Tandai bahwa user sudah menekan tombol cari
    setResult(null);

    // Simulasi delay sedikit agar UX loading terasa (opsional)
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (transactionData) {
      const mockData: TrackResult = {
        id: transactionData.id,
        reference: transactionData.reference,
        status: transactionData.status === 0 ? "PENDING" : "SHIPPED",
        created_at: transactionData.created_at,
        grand_total: transactionData.grand_total,
        resi_number: transactionData.resi_number,
        courier: transactionData.stores?.[0]?.courier || "",
        service: transactionData.stores?.[0]?.shipment_detail || "",
        buyer_name: transactionData.guest_name,
        buyer_address: transactionData.address_line_1,
        items:
          transactionData.stores?.[0]?.details.map(
            (detail: TransactionDetail) => ({
              id: detail.id,
              name: detail.product.name,
              image: detail.product.image,
              qty: detail.quantity,
              price: detail.price,
            })
          ) || [],
        history: [
          {
            status: "PENDING",
            description: "Pesanan dibuat, menunggu pembayaran",
            date: new Date().toISOString(),
          },
          {
            status: "PAID",
            description: "Pembayaran diterima",
            date: new Date().toISOString(),
          },
          // ... logic history lainnya
        ],
      };
      setResult(mockData);
    } else {
      // Jika data tidak ditemukan di API (atau API error)
      // Tidak perlu Swal, cukup biarkan UI 'Not Found' di bawah yang muncul
    }

    setIsLoading(false);
  };

  // --- HELPER UTILS ---
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-gray-300 text-gray-700 border-gray-400";
      case "PAID":
        return "bg-gray-300 text-gray-700 border-gray-400";
      case "PROCESSED":
        return "bg-gray-300 text-gray-700 border-gray-400";
      case "SHIPPED":
        return "bg-gray-300 text-gray-700 border-gray-400";
      case "COMPLETED":
        return "bg-gray-300 text-gray-700 border-gray-400";
      case "CANCELLED":
        return "bg-gray-300 text-gray-700 border-gray-400";
      default:
        return "bg-gray-300 text-gray-700 border-gray-400";
    }
  };

  const getStepStatus = (step: string, currentStatus: OrderStatus) => {
    const order = ["PENDING", "PAID", "PROCESSED", "SHIPPED", "COMPLETED"];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(step);

    if (currentStatus === "CANCELLED") return "inactive";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "inactive";
  };

  return (
    <div className={`min-h-screen bg-white pt-24 pb-12 ${sniglet.className}`}>
      <div className="container mx-auto px-6 lg:px-12">
        {/* TITLE SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full mb-4">
            <Truck className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              Lacak Kiriman
            </span>
          </div>
          <h1
            className={`text-4xl font-bold text-black mb-4 ${fredoka.className}`}
          >
            Lacak Status <span className="text-gray-700">Pesanan Anda</span>
          </h1>
          <p className="text-gray-500">
            Masukkan Kode Transaksi (contoh: TRX-2025...) yang dikirimkan ke
            email Anda untuk mengetahui posisi paket terkini.
          </p>
        </div>

        {/* SEARCH FORM */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative group">
            <div className="relative z-10">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-gray-700 transition-colors" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Masukkan Kode Transaksi..."
                className="w-full pl-14 pr-32 py-5 rounded-full border-2 border-gray-200 focus:border-gray-700 focus:ring-4 focus:ring-gray-300/20 shadow-lg text-lg outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-2 bottom-2 bg-gray-700 text-white px-6 rounded-full font-bold hover:bg-gray-800/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Mencari..." : "Lacak"}
              </button>
            </div>
            {/* Decorative shadow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-300/20 to-gray-300/20 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
          </form>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="min-h-[400px]">
          {/* 1. LOADING STATE */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
              <DotdLoader />
              <p className="mt-4 text-gray-500 font-medium">
                Sedang mencari data transaksi...
              </p>
            </div>
          )}

          {/* 2. INITIAL STATE (Belum mencari) */}
          {!isLoading && !hasSearched && (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileQuestion className="w-10 h-10 text-gray-700" />
              </div>
              <h3
                className={`text-2xl font-bold text-black mb-3 ${fredoka.className}`}
              >
                Belum Melacak Pesanan?
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Silakan masukkan <strong>Kode Referensi (TRX-...)</strong>{" "}
                {`yang Anda dapatkan pada halaman "Terima Kasih" atau yang kami kirimkan melalui Email/WhatsApp.`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                    <Search className="w-4 h-4 text-gray-600" />
                  </div>
                  <h4 className="font-bold text-black text-sm mb-1">
                    1. Masukkan Kode
                  </h4>
                  <p className="text-xs text-gray-500">
                    Input kode transaksi dengan benar.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                    <Truck className="w-4 h-4 text-gray-600" />
                  </div>
                  <h4 className="font-bold text-black text-sm mb-1">
                    2. Cek Status
                  </h4>
                  <p className="text-xs text-gray-500">
                    Lihat posisi terkini paket Anda.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="w-4 h-4 text-gray-600" />
                  </div>
                  <h4 className="font-bold text-black text-sm mb-1">
                    3. Selesai
                  </h4>
                  <p className="text-xs text-gray-500">
                    Paket diterima dengan aman.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. NOT FOUND STATE (Sudah mencari tapi hasil kosong) */}
          {!isLoading && hasSearched && !result && (
            <div className="max-w-2xl mx-auto bg-gray-100 rounded-3xl p-8 border border-gray-100 text-center animate-shake">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchX className="w-8 h-8 text-gray-500" />
              </div>
              <h3
                className={`text-xl font-bold text-black mb-2 ${fredoka.className}`}
              >
                Data Tidak Ditemukan
              </h3>
              <p className="text-gray-600 mb-6">
                Maaf, kami tidak dapat menemukan data transaksi dengan kode{" "}
                <br />
                <span className="font-mono font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded-md mx-1">
                  {searchCode}
                </span>
              </p>
              <div className="bg-white p-4 rounded-xl text-left border border-gray-100 inline-block w-full md:w-auto">
                <h4 className="font-bold text-black text-sm mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-400" /> Tips Pencarian:
                </h4>
                <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                  <li>Pastikan kode transaksi sudah benar (Case Sensitive).</li>
                  <li>Periksa kembali email konfirmasi pesanan Anda.</li>
                  <li>Hubungi admin jika Anda yakin sudah membayar.</li>
                </ul>
              </div>
            </div>
          )}

          {/* 4. RESULT SECTION (Data Ditemukan) */}
          {!isLoading && result && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              {/* Header Card */}
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-lg border border-gray-100 mb-6">
                {/* ... (Kode Card Header sama seperti sebelumnya) ... */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Kode Transaksi</p>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-black">
                        {result.reference}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                          result.status
                        )}`}
                      >
                        {result.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500 mb-1">
                      Tanggal Pemesanan
                    </p>
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {format(
                        new Date(result.created_at),
                        "dd MMM yyyy, HH:mm",
                        {
                          locale: idLocale,
                        }
                      )}
                    </div>
                  </div>
                </div>

                {/* Alert if Pending */}
                {result.status === "PENDING" && (
                  <div className="bg-gray-100 border border-gray-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="font-bold text-gray-800">
                          Menunggu Pembayaran
                        </p>
                        <p className="text-sm text-gray-700">
                          Pesanan belum dibayar. Silakan upload bukti transfer.
                        </p>
                      </div>
                    </div>

                    {/* Logic Tombol Bayar dengan Encrypted ID */}
                    {encryptedPaymentId ? (
                      <Link
                        // Menggunakan encodeURIComponent agar karakter spesial (:, +) di string enkripsi aman di URL
                        href={`/guest/transaction/${encodeURIComponent(
                          encryptedPaymentId
                        )}`}
                        className="bg-gray-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap shadow-lg shadow-gray-500/30"
                      >
                        Bayar Sekarang
                      </Link>
                    ) : (
                      // Tampilkan loading state pada tombol saat proses enkripsi berjalan
                      <div className="h-10 w-32 bg-gray-300 rounded-xl animate-pulse flex items-center justify-center text-gray-700 text-xs">
                        Menyiapkan...
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline Visual (Horizontal/Vertical logic sama seperti sebelumnya) */}
                <div className="relative px-4 py-4">
                  {/* ... (Kode Timeline sama seperti sebelumnya) ... */}
                  {/* Untuk menghemat tempat, saya tidak menulis ulang bagian Timeline dan History log karena tidak berubah logikanya, 
                       hanya pastikan bagian ini ada di dalam blok `!isLoading && result` */}

                  {/* Desktop Timeline Visualization (Simplified for brevity) */}
                  <div className="hidden md:flex justify-between items-center relative mb-8">
                    {/* Line Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 -translate-y-1/2 rounded-full" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-gray-500 -z-0 -translate-y-1/2 rounded-full transition-all duration-1000"
                      style={{
                        width:
                          result.status === "COMPLETED"
                            ? "100%"
                            : result.status === "SHIPPED"
                            ? "75%"
                            : result.status === "PROCESSED"
                            ? "50%"
                            : result.status === "PAID"
                            ? "25%"
                            : "0%",
                      }}
                    />
                    {[
                      { key: "PENDING", label: "Dibuat", icon: Package },
                      { key: "PAID", label: "Dibayar", icon: CreditCard },
                      { key: "PROCESSED", label: "Diproses", icon: Clock },
                      { key: "SHIPPED", label: "Dikirim", icon: Truck },
                      { key: "COMPLETED", label: "Selesai", icon: CheckCircle },
                    ].map((step, idx) => {
                      const status = getStepStatus(step.key, result.status);
                      const isActive =
                        status === "current" || status === "completed";
                      return (
                        <div
                          key={idx}
                          className="relative z-10 flex flex-col items-center bg-white px-2"
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-4 mb-3 transition-all duration-300 ${
                              isActive
                                ? "border-gray-700 bg-gray-700 text-white"
                                : "border-gray-200 bg-gray-100 text-gray-400"
                            }`}
                          >
                            <step.icon className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-sm font-bold ${
                              isActive ? "text-gray-700" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2 Columns: Shipping & Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Info */}
                <div className="bg-white rounded-3xl p-6 shadow-lg h-full">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-700" /> Informasi
                    Pengiriman
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-gray-500 text-xs mb-1">Penerima</p>
                      <p className="font-bold text-gray-900">
                        {result.buyer_name}
                      </p>
                      <p className="text-gray-600 mt-1">
                        {result.buyer_address}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                      <div>
                        <p className="text-gray-500 text-xs">Ekspedisi</p>
                        <p className="font-bold text-gray-900 text-lg">
                          {result.courier.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {result.service}
                        </p>
                      </div>
                      {result.resi_number && (
                        <div className="text-right">
                          <p className="text-gray-500 text-xs">No. Resi</p>
                          <p className="font-mono font-bold text-gray-700">
                            {result.resi_number}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Info */}
                <div className="bg-white rounded-3xl p-6 shadow-lg h-full">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-gray-700" /> Detail
                    Produk
                  </h3>
                  <div className="space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                    {result.items.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <div className="w-14 h-14 relative flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-xl bg-gray-100"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800 line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.qty} x Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <p className="font-bold text-gray-700 text-sm">
                          Rp {(item.qty * item.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Total Belanja
                    </span>
                    <span className="text-xl font-bold text-gray-700">
                      Rp{" "}
                      {result.items
                        .reduce(
                          (total, item) => total + item.qty * item.price,
                          0
                        )
                        .toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}