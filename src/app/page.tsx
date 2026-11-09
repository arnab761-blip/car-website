'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CAR_COLORS } from '@/data/cars';
import { useCars } from '@/context/CarContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Sliders,
  ShieldCheck,
  Zap,
  Gauge,
  RotateCw,
} from 'lucide-react';

const CarCanvas = dynamic(
  () => import('@/components/canvas/CarCanvas').then((mod) => mod.CarCanvas),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function HomePage() {
  const { cars, featuredModelUrl } = useCars();
  const { isBn, t, toBnDigits, getTranslatedCar, formatPrice } = useLanguage();

  const telemetryStats = [
    {
      label: isBn ? 'সর্বোচ্চ শক্তি' : 'Max Power',
      value: isBn ? `${toBnDigits('1,450')} HP` : '1,450 HP',
      sub: isBn ? 'কোয়াড-মোটর ম্যাট্রিক্স' : 'Quad-Motor Matrix',
    },
    {
      label: isBn ? '০-৬০ মাইল/ঘণ্টা' : '0-60 MPH',
      value: isBn ? `${toBnDigits('1.85')}s` : '1.85s',
      sub: isBn ? 'টর্ক ভেক্টরিং' : 'Torque Vectoring',
    },
    {
      label: isBn ? 'সর্বোচ্চ গতি' : 'Top Speed',
      value: isBn ? `${toBnDigits('265')} MPH` : '265 MPH',
      sub: isBn ? 'অ্যাক্টিভ এয়ারো মর্ফ' : 'Active Aero Morph',
    },
    {
      label: isBn ? 'ব্যাটারি রেঞ্জ' : 'Range',
      value: isBn ? `${toBnDigits('440')} MI` : '440 MI',
      sub: isBn ? 'সিলিকন-কার্বাইড সেল' : 'Silicon-Carbide Cell',
    },
  ];

  return (
    <main className="relative min-h-screen bg-transparent text-white selection:bg-cyan-500/30 selection:text-white overflow-hidden flex flex-col justify-between">
      {/* Real Photorealistic 3D Car floating in background */}
      <CarCanvas
        modelUrl={featuredModelUrl}
        color="#00d2ff"
        finish="metallic"
        headlightsOn={true}
      />

      <Navbar />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col">
        {/* ================= HERO SECTION ================= */}
        <section className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-16 px-4 sm:px-6 lg:px-8 pointer-events-none">
          {/* Top Tag */}
          <div className="max-w-7xl mx-auto w-full pt-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0a0c14]/90 md:bg-white/[0.05] border border-cyan-500/30 md:backdrop-blur-md shadow-lg shadow-cyan-500/10 pointer-events-auto"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-semibold">
                {isBn
                  ? 'ভেলোসিটি মোটরস • ৩ডি হাইপারকার ভার্চুয়াল শোরুম'
                  : 'VELOCITY MOTORS • REALISTIC 3D HYPERCAR EXPERIENCE'}
              </span>
            </motion.div>
          </div>

          {/* Center Titles & Actions */}
          <div className="max-w-7xl mx-auto w-full my-auto py-8">
            <div className="max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans leading-[1.08]"
              >
                {isBn ? 'আপনার স্বপ্নের গাড়ি আবিষ্কার করুন।' : 'Discover Your Dream Car.'}{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent block mt-1">
                  {isBn ? 'ভবিষ্যতের পথে চালান।' : 'Drive the Future.'}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-6 text-base sm:text-lg text-neutral-300 font-normal max-w-xl leading-relaxed"
              >
                {isBn
                  ? 'বাস্তবধর্মী ৩ডি অটোমোটিভ ইঞ্জিনিয়ারিং এর অভিজ্ঞতা নিন। পছন্দমতো রং কাস্টমাইজ করুন, এয়ারোডাইনামিক্স পরীক্ষা করুন এবং ডেডিকেটেড শোরুম ঘুরে দেখুন।'
                  : 'Experience real photorealistic 3D automotive engineering. Customize individual colors, inspect aerodynamics, and explore dedicated vehicle showrooms.'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 flex flex-wrap items-center gap-4 pointer-events-auto"
              >
                <Link
                  href="/customizer"
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-4 h-4" />
                  <span>{t('heroCtaCustomizer')}</span>
                </Link>

                <Link
                  href="/inventory"
                  className="px-7 py-3.5 rounded-full bg-[#0a0c14]/80 md:bg-white/[0.08] hover:bg-white/[0.14] text-neutral-200 hover:text-white border border-white/15 md:backdrop-blur-md font-semibold text-xs tracking-wider uppercase transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>{isBn ? `গাড়ির তালিকা (${toBnDigits(cars.length)})` : `Explore Inventory (${cars.length})`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Telemetry HUD Bar */}
          <div className="max-w-7xl mx-auto w-full pt-4 pointer-events-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-black/85 md:bg-black/50 border border-white/10 md:backdrop-blur-md shadow-2xl">
              {telemetryStats.map((item, idx) => (
                <div
                  key={idx}
                  className="border-l-2 border-cyan-500/50 pl-3 sm:pl-4 py-1 flex flex-col justify-center"
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    {item.label}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight mt-0.5">
                    {item.value}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono tracking-wide">
                    {item.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FEATURED SHOWCASE TILES ================= */}
        <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-black/70 md:bg-black/30 md:backdrop-blur-sm z-10">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 tracking-widest block mb-2">
                  {isBn ? 'নির্বাচিত ফ্লিট শোকেস' : 'Featured Fleet Highlights'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  {isBn ? 'এক্সক্লুসিভ হাইপারকার মাস্টারপিস' : 'Curated Exotic Masterpieces'}
                </h2>
              </div>

              <Link
                href="/inventory"
                className="text-xs font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                <span>{isBn ? 'সম্পূর্ণ শোরুম দেখুন' : 'View Full Showroom'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {cars.slice(0, 3).map((rawCar) => {
                const car = getTranslatedCar(rawCar);
                return (
                  <Link
                    key={car.id}
                    href={`/inventory/${car.id}`}
                    className="group relative bg-[#090b10]/95 md:bg-[#090b10]/80 md:backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-black/30" />
                        <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                          {car.category}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {car.name}
                        </h3>
                        <p className="text-neutral-400 text-xs mt-1 line-clamp-2">
                          {car.tagline}
                        </p>

                        <div className="mt-4 flex items-center justify-between text-xs font-mono text-neutral-300">
                          <span>{toBnDigits(car.specs.horsepower)} HP</span>
                          <span>{isBn ? `০-৬০: ${toBnDigits(car.specs.zeroToSixty)}` : `0-60: ${car.specs.zeroToSixty}`}</span>
                          <span>{toBnDigits(car.specs.topSpeed)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-base font-bold font-mono text-cyan-300">
                        {formatPrice(rawCar.price || 350000)}
                      </span>
                      <span className="text-xs font-semibold text-neutral-400 group-hover:text-cyan-400 flex items-center gap-1 transition-colors">
                        <span>{isBn ? '৩ডি স্যুট দেখুন' : 'View 3D Suite'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
