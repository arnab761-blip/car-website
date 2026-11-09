'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InventoryCar } from '@/types';
import { X, CheckCircle, Zap, Shield, Gauge, Fuel, Calendar, DollarSign, ArrowRight } from 'lucide-react';

interface CarDetailModalProps {
  car: InventoryCar | null;
  onClose: () => void;
  onOrderNow: (carName: string) => void;
}

export function CarDetailModal({ car, onClose, onOrderNow }: CarDetailModalProps) {
  if (!car) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0c13] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/10 z-10 text-white custom-scrollbar"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-neutral-400 hover:text-white transition-all cursor-pointer"
            aria-label="Close vehicle details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
              {car.category}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              {car.status}
            </span>
            <span className="text-xs font-mono text-neutral-400">Model Year {car.year}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {car.name}
          </h2>
          <p className="text-neutral-400 text-sm mt-1">{car.tagline}</p>

          {/* Main Visual Image Banner */}
          <div className="relative mt-6 aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-neutral-300">
                  Acquisition Valuation
                </span>
                <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
                  {car.formattedPrice}
                </div>
              </div>
              <span className="text-xs font-mono text-neutral-400 hidden sm:block">
                Tax, Title & Factory Handover Included
              </span>
            </div>
          </div>

          {/* Detailed Performance Metrics Grid */}
          <div className="mt-8">
            <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" /> Technical Telemetry & Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/[0.03] border border-white/10 p-3.5 rounded-xl">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Horsepower</span>
                <div className="text-lg font-bold text-white font-mono mt-0.5">
                  {car.specs.horsepower} HP
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 p-3.5 rounded-xl">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">0-60 MPH</span>
                <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                  {car.specs.zeroToSixty}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 p-3.5 rounded-xl">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Top Speed</span>
                <div className="text-lg font-bold text-white font-mono mt-0.5">
                  {car.specs.topSpeed}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 p-3.5 rounded-xl">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Peak Torque</span>
                <div className="text-lg font-bold text-white font-mono mt-0.5">
                  {car.specs.torque}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 p-3.5 rounded-xl">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Powertrain</span>
                <div className="text-xs font-bold text-neutral-200 font-sans mt-0.5">
                  {car.specs.powertrain}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 p-3.5 rounded-xl">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Drag Index</span>
                <div className="text-lg font-bold text-white font-mono mt-0.5">
                  {car.specs.dragCoefficient}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 p-3.5 rounded-xl">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Curb Weight</span>
                <div className="text-lg font-bold text-white font-mono mt-0.5">
                  {car.specs.curbWeight}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 p-3.5 rounded-xl">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Range / Fuel</span>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  {car.specs.range || 'High Octane'}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
              Engineering Narrative
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">{car.description}</p>
          </div>

          {/* Key Features List */}
          <div className="mt-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
              Included Bespoke Appointments
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {car.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-xs text-neutral-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/5"
                >
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-neutral-400">Estimated Lease Tier</span>
              <div className="text-lg font-bold text-white font-mono">
                From ${(car.price * 0.012).toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Close Spec Sheet
              </button>
              <button
                onClick={() => {
                  onOrderNow(car.name);
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Book VIP Viewing / Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
