'use client';

import React from 'react';
import { ENVIRONMENT_PRESETS } from '@/data/cars';
import { EnvironmentPresetType } from '@/types';
import { CarSoundProfile } from '@/lib/soundProfiles';
import { useLanguage } from '@/context/LanguageContext';
import {
  Power,
  Lightbulb,
  Building2,
  Sparkles,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Gauge,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';

interface GlassCarControlsProps {
  currentEnvPreset: EnvironmentPresetType;
  onEnvironmentChange: (preset: EnvironmentPresetType) => void;
  showBackdrop: boolean;
  onToggleBackdrop: () => void;
  isEngineRunning: boolean;
  onToggleEngine: () => void;
  isHeadlightOn: boolean;
  onToggleHeadlight: () => void;
  speed?: number; // km/h
  rpm?: number;
  gear?: string;
  soundProfile?: CarSoundProfile;
  isAudioMuted?: boolean;
  onToggleMute?: () => void;
}

export function GlassCarControls({
  currentEnvPreset,
  onEnvironmentChange,
  showBackdrop,
  onToggleBackdrop,
  isEngineRunning,
  onToggleEngine,
  isHeadlightOn,
  onToggleHeadlight,
  speed = 0,
  rpm = 0,
  gear = 'P',
  soundProfile,
  isAudioMuted = false,
  onToggleMute,
}: GlassCarControlsProps) {
  const { isBn, toBnDigits } = useLanguage();

  const getPresetIcon = (id: EnvironmentPresetType) => {
    switch (id) {
      case 'studio':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'city':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'sunset':
        return <Sun className="w-3.5 h-3.5" />;
      case 'night':
        return <Moon className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const getPresetLabel = (preset: { id: string; label: string }) => {
    if (!isBn) return preset.label;
    switch (preset.id) {
      case 'studio':
        return 'স্টুডিও';
      case 'city':
        return 'নিয়ন সিটি';
      case 'sunset':
        return 'মরুভূমি';
      case 'night':
        return 'নাইট সার্কিট';
      default:
        return preset.label;
    }
  };

  const displayRpm = Math.round(rpm);
  const displaySpeed = Math.round(speed);
  const topSpeed = soundProfile?.topSpeedKmh || 320;
  const speedPercentage = Math.min(100, Math.round((displaySpeed / topSpeed) * 100));

  return (
    <div className="w-full flex flex-col gap-2 select-none">
      {/* ================= ROW 1: POWERTRAIN, TELEMETRY & COCKPIT OPTICS ================= */}
      <div className="w-full flex items-center justify-between gap-2">
        {/* Left cluster: Start Engine + Live Telemetry */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* ENGINE START / STOP TOGGLE BUTTON */}
          <button
            onClick={onToggleEngine}
            type="button"
            aria-label={isEngineRunning ? (isBn ? 'ইঞ্জিন বন্ধ করুন' : 'Stop Engine') : (isBn ? 'স্টার্ট ইঞ্জিন' : 'Start Engine')}
            className={`group relative flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
              isEngineRunning
                ? 'bg-gradient-to-r from-emerald-500/25 via-cyan-500/20 to-emerald-500/15 border border-emerald-400/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/40'
                : 'bg-gradient-to-r from-red-500/20 via-rose-500/15 to-transparent border border-red-500/35 text-rose-300 hover:border-red-400/70 hover:text-white hover:bg-red-500/25'
            }`}
          >
            {/* Animated Glow Wave on Running */}
            {isEngineRunning && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            )}

            {/* Engine Power Bezel Icon */}
            <span
              className={`relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-300 shrink-0 ${
                isEngineRunning
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/60 scale-105'
                  : 'bg-red-500/30 border border-red-400/50 text-red-300'
              }`}
            >
              <Power className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {isEngineRunning && (
                <span className="absolute -inset-1 rounded-full border border-emerald-400/60 animate-ping opacity-60" />
              )}
            </span>

            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono tracking-wider uppercase font-bold leading-none">
                {isEngineRunning ? (isBn ? 'ইঞ্জিন চলছে' : 'ENGINE RUNNING') : (isBn ? 'স্টার্ট ইঞ্জিন' : 'START ENGINE')}
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-neutral-300 leading-tight flex items-center gap-1 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isEngineRunning
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse'
                      : 'bg-red-400'
                  }`}
                />
                <span className="truncate max-w-[110px] sm:max-w-[130px]">
                  {isEngineRunning
                    ? `${soundProfile?.powertrainType || 'V8'} • ${gear}`
                    : `${soundProfile?.engineName ? soundProfile.engineName.split(' ')[0] : 'V8'} • ${isBn ? 'প্রস্তুত' : 'READY'}`}
                </span>
              </span>
            </div>
          </button>

          {/* ================= LIVE SPEEDOMETER & TELEMETRY HUD ================= */}
          {isEngineRunning && (
            <div className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-black/60 border border-emerald-500/30 font-mono shadow-inner animate-in fade-in duration-300">
              <div className="flex flex-col text-left">
                <span className="text-[8px] uppercase tracking-wider text-neutral-400 leading-none">
                  {isBn ? 'গতি' : 'Velocity'}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-emerald-300 tracking-tight leading-none">
                    {isBn ? toBnDigits(displaySpeed) : displaySpeed}
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-neutral-400 font-bold">
                    {isBn ? 'কিমি/ঘণ্টা' : 'KM/H'}
                  </span>
                </div>
              </div>

              <div className="h-5 sm:h-6 w-px bg-white/10" />

              <div className="flex flex-col text-left">
                <span className="text-[8px] uppercase tracking-wider text-neutral-400 leading-none">
                  {isBn ? 'গিয়ার' : 'Gear'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-cyan-400 leading-none mt-0.5">
                  {gear}
                </span>
              </div>

              <div className="h-5 sm:h-6 w-px bg-white/10" />

              <div className="flex flex-col text-left min-w-[48px] sm:min-w-[56px]">
                <span className="text-[8px] uppercase tracking-wider text-neutral-400 leading-none">
                  {isBn ? 'আরপিএম' : 'RPM'}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-white leading-none mt-0.5">
                  {isBn ? toBnDigits(displayRpm.toLocaleString()) : displayRpm.toLocaleString()}
                </span>
              </div>

              {/* Speedometer Gauge Bar */}
              <div className="hidden lg:flex flex-col justify-center w-12 gap-0.5">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-150"
                    style={{ width: `${Math.max(6, speedPercentage)}%` }}
                  />
                </div>
                <span className="text-[8px] text-neutral-500 text-right font-mono">
                  {isBn ? `${toBnDigits(speedPercentage)}%` : `${speedPercentage}%`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right cluster: Headlights & Audio Mute */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* HEADLIGHT TOGGLE BUTTON */}
          <button
            onClick={onToggleHeadlight}
            type="button"
            title={isHeadlightOn ? (isBn ? 'হেডলাইট বন্ধ করুন' : 'Turn Headlights Off') : (isBn ? 'হেডলাইট চালু করুন' : 'Turn Headlights On')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-300 border cursor-pointer ${
              isHeadlightOn
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Lightbulb
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${
                isHeadlightOn ? 'text-cyan-300 drop-shadow-[0_0_6px_#22d3ee] scale-110' : 'text-neutral-400'
              }`}
            />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold leading-none">
                {isBn ? 'অপটিক্স' : 'Optics'}
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-neutral-400 leading-tight hidden xs:inline">
                {isHeadlightOn ? (isBn ? 'লাইট অন' : 'Beam ON') : (isBn ? 'লাইট অফ' : 'Beam OFF')}
              </span>
            </div>
          </button>

          {/* MUTE / AUDIO INDICATOR TOGGLE */}
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              type="button"
              title={isAudioMuted ? (isBn ? 'সাউন্ড চালু করুন' : 'Unmute Engine Audio') : (isBn ? 'সাউন্ড বন্ধ করুন' : 'Mute Engine Audio')}
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {isAudioMuted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
              ) : (
                <Volume2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isEngineRunning ? 'text-emerald-400 animate-pulse' : 'text-neutral-400'}`} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ================= ROW 2: ENVIRONMENT PRESETS & BACKDROP DOCK ================= */}
      <div className="w-full flex items-center justify-between gap-2 pt-1.5 border-t border-white/10">
        {/* Left: HDRI Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full scrollbar-none py-0.5">
          <div className="flex items-center gap-1 pl-1 pr-1 text-[10px] font-mono uppercase text-neutral-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 animate-pulse" />
            <span>HDRI:</span>
          </div>

          {ENVIRONMENT_PRESETS.map((preset) => {
            const isSelected = currentEnvPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onEnvironmentChange(preset.id)}
                type="button"
                title={`${preset.label} - ${preset.description}`}
                className={`group shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border shadow-md font-bold'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: isSelected ? `${preset.themeColor}22` : undefined,
                  borderColor: isSelected ? preset.themeColor : undefined,
                  color: isSelected ? '#ffffff' : undefined,
                  boxShadow: isSelected ? `0 0 14px ${preset.glow}` : undefined,
                }}
              >
                <span
                  className="transition-transform group-hover:scale-110 shrink-0"
                  style={{ color: isSelected ? preset.themeColor : undefined }}
                >
                  {getPresetIcon(preset.id)}
                </span>
                <span className="whitespace-nowrap text-[11px] font-semibold">{getPresetLabel(preset)}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Backdrop Toggle (Always shrink-0 and fully visible!) */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={onToggleBackdrop}
            type="button"
            title={showBackdrop ? (isBn ? 'ব্যাকড্রপ লুকান' : 'Hide HDRI backdrop') : (isBn ? '৩৬০° ব্যাকড্রপ দেখান' : 'Show 360 HDRI backdrop')}
            className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              showBackdrop
                ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            {showBackdrop ? (
              <>
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-semibold">{isBn ? 'ব্যাকড্রপ' : 'Backdrop'}</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[10px] font-semibold">{isBn ? 'ডার্ক স্টুডিও' : 'Dark Studio'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
