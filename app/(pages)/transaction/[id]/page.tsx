"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Copy,
  UploadCloud,
  CreditCard,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Package,
  ArrowLeft,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

// Importing necessary services
import {
  useGetPublicTransactionByIdQuery,
  useUpdatePublicTransactionWithFormMutation,
} from "@/services/public-transactions.service"; // Import mutation and query hooks
import Image from "next/image";
import DotdLoader from "@/components/loader/3dot";
import { formatRupiahWithRp } from "@/lib/format-utils"; // Assuming you have a utility to format Rp

export default function GuestConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string; // Fetch the transaction ID from URL params

  // State hooks
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch transaction data by ID (instead of by reference)
  const {
    data: transactionData,
    isLoading,
    isError,
  } = useGetPublicTransactionByIdQuery(transactionId); // Use the new query for transaction by ID

  // Mutation hook to update transaction with proof
  const [uploadPaymentProof] = useUpdatePublicTransactionWithFormMutation();

  useEffect(() => {
    if (transactionData) {
      // Additional logic can be added if needed when transaction data is fetched
    }
  }, [transactionData]);

  const handleCopyRekening = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: "success",
      title: "Disalin!",
      text: "Nomor rekening berhasil disalin.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // File size validation (Max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Terlalu Besar",
          text: "Maksimal ukuran file adalah 2MB",
        });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "Pilih File",
        text: "Mohon upload bukti transfer terlebih dahulu.",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Prepare the FormData for API
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("transaction_id", transactionId); // Use the transaction ID

      // Upload payment proof
      await uploadPaymentProof({ id: transactionId, formData }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Bukti pembayaran berhasil dikirim. Mohon tunggu verifikasi admin.",
        confirmButtonText: "Kembali ke Beranda",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/"); // Redirect to home
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat mengupload bukti pembayaran.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <DotdLoader />
      </div>
    );
  }

  if (isError || !transactionData) {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-br from-red-200 via-red-100 to-gray-50 p-6">
        {/* Error Icon and Message */}
        <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-xl max-w-sm w-full text-center">
          <div className="bg-red-500 p-4 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM10 5a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1zM10 9a1 1 0 00-1 1v2a1 1 0 102 0V10a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-xl font-semibold text-red-600 mb-4">
            Data Transaksi Tidak Ditemukan
          </p>
          <p className="text-gray-700 mb-6">
            Maaf, kami tidak dapat menemukan data transaksi yang Anda cari.
            Pastikan ID transaksi yang dimasukkan benar.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-red-500 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Status mapping
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
      case 2:
        return "Paid";
      case 3:
        return "Proses";
      case 4:
        return "Dikirim";
      case 5:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    transactionData.stores?.forEach((store) => {
      store.details.forEach((item) => {
        total += item.total; // Add up product total
      });
    });
    return total;
  };

  const totalProductPrice = calculateTotal();
  const totalWithShipping =
    totalProductPrice + (transactionData.shipping_cost || 0);

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full mb-4">
              <CreditCard className="w-4 h-4 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">
                {getStatusText(transactionData.status)}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Selesaikan <span className="text-gray-700">Pembayaran</span>
            </h1>
            <p className="text-gray-600">
              Order ID:{" "}
              <span className="font-mono font-bold text-gray-800">
                {transactionData.reference}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* === KOLOM KIRI: INSTRUKSI & UPLOAD === */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Informasi Rekening & Nominal */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border-l-4 border-gray-700">
              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-gray-700" />
                Transfer Pembayaran
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bank Info */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    {/* Logo Bank Dummy */}
                    <div className="w-16 h-10 bg-gray-800 rounded flex items-center justify-center text-white font-bold italic">
                      BCA
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bank Central Asia</p>
                      <p className="font-bold text-gray-900">
                        PT. KREASI ANAK BANGSA
                      </p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <p className="text-sm text-gray-500 mb-1">Nomor Rekening</p>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                      <span className="text-xl font-mono font-bold text-gray-800 tracking-wider">
                        8735089123
                      </span>
                      <button
                        onClick={() => handleCopyRekening("8735089123")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                        title="Salin"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total Info */}
                <div className="flex flex-col justify-center">
                  <p className="text-gray-600 mb-2">
                    Total yang harus dibayar:
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl lg:text-4xl font-bold text-gray-700">
                      {formatRupiahWithRp(totalWithShipping)}
                    </span>
                    <button
                      onClick={() =>
                        handleCopyRekening(totalWithShipping.toString())
                      }
                      className="text-gray-400 hover:text-gray-700"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                    <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>
                      Mohon transfer tepat hingga 3 digit terakhir untuk
                      mempercepat verifikasi otomatis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Upload Bukti Bayar */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <UploadCloud className="w-6 h-6 text-gray-700" />
                Konfirmasi Pembayaran
              </h3>

              <p className="text-gray-600 mb-6">
                Sudah melakukan transfer? Silakan upload bukti struk atau
                screenshot transfer di bawah ini.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />

                {previewUrl ? (
                  <div className="relative w-full h-64 max-w-md mx-auto">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-contain rounded-xl"
                    />
                    <div className="absolute bottom-2 right-2 bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-gray-700 shadow">
                      Ganti File
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-700">
                      <Download className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-bold text-gray-700 mb-1">
                      Klik atau Tarik File ke Sini
                    </p>
                    <p className="text-sm text-gray-500">
                      Format: JPG, PNG (Max 2MB)
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full mt-6 bg-gray-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800/90 transition-all shadow-lg shadow-gray-700/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Kirim Bukti Pembayaran
                  </>
                )}
              </button>
            </div>
          </div>

          {/* === KOLOM KANAN: DETAIL TRANSAKSI === */}
          <div className="lg:col-span-1 space-y-6">
            {/* Ringkasan Status */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <span className="text-gray-500">Tanggal Transaksi</span>
                <span className="font-bold text-gray-900">
                  {format(new Date(transactionData.created_at), "dd MMM yyyy", {
                    locale: idLocale,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold capitalize">
                  {getStatusText(transactionData.status)}
                </span>
              </div>
            </div>

            {/* Detail Pembeli & Pengiriman */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-700" />
                Info Pembeli
              </h3>
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div>
                  <p className="text-xs text-gray-400">Nama</p>
                  <p className="font-bold text-gray-800">
                    {transactionData.guest_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Kontak</p>
                  <p className="font-medium">{transactionData.guest_email}</p>
                  <p className="font-medium">{transactionData.guest_phone}</p>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 pt-4 border-t border-gray-100">
                <MapPin className="w-5 h-5 text-gray-700" />
                Alamat Pengiriman
              </h3>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                <p className="font-medium text-gray-900 mb-1">
                  {transactionData.address_line_1}
                </p>
                {transactionData.address_line_2 && (
                  <p className="mb-1">{transactionData.address_line_2}</p>
                )}
                <p>
                  {transactionData.district_name}, {transactionData.city_name}
                </p>
                <p>
                  {transactionData.province_name} {transactionData.postal_code}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg font-bold uppercase">
                  {transactionData.courier}
                </div>
                <span className="text-gray-500">{transactionData.service}</span>
              </div>
            </div>

            {/* Detail Produk */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-700" />
                Detail Produk
              </h3>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {transactionData.stores?.map((store) =>
                  store.details.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg bg-gray-100"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800 line-clamp-2">
                          {item.product.name}
                        </p>
                        <div className="flex justify-between mt-1 text-xs">
                          <span className="text-gray-500">
                            {item.quantity} x Rp{" "}
                            {formatRupiahWithRp(item.price)}
                          </span>
                          <span className="font-bold text-gray-700">
                            {formatRupiahWithRp(item.quantity * item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Ongkos Kirim</span>
                  <span>
                    {formatRupiahWithRp(transactionData.shipping_cost)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
                  <span>Total</span>
                  <span className="text-gray-700">
                    {formatRupiahWithRp(totalWithShipping)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}