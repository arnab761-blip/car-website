'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCars } from '@/context/CarContext';
import { TestDriveBooking } from '@/types';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  MapPin,
  Car,
  CheckCircle2,
  Send,
  QrCode,
  ShieldCheck,
  Calendar,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function TestDriveFormContent() {
  const searchParams = useSearchParams();
  const carFromQuery = searchParams.get('car') || '';
  const financePlanFromQuery = searchParams.get('financePlan') || '';
  const { cars, addBooking } = useCars();
  const { t, isBn, toBnDigits, getTranslatedCar } = useLanguage();

  const [formData, setFormData] = useState<TestDriveBooking>({
    fullName: '',
    email: '',
    phone: '',
    selectedCar: carFromQuery || (cars[0]?.name ?? 'Apex Hyperion GT'),
    deliveryType: 'showroom',
    date: '',
    timeSlot: '14:00 - Afternoon Session',
    notes: financePlanFromQuery ? `Requested Financing Plan: ${financePlanFromQuery}` : '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPass, setSubmittedPass] = useState<{
    referenceId: string;
    booking: TestDriveBooking;
  } | null>(null);

  useEffect(() => {
    if (carFromQuery) {
      setFormData((prev) => ({
        ...prev,
        selectedCar: carFromQuery,
        notes: financePlanFromQuery ? `Requested Financing Plan: ${financePlanFromQuery}` : prev.notes,
      }));
    }
  }, [carFromQuery, financePlanFromQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const refId = addBooking(formData);
      setSubmittedPass({
        referenceId: refId,
        booking: { ...formData },
      });

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#4facfe', '#ffffff', '#ffd700'],
      });
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isBn ? 'ভিআইপি ডায়নামিক মূল্যায়ন' : 'VIP Dynamic Evaluation'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {t('testDriveTitle', 'Book Your VIP Test Drive')}
        </h1>
        <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
          {t(
            'testDriveSubtitle',
            'Experience hyper-propulsion at one of our private test proving grounds, flagship galleries, or arrange private enclosed transporter delivery to your personal residence.'
          )}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Info Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0c13]/75 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
            <h2 className="text-base font-bold text-white uppercase font-sans tracking-wider mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>{isBn ? 'অ্যাপেক্স ড্রাইভিং প্রটোকল' : 'The Apex Driving Protocol'}</span>
            </h2>

            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400 font-mono font-bold text-xs">
                  {toBnDigits('01')}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">
                    {isBn ? 'ফ্যাক্টরি টেস্ট ড্রাইভার সঙ্গ' : 'Factory Test Driver Escort'}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                    {isBn
                      ? 'অ্যাক্টিভ অ্যারো মোড এবং লঞ্চ কন্ট্রোল টেলিমেট্রি প্রদর্শনের জন্য একজন এফআইএ-প্রত্যয়িত পাইলট সার্বক্ষণিক থাকবেন।'
                      : 'Accompanied by an FIA-certified pilot to demonstrate active aero modes and launch control telemetry.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400 font-mono font-bold text-xs">
                  {toBnDigits('02')}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">
                    {isBn ? 'ব্যক্তিগত ক্লোজড সার্কিট ও রানওয়ে' : 'Closed Proving Ground'}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                    {isBn
                      ? 'সম্পূর্ণ নিরাপদ ও নিয়ন্ত্রিত রানওয়েতে ০-১০০ কিমি/ঘণ্টার সাব-২ সেকেন্ডের তীব্র গতি পরীক্ষা করুন।'
                      : 'Test the 0-100 km/h sub-2-second acceleration safely on a controlled runway.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400 font-mono font-bold text-xs">
                  {toBnDigits('03')}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">
                    {isBn ? 'গোপনীয়তা ও ভিআইপি প্রটেকশন' : 'Discreet Confidentiality'}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                    {isBn
                      ? 'ভিআইপি ও বিশিষ্ট ব্যক্তিদের জন্য ব্যক্তিগত ভ্যালেট স্যুট এবং সম্পূর্ণ এনডিএ (NDA) গোপনীয়তা সুরক্ষা।'
                      : 'Private valet suites and full non-disclosure protection for ultra-high-net-worth clients.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-xs font-mono text-neutral-400">
              <span className="text-[10px] uppercase block text-neutral-500">
                {isBn ? 'জরুরি কনসিয়ার্জ হটলাইন' : 'Urgent Concierge Hotline'}
              </span>
              <span className="text-cyan-400 font-bold block mt-1">
                {toBnDigits('+1 (800) 489-APEX')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="lg:col-span-7">
          <div className="bg-[#0a0c13]/75 border border-white/15 rounded-3xl p-6 sm:p-9 backdrop-blur-2xl shadow-2xl">
            {!submittedPass ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                    {isBn ? 'রিজার্ভেশন বিবরণ' : 'Reservation Details'}
                  </h2>
                  <span className="text-xs font-mono text-cyan-400">
                    {isBn ? 'গোপনীয় ও সংরক্ষিত' : 'Confidential'}
                  </span>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      {isBn ? 'পূর্ণ নাম *' : 'Full Legal Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isBn ? 'উদা: আলেকজান্ডার স্টার্লিং' : 'e.g. Lord Alexander Sterling'}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      {isBn ? 'সরাসরি ইমেইল *' : 'Direct Email *'}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alexander@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Phone & Vehicle Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      {isBn ? 'যোগাযোগ নম্বর *' : 'Contact Telephone *'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      {isBn ? 'পছন্দের গাড়ি *' : 'Requested Machine *'}
                    </label>
                    <select
                      value={formData.selectedCar}
                      onChange={(e) => setFormData({ ...formData, selectedCar: e.target.value })}
                      className="w-full bg-[#0e111a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {cars.map((c) => {
                        const tc = getTranslatedCar(c);
                        return (
                          <option key={c.id} value={c.name}>
                            {tc.name} ({toBnDigits(c.formattedPrice)})
                          </option>
                        );
                      })}
                      <option value="Apex Bespoke Prototype">
                        {isBn ? 'অ্যাপেক্স বিস্পোক প্রোটোটাইপ' : 'Apex Bespoke Prototype'}
                      </option>
                    </select>
                  </div>
                </div>

                {/* Experience Tier */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    {isBn ? 'ডেলিভারি ও টেস্ট ড্রাইভের স্থান' : 'Experience / Delivery Tier'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        id: 'showroom',
                        label: isBn ? 'ফ্ল্যাগশিপ গ্যালারি' : 'Flagship Gallery',
                        icon: MapPin,
                      },
                      {
                        id: 'private_track',
                        label: isBn ? 'প্রাইভেট সার্কিট' : 'Private Circuit',
                        icon: Car,
                      },
                      {
                        id: 'vip_home',
                        label: isBn ? 'বাসভবনে ডেলিভারি' : 'Estate Delivery',
                        icon: Sparkles,
                      },
                    ].map((t) => {
                      const selected = formData.deliveryType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, deliveryType: t.id as any })}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            selected
                              ? 'bg-cyan-500/15 border-cyan-400 text-white'
                              : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <t.icon className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                          <span className="text-[11px] font-semibold block">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date & Time slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      {isBn ? 'পছন্দের তারিখ *' : 'Preferred Date *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                      {isBn ? 'সেশনের সময় নির্ধারণ *' : 'Time Slot Session *'}
                    </label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full bg-[#0e111a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="10:00 - Morning Dawn Run">
                        {isBn ? 'সকাল ১০:০০ - ভোরের সেশন' : '10:00 - Morning Dawn Run'}
                      </option>
                      <option value="14:00 - Afternoon Session">
                        {isBn ? 'দুপুর ২:০০ - বিকেলের সেশন' : '14:00 - Afternoon Session'}
                      </option>
                      <option value="17:30 - Sunset High-Speed Run">
                        {isBn ? 'বিকেল ৫:৩০ - সূর্যাস্ত হাই-স্পিড রান' : '17:30 - Sunset High-Speed Run'}
                      </option>
                      <option value="20:00 - Nocturnal Proving Ground">
                        {isBn ? 'রাত ৮:০০ - নৈশ ট্রায়াল সেশন' : '20:00 - Nocturnal Proving Ground'}
                      </option>
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    {isBn ? 'বিশেষ কনসিয়ার্জ নোট / চাহিদা' : 'Special Concierge Notes'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={
                      isBn
                        ? 'যেমন: বিশেষ হেলমেট সাইজ, আবদ্ধ ট্রান্সপোর্টার...'
                        : 'e.g. Enclosed transport required, track helmet sizing...'
                    }
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isBn ? 'ফ্যাক্টরি স্লট বরাদ্দ হচ্ছে...' : 'Securing Factory Allocation...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isBn ? 'ভিআইপি টেস্ট ড্রাইভ বুকিং নিশ্চিত করুন' : 'Confirm VIP Driving Reservation'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Confirmed Pass */
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                  {isBn ? 'বরাদ্দ নিশ্চিত হয়েছে' : 'Allocation Confirmed'}
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">
                  {isBn ? 'ভিআইপি ড্রাইভিং স্লট সংরক্ষিত' : 'VIP Driving Slot Secured'}
                </h2>
                <p className="text-neutral-400 text-xs mt-1 max-w-sm mx-auto">
                  {isBn
                    ? 'আপনার রিজার্ভেশন রেফারেন্স কার্যকর এবং কনসিয়ার্জ সিস্টেমে লগ করা হয়েছে।'
                    : 'Your reservation reference is active and logged in the concierge system.'}
                </p>

                <div className="mt-5 bg-[#07090e] border border-cyan-500/40 rounded-2xl p-5 text-left text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase">
                        {isBn ? 'রেফারেন্স আইডি' : 'Reference ID'}
                      </span>
                      <div className="text-lg font-bold text-cyan-400">
                        {toBnDigits(submittedPass.referenceId)}
                      </div>
                    </div>
                    <QrCode className="w-8 h-8 text-cyan-400/80" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-neutral-500 block">{isBn ? 'ক্লায়েন্ট' : 'Client'}</span>
                      <span className="text-white font-bold">{submittedPass.booking.fullName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">{isBn ? 'গাড়ি' : 'Machine'}</span>
                      <span className="text-cyan-400 font-bold">{submittedPass.booking.selectedCar}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">{isBn ? 'নির্ধারিত তারিখ' : 'Scheduled Date'}</span>
                      <span className="text-white">{toBnDigits(submittedPass.booking.date || (isBn ? 'শীঘ্রই নির্ধারিত হবে' : 'TBD'))}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">{isBn ? 'সেশনের সময়' : 'Session Slot'}</span>
                      <span className="text-white">{submittedPass.booking.timeSlot}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSubmittedPass(null)}
                  className="mt-6 px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-neutral-300 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  {isBn ? 'আরেকটি সেশন বুক করুন' : 'Book Another Session'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestDrivePage() {
  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar />
      <Suspense fallback={<div className="pt-40 text-center text-xs font-mono">Loading form...</div>}>
        <TestDriveFormContent />
      </Suspense>
      <Footer />
    </div>
  );
}
