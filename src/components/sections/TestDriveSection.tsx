'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INVENTORY_CARS } from '@/data/cars';
import { TestDriveBooking } from '@/types';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  Car,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  QrCode,
  Download,
} from 'lucide-react';

interface TestDriveSectionProps {
  preselectedCar?: string;
}

export function TestDriveSection({ preselectedCar }: TestDriveSectionProps) {
  const [formData, setFormData] = useState<TestDriveBooking>({
    fullName: '',
    email: '',
    phone: '',
    selectedCar: preselectedCar || 'Apex Hyperion GT',
    deliveryType: 'showroom',
    date: '',
    timeSlot: '14:00 - Afternoon Session',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPass, setSubmittedPass] = useState<{
    referenceId: string;
    booking: TestDriveBooking;
  } | null>(null);

  // Update selected car if preselectedCar changes
  useEffect(() => {
    if (preselectedCar) {
      setFormData((prev) => ({ ...prev, selectedCar: preselectedCar }));
    }
  }, [preselectedCar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate luxury API booking
    setTimeout(() => {
      setIsSubmitting(false);
      const refId = `APX-${Math.floor(1000 + Math.random() * 9000)}-VIP`;
      setSubmittedPass({
        referenceId: refId,
        booking: { ...formData },
      });

      // Fire celebratory confetti!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#4facfe', '#ffffff', '#ffd700'],
      });
    }, 1200);
  };

  return (
    <section
      id="test-drive"
      className="relative min-h-screen w-full py-28 px-4 sm:px-6 lg:px-8 bg-[#06070a] z-10"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Driving Privilege</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight"
          >
            Book a VIP Test Drive.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent block sm:inline">
              Feel the Raw Thrust.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed"
          >
            Reserve an exclusive private circuit session, test drive at our flagship
            glass galleries, or request white-glove enclosed transporter delivery directly
            to your residence.
          </motion.p>
        </div>

        {/* Booking Card & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Privileges & Security */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-[#0a0c13] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <h3 className="text-lg font-bold text-white uppercase font-sans tracking-wider mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>The Apex VIP Protocol</span>
              </h3>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400 font-mono font-bold text-sm">
                    01
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Dedicated Performance Pilot</h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Accompanied by a factory racing instructor to guide you through launch
                      control and aerodynamic wing modes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400 font-mono font-bold text-sm">
                    02
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Closed-Circuit Run Available</h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Experience 0-200 km/h unrestricted acceleration runs in a safe, controlled
                      proving ground environment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400 font-mono font-bold text-sm">
                    03
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Discreet Confidentiality</h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      NDAs and private VIP valet lounges ensure complete security and discretion
                      for all high-profile clients.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Concierge Hotline */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <span className="text-xs font-mono text-neutral-400 uppercase block">
                  Urgent Same-Day Inquiries
                </span>
                <span className="text-base font-bold font-mono text-cyan-400 mt-1 block">
                  +1 (800) 489-APEX • concierge@apexmotors.luxury
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Form / Confirmation Pass */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="bg-[#0a0c13] border border-white/15 rounded-3xl p-6 sm:p-9 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!submittedPass ? (
                  /* Form View */
                  <motion.form
                    key="booking-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <h3 className="text-lg font-bold text-white uppercase font-sans tracking-wider">
                        VIP Reservation Application
                      </h3>
                      <span className="text-xs font-mono text-cyan-400">Step 1 of 1</span>
                    </div>

                    {/* Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Lord Alexander Sterling"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/70 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Direct Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="alexander@domain.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/70 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Phone & Selected Vehicle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Contact Telephone *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+1 (555) 019-2834"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/70 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Requested Machine *
                        </label>
                        <select
                          value={formData.selectedCar}
                          onChange={(e) =>
                            setFormData({ ...formData, selectedCar: e.target.value })
                          }
                          className="w-full bg-[#0e111a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/70 transition-colors cursor-pointer"
                        >
                          {INVENTORY_CARS.map((car) => (
                            <option key={car.id} value={car.name}>
                              {car.name} ({car.formattedPrice})
                            </option>
                          ))}
                          <option value="Apex Custom 3D Prototype">
                            Apex Custom 3D Prototype (Configured Live)
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Experience Tier selection */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                        Preferred Delivery / Experience Tier
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { id: 'showroom', label: 'Flagship Gallery', icon: MapPin },
                          { id: 'private_track', label: 'Private Circuit', icon: Car },
                          { id: 'vip_home', label: 'Estate Delivery', icon: Sparkles },
                        ].map((t) => {
                          const isSelected = formData.deliveryType === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  deliveryType: t.id as any,
                                })
                              }
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                                  : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white'
                              }`}
                            >
                              <t.icon className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                              <span className="text-xs font-semibold block">{t.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Date and Time slot */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Preferred Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/70 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                          Time Slot Session *
                        </label>
                        <select
                          value={formData.timeSlot}
                          onChange={(e) =>
                            setFormData({ ...formData, timeSlot: e.target.value })
                          }
                          className="w-full bg-[#0e111a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/70 transition-colors cursor-pointer"
                        >
                          <option value="10:00 - Morning Dawn Run">10:00 - Morning Dawn Run</option>
                          <option value="14:00 - Afternoon Session">14:00 - Afternoon Session</option>
                          <option value="17:30 - Sunset High-Speed Run">
                            17:30 - Sunset High-Speed Run
                          </option>
                          <option value="20:00 - Nocturnal Proving Ground">
                            20:00 - Nocturnal Proving Ground
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                        Special Requests / Security Requirements (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Enclosed transport required, track helmet sizing, NDA paperwork..."
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/70 transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Securing Factory Allocation...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Confirm VIP Driving Reservation</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  /* Confirmed Digital VIP Pass View */
                  <motion.div
                    key="confirmation-pass"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                      VIP Authorization Confirmed
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 font-sans">
                      Your Driving Slot is Secured
                    </h3>
                    <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                      Our Executive Concierge has dispatched your authorization pack. An
                      assigned pilot will contact you directly within 2 hours.
                    </p>

                    {/* Boarding Pass Box */}
                    <div className="mt-6 bg-[#07090e] border border-cyan-500/40 rounded-2xl p-6 text-left relative overflow-hidden shadow-2xl">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-neutral-400">
                            Reservation Reference
                          </span>
                          <div className="text-xl font-bold font-mono text-cyan-300">
                            {submittedPass.referenceId}
                          </div>
                        </div>
                        <QrCode className="w-10 h-10 text-cyan-400/80" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div>
                          <span className="text-neutral-500 block uppercase">Client</span>
                          <span className="text-white font-bold">
                            {submittedPass.booking.fullName}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase">Machine</span>
                          <span className="text-cyan-400 font-bold">
                            {submittedPass.booking.selectedCar}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase">Scheduled Date</span>
                          <span className="text-white">
                            {submittedPass.booking.date || 'To be confirmed'}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase">Session</span>
                          <span className="text-white">{submittedPass.booking.timeSlot}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSubmittedPass(null)}
                      className="mt-6 px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-neutral-300 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Book Another Machine
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
