'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { INVENTORY_CARS } from '@/data/cars';
import { InventoryCar } from '@/types';
import { CarDetailModal } from '@/components/ui/CarDetailModal';
import { Search, SlidersHorizontal, ArrowUpRight, Zap, Gauge, Flame, Check } from 'lucide-react';

interface InventorySectionProps {
  onSelectCarForTestDrive: (carName: string) => void;
}

export function InventorySection({ onSelectCarForTestDrive }: InventorySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'hp-desc'>('featured');
  const [selectedModalCar, setSelectedModalCar] = useState<InventoryCar | null>(null);

  const categories = ['All', 'Hypercar', 'Electric GT', 'Luxury SUV', 'Track Series'];

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    return INVENTORY_CARS.filter((car) => {
      const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
      const matchesSearch =
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.specs.powertrain.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'hp-desc') return b.specs.horsepower - a.specs.horsepower;
      return 0; // featured/default
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section
      id="inventory"
      className="relative min-h-screen w-full py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-[#06070a]/90 to-[#07080c] z-10"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Elite Fleet Allocation</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl font-black text-white tracking-tight"
            >
              Exotic Showroom & Marketplace
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-neutral-400 text-sm sm:text-base max-w-xl"
            >
              Every masterpiece in our vault undergoes a rigorous 200-point aerospace-grade
              inspection and comes with global concierge delivery.
            </motion.p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="text-[11px] font-mono text-neutral-400 uppercase block">
                Available Allocations
              </span>
              <span className="text-xl font-bold font-mono text-cyan-400">
                {filteredCars.length} Models
              </span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar (Categories, Search, Sort) */}
        <div className="mt-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 scale-105'
                      : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Row */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search models, V12, electric..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0b0c13] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-cyan-500/60 cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="hp-desc">Power: Highest HP</option>
            </select>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCars.map((car, idx) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="group relative bg-[#090b10] border border-white/10 hover:border-cyan-500/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-black/30" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      {car.category}
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
                      {car.status}
                    </span>
                  </div>

                  {/* Model Year overlay */}
                  <div className="absolute bottom-3 left-4 text-[11px] font-mono text-neutral-400">
                    Model Year {car.year}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {car.name}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {car.tagline}
                  </p>

                  {/* Telemetry Micro-Grid */}
                  <div className="mt-5 grid grid-cols-3 gap-2 bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                    <div className="text-center">
                      <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                        Power
                      </span>
                      <span className="text-xs font-bold font-mono text-white mt-0.5 block">
                        {car.specs.horsepower} HP
                      </span>
                    </div>
                    <div className="text-center border-x border-white/10">
                      <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                        0-60 MPH
                      </span>
                      <span className="text-xs font-bold font-mono text-cyan-400 mt-0.5 block">
                        {car.specs.zeroToSixty}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] uppercase font-mono text-neutral-400 block">
                        Top Speed
                      </span>
                      <span className="text-xs font-bold font-mono text-white mt-0.5 block">
                        {car.specs.topSpeed}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Pricing and Actions */}
              <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                    Starting From
                  </span>
                  <span className="text-lg font-black font-mono text-white tracking-tight">
                    {car.formattedPrice}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedModalCar(car)}
                    className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    title="View Details"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onSelectCarForTestDrive(car.name)}
                    className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold uppercase tracking-wider shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buy Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state if search yields nothing */}
        {filteredCars.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-neutral-400 text-sm">
              No vehicles found matching "{searchQuery}" in this category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-white/[0.08] text-white text-xs uppercase font-mono"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <CarDetailModal
        car={selectedModalCar}
        onClose={() => setSelectedModalCar(null)}
        onOrderNow={(carName) => {
          onSelectCarForTestDrive(carName);
        }}
      />
    </section>
  );
}
