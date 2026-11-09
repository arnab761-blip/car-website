'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CAR_COLORS } from '@/data/cars';
import { CarColor, CarFinish } from '@/types';
import { Palette, Sparkles, Sliders, Lightbulb, Gauge, Wind, ShieldAlert, Check } from 'lucide-react';

interface CustomizationSectionProps {
  currentColor: CarColor;
  currentFinish: CarFinish;
  headlightsOn: boolean;
  onColorChange: (color: CarColor) => void;
  onFinishChange: (finish: CarFinish) => void;
  onHeadlightsToggle: () => void;
}

export function CustomizationSection({
  currentColor,
  currentFinish,
  headlightsOn,
  onColorChange,
  onFinishChange,
  onHeadlightsToggle,
}: CustomizationSectionProps) {
  const finishOptions: { id: CarFinish; label: string; desc: string }[] = [
    { id: 'metallic', label: 'Metallic', desc: 'High-specular aluminum flake clearcoat' },
    { id: 'matte', label: 'Matte Stealth', desc: 'Non-reflective light-absorbing velvet' },
    { id: 'gloss', label: 'High Gloss', desc: 'Mirror-finish deep ceramic polish' },
    { id: 'carbon', label: 'Carbon Weave', desc: 'T700 exposed dry carbon fiber' },
  ];

  return (
    <section
      id="customizer"
      className="relative min-h-screen w-full flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Typography & Performance Spec Badges */}
        <div className="lg:col-span-6 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Bespoke Studio</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]"
          >
            Customize Your Style.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent block mt-1">
              Unmatched Performance.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed max-w-lg"
          >
            Sculpt your bespoke hypercar in real-time 3D. Inspect active aerodynamic
            lines, toggled matrix LED optics, and multi-layer metallic lacquer calibrated
            to reflect every beam of light in photorealistic precision.
          </motion.p>

          {/* Live Telemetry Progress Bars */}
          <div className="mt-8 space-y-4 max-w-md">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" /> Aerodynamic Drag Coefficient
                </span>
                <span className="text-cyan-300 font-bold">0.208 Cd</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: '92%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Instant Torque Delivery
                </span>
                <span className="text-emerald-300 font-bold">1,420 Nm (0 RPM)</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: '96%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" /> Track Weight Balance
                </span>
                <span className="text-indigo-300 font-bold">48 : 52 F/R</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: '88%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Customizer Panel */}
        <div className="lg:col-span-6 flex justify-end pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-md bg-[#0a0c13]/90 border border-white/15 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl shadow-black/80"
          >
            {/* Header of control card */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">
                  Exterior Formulation
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                Live 3D Sync
              </span>
            </div>

            {/* Selected Color Showcase */}
            <div className="mt-5 flex items-center justify-between bg-white/[0.04] p-3.5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white/30 shadow-md"
                  style={{ backgroundColor: currentColor.hex }}
                />
                <div>
                  <div className="text-xs text-neutral-400 font-mono">Current Spec</div>
                  <div className="text-sm font-bold text-white">{currentColor.name}</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-neutral-400 uppercase">
                Hex: {currentColor.hex}
              </span>
            </div>

            {/* Color Palette Swatches */}
            <div className="mt-5">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                Select Lacquer Color
              </label>
              <div className="grid grid-cols-6 gap-2.5">
                {CAR_COLORS.map((color) => {
                  const isSelected = currentColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => onColorChange(color)}
                      className={`relative aspect-square rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer p-1 group ${
                        isSelected
                          ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0a0c13] scale-105'
                          : 'hover:scale-105 hover:opacity-90'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 ${
                            color.id === 'quicksilver' || color.id === 'solar-gold'
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

            {/* Finish Selector */}
            <div className="mt-6">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                Paint Clearcoat & Texture
              </label>
              <div className="grid grid-cols-2 gap-2">
                {finishOptions.map((opt) => {
                  const isSelected = currentFinish === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onFinishChange(opt.id)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400/80 text-white'
                          : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="text-xs font-bold font-sans flex items-center justify-between">
                        <span>{opt.label}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-1 line-clamp-1">
                        {opt.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lighting Toggle Controls */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lightbulb
                  className={`w-4 h-4 transition-colors ${
                    headlightsOn ? 'text-cyan-400' : 'text-neutral-500'
                  }`}
                />
                <div>
                  <div className="text-xs font-semibold text-white">Laser Matrix Headlights</div>
                  <div className="text-[10px] text-neutral-400">
                    Adaptive 600m High-Beam Optics
                  </div>
                </div>
              </div>
              <button
                onClick={onHeadlightsToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  headlightsOn ? 'bg-cyan-500' : 'bg-neutral-800'
                }`}
                aria-label="Toggle Headlights"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    headlightsOn ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
