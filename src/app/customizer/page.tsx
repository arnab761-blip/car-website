'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CAR_COLORS,
  FINISH_OPTIONS,
  RIM_COLORS,
  CALIPER_COLORS,
  INTERIOR_COLORS,
  TRIM_OPTIONS,
  HEADLIGHT_COLORS,
  GLASS_TINT_OPTIONS,
  ENVIRONMENT_PRESETS,
} from '@/data/cars';
import {
  CarColor,
  CarFinish,
  CustomizerOption,
  GlassTint,
  InventoryCar,
  EnvironmentPresetType,
} from '@/types';
import { useCars } from '@/context/CarContext';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import { Interactive3DViewer } from '@/components/canvas/Interactive3DViewer';
import { CarFinancingCalculator } from '@/components/finance/CarFinancingCalculator';
import {
  Palette,
  Sliders,
  Disc,
  Armchair,
  Layers,
  Lightbulb,
  ArrowRight,
  Check,
  Car,
  RotateCcw,
  Sparkles,
  Eye,
  Shield,
  CircleDot,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { useGarage } from '@/hooks/useGarage';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatBDT, DEFAULT_USD_TO_BDT_RATE } from '@/lib/financeUtils';

function CustomizerContent() {
  const { t, isBn, toBnDigits, getTranslatedCar, formatPrice } = useLanguage();
  const searchParams = useSearchParams();
  const carQuery = searchParams.get('car') || '';
  const colorQuery = searchParams.get('color') || '';
  const finishQuery = searchParams.get('finish') || '';
  const rimQuery = searchParams.get('rim') || '';
  const caliperQuery = searchParams.get('caliper') || '';
  const interiorQuery = searchParams.get('interior') || '';
  const tintQuery = searchParams.get('tint') || '';
  const headlightQuery = searchParams.get('headlight') || '';

  const { cars, featuredModelUrl } = useCars();
  const { saveCar, isInGarage } = useGarage();
  const { showToast } = useToast();

  // Find initial car from query param or default to first car
  const initialCar = useMemo(() => {
    if (carQuery) {
      const match = cars.find(
        (c) =>
          c.id === carQuery ||
          c.name.toLowerCase() === carQuery.toLowerCase()
      );
      if (match) return match;
    }
    return cars[0];
  }, [carQuery, cars]);

  const [selectedCar, setSelectedCar] = useState<InventoryCar>(initialCar || cars[0]);

  // Multi-Zone Customization States
  const [currentColor, setCurrentColor] = useState<CarColor>(() => {
    if (colorQuery) {
      const match = CAR_COLORS.find(
        (c) =>
          c.hex.toLowerCase() === colorQuery.toLowerCase() ||
          c.name.toLowerCase() === colorQuery.toLowerCase()
      );
      if (match) return match;
    }
    return CAR_COLORS[0];
  });

  const [currentFinish, setCurrentFinish] = useState<CarFinish>(() => {
    if (finishQuery && FINISH_OPTIONS.some((f) => f.id === finishQuery)) {
      return finishQuery as CarFinish;
    }
    return 'metallic';
  });

  const [currentRim, setCurrentRim] = useState<CustomizerOption>(() => {
    if (rimQuery) {
      const match = RIM_COLORS.find(
        (r) =>
          r.name.toLowerCase() === rimQuery.toLowerCase() ||
          r.id === rimQuery ||
          r.hex?.toLowerCase() === rimQuery.toLowerCase()
      );
      if (match) return match;
    }
    return RIM_COLORS[0];
  });

  const [currentCaliper, setCurrentCaliper] = useState<CustomizerOption>(() => {
    if (caliperQuery) {
      const match = CALIPER_COLORS.find(
        (c) =>
          c.name.toLowerCase() === caliperQuery.toLowerCase() ||
          c.id === caliperQuery ||
          c.hex?.toLowerCase() === caliperQuery.toLowerCase()
      );
      if (match) return match;
    }
    return CALIPER_COLORS[0];
  });

  const [currentInterior, setCurrentInterior] = useState<CustomizerOption>(() => {
    if (interiorQuery) {
      const match = INTERIOR_COLORS.find(
        (i) =>
          i.name.toLowerCase() === interiorQuery.toLowerCase() ||
          i.id === interiorQuery ||
          i.hex?.toLowerCase() === interiorQuery.toLowerCase()
      );
      if (match) return match;
    }
    return INTERIOR_COLORS[0];
  });

  const [currentTrim, setCurrentTrim] = useState<CustomizerOption>(TRIM_OPTIONS[0]);

  const [currentHeadlight, setCurrentHeadlight] = useState<CustomizerOption>(() => {
    if (headlightQuery) {
      const match = HEADLIGHT_COLORS.find(
        (h) =>
          h.name.toLowerCase() === headlightQuery.toLowerCase() ||
          h.id === headlightQuery ||
          h.hex?.toLowerCase() === headlightQuery.toLowerCase()
      );
      if (match) return match;
    }
    return HEADLIGHT_COLORS[0];
  });

  const [currentGlassTint, setCurrentGlassTint] = useState<GlassTint>(() => {
    if (tintQuery && GLASS_TINT_OPTIONS.some((g) => g.id === tintQuery)) {
      return tintQuery as GlassTint;
    }
    return 'sport';
  });

  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [environmentPreset, setEnvironmentPreset] = useState<EnvironmentPresetType>('studio');

  // Active Tab: 'paint' | 'wheels' | 'interior' | 'accents' | 'optics'
  const [activeTab, setActiveTab] = useState<'paint' | 'wheels' | 'interior' | 'accents' | 'optics'>('paint');

  // Update selectedCar if initialCar changes from query
  useEffect(() => {
    if (initialCar) {
      setSelectedCar(initialCar);
    }
  }, [initialCar]);

  // Synchronize when query parameters change (e.g. from Resume Customization links)
  useEffect(() => {
    if (colorQuery) {
      const match = CAR_COLORS.find(
        (c) =>
          c.hex.toLowerCase() === colorQuery.toLowerCase() ||
          c.name.toLowerCase() === colorQuery.toLowerCase()
      );
      if (match) setCurrentColor(match);
    }
    if (finishQuery && FINISH_OPTIONS.some((f) => f.id === finishQuery)) {
      setCurrentFinish(finishQuery as CarFinish);
    }
    if (rimQuery) {
      const match = RIM_COLORS.find(
        (r) =>
          r.name.toLowerCase() === rimQuery.toLowerCase() ||
          r.id === rimQuery ||
          r.hex?.toLowerCase() === rimQuery.toLowerCase()
      );
      if (match) setCurrentRim(match);
    }
    if (caliperQuery) {
      const match = CALIPER_COLORS.find(
        (c) =>
          c.name.toLowerCase() === caliperQuery.toLowerCase() ||
          c.id === caliperQuery ||
          c.hex?.toLowerCase() === caliperQuery.toLowerCase()
      );
      if (match) setCurrentCaliper(match);
    }
    if (interiorQuery) {
      const match = INTERIOR_COLORS.find(
        (i) =>
          i.name.toLowerCase() === interiorQuery.toLowerCase() ||
          i.id === interiorQuery ||
          i.hex?.toLowerCase() === interiorQuery.toLowerCase()
      );
      if (match) setCurrentInterior(match);
    }
    if (tintQuery && GLASS_TINT_OPTIONS.some((g) => g.id === tintQuery)) {
      setCurrentGlassTint(tintQuery as GlassTint);
    }
    if (headlightQuery) {
      const match = HEADLIGHT_COLORS.find(
        (h) =>
          h.name.toLowerCase() === headlightQuery.toLowerCase() ||
          h.id === headlightQuery ||
          h.hex?.toLowerCase() === headlightQuery.toLowerCase()
      );
      if (match) setCurrentHeadlight(match);
    }
  }, [colorQuery, finishQuery, rimQuery, caliperQuery, interiorQuery, tintQuery, headlightQuery]);

  const activeCar = selectedCar || initialCar || cars[0];

  const isSavedInGarage = activeCar ? isInGarage(activeCar.id) : false;

  const handleSaveToGarage = () => {
    if (!activeCar) return;

    const customizerUrl = `/customizer?car=${encodeURIComponent(activeCar.id)}&color=${encodeURIComponent(currentColor.hex)}&finish=${encodeURIComponent(currentFinish)}&rim=${encodeURIComponent(currentRim.name)}&caliper=${encodeURIComponent(currentCaliper.name)}&interior=${encodeURIComponent(currentInterior.name)}&tint=${encodeURIComponent(currentGlassTint)}&headlight=${encodeURIComponent(currentHeadlight.name)}`;

    saveCar({
      carId: activeCar.id,
      modelName: activeCar.name,
      tagline: activeCar.tagline,
      category: activeCar.category,
      bodyColorHex: currentColor.hex,
      bodyColorName: currentColor.name,
      finish: currentFinish,
      wheelType: currentRim.name,
      wheelHex: currentRim.hex,
      interiorTrim: currentInterior.name,
      interiorHex: currentInterior.hex,
      caliperColor: currentCaliper.name,
      caliperHex: currentCaliper.hex,
      headlightColor: currentHeadlight.name,
      headlightHex: currentHeadlight.hex,
      glassTint: currentGlassTint,
      priceTotal: activeCar.price || 350000,
      imageThumbnail: activeCar.image,
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

  const handleResetToFactory = () => {
    setCurrentColor(CAR_COLORS[0]);
    setCurrentFinish('metallic');
    setCurrentRim(RIM_COLORS[0]);
    setCurrentCaliper(CALIPER_COLORS[0]);
    setCurrentInterior(INTERIOR_COLORS[0]);
    setCurrentTrim(TRIM_OPTIONS[0]);
    setCurrentHeadlight(HEADLIGHT_COLORS[0]);
    setCurrentGlassTint('sport');
    setHeadlightsOn(true);
    setEnvironmentPreset('studio');
  };

  if (!activeCar) {
    return (
      <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-40 pb-20 text-center font-mono text-neutral-400">
          Loading atelier fleet...
        </main>
        <Footer />
      </div>
    );
  }

  const activeModelUrl = activeCar.model3dUrl || featuredModelUrl || '/models/car.glb';

  // Configured summary for ordering
  const configuredSpecSummary = `${activeCar.name} [Paint: ${currentColor.name} (${currentFinish}), Rims: ${currentRim.name}, Calipers: ${currentCaliper.name}, Interior: ${currentInterior.name}, Optics: ${currentHeadlight.name}, Environment: ${ENVIRONMENT_PRESETS.find(p => p.id === environmentPreset)?.label || 'Studio'}]`;

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12 sm:pb-20">
        {/* Header */}
        <div className="pb-4 sm:pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-2 sm:mb-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>{t('customizerBadge', 'Multi-Zone 3D Atelier')}</span>
            </div>
            <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight">
              {t('customizerTitle', '3D Customizer Studio')}
            </h1>
            <p className="mt-1.5 sm:mt-2 text-neutral-400 text-xs sm:text-base max-w-xl">
              {t('customizerSubtitle', 'Rotate 360° in real time. Formulate custom lacquer body paint, alloy rims, racing calipers, handcrafted interior leather, aero trims, and laser optics.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handleResetToFactory}
              className="px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('customizerFactorySpec', 'Factory Spec')}</span>
            </button>

            <button
              onClick={handleSaveToGarage}
              className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                isSavedInGarage
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 shadow-amber-500/10'
                  : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300 hover:text-white shadow-cyan-500/10'
              }`}
            >
              {isSavedInGarage ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('customizerUpdateGarage', 'Update in Garage')}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('customizerSaveToGarage', 'Save Spec to Garage')}</span>
                </>
              )}
            </button>

            <Link
              href={`/test-drive?car=${encodeURIComponent(configuredSpecSummary)}`}
              className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <span>{t('customizerOrderSpec', 'Order Configured Spec')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ================= INVENTORY VEHICLE SELECTOR CAROUSEL ================= */}
        <div className="my-3 sm:my-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              <span>{t('customizerSelectVehicle', 'Select Vehicle to Inspect & Customize')} ({isBn ? toBnDigits(cars.length) : cars.length} {t('customizerFleetModels', 'Fleet Models')})</span>
            </span>
            <span className="text-[11px] font-mono text-cyan-400 hidden sm:block">
              {t('customizerClickTurntable', 'Click any car to load onto 3D turntable')}
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {cars.map((c) => {
              const isSelected = activeCar.id === c.id;
              const translatedC = getTranslatedCar(c);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCar(c)}
                  className={`group shrink-0 flex items-center gap-3 p-2.5 pr-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-102 ring-1 ring-cyan-400/50'
                      : 'bg-[#090b10]/80 backdrop-blur-md border-white/10 hover:border-white/20 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="w-14 h-10 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt={translatedC.name} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 block">
                      {translatedC.category}
                    </span>
                    <span className="text-xs font-bold text-white block whitespace-nowrap">
                      {translatedC.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300">
                      {formatPrice(c.price, 'USD')}
                    </span>
                    <span className="text-[9px] font-mono text-amber-400 block">
                      ≈ {formatPrice(c.price, 'BDT')}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= 3D STAGE & MULTI-ZONE CUSTOMIZER ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 items-start">
          {/* Main 3D Canvas with 360 Orbit Controls - STICKY PINNED ON MOBILE FOR LIVE SYNCHRONOUS PREVIEWS */}
          <div className="order-1 lg:col-span-7 xl:col-span-8 lg:row-start-1 sticky top-16 z-30 lg:static bg-[#070910]/95 lg:bg-transparent -mx-4 px-4 sm:mx-0 sm:px-0 py-1.5 lg:py-0 backdrop-blur-2xl lg:backdrop-blur-none border-b border-white/10 lg:border-none shadow-2xl lg:shadow-none">
            <Interactive3DViewer
              key={activeModelUrl}
              modelUrl={activeModelUrl}
              color={currentColor.hex}
              finish={currentFinish}
              rimColor={currentRim.hex}
              caliperColor={currentCaliper.hex}
              interiorColor={currentInterior.hex}
              trimColor={currentTrim.hex}
              headlightColor={currentHeadlight.hex}
              glassTint={currentGlassTint}
              headlightsOn={headlightsOn}
              onHeadlightsChange={setHeadlightsOn}
              environmentPreset={environmentPreset}
              onEnvironmentChange={setEnvironmentPreset}
              heightClass="h-[270px] xs:h-[300px] sm:h-[400px] lg:h-[600px] xl:h-[640px] w-full"
              cameraPosition={[3.8, 1.5, 4.6]}
            />
          </div>

          {/* Right Control Suite with Multi-Zone Tabs - POSITIONED DIRECTLY UNDER 3D VIEWER ON MOBILE */}
          <div className="order-2 lg:col-span-5 xl:col-span-4 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 bg-[#0a0c13]/85 border border-white/15 rounded-3xl p-3.5 sm:p-6 backdrop-blur-2xl shadow-2xl space-y-4 sm:space-y-5">
            {/* Multi-Zone Navigation Tabs */}
            <div className="grid grid-cols-5 gap-1 p-1 bg-black/50 border border-white/10 rounded-2xl">
              <button
                onClick={() => setActiveTab('paint')}
                className={`py-2 px-1 rounded-xl text-[10px] font-mono uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'paint'
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
                title={t('tabBody', 'Body')}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{t('tabBody', 'Body')}</span>
              </button>

              <button
                onClick={() => setActiveTab('wheels')}
                className={`py-2 px-1 rounded-xl text-[10px] font-mono uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'wheels'
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
                title={t('tabWheels', 'Wheels')}
              >
                <Disc className="w-3.5 h-3.5" />
                <span>{t('tabWheels', 'Wheels')}</span>
              </button>

              <button
                onClick={() => setActiveTab('interior')}
                className={`py-2 px-1 rounded-xl text-[10px] font-mono uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'interior'
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
                title={t('tabInterior', 'Interior')}
              >
                <Armchair className="w-3.5 h-3.5" />
                <span>{t('tabInterior', 'Interior')}</span>
              </button>

              <button
                onClick={() => setActiveTab('accents')}
                className={`py-2 px-1 rounded-xl text-[10px] font-mono uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'accents'
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
                title={t('tabAccents', 'Accents')}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t('tabAccents', 'Accents')}</span>
              </button>

              <button
                onClick={() => setActiveTab('optics')}
                className={`py-2 px-1 rounded-xl text-[10px] font-mono uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'optics'
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
                title={t('tabOptics', 'Optics')}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{t('tabOptics', 'Optics')}</span>
              </button>
            </div>

            {/* ================= TAB 1: BODY PAINT & FINISH ================= */}
            {activeTab === 'paint' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                      Bespoke Body Paint & Lacquer
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Live Reactive
                  </span>
                </div>

                {/* Selected Color Spec */}
                <div className="flex items-center justify-between bg-white/[0.04] p-3 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white/30 shadow-md"
                      style={{ backgroundColor: currentColor.hex }}
                    />
                    <div>
                      <div className="text-[10px] text-neutral-400 font-mono">Selected Lacquer</div>
                      <div className="text-sm font-bold text-white">{currentColor.name}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 uppercase">
                    {currentColor.hex}
                  </span>
                </div>

                {/* Color Swatches Grid */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                    12 Bespoke Formulations
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {CAR_COLORS.map((c) => {
                      const isSelected = currentColor.id === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setCurrentColor(c)}
                          className={`relative aspect-square rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0a0c13] scale-105 shadow-lg shadow-cyan-500/30'
                              : 'hover:scale-105 hover:opacity-90 border border-white/10'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {isSelected && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                c.id === 'quicksilver' || c.id === 'frozen-white'
                                  ? 'text-black'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clearcoat Luster */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                    Clearcoat Luster & Texture
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FINISH_OPTIONS.map((f) => {
                      const isSelected = currentFinish === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setCurrentFinish(f.id)}
                          className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 text-white'
                              : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-bold font-mono uppercase">{f.label}</div>
                          <div className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                            {f.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: WHEELS & BRAKES ================= */}
            {activeTab === 'wheels' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Disc className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                      Forged Wheels & Brake Calipers
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Alloy & Ceramic
                  </span>
                </div>

                {/* Wheel Rim Color */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      Wheel Rims Finish
                    </label>
                    <span className="text-[11px] font-mono text-cyan-400">{currentRim.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {RIM_COLORS.map((r) => {
                      const isSelected = currentRim.id === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => setCurrentRim(r)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/50'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                              style={{ backgroundColor: r.hex }}
                            />
                            <span className="text-[11px] font-bold text-white truncate block">
                              {r.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Brake Calipers */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      Carbon-Ceramic Brake Caliper
                    </label>
                    <span className="text-[11px] font-mono text-cyan-400">{currentCaliper.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {CALIPER_COLORS.map((cal) => {
                      const isSelected = currentCaliper.id === cal.id;
                      return (
                        <button
                          key={cal.id}
                          onClick={() => setCurrentCaliper(cal)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/50'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                              style={{ backgroundColor: cal.hex }}
                            />
                            <span className="text-[11px] font-bold text-white truncate block">
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

            {/* ================= TAB 3: INTERIOR CABIN ================= */}
            {activeTab === 'interior' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                      Cockpit & Leather Upholstery
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Handcrafted
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white/[0.04] p-3 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white/30 shadow-md"
                      style={{ backgroundColor: currentInterior.hex }}
                    />
                    <div>
                      <div className="text-[10px] text-neutral-400 font-mono">Bespoke Hide</div>
                      <div className="text-sm font-bold text-white">{currentInterior.name}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {currentInterior.desc}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                    Available Interior Hides
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {INTERIOR_COLORS.map((inColor) => {
                      const isSelected = currentInterior.id === inColor.id;
                      return (
                        <button
                          key={inColor.id}
                          onClick={() => setCurrentInterior(inColor)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/50'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-full border border-white/20 shrink-0 shadow-sm"
                            style={{ backgroundColor: inColor.hex }}
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {inColor.name}
                            </span>
                            <span className="text-[10px] text-neutral-500 block truncate">
                              {inColor.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 4: EXTERIOR ACCENTS & TRIMS ================= */}
            {activeTab === 'accents' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                      Exterior Accents, Grille & Trims
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Aerodynamic
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                    Trim Package & Mirror Caps
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {TRIM_OPTIONS.map((trim) => {
                      const isSelected = currentTrim.id === trim.id;
                      return (
                        <button
                          key={trim.id}
                          onClick={() => setCurrentTrim(trim)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/50'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                              style={{
                                backgroundColor:
                                  trim.hex === 'body' ? currentColor.hex : trim.hex,
                              }}
                            />
                            <span className="text-xs font-bold text-white block truncate">
                              {trim.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-500 block">
                            {trim.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 5: OPTICS & GLASS TINT ================= */}
            {activeTab === 'optics' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                      Laser Headlights & Privacy Glass
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Matrix Optics
                  </span>
                </div>

                {/* Headlight Beam Color */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                    Laser Beam Color Signature
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {HEADLIGHT_COLORS.map((hl) => {
                      const isSelected = currentHeadlight.id === hl.id;
                      return (
                        <button
                          key={hl.id}
                          onClick={() => setCurrentHeadlight(hl)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/50'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                              style={{ backgroundColor: hl.hex }}
                            />
                            <span className="text-xs font-bold text-white truncate">
                              {hl.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Glass Tint */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                    Privacy Glass Tint Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {GLASS_TINT_OPTIONS.map((g) => {
                      const isSelected = currentGlassTint === g.id;
                      return (
                        <button
                          key={g.id}
                          onClick={() => setCurrentGlassTint(g.id)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/50'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                          }`}
                        >
                          <span className="text-[11px] font-bold text-white block">
                            {g.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* HDRI Showroom Lighting Environment */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                      Showroom HDRI Atmosphere
                    </label>
                    <span className="text-[10px] font-mono text-cyan-400">
                      Real-time Drei IBL
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {ENVIRONMENT_PRESETS.map((preset) => {
                      const isSelected = environmentPreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => setEnvironmentPreset(preset.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400/50 shadow-md shadow-cyan-500/20'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                              style={{ backgroundColor: preset.themeColor }}
                            />
                            <span className="text-xs font-bold text-white truncate">
                              {preset.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-400 block mt-1 truncate">
                            {preset.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Headlights Toggle */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Lightbulb
                      className={`w-4 h-4 ${headlightsOn ? 'text-cyan-400' : 'text-neutral-500'}`}
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">Laser Projector Optics</div>
                      <div className="text-[10px] text-neutral-400">Toggle live headlights on/off</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setHeadlightsOn((prev) => !prev)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      headlightsOn ? 'bg-cyan-500' : 'bg-neutral-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        headlightsOn ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Order / Test Drive & Virtual Garage CTA */}
            <div className="pt-3 border-t border-white/10 space-y-2.5">
              <button
                onClick={handleSaveToGarage}
                className={`w-full py-3.5 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSavedInGarage
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 shadow-lg shadow-amber-500/10'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/15 text-white hover:border-cyan-400/50 shadow-lg'
                }`}
              >
                {isSavedInGarage ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    <span>{t('customizerSavedInGarageUpdate', 'Saved to Virtual Garage (Update Spec)')}</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-cyan-400" />
                    <span>{t('customizerSaveSpecToGarage', 'Save Spec to Garage')}</span>
                  </>
                )}
              </button>

              <Link
                href={`/test-drive?car=${encodeURIComponent(configuredSpecSummary)}`}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all"
              >
                <span>{t('customizerReserveSpecBtn', 'Reserve Spec')} ({getTranslatedCar(activeCar).name})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Performance Telemetry & Spec Badges Bar - POSITIONED BELOW CONTROLS ON MOBILE, UNDER 3D CANVAS ON DESKTOP */}
          <div className="order-3 lg:col-span-7 xl:col-span-8 lg:row-start-2 space-y-4">
            {/* Live Spec Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#090b10]/75 border border-white/10 backdrop-blur-md text-[11px] font-mono">
              <span className="text-neutral-500 uppercase mr-1">{t('customizerActiveSpec', 'Active Spec')}:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentColor.hex }} />
                <span>{currentColor.name} ({currentFinish})</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentRim.hex }} />
                <span>{currentRim.name}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentCaliper.hex }} />
                <span>{currentCaliper.name} Caliper</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentInterior.hex }} />
                <span>{currentInterior.name}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                <Lightbulb className="w-3 h-3" />
                <span>{currentHeadlight.name}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <Sparkles className="w-3 h-3" />
                <span>{ENVIRONMENT_PRESETS.find((p) => p.id === environmentPreset)?.label || 'Studio'} HDRI</span>
              </span>
            </div>

            {/* Selected Car Performance Telemetry bar */}
            <div className="bg-[#0a0c13]/75 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400">
                    {t('customizerActiveMachineSpecs', 'Active Machine Specifications')}
                  </span>
                  <h3 className="text-xl font-black text-white font-sans">
                    {getTranslatedCar(activeCar).name}
                  </h3>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                    {t('customizerBasePrice', 'Base Acquisition Valuation')}
                  </span>
                  <div className="flex flex-col sm:items-end">
                    <span className="text-lg sm:text-xl font-bold font-mono text-cyan-300">
                      {formatPrice(activeCar.price, 'USD')}
                    </span>
                    <span className="text-xs font-bold font-mono text-amber-400">
                      ≈ {formatPrice(activeCar.price, 'BDT')} ({formatBDT(activeCar.price, DEFAULT_USD_TO_BDT_RATE, true)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                  <span className="text-neutral-500 uppercase block text-[10px]">{t('customizerPowerHp', 'Power')}</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">
                    {isBn ? toBnDigits(activeCar.specs.horsepower) : activeCar.specs.horsepower} HP
                  </span>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                  <span className="text-neutral-500 uppercase block text-[10px]">{t('customizerTelemetry060', '0-60 MPH')}</span>
                  <span className="text-cyan-400 font-bold text-sm mt-0.5 block">
                    {isBn ? toBnDigits(activeCar.specs.zeroToSixty) : activeCar.specs.zeroToSixty}
                  </span>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                  <span className="text-neutral-500 uppercase block text-[10px]">{t('customizerTopSpeedLabel', 'Top Speed')}</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">
                    {isBn ? toBnDigits(activeCar.specs.topSpeed) : activeCar.specs.topSpeed}
                  </span>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                  <span className="text-neutral-500 uppercase block text-[10px]">{t('customizerAeroDragLabel', 'Aero Drag')}</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">
                    {isBn ? toBnDigits(activeCar.specs.dragCoefficient) : activeCar.specs.dragCoefficient}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BESPOKE FINANCING & LEASE ESTIMATOR ================= */}
        <div className="mt-16">
          <CarFinancingCalculator
            initialPrice={activeCar.price || 350000}
            carName={activeCar.name}
            carId={activeCar.id}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CustomizerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060709] flex items-center justify-center font-mono text-xs text-neutral-400">
          Loading Atelier...
        </div>
      }
    >
      <CustomizerContent />
    </Suspense>
  );
}
