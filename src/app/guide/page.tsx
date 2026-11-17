'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/sections/Footer';
import { useLanguage } from '@/context/LanguageContext';
import {
  BookOpen,
  Sparkles,
  Layers,
  Volume2,
  BookmarkCheck,
  Calculator,
  Compass,
  ShieldCheck,
  Sliders,
  Database,
  Palette,
  Users,
  FileText,
  CheckCircle2,
  ArrowRight,
  Zap,
  Eye,
  Key,
  Flame,
  Radio,
  Car,
} from 'lucide-react';

export default function GuidePage() {
  const { t, isBn, toBnDigits } = useLanguage();
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [activeUserSection, setActiveUserSection] = useState<'customizer' | 'simulator' | 'garage' | 'finance' | 'testdrive'>('customizer');
  const [activeAdminSection, setActiveAdminSection] = useState<'auth' | 'fleet' | 'model' | 'bookings' | 'branding' | 'logs'>('auth');

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('guideBadge', 'COMPLETE SYSTEM MANUAL')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t('guideTitle', 'User & Admin Operational Guidelines')}
          </h1>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
            {t(
              'guideSubtitle',
              'Comprehensive manual covering every feature of the Velocity Motors platform: 3D customizer, sound simulation, virtual garage, financing, fleet inventory, and administrative control.'
            )}
          </p>
        </div>

        {/* Tab Switcher: User Guide vs. Admin Manual */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#0a0c13]/90 border border-white/15 p-1.5 rounded-2xl flex items-center gap-2 shadow-2xl backdrop-blur-2xl">
            <button
              onClick={() => setActiveTab('user')}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('guideTabUser', 'Customer & Client Guide')}</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/25'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('guideTabAdmin', 'Executive Admin Manual')}</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: USER & CLIENT GUIDE */}
        {/* ============================================================ */}
        {activeTab === 'user' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Section Navigation */}
            <div className="lg:col-span-4 bg-[#0a0c13]/80 border border-white/10 rounded-3xl p-5 backdrop-blur-2xl sticky top-28 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 px-3 block mb-2">
                {isBn ? 'ইউজার ফিচার মেনু' : 'User Features Navigation'}
              </span>

              {[
                {
                  id: 'customizer',
                  label: isBn ? '১. ৩ডি কাস্টমাইজার স্টুডিও' : '1. 3D Customizer Studio',
                  icon: Layers,
                },
                {
                  id: 'simulator',
                  label: isBn ? '২. ইঞ্জিন সাউন্ড ও সোজা রাস্তা' : '2. Engine Sound & Road Run',
                  icon: Volume2,
                },
                {
                  id: 'garage',
                  label: isBn ? '৩. ভার্চুয়াল গ্যারেজ ভল্ট' : '3. Virtual Garage Vault',
                  icon: BookmarkCheck,
                },
                {
                  id: 'finance',
                  label: isBn ? '৪. অ্যাডভান্সড ইএমআই ক্যালকুলেটর' : '4. Advanced EMI Calculator',
                  icon: Calculator,
                },
                {
                  id: 'testdrive',
                  label: isBn ? '৫. ভিআইপি টেস্ট ড্রাইভ বুকিং' : '5. VIP Test Drive Booking',
                  icon: Compass,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveUserSection(item.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeUserSection === item.id
                      ? 'bg-cyan-500/15 border border-cyan-400 text-cyan-400'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-white/10 px-3">
                <Link
                  href="/customizer"
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isBn ? 'কাস্টমাইজার খুলুন' : 'Open Customizer'}</span>
                </Link>
              </div>
            </div>

            {/* Right Content Panel */}
            <div className="lg:col-span-8 bg-[#0a0c13]/85 border border-white/15 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
              {/* SECTION: 3D CUSTOMIZER */}
              {activeUserSection === 'customizer' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isBn ? '৩ডি কাস্টমাইজার স্টুডিও পরিচালনা' : 'Mastering the 3D Customizer Studio'}
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono">
                        {isBn ? 'রিয়েল-টাইম থ্রি-ডি মডেলিং ও কনফিগারেশন' : 'Real-time WebGL Model Configuration'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {isBn
                      ? 'আমাদের ৩ডি কাস্টমাইজারে আপনি সম্পূর্ণ রিয়েল-টাইমে ৩৬০ ডিগ্রি অ্যাঙ্গেলে গাড়ি ঘুরিয়ে দেখতে পারবেন। প্রতিটি গাড়ির জন্য ৫টি পৃথক পার্সোনালাইজেশন জোন রয়েছে:'
                      : 'Our 3D Customizer Studio gives you full 360-degree interactive freedom to inspect, configure, and engineer your machine. It features 5 multi-zone tabs:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-cyan-400 uppercase font-mono">
                        {isBn ? '১. বডি পেইন্ট ও ফিনিশ' : '1. Body Paint & Finish'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? '৮টি এক্সক্লুসিভ রঙ (নর্ডিক আইস, অ্যাটলাস সিয়ান, রয়্যাল রুবি ইত্যাদি) এবং ৪টি সারফেস ফিনিশ (মেটালিক, আল্ট্রা-ম্যাট, সাটিন ও গ্লস) বেছে নিন।'
                          : 'Choose from 8 curated luxury shades with 4 distinct clearcoats: Metallic Pearl, Ultra-Matte Stealth, Satin Velvet, and Deep Gloss.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-cyan-400 uppercase font-mono">
                        {isBn ? '২. চাকা ও ব্রেক ক্যালিপার' : '2. Wheels & Brake Calipers'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? 'ফরজড অ্যালয় রিম (কার্বন ব্ল্যাক, ব্রাশড গোল্ড, হাইপার সিলভার) এবং রেসিং ব্রেক ক্যালিপারের রঙ পরিবর্তন করুন।'
                          : 'Select custom forged multi-spoke rims and contrast racing caliper lacquers (Acid Cyan, Track Yellow, Rosso Corsa).'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-cyan-400 uppercase font-mono">
                        {isBn ? '৩. লাক্সারি ইন্টেরিয়র লেদার' : '3. Interior Leather Hide'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? 'কাস্টম নাপ্পা লেদার ও আলকান্টারা ট্রিম (টাস্কান ট্যান, সিয়ান রেস, ক্রিস্টাল হোয়াইট, ওবসিডিয়ান ব্ল্যাক)।'
                          : 'Custom tailored leather upholstery appointments including Tuscan Tan, Cyan Race Alcantara, and Crisp White hide.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-cyan-400 uppercase font-mono">
                        {isBn ? '৪. এয়ারো ট্রিম ও অপটিক্স' : '4. Aero Trim & Laser Optics'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? 'কার্বন ফাইবার মিরর ক্যাপ, লেজার হেডলাইট সিগনেচার এবং ৩ স্তরের প্রাইভেসি গ্লাস টিন্ট (ক্লিয়ার, ৩৫% এবং ৫%)।'
                          : 'Carbon aero trims, laser projector beam temperatures, and executive privacy tint depths.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-white block">
                        {isBn ? 'গ্যারেজে সেভ করার সুবিধা' : 'Save Directly to Virtual Garage'}
                      </span>
                      <p className="text-neutral-300 mt-0.5">
                        {isBn
                          ? 'আপনার পছন্দের ডিজাইনটি সম্পন্ন হলে উপরের "গ্যারেজে সেভ করুন" বাটনে ক্লিক করুন। এটি সরাসরি আপনার ভার্চুয়াল গ্যারেজে স্টোর হয়ে যাবে।'
                          : 'When finished with your bespoke commission, tap "Save to Virtual Garage" to store your specification safely in your browser.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: SIMULATOR & SOUND */}
              {activeUserSection === 'simulator' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Volume2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isBn ? 'ইঞ্জিন সাউন্ড ও সোজা রাস্তা সিমুলেশন' : 'Real-time Engine Audio & Road Run'}
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono">
                        {isBn ? 'ওয়েব অডিও এপিআই ও ডায়নামিক ক্যামেরা কন্ট্রোল' : 'Web Audio API Synthesis & Telemetry HUD'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {isBn
                      ? 'প্রতিটি হাইপারকারের ইঞ্জিন গর্জন এবং ড্রাইভিং অনুভূতি যাচাই করার জন্য আমাদের ককপিট কন্ট্রোল তৈরি করা হয়েছে:'
                      : 'Experience real synthetic engine harmonics and driving road simulation with responsive physics:'}
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {toBnDigits('1')}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">
                          {isBn ? 'স্টার্ট ইঞ্জিন ও রিয়েল ইঞ্জিন সাউন্ড' : 'Start Engine with Dynamic Audio'}
                        </span>
                        <p className="text-neutral-400 mt-1 leading-relaxed">
                          {isBn
                            ? '"START ENGINE" বাটনে ক্লিক করলে ইঞ্জিনের গর্জন শুরু হয়। স্পিড বাড়ানোর সাথে সাথে ইঞ্জিনের পিচ ও আরপিএম (RPM) নিখুঁতভাবে পরিবর্তিত হয়।'
                            : 'Pressing "Start Engine" triggers Web Audio API oscillator synthesis matching engine idling, acceleration, and cruising gears.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {toBnDigits('2')}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">
                          {isBn ? 'সোজা রাস্তায় ড্রাইভিং সিমুলেশন (Road Run)' : 'Straight Road Run Simulation'}
                        </span>
                        <p className="text-neutral-400 mt-1 leading-relaxed">
                          {isBn
                            ? '"সোজা রাস্তায় ড্রাইভিং সিমুলেশন" চালু করলে ৩ডি মডেলের নিচে একটি অনন্ত হাইওয়ে তৈরি হয় এবং চাকাগুলো নিখুঁত সোজা কোণে সামনে ঘুরতে থাকে।'
                            : 'Enabling Road Run generates an infinite asphalt speedway directly beneath the vehicle with perfectly aligned forward wheel rotation.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {toBnDigits('3')}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">
                          {isBn ? 'হেডলাইট ও পরিবেশ নির্বাচন (HDRI)' : 'Headlights & HDRI Atmosphere'}
                        </span>
                        <p className="text-neutral-400 mt-1 leading-relaxed">
                          {isBn
                            ? 'স্টুডিও, সূর্যাস্ত (Sunset Boulevard), অথবা রাতের আবহে (Night Circuit) গাড়িটির আলোর বিচ্ছুরণ ও হেডলাইটের প্রজেকশন পরীক্ষা করতে পারেন।'
                            : 'Switch between Studio Atelier, Sunset Strip, and Nocturnal Circuit to evaluate dynamic shadows and high-beam laser optics.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: VIRTUAL GARAGE */}
              {activeUserSection === 'garage' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <BookmarkCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isBn ? 'ভার্চুয়াল গ্যারেজ ও পোর্টফোলিও ভল্ট' : 'Virtual Garage & Asset Portfolio'}
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono">
                        {isBn ? 'ব্যক্তিগত সংগ্রহশালা ও স্পেসিফিকেশন সংরক্ষণ' : 'Private Storage & One-Click Specs Restoration'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {isBn
                      ? 'ভার্চুয়াল গ্যারেজ হলো আপনার ব্যক্তিগত অটোমোটিভ সংগ্রহশালা। এখানে সংরক্ষিত গাড়িগুলোর বিবরণ এবং কার্যাবলী নিচে দেওয়া হলো:'
                      : 'The Virtual Garage serves as your personal collector vault. Key features include:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-white uppercase font-mono">
                        {isBn ? 'পোর্টফোলিও লাইভ পরিসংখ্যান' : 'Live Portfolio Telemetry'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? 'গ্যারেজের মোট মূল্য, মোট গাড়ির সংখ্যা এবং গড় গাড়ির ভ্যালুয়েশন স্বয়ংক্রিয়ভাবে ক্যালকুলেট হয়।'
                          : 'Calculates cumulative vault portfolio value, commissioned fleet count, and average vehicle allocation.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-white uppercase font-mono">
                        {isBn ? 'কাস্টমাইজেশন রিজিউম' : 'Resume Customization'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? 'যেকোনো গাড়ির নিচে "কাস্টমাইজেশন রিজিউম" বাটনে ক্লিক করলে আপনার সেভ করা বডি রঙ ও হুইল সরাসরি ৩ডি স্টুডিওতে লোড হবে।'
                          : 'Clicking "Resume Customization" restores your saved body color, wheel type, and interior in the 3D Atelier.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-white uppercase font-mono">
                        {isBn ? 'সরাসরি টেস্ট ড্রাইভ বুকিং' : 'Direct VIP Test Drive Booking'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? 'গ্যারেজের গাড়ি থেকে সরাসরি ১ ক্লিকেই টেস্ট ড্রাইভের জন্য আবেদন করা যায়।'
                          : 'Seamlessly schedule an allocation slot directly from any commissioned vehicle in your vault.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-white uppercase font-mono">
                        {isBn ? 'নিরাপদ লোকাল ডেটা স্টোরেজ' : 'Zero-Loss Storage'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? 'ব্রাউজার রিলোড বা বন্ধ করলেও আপনার সেভ করা কনফিগারেশন মুছে যাবে না।'
                          : 'Persisted reliably in local state so your custom specs remain safe across browser sessions.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: FINANCE */}
              {activeUserSection === 'finance' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isBn ? 'অ্যাডভান্সড ফাইন্যান্সিং ও ইএমআই ক্যালকুলেটর' : 'Advanced Financing & EMI Calculator'}
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono">
                        {isBn ? 'রিয়েল-টাইম কম্পাউন্ডিং ও কিস্তি হিসাব বিবরণী' : 'Real-time Amortization & Installment Telemetry'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {isBn
                      ? 'লাক্সারি গাড়ি কেনার জন্য আমাদের ইএমআই ক্যালকুলেটর রিয়েল-টাইমে মাসিক কিস্তি এবং আর্থিক অনুপাত গণনা করে:'
                      : 'Our custom financing engine computes precision monthly installments and capital breakdowns:'}
                  </p>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                      <span className="font-bold text-cyan-400">
                        {isBn ? '• ডাউন পেমেন্ট স্লাইডার:' : '• Down Payment Range Slider:'}
                      </span>
                      <span className="text-neutral-300 ml-2">
                        {isBn
                          ? 'গাড়ির বেস মূল্যের ০% থেকে ৫০% পর্যন্ত নির্ধারণ করা যায়।'
                          : 'Adjust equity from 0% up to 50% of base vehicle valuation.'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                      <span className="font-bold text-cyan-400">
                        {isBn ? '• লোনের মেয়াদ (Term):' : '• Loan & Lease Term:'}
                      </span>
                      <span className="text-neutral-300 ml-2">
                        {isBn
                          ? '২৪, ৩৬, ৪৮, ৬০ বা ৭২ মাস (২ থেকে ৬ বছর)।'
                          : 'Select 24, 36, 48, 60, or 72 months (2 to 6 years).'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                      <span className="font-bold text-cyan-400">
                        {isBn ? '• ক্রেডিট রেটিং ও বার্ষিক সুদ (APR):' : '• Credit Benchmarks & APR:'}
                      </span>
                      <span className="text-neutral-300 ml-2">
                        {isBn
                          ? 'ডায়মন্ড (৩.৯%), প্ল্যাটিনাম (৫.৫%), গোল্ড (৭.২%), অথবা সিলেক্ট (৯.৫%)।'
                          : 'Choose from Diamond (3.9%), Platinum (5.5%), Gold (7.2%), or Select (9.5%).'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                      <span className="font-bold text-cyan-400">
                        {isBn ? '• মুদ্রা পরিবর্তন (USD & BDT):' : '• Live Currency Toggle:'}
                      </span>
                      <span className="text-neutral-300 ml-2">
                        {isBn
                          ? 'এক ক্লিকেই ইউএস ডলার ($) অথবা বাংলাদেশি টাকায় (৳) রূপান্তর দেখার সুবিধা।'
                          : 'Instant conversion between USD ($) and Bangladeshi Taka (৳).'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                      <span className="font-bold text-cyan-400">
                        {isBn ? '• বার্ষিক পেমেন্ট টেবিল ও প্রিন্ট:' : '• Annual Amortization Table & Print Spec:'}
                      </span>
                      <span className="text-neutral-300 ml-2">
                        {isBn
                          ? 'প্রতি বছর কত আসল ও কত সুদ পরিশোধ হবে তার সম্পূর্ণ চার্ট দেখা ও প্রিন্ট করার সুবিধা।'
                          : 'Year-by-year principal vs. interest amortization breakdown with one-click print feature.'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: TEST DRIVE */}
              {activeUserSection === 'testdrive' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isBn ? 'ভিআইপি টেস্ট ড্রাইভ বুকিং প্রক্রিয়া' : 'VIP Test Drive Reservation'}
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono">
                        {isBn ? 'সার্কিট ট্র্যাক, শোরুম অথবা ব্যক্তিগত বাসভবনে ডেলিভারি' : 'Track Proving Grounds or Estate Delivery'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {isBn
                      ? 'টেস্ট ড্রাইভ বুকিং করার জন্য নিচের সহজ ৩টি ধাপ অনুসরণ করুন:'
                      : 'Booking your exclusive driving session takes under two minutes:'}
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {toBnDigits('01')}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">
                          {isBn ? 'গাড়ি ও ব্যক্তিগত তথ্য প্রদান' : 'Select Vehicle & Contact Information'}
                        </span>
                        <p className="text-neutral-400 mt-1">
                          {isBn
                            ? 'আপনার পছন্দের মডেলটি ড্রপডাউন থেকে সিলেক্ট করুন এবং আপনার পূর্ণ নাম, ইমেইল ও ফোন নাম্বার দিন।'
                            : 'Choose your desired model from the fleet and supply your legal name and contact details.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {toBnDigits('02')}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">
                          {isBn ? 'ড্রাইভ ফরম্যাট ও সময় নির্বাচন' : 'Choose Experience Tier & Session Slot'}
                        </span>
                        <p className="text-neutral-400 mt-1">
                          {isBn
                            ? 'ফ্ল্যাগশিপ গ্যালারি, প্রাইভেট রেসিং সার্কিট অথবা বাসভবনে ডেলিভারি অপশন বেছে নিন এবং সুবিধাজনক সময় নির্ধারণ করুন।'
                            : 'Select Flagship Gallery, Private Track Proving Ground, or Estate Delivery alongside preferred time.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {toBnDigits('03')}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-white block">
                          {isBn ? 'ভিআইপি বোর্ডিং পাস প্রাপ্তি' : 'Receive VIP Boarding Pass'}
                        </span>
                        <p className="text-neutral-400 mt-1">
                          {isBn
                            ? 'সাবমিট করার সাথে সাথেই আপনি একটি কিউআর কোডসহ ডিজিটাল ভিআইপি বোর্ডিং পাস ও বুকিং রেফারেন্স আইডি পাবেন।'
                            : 'Immediately receive your cryptographically referenced VIP Boarding Pass and allocation ID.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: ADMIN & EXECUTIVE MANUAL */}
        {/* ============================================================ */}
        {activeTab === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Admin Section Nav */}
            <div className="lg:col-span-4 bg-[#0a0c13]/80 border border-amber-500/20 rounded-3xl p-5 backdrop-blur-2xl sticky top-28 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 px-3 block mb-2">
                {isBn ? 'অ্যাডমিন কন্ট্রোল মেনু' : 'Admin Control Menu'}
              </span>

              {[
                {
                  id: 'auth',
                  label: isBn ? '১. অ্যাডমিন অ্যাক্সেস ও লগইন' : '1. Admin Authentication',
                  icon: Key,
                },
                {
                  id: 'fleet',
                  label: isBn ? '২. ফ্লিট ইনভেন্টরি ম্যানেজমেন্ট' : '2. Fleet Inventory CRUD',
                  icon: Car,
                },
                {
                  id: 'model',
                  label: isBn ? '৩. ৩ডি শোরুম মডেল নিয়ন্ত্রণ' : '3. 3D Model Environment',
                  icon: Layers,
                },
                {
                  id: 'bookings',
                  label: isBn ? '৪. টেস্ট ড্রাইভ রিকোয়েস্ট যাচাই' : '4. VIP Bookings & Concierge',
                  icon: Compass,
                },
                {
                  id: 'branding',
                  label: isBn ? '৫. হোয়াইট-লেবেল ও লোগো পরিবর্তন' : '5. White-Label & Logo',
                  icon: Palette,
                },
                {
                  id: 'logs',
                  label: isBn ? '৬. নিরাপত্তা ও অডিট লগ' : '6. Security Audit Logs',
                  icon: FileText,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveAdminSection(item.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold font-mono flex items-center justify-between transition-all cursor-pointer ${
                    activeAdminSection === item.id
                      ? 'bg-amber-500/15 border border-amber-400 text-amber-400'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-amber-400" />
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-white/10 px-3">
                <Link
                  href="/admin"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isBn ? 'অ্যাডমিন কনসোলে যান' : 'Go to Admin Console'}</span>
                </Link>
              </div>
            </div>

            {/* Right Admin Content Panel */}
            <div className="lg:col-span-8 bg-[#0a0c13]/85 border border-amber-500/20 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
              {/* AUTH */}
              {activeAdminSection === 'auth' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Key className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isBn ? 'অ্যাডমিন প্রমাণীকরণ ও অ্যাক্সেস কন্ট্রোল' : 'Admin Authentication & Roles'}
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono">
                        {isBn ? 'সুপার-অ্যাডমিন ও জিমেইল অনুমোদন সিস্টেম' : 'Role-Based Access Control (RBAC)'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {isBn
                      ? 'অ্যাডমিন প্যানেলটি সম্পূর্ণ সুরক্ষিত। কেবল অনুমোদিত অ্যাডমিনরাই ইনভেন্টরি, ৩ডি মডেল ও বুকিং পরিবর্তন করতে পারবেন:'
                      : 'The administrative command suite is guarded by strict access verification:'}
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-amber-400 uppercase font-mono">
                        {isBn ? '১. ওয়ান-ক্লিক সুপার অ্যাডমিন অ্যাক্সেস' : '1. Instant Superadmin Authentication'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? 'টেস্টিং ও ডেমোর সুবিধার্থে "Instant Enter as Super Admin" বাটনে ক্লিক করে সাথে সাথে পূর্ণ অ্যাডমিন প্রিভিলেজ পাওয়া যায়।'
                          : 'Use "Instant Enter as Super Admin" for instant administrative clearance and full access across all modules.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-amber-400 uppercase font-mono">
                        {isBn ? '২. নতুন অ্যাডমিন যোগ করা' : '2. Adding Sub-Admins'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? 'অ্যাডমিন ট্যাবের ভেতর থেকে যেকোনো অনুমোদিত ব্যক্তির জিমেইল ঠিকানা যুক্ত বা বাতিল করা যায়।'
                          : 'Delegate authority by adding corporate or personal Gmail addresses in the Admin Access tab.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* FLEET */}
              {activeAdminSection === 'fleet' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isBn ? 'ফ্লিট ইনভেন্টরি ম্যানেজমেন্ট (CRUD)' : 'Fleet Inventory Management'}
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono">
                        {isBn ? 'গাড়ি যোগ, এডিট, ডিলিট এবং গুগল ড্রাইভ ফটো লিঙ্ক' : 'Add, Edit, Delete Vehicles & Connect Drive Media'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {isBn
                      ? 'অ্যাডমিন কনসোলে ফ্লিট ইনভেন্টরির প্রতিটি গাড়ি নিয়ন্ত্রণ করার পূর্ণ সুবিধা রয়েছে:'
                      : 'Manage every single machine listed in the public showroom:'}
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-white uppercase font-mono">
                        {isBn ? '• নতুন গাড়ি যোগ করা (Add Hypercar)' : '• Add New Hypercar'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? 'গাড়ির নাম, ক্যাটাগরি, মূল্য, সাল, হর্সপাওয়ার, ০-৬০ স্পিড, সর্বোচ্চ গতি, রেঞ্জ, এবং ড্র্যাগ কোএফিশিয়েন্ট দিয়ে নতুন গাড়ি যোগ করা যায়।'
                          : 'Provide vehicle name, category, price, year, horsepower, 0-60 acceleration, top speed, and technical specifications.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-white uppercase font-mono">
                        {isBn ? '• গুগল ড্রাইভ ফটোর সরাসরি সমর্থন' : '• Google Drive Direct Photo Conversion'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? 'গুগল ড্রাইভের শেয়ার করা লিঙ্ক পেস্ট করলেই সিস্টেম স্বয়ংক্রিয়ভাবে সরাসরি ভিউযোগ্য হাই-রেজোলিউশন ছবিতে রূপান্তর করে নেয়।'
                          : 'Paste raw Google Drive shareable links; the platform automatically converts them into direct-display CDN image assets.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <h3 className="text-xs font-bold text-white uppercase font-mono">
                        {isBn ? '• লাইভ এডিট ও রিমুভ' : '• Real-time Edit & Deletion'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {isBn
                          ? 'যেকোনো গাড়ির তথ্য পরিবর্তন বা ইনভেন্টরি থেকে স্থায়ীভাবে মুছে ফেলার পূর্ণ নিরাপত্তা ব্যবস্থা রয়েছে।'
                          : 'Update existing specifications or purge discontinued models with instant client-side synchronization.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MODEL */}
              {activeAdminSection === 'model' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isBn ? '৩ডি শোরুম ও ব্যাকগ্রাউন্ড মডেল পরিবর্তন' : '3D Showroom & Model Control'}
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono">
                        {isBn ? 'গাড়ির ৩ডি .glb মডেল পরিবর্তন ও কাস্টম ইউআরএল' : 'Dynamic .glb URL Assignment'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {isBn
                      ? 'শোরুমের মূল ব্যাকগ্রাউন্ডে কোন ৩ডি মডেল প্রদর্শিত হবে তা অ্যাডমিন নিজেই সিলেক্ট করতে পারেন:'
                      : 'Change the featured 3D model rendered on the hero canvas and customizer studio:'}
                  </p>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-neutral-300 space-y-2">
                    <p>
                      {isBn
                        ? '১. ড্রপডাউন থেকে প্রি-ইনস্টল করা ৩ডি মডেল সিলেক্ট করতে পারেন।'
                        : '1. Select from built-in 3D assets in the dropdown.'}
                    </p>
                    <p>
                      {isBn
                        ? '২. নিজস্ব তৈরি করা যেকোনো .glb ফাইলের লিঙ্ক বা গুগল ড্রাইভ ৩ডি মডেল লিঙ্ক সরাসরি বসাতে পারেন।'
                        : '2. Or paste any custom hosted .glb model URL to load custom 3D vehicle geometries.'}
                    </p>
                  </div>
                </div>
              )}

              {/* BOOKINGS */}
              {activeAdminSection === 'bookings' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isBn ? 'ভিআইপি টেস্ট ড্রাইভ বুকিং পরিচালনা' : 'VIP Bookings & Concierge Handling'}
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono">
                        {isBn ? 'ক্লায়েন্ট আবেদন পর্যালোচনা ও অনুমোদন' : 'Review, Approve, or Decline Test Drive Passes'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {isBn
                      ? 'ক্লায়েন্টরা টেস্ট ড্রাইভ বুক করলে তাৎক্ষণিকভাবে অ্যাডমিন প্যানেলের "User Activity & VIP Bookings" ট্যাবে জমা হয়:'
                      : 'All client test-drive submissions populate the reservation queue:'}
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                      <span className="font-bold text-amber-400">
                        {isBn ? '• ক্লায়েন্টের বিবরণ প্রদর্শন:' : '• Client Details Display:'}
                      </span>
                      <p className="text-neutral-400 mt-1">
                        {isBn
                          ? 'ক্লায়েন্টের নাম, ইমেইল, ফোন নাম্বার, পছন্দের গাড়ি, ডেলিভারির স্থান ও কনসিয়ার্জ নোট স্পষ্টভাবে দেখা যায়।'
                          : 'View client name, email, contact telephone, vehicle model, venue tier, and custom requests.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                      <span className="font-bold text-amber-400">
                        {isBn ? '• বুকিং অনুমোদন ও স্ট্যাটাস আপডেট:' : '• Status Approval & Updates:'}
                      </span>
                      <p className="text-neutral-400 mt-1">
                        {isBn
                          ? 'অ্যাডমিন এক ক্লিকেই আবেদনটি "অনুমোদিত" (Approved) বা "বাতিল" (Rejected) করতে পারেন।'
                          : 'Approve or decline reservations with a single click to manage circuit capacity.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* BRANDING */}
              {activeAdminSection === 'branding' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isBn ? 'হোয়াইট-লেবেল ও পূর্ণ ব্র্যান্ডিং কাস্টমাইজেশন' : 'White-Label & Branding Suite'}
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono">
                        {isBn ? 'কোম্পানির নাম, ট্যাগলাইন এবং ইমেজ/টেক্সট লোগো পরিবর্তন' : 'Change Brand Name, Slogan & Custom Logo Asset'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {isBn
                      ? 'অ্যাডমিন তার নিজস্ব ব্র্যান্ড অনুযায়ী পুরো ওয়েবসাইটের পরিচয় মুহূর্তের মধ্যে বদলে দিতে পারেন:'
                      : 'Tailor the entire platform identity to match your agency, dealership, or atelier brand:'}
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                      <span className="font-bold text-amber-400">
                        {isBn ? '• ইমেজ লোগো আপলোড (PNG/SVG/WebP):' : '• Custom Logo Image Upload:'}
                      </span>
                      <p className="text-neutral-400 mt-1">
                        {isBn
                          ? 'আপনার নিজস্ব ব্র্যান্ড লোগো সরাসরি আপলোড করলে পুরো ওয়েবসাইটের নেভবার, ফুটার ও মোবাইলে সেই লোগো ফুটে উঠবে।'
                          : 'Upload any PNG, SVG, or WebP logo file to replace the default emblem across navigation and footer.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                      <span className="font-bold text-amber-400">
                        {isBn ? '• ব্র্যান্ড নাম ও ট্যাগলাইন পরিবর্তন:' : '• Brand Name & Tagline Override:'}
                      </span>
                      <p className="text-neutral-400 mt-1">
                        {isBn
                          ? 'ব্র্যান্ডের নাম (যেমন: Apex Motors, Velocity Motors ইত্যাদি) লিখে সেভ করলেই পুরো সাইটের হেডার ও ব্যানার আপডেট হয়ে যায়।'
                          : 'Customize the primary dealership brand name and subtitle in real-time.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* LOGS */}
              {activeAdminSection === 'logs' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isBn ? 'নিরাপত্তা ও অডিট অ্যাক্টিভিটি লগ' : 'Security & Activity Audit Logs'}
                      </h2>
                      <p className="text-xs text-neutral-400 font-mono">
                        {isBn ? 'ইউজার ইন্টারঅ্যাকশন ও সিস্টেম টাইমস্ট্যাম্প' : 'System Transparency & Audit Tracking'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {isBn
                      ? 'প্ল্যাটফর্মের প্রতিটি গুরুত্বপূর্ণ অ্যাকশন ও পরিবর্তন অডিট লগে সংরক্ষিত হয়:'
                      : 'Every critical system action is recorded for transparency and compliance:'}
                  </p>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-neutral-300 space-y-2">
                    <p>
                      {isBn
                        ? '• গাড়ি যোগ, সম্পাদন বা মুছে ফেলার সময় ও বিবরণ।'
                        : '• Timestamped records of vehicle creation, modification, and deletion.'}
                    </p>
                    <p>
                      {isBn
                        ? '• ক্লায়েন্টদের নতুন টেস্ট ড্রাইভ বুকিং সাবমিশন।'
                        : '• Client test-drive reservations and status modifications.'}
                    </p>
                    <p>
                      {isBn
                        ? '• অ্যাডমিন লগইন ও সাইন-আউট টাইমস্ট্যাম্প।'
                        : '• Administrative authentication timestamps and IP / session traces.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
