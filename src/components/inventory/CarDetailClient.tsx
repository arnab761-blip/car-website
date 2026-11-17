'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCars } from '@/context/CarContext';
import {
  CAR_COLORS,
  FINISH_OPTIONS,
  RIM_COLORS,
  CALIPER_COLORS,
  INTERIOR_COLORS,
} from '@/data/cars';
import { CarColor, CarFinish, CustomizerOption } from '@/types';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import { Interactive3DViewer } from '@/components/canvas/Interactive3DViewer';
import { CarFinancingCalculator } from '@/components/finance/CarFinancingCalculator';
import {
  ArrowLeft,
  Gauge,
  CheckCircle,
  Lightbulb,
  ArrowUpRight,
  Palette,
  Sliders,
  Disc,
  Armchair,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { useGarage } from '@/hooks/useGarage';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatBDT, DEFAULT_USD_TO_BDT_RATE } from '@/lib/financeUtils';

export function CarDetailClient({ id }: { id: string }) {
  const { t, isBn, toBnDigits, getTranslatedCar, formatPrice } = useLanguage();
  const { getCarById, featuredModelUrl } = useCars();
  const rawCar = getCarById(id);
  const car = rawCar ? getTranslatedCar(rawCar) : null;
  const { saveCar, isInGarage } = useGarage();
  const { showToast } = useToast();

  // Live 3D multi-zone customization state for this car
  const [currentColor, setCurrentColor] = useState<CarColor>(CAR_COLORS[0]); // Neon cyan
  const [currentFinish, setCurrentFinish] = useState<CarFinish>('metallic');
  const [currentRim, setCurrentRim] = useState<CustomizerOption>(RIM_COLORS[0]);
  const [currentCaliper, setCurrentCaliper] = useState<CustomizerOption>(CALIPER_COLORS[0]);
  const [currentInterior, setCurrentInterior] = useState<CustomizerOption>(INTERIOR_COLORS[0]);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'paint' | 'wheels' | 'interior'>('paint');

  const isSavedInGarage = car ? isInGarage(car.id) : false;

  const handleSaveToGarage = () => {
    if (!car) return;

    const customizerUrl = `/customizer?car=${encodeURIComponent(car.id)}&color=${encodeURIComponent(currentColor.hex)}&finish=${encodeURIComponent(currentFinish)}&rim=${encodeURIComponent(currentRim.name)}&caliper=${encodeURIComponent(currentCaliper.name)}&interior=${encodeURIComponent(currentInterior.name)}`;

    saveCar({
      carId: car.id,
      modelName: car.name,
      tagline: car.tagline,
      category: car.category,
      bodyColorHex: currentColor.hex,
      bodyColorName: currentColor.name,
      finish: currentFinish,
      wheelType: currentRim.name,
      wheelHex: currentRim.hex,
      interiorTrim: currentInterior.name,
      interiorHex: currentInterior.hex,
      caliperColor: currentCaliper.name,
      caliperHex: currentCaliper.hex,
      priceTotal: car.price || 350000,
      imageThumbnail: car.image,
      customizerUrl,
      notes: `${currentFinish.toUpperCase()} Finish • ${currentRim.name} Alloys • ${currentInterior.name} Trim`,
    });

    showToast('Configuration secured in your Virtual Garage', {
      type: 'success',
      title: 'Spec Secured',
      link: '/garage',
      linkText: 'View in Garage →',
    });
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-40 pb-20 text-center">
          <h1 className="text-3xl font-bold">Vehicle Allocation Not Found</h1>
          <p className="text-neutral-400 mt-2 text-sm">
            The requested machine reference could not be located in our current vault.
          </p>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Inventory</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Back Link & Breadcrumbs */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-neutral-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('detailBackLink', 'Back to Inventory Showroom')}</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
              {car.category}
            </span>
            <span className="text-xs font-mono uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              {car.status}
            </span>
            <button
              onClick={handleSaveToGarage}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase transition-all cursor-pointer ${
                isSavedInGarage
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white'
              }`}
            >
              {isSavedInGarage ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('detailSecuredInGarage', 'In Garage')}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('detailSaveToGarage', 'Save to Garage')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title & Headline */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {car.name}
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl">
            {car.tagline}
          </p>
        </div>

        {/* ================= 3D INTERACTIVE CUSTOMIZER STAGE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* 3D Canvas Container with 360 Drag Controls */}
          <div className="lg:col-span-8">
            <Interactive3DViewer
              key={car.model3dUrl || featuredModelUrl || '/models/car.glb'}
              modelUrl={car.model3dUrl || featuredModelUrl || '/models/car.glb'}
              color={currentColor.hex}
              finish={currentFinish}
              rimColor={currentRim.hex}
              caliperColor={currentCaliper.hex}
              interiorColor={currentInterior.hex}
              headlightsOn={headlightsOn}
              onHeadlightsChange={setHeadlightsOn}
              heightClass="h-[520px] sm:h-[600px] w-full"
              cameraPosition={[3.8, 1.4, 4.6]}
            />

            {/* Active Spec Badges Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#090b10]/75 border border-white/10 backdrop-blur-md text-[11px] font-mono">
              <span className="text-neutral-500 uppercase mr-1">Active Spec:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentColor.hex }} />
                <span>{currentColor.name} ({currentFinish})</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentRim.hex }} />
                <span>{currentRim.name} Rims</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentCaliper.hex }} />
                <span>{currentCaliper.name} Caliper</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentInterior.hex }} />
                <span>{currentInterior.name}</span>
              </span>
            </div>
          </div>

          {/* Interactive Paint & Control Suite */}
          <div className="lg:col-span-4 bg-[#0a0c13]/85 border border-white/15 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                  3D Multi-Zone Atelier
                </h2>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                Live 360°
              </span>
            </div>

            {/* Customizer Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-black/50 border border-white/10 rounded-xl">
              <button
                onClick={() => setActiveTab('paint')}
                className={`py-2 text-[11px] font-mono uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'paint'
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Body</span>
              </button>
              <button
                onClick={() => setActiveTab('wheels')}
                className={`py-2 text-[11px] font-mono uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'wheels'
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Disc className="w-3.5 h-3.5" />
                <span>Wheels</span>
              </button>
              <button
                onClick={() => setActiveTab('interior')}
                className={`py-2 text-[11px] font-mono uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'interior'
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Armchair className="w-3.5 h-3.5" />
                <span>Cabin</span>
              </button>
            </div>

            {/* TAB 1: BODY PAINT */}
            {activeTab === 'paint' && (
              <div className="space-y-4">
                {/* Current Color Indicator */}
                <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-full border border-white/30"
                      style={{ backgroundColor: currentColor.hex }}
                    />
                    <span className="text-xs font-semibold text-white">{currentColor.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    {currentColor.hex}
                  </span>
                </div>

                {/* Color Palette */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Select Bespoke Shade
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {CAR_COLORS.map((c) => {
                      const selected = currentColor.id === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setCurrentColor(c)}
                          className={`aspect-square rounded-xl transition-all cursor-pointer ${
                            selected
                              ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0a0c13] scale-105 shadow-md shadow-cyan-500/30'
                              : 'hover:scale-105 hover:opacity-90 border border-white/10'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Finishes */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Clearcoat Luster
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FINISH_OPTIONS.map((f) => {
                      const selected = currentFinish === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setCurrentFinish(f.id)}
                          className={`p-2.5 rounded-xl text-xs font-semibold uppercase font-mono tracking-wider transition-all cursor-pointer ${
                            selected
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/80'
                              : 'bg-white/[0.03] text-neutral-400 border border-white/5 hover:text-white'
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: WHEELS & CALIPERS */}
            {activeTab === 'wheels' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Wheel Rims Finish
                    </label>
                    <span className="text-[10px] font-mono text-cyan-400">{currentRim.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {RIM_COLORS.map((r) => {
                      const selected = currentRim.id === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => setCurrentRim(r)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            selected
                              ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/50'
                              : 'bg-white/[0.03] border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                              style={{ backgroundColor: r.hex }}
                            />
                            <span className="text-[10px] font-bold text-white truncate block">
                              {r.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Brake Calipers
                    </label>
                    <span className="text-[10px] font-mono text-cyan-400">{currentCaliper.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {CALIPER_COLORS.map((cal) => {
                      const selected = currentCaliper.id === cal.id;
                      return (
                        <button
                          key={cal.id}
                          onClick={() => setCurrentCaliper(cal)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            selected
                              ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/50'
                              : 'bg-white/[0.03] border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                              style={{ backgroundColor: cal.hex }}
                            />
                            <span className="text-[10px] font-bold text-white truncate block">
                              {cal.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: INTERIOR CABIN */}
            {activeTab === 'interior' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-full border border-white/30"
                      style={{ backgroundColor: currentInterior.hex }}
                    />
                    <span className="text-xs font-semibold text-white">{currentInterior.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {currentInterior.desc}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {INTERIOR_COLORS.map((inColor) => {
                    const selected = currentInterior.id === inColor.id;
                    return (
                      <button
                        key={inColor.id}
                        onClick={() => setCurrentInterior(inColor)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          selected
                            ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/50'
                            : 'bg-white/[0.03] border-white/10'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-sm"
                          style={{ backgroundColor: inColor.hex }}
                        />
                        <div className="truncate">
                          <span className="text-[11px] font-bold text-white block truncate">
                            {inColor.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Headlights Toggle */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb
                  className={`w-4 h-4 ${headlightsOn ? 'text-cyan-400' : 'text-neutral-500'}`}
                />
                <span className="text-xs text-neutral-300">Laser Matrix Headlights</span>
              </div>
              <button
                onClick={() => setHeadlightsOn((prev) => !prev)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                  headlightsOn ? 'bg-cyan-500' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    headlightsOn ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleSaveToGarage}
                className={`w-full py-3 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSavedInGarage
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 shadow-lg shadow-amber-500/10'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/15 text-white hover:border-cyan-400/50 shadow-md'
                }`}
              >
                {isSavedInGarage ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    <span>{t('customizerSavedInGarageUpdate', 'Saved in Virtual Garage (Update Spec)')}</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-cyan-400" />
                    <span>{t('detailSaveToGarage', 'Save Spec to Virtual Garage')}</span>
                  </>
                )}
              </button>

              <Link
                href={`/customizer?car=${car.id}`}
                className="w-full py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 hover:text-cyan-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Sliders className="w-4 h-4" />
                <span>{t('detailOpenCustomizer', 'Open in 3D Customizer Studio')}</span>
              </Link>

              <Link
                href={`/test-drive?car=${encodeURIComponent(
                  `${car.name} [${currentColor.name}, ${currentRim.name} Rims, ${currentInterior.name} Interior]`
                )}`}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>{t('detailBookTestDrive', 'Book Test Drive for This Spec')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ================= PERFORMANCE METRICS & PHOTO ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Real Photo Showcase */}
          <div className="lg:col-span-6 relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-white/10 shadow-xl group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-neutral-400">
                  {t('detailAcquisitionPrice', 'Acquisition Valuation')}
                </span>
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                    {formatPrice(car.price, 'USD')}
                  </span>
                  <span className="text-base sm:text-xl font-bold text-amber-400 font-mono">
                    ≈ {formatPrice(car.price, 'BDT')}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    ({formatBDT(car.price, DEFAULT_USD_TO_BDT_RATE, true)})
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-neutral-300">
                {t('detailModelYear', 'Model Year')} {isBn ? toBnDigits(car.year) : car.year}
              </span>
            </div>
          </div>

          {/* Technical Telemetry Grid */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" /> {t('detailTechnicalSpecs', 'Technical Telemetry & Engineering Specs')}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">{t('customizerTelemetryPower', 'Power Output')}</span>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {isBn ? toBnDigits(car.specs.horsepower) : car.specs.horsepower} HP
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">{t('customizerTelemetry060', '0-60 MPH Acceleration')}</span>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                  {isBn ? toBnDigits(car.specs.zeroToSixty) : car.specs.zeroToSixty}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">{t('customizerTelemetrySpeed', 'Top Velocity')}</span>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {isBn ? toBnDigits(car.specs.topSpeed) : car.specs.topSpeed}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">{t('detailTorque', 'Peak Torque')}</span>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {isBn ? toBnDigits(car.specs.torque) : car.specs.torque}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">{t('detailDragCoefficient', 'Aerodynamic Drag')}</span>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {isBn ? toBnDigits(car.specs.dragCoefficient) : car.specs.dragCoefficient}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">{t('detailRange', 'Range / Fuel')}</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {isBn ? toBnDigits(car.specs.range || 'High Octane') : (car.specs.range || 'High Octane')}
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                {t('detailPowertrain', 'Powertrain Architecture')}
              </span>
              <span className="text-sm font-semibold text-white mt-1 block">
                {car.specs.powertrain} • {t('detailCurbWeight', 'Curb Weight')}: {isBn ? toBnDigits(car.specs.curbWeight) : car.specs.curbWeight}
              </span>
            </div>
          </div>
        </div>

        {/* ================= ADVANCED AUTOMOTIVE FINANCING & EMI CALCULATOR ================= */}
        <div className="mb-12">
          <CarFinancingCalculator
            initialPrice={car.price || 350000}
            carName={car.name}
            carId={car.id}
          />
        </div>

        {/* Narrative & Standard Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-[#0a0c13]/75 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
              {isBn ? 'ডিজাইন ও ইঞ্জিনিয়ারিং প্রেক্ষাপট' : 'Design & Engineering Narrative'}
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {car.description}
            </p>
          </div>

          <div className="lg:col-span-5 bg-[#0a0c13]/75 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
              {t('detailStandardFeatures', 'Included Bespoke Appointments')}
            </h2>
            <div className="space-y-2.5">
              {car.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
