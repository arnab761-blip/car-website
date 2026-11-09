'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import { useGarage } from '@/hooks/useGarage';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Bookmark,
  Sliders,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  DollarSign,
  Coins,
  Layers,
  Car,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { formatUSD, formatBDT, DEFAULT_USD_TO_BDT_RATE } from '@/lib/financeUtils';

export default function GaragePage() {
  const { garageCars, isLoaded, removeCar, clearGarage, totalValueUSD, totalValueBDT } = useGarage();
  const { showToast } = useToast();
  const { t, isBn, toBnDigits } = useLanguage();

  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'BDT'>('USD');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  // Filter cars by category if selected
  const filteredCars = garageCars.filter((car) => {
    if (filterCategory === 'all') return true;
    return (car.category || '').toLowerCase() === filterCategory.toLowerCase();
  });

  const handleRemove = (id: string, modelName: string) => {
    removeCar(id);
    showToast(`${modelName} ${isBn ? 'ভার্চুয়াল গ্যারেজ থেকে মুছে ফেলা হয়েছে।' : 'removed from your Virtual Garage.'}`, {
      type: 'info',
      title: t('garageVaultUpdated', 'Vault Updated'),
    });
  };

  const handleClearAll = () => {
    clearGarage();
    setConfirmClear(false);
    showToast(isBn ? 'আপনার গ্যারেজের সমস্ত গাড়ি সফলভাবে মুছে ফেলা হয়েছে।' : 'Your private collection has been cleared.', {
      type: 'info',
      title: t('garageVaultCleared', 'Vault Cleared'),
    });
  };

  const categories = [
    { id: 'all', label: isBn ? 'সকল গাড়ি' : 'All Collections' },
    { id: 'Hypercar', label: isBn ? 'হাইপারকার' : 'Hypercar' },
    { id: 'Electric GT', label: isBn ? 'ইলেকট্রিক জিটি' : 'Electric GT' },
    { id: 'Luxury SUV', label: isBn ? 'লাক্সারি এসইউভি' : 'Luxury SUV' },
    { id: 'Track Series', label: isBn ? 'ট্র্যাক সিরিজ' : 'Track Series' },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* ================= HEADER SECTION ================= */}
        <div className="pb-8 border-b border-white/10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t('garageBadge', 'Private Vault & Atelier Garage')}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {t('garageTitle', 'My Virtual Garage')}
            </h1>
            <p className="mt-2 text-neutral-400 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
              {t('garageSubtitle', 'Your bespoke repository of custom-built hypercars, saved specifications, and curated dream fleet. Resume 3D tuning or schedule concierge delivery anytime.')}
            </p>
          </div>

          {/* Currency Switcher & Actions */}
          <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
            {/* Currency Pill */}
            <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/15 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCurrency === 'USD'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>USD ($)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCurrency('BDT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCurrency === 'BDT'
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>BDT (৳)</span>
              </button>
            </div>

            {/* Clear Vault Trigger (if cars exist) */}
            {garageCars.length > 0 && (
              <>
                {confirmClear ? (
                  <div className="flex items-center gap-2 animate-in fade-in">
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 text-xs font-mono uppercase font-bold transition-all cursor-pointer"
                    >
                      {t('garageConfirmClear', 'Confirm Clear')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 text-xs font-mono"
                    >
                      {t('garageCancel', 'Cancel')}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                    title={t('garageClearAll', 'Clear Vault')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* ================= VAULT TELEMETRY SUMMARY METRICS ================= */}
        {garageCars.length > 0 && (
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Portfolio Valuation */}
            <div className="p-5 rounded-2xl bg-[#090b14]/80 border border-white/10 backdrop-blur-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                {t('garageTotalValue', 'Vault Total Portfolio Value')}
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400 tracking-tight">
                {activeCurrency === 'USD'
                  ? (isBn ? toBnDigits(formatUSD(totalValueUSD)) : formatUSD(totalValueUSD))
                  : (isBn ? toBnDigits(formatBDT(totalValueUSD)) : formatBDT(totalValueUSD))}
              </div>
              <span className="text-[11px] font-mono text-neutral-500 block mt-0.5">
                {activeCurrency === 'USD'
                  ? (isBn ? toBnDigits(formatBDT(totalValueUSD)) : formatBDT(totalValueUSD))
                  : (isBn ? toBnDigits(formatUSD(totalValueUSD)) : formatUSD(totalValueUSD))}
              </span>
            </div>

            {/* Total Commissioned Builds */}
            <div className="p-5 rounded-2xl bg-[#090b14]/80 border border-white/10 backdrop-blur-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                {t('garageVehicleCount', 'Commissioned Vehicles')}
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                {isBn ? toBnDigits(garageCars.length) : garageCars.length}{' '}
                <span className="text-xs font-normal text-neutral-400">{isBn ? 'টি সংরক্ষিত গাড়ি' : 'Spec Models'}</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 block mt-0.5">
                {t('garageVehicleCountSub', 'Secured in Private Storage')}
              </span>
            </div>

            {/* Average Spec Price */}
            <div className="p-5 rounded-2xl bg-[#090b14]/80 border border-white/10 backdrop-blur-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                {t('garageAverageValue', 'Average Vehicle Valuation')}
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                {activeCurrency === 'USD'
                  ? (isBn ? toBnDigits(formatUSD(totalValueUSD / (garageCars.length || 1))) : formatUSD(totalValueUSD / (garageCars.length || 1)))
                  : (isBn ? toBnDigits(formatBDT(totalValueUSD / (garageCars.length || 1))) : formatBDT(totalValueUSD / (garageCars.length || 1)))}
              </div>
              <span className="text-[11px] font-mono text-neutral-500 block mt-0.5">
                {t('garageAverageValueSub', 'Per Machine Allocation')}
              </span>
            </div>

            {/* Concierge Delivery Status */}
            <div className="p-5 rounded-2xl bg-[#090b14]/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  {t('garageConciergeStatus', 'Concierge Status')}
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t('garageConciergeStatusSub', 'VIP Priority Production')}</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 mt-2 block">
                {isBn ? 'তাৎক্ষণিক টেস্ট-ড্রাইভ বরাদ্দ' : 'Instant Test-Drive Allocation'}
              </span>
            </div>
          </div>
        )}

        {/* ================= CATEGORY FILTER TABS ================= */}
        {garageCars.length > 0 && (
          <div className="mt-8 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <span className="text-xs font-mono uppercase text-neutral-500 mr-2 shrink-0">
              {t('garageFilterVault', 'Filter Vault:')}
            </span>
            {categories.map((cat) => {
              const isSelected = filterCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ================= VEHICLE CARDS GRID ================= */}
        {!isLoaded ? (
          <div className="mt-16 text-center font-mono text-neutral-400 text-sm">
            {isBn ? 'ব্যক্তিগত ভল্ট আর্কাইভ লোড হচ্ছে...' : 'Loading private vault archives...'}
          </div>
        ) : garageCars.length === 0 ? (
          /* ================= LUXURY EMPTY STATE ================= */
          <div className="mt-12 py-20 px-6 sm:px-12 text-center rounded-3xl bg-[#090b14]/70 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-lg mx-auto space-y-5">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
                <Bookmark className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {t('garageEmptyTitle', 'Your Collection is Currently Empty')}
                </h2>
                <p className="mt-2 text-neutral-400 text-sm font-sans leading-relaxed">
                  {t('garageEmptyText', 'Your private automotive sanctuary is ready for your first bespoke commission. Design a one-of-one build in our 3D Atelier or explore the curated fleet vault to begin curating.')}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/customizer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                >
                  <Sliders className="w-4 h-4" />
                  <span>{t('garageLaunchCustomizer', 'Launch 3D Customizer Atelier')}</span>
                </Link>

                <Link
                  href="/inventory"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <Car className="w-4 h-4" />
                  <span>{t('garageBrowseFleet', 'Browse Fleet Inventory')}</span>
                </Link>
              </div>
            </div>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="mt-16 text-center py-16 text-neutral-400 font-mono text-sm">
            {isBn ? `এই ক্যাটাগরিতে কোনো সংরক্ষিত গাড়ি পাওয়া যায়নি।` : `No commissioned vehicles found in category "${filterCategory}".`}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => {
              const resumeUrl = car.customizerUrl || `/customizer?car=${car.carId || car.id}`;
              const testDriveUrl = `/test-drive?car=${encodeURIComponent(
                `${car.modelName} [Color: ${car.bodyColorName}, Wheels: ${car.wheelType}, Interior: ${car.interiorTrim}]`
              )}`;

              return (
                <div
                  key={car.id}
                  className="group relative rounded-3xl bg-[#090c16]/85 border border-white/10 hover:border-cyan-500/40 backdrop-blur-2xl shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Thumbnail Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900 border-b border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={car.imageThumbnail || '/images/fleet/ferrari.jpg'}
                      alt={car.modelName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 border border-white/15 backdrop-blur-md text-[10px] font-mono uppercase font-bold text-cyan-400">
                        {car.category || 'Commissioned Spec'}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(car.id, car.modelName)}
                        type="button"
                        title={t('garageRemoveFromGarage', 'Remove from Garage')}
                        className="p-1.5 rounded-full bg-black/70 border border-white/15 text-neutral-400 hover:text-red-400 hover:bg-black transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Saved Date */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-mono text-neutral-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>{isBn ? toBnDigits(car.formattedDate || 'Saved in Vault') : (car.formattedDate || 'Saved in Vault')}</span>
                    </div>
                  </div>

                  {/* Card Content & Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-black text-white font-sans tracking-tight group-hover:text-cyan-300 transition-colors">
                            {car.modelName}
                          </h3>
                          {car.tagline && (
                            <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                              {car.tagline}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Custom Configuration Specs Badges */}
                      <div className="mt-4 space-y-2">
                        {/* Body Color */}
                        <div className="flex items-center justify-between text-xs font-mono p-2 rounded-xl bg-white/[0.03] border border-white/5">
                          <span className="text-neutral-400">{t('garageCardBodyFinish', 'Body Finish:')}</span>
                          <span className="flex items-center gap-2 font-bold text-white">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                              style={{ backgroundColor: car.bodyColorHex }}
                            />
                            <span>{car.bodyColorName} ({car.finish})</span>
                          </span>
                        </div>

                        {/* Rims / Wheels */}
                        <div className="flex items-center justify-between text-xs font-mono p-2 rounded-xl bg-white/[0.03] border border-white/5">
                          <span className="text-neutral-400">{t('garageCardWheelAlloys', 'Wheel Alloys:')}</span>
                          <span className="font-bold text-neutral-200 truncate max-w-[170px]">
                            {car.wheelType}
                          </span>
                        </div>

                        {/* Interior */}
                        <div className="flex items-center justify-between text-xs font-mono p-2 rounded-xl bg-white/[0.03] border border-white/5">
                          <span className="text-neutral-400">{t('garageCardInteriorHide', 'Interior Hide:')}</span>
                          <span className="font-bold text-neutral-200 truncate max-w-[170px]">
                            {car.interiorTrim}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Valuation & Actions Section */}
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                            {t('garageCardTotalValuation', 'Total Valuation')}
                          </span>
                          <div className="text-2xl font-black font-mono text-cyan-400">
                            {activeCurrency === 'USD'
                              ? (isBn ? toBnDigits(formatUSD(car.priceTotal)) : formatUSD(car.priceTotal))
                              : (isBn ? toBnDigits(formatBDT(car.priceTotal)) : formatBDT(car.priceTotal))}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-mono text-neutral-500 block">
                            {activeCurrency === 'USD'
                              ? (isBn ? toBnDigits(formatBDT(car.priceTotal)) : formatBDT(car.priceTotal))
                              : (isBn ? toBnDigits(formatUSD(car.priceTotal)) : formatUSD(car.priceTotal))}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            {t('garageCardEstPerMonth', 'Est.')} {isBn ? toBnDigits(formatUSD(car.priceTotal * 0.015)) : formatUSD(car.priceTotal * 0.015)}/mo
                          </span>
                        </div>
                      </div>

                      {/* Primary Actions: Resume Customization, Test Drive & Remove */}
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={resumeUrl}
                            className="py-2.5 px-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 hover:text-cyan-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center truncate"
                            title={t('garageResumeCustomization', 'Resume Customization')}
                          >
                            <Sliders className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{t('garageResumeCustomization', 'Resume Customization')}</span>
                          </Link>

                          <Link
                            href={testDriveUrl}
                            className="py-2.5 px-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer text-center"
                          >
                            <span>{t('garageTestDrive', 'Test Drive')}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(car.id, car.modelName)}
                          className="w-full py-2 rounded-xl bg-red-500/5 hover:bg-red-500/15 border border-red-500/20 hover:border-red-500/40 text-neutral-400 hover:text-red-300 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          <span>{t('garageRemoveFromGarage', 'Remove from Garage')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
