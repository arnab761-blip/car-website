'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Gauge, Shield, Sparkles, Cpu, Compass } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onCustomizeClick: () => void;
}

export function HeroSection({ onExploreClick, onCustomizeClick }: HeroSectionProps) {
  const telemetryStats = [
    { label: 'Max Power', value: '1,450 HP', sub: 'Quad-Motor Matrix' },
    { label: '0-60 MPH', value: '1.85s', sub: 'Torque Vectoring' },
    { label: 'Top Speed', value: '265 MPH', sub: 'Active Aero Morph' },
    { label: 'Range', value: '440 MI', sub: 'Silicon-Carbide Cell' },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-8 pointer-events-none"
    >
      {/* Top Banner Tag */}
      <div className="max-w-7xl mx-auto w-full pt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-500/10 pointer-events-auto"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-semibold">
            APEX EXPERIMENTAL HYPERCAR • 2026 ROAD-LEGAL
          </span>
        </motion.div>
      </div>

      {/* Main Center Overlay Headlines */}
      <div className="max-w-7xl mx-auto w-full my-auto py-8">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans leading-[1.08]"
          >
            Discover Your Dream Car.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent block mt-1">
              Drive the Future.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-base sm:text-lg text-neutral-300 font-normal max-w-xl leading-relaxed"
          >
            Step into the next realm of automotive mastery. Handcrafted carbon-titanium
            architecture, synchronized active aerodynamics, and instantaneous hyper-electric
            torque.
          </motion.p>

          {/* Interactive CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 flex flex-wrap items-center gap-4 pointer-events-auto"
          >
            <button
              onClick={onCustomizeClick}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm tracking-wider uppercase transition-all shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Customize 3D Spec</span>
            </button>

            <button
              onClick={onExploreClick}
              className="px-7 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-neutral-200 hover:text-white border border-white/15 backdrop-blur-md font-semibold text-sm tracking-wider uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Explore Inventory</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Telemetry HUD Bar & Scroll Indicator */}
      <div className="max-w-7xl mx-auto w-full pt-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md pointer-events-auto shadow-2xl"
        >
          {telemetryStats.map((item, idx) => (
            <div
              key={idx}
              className="border-l-2 border-cyan-500/50 pl-3 sm:pl-4 py-1 flex flex-col justify-center"
            >
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
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
        </motion.div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center justify-center mt-6 text-neutral-400 pointer-events-auto">
          <button
            onClick={onCustomizeClick}
            className="flex flex-col items-center gap-1 group cursor-pointer focus:outline-none"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 group-hover:text-cyan-400 transition-colors">
              Scroll to Configure & Explore
            </span>
            <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
