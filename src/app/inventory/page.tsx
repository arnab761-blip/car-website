'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCars } from '@/context/CarContext';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { formatBDT, DEFAULT_USD_TO_BDT_RATE } from '@/lib/financeUtils';
import { Search, ArrowUpRight, Zap, SlidersHorizontal, ShieldCheck, Sliders, RotateCcw } from 'lucide-react';

export default function InventoryPage() {
  const { cars } = useCars();
  const { t, isBn, toBnDigits, getTranslatedCar, formatPrice } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'hp-desc'>('featured');

  const categories = [
    { id: 'All', label: isBn ? 'সকল গাড়ি' : 'All Fleet' },
    { id: 'Sedan', label: isBn ? 'সেডান' : 'Sedan' },
    { id: 'Luxury SUV', label: isBn ? 'লাক্সারি এসইউভি' : 'Luxury SUV' },
    { id: 'Microbus & MPV', label: isBn ? 'মাইক্রোবাস ও এমপিভি' : 'Microbus & MPV' },
    { id: 'Hatchback & Compact', label: isBn ? 'হ্যাচব্যাক' : 'Hatchback' },
    { id: 'Hybrid & Eco', label: isBn ? 'হাইব্রিড' : 'Hybrid' },
    { id: 'Electric Vehicle (EV)', label: isBn ? 'ইলেকট্রিক (EV)' : 'Electric (EV)' },
    { id: 'Executive Flagship', label: isBn ? 'এক্সিকিউটিভ' : 'Executive Flagship' },
    { id: 'Double Cabin Pickup', label: isBn ? 'পিকআপ ৪x৪' : 'Pickup & 4x4' },
    { id: 'Hypercar', label: isBn ? 'হাইপারকার' : 'Hypercar' },
    { id: 'Track Series', label: isBn ? 'ট্র্যাক সিরিজ' : 'Track Series' },
  ];

  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
        const matchesSearch =
          car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.specs.powertrain.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'hp-desc') return b.specs.horsepower - a.specs.horsepower;
        return 0;
      });
  }, [cars, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header */}
        <div className="pb-8 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>{t('inventoryFullAllocation', 'Full Showroom Allocation')}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {t('inventoryPageTitle', 'Vehicle Inventory & Fleet')}
            </h1>
            <p className="mt-2 text-neutral-400 text-sm sm:text-base max-w-xl">
              {t('inventoryPageSubtitle', 'Select any hypercar below to open its dedicated technical specification suite, rotate in 360° 3D, and customize bespoke colors.')}
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md self-start md:self-auto">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">
              {t('inventoryTotalAllocations', 'Total Allocations')}
            </span>
            <span className="text-xl font-bold font-mono text-cyan-400">
              {isBn ? toBnDigits(filteredCars.length) : filteredCars.length} {t('inventoryMachines', 'Machines')}
            </span>
          </div>
        </div>

        {/* Toolbar (Categories, Search, Sort) */}
        <div className="mt-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 scale-105'
                      : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('inventorySearchPlaceholderInput', 'Search models, V12, electric, hypercar...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0b0c13] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-cyan-500/60 cursor-pointer"
            >
              <option value="featured">{t('inventorySortFeatured', 'Sort: Featured')}</option>
              <option value="price-desc">{t('inventorySortPriceHighLow', 'Price: High to Low')}</option>
              <option value="price-asc">{t('inventorySortPriceLowHigh', 'Price: Low to High')}</option>
              <option value="hp-desc">{t('inventorySortPowerHp', 'Power: Highest HP')}</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredCars.length === 0 && (
          <div className="mt-16 text-center max-w-md mx-auto p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2">{t('inventoryNoResults', 'No vehicles match your active search filters.')}</h3>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('inventoryResetFilters', 'Reset All Filters')}</span>
            </button>
          </div>
        )}

        {/* Cars Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCars.map((car, idx) => {
            const translatedCar = getTranslatedCar(car);
            return (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative bg-[#090b10]/75 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <Link href={`/inventory/detail?id=${car.id}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={car.image}
                      alt={translatedCar.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-black/30" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        {translatedCar.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${
                          car.status === 'In Stock'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : car.status === 'Rare Spec'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                        }`}
                      >
                        {translatedCar.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 text-[11px] font-mono text-neutral-400">
                      {t('inventoryModelYear', 'Model Year')} {isBn ? toBnDigits(car.year) : car.year}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-6">
                    <Link href={`/inventory/detail?id=${car.id}`}>
                      <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {translatedCar.name}
                      </h2>
                    </Link>
                    <p className="text-neutral-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {translatedCar.tagline}
                    </p>

                    {/* Telemetry */}
                    <div className="mt-5 grid grid-cols-3 gap-2 bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                          {t('customizerPowerHp', 'Power')}
                        </span>
                        <span className="text-xs font-bold font-mono text-white mt-0.5 block">
                          {isBn ? toBnDigits(car.specs.horsepower) : car.specs.horsepower} HP
                        </span>
                      </div>
                      <div className="text-center border-x border-white/10">
                        <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                          {t('customizerTelemetry060', '0-60 MPH')}
                        </span>
                        <span className="text-xs font-bold font-mono text-cyan-400 mt-0.5 block">
                          {isBn ? toBnDigits(car.specs.zeroToSixty) : car.specs.zeroToSixty}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                          {t('customizerTopSpeedLabel', 'Top Speed')}
                        </span>
                        <span className="text-xs font-bold font-mono text-white mt-0.5 block">
                          {isBn ? toBnDigits(car.specs.topSpeed) : car.specs.topSpeed}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                      {t('featuredStartingFrom', 'Acquisition Price')}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-base sm:text-lg font-black font-mono text-white tracking-tight">
                        {formatPrice(car.price, 'USD')}
                      </span>
                      <span className="text-[11px] font-bold font-mono text-amber-400">
                        ≈ {formatPrice(car.price, 'BDT')} ({formatBDT(car.price, DEFAULT_USD_TO_BDT_RATE, true)})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/customizer?car=${car.id}`}
                      title={t('featuredInspect3D', '3D Studio')}
                      className="px-3 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t('featuredInspect3D', '3D Studio')}</span>
                    </Link>

                    <Link
                      href={`/inventory/detail?id=${car.id}`}
                      className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold uppercase tracking-wider shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                    >
                      <span>{t('inventoryViewDetails', 'Details')}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
