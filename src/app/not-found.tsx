'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCars } from '@/context/CarContext';
import { CarDetailClient } from '@/components/inventory/CarDetailClient';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import { ArrowLeft, Car, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { isBn } = useLanguage();
  const { getCarById, isLoaded } = useCars();
  const [extractedCarId, setExtractedCarId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      // Match /inventory/[id] or /inventory/[id]/
      const match = pathname.match(/^\/inventory\/([^/?#]+)/);
      if (match && match[1] && match[1] !== 'detail') {
        const candidateId = decodeURIComponent(match[1]);
        setExtractedCarId(candidateId);
      }
    }
  }, []);

  // If this route is an /inventory/:id route, resolve it from CarContext (custom added cars or default)
  if (isClient && extractedCarId) {
    if (!isLoaded) {
      return (
        <div className="min-h-screen bg-[#06070a] text-cyan-400 flex flex-col justify-between">
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-40 pb-20 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">
              {isBn ? 'গাড়ির তথ্য লোড হচ্ছে...' : 'Resolving Vehicle Specification...'}
            </p>
          </main>
          <Footer />
        </div>
      );
    }

    const matchedCar = getCarById(extractedCarId);
    if (matchedCar) {
      return <CarDetailClient id={extractedCarId} />;
    }
  }

  return (
    <div className="min-h-screen bg-[#06070a] text-white flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-36 pb-20 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 shadow-lg shadow-cyan-500/20">
          <Car className="w-8 h-8" />
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-2">
          {isBn ? 'ত্রুটি ৪০৪ • পেজ পাওয়া যায়নি' : 'Error 404 • Resource Vault Unreachable'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {isBn ? 'গাড়ির তথ্য বা পেজটি পাওয়া যায়নি' : 'Vehicle Specification Not Located'}
        </h1>
        <p className="text-neutral-400 mt-4 text-sm sm:text-base max-w-lg">
          {isBn
            ? 'আপনি যে পেজ বা গাড়িটি খুঁজছেন তা আমাদের শো-রুমে তালিকাভুক্ত নেই অথবা লিঙ্কটি সঠিক নয়।'
            : 'The machine or page reference requested is not currently mapped in our allocation registry.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'ইনভেন্টরিতে ফিরে যান' : 'Return to Fleet'}</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Home className="w-4 h-4" />
            <span>{isBn ? 'হোমপেজ' : 'Showroom Home'}</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
