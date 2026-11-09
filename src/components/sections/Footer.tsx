'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ArrowUp, Mail, Shield, Globe, Award, Flame, Crown, Sparkles, BookOpen } from 'lucide-react';
import { useCars } from '@/context/CarContext';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { branding } = useCars();
  const { isBn, t, toBnDigits } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const words = (isBn ? 'ভেলোসিটি মোটরস' : (branding?.brandName || 'VELOCITY MOTORS')).split(' ');
  const firstWord = words[0];
  const restWords = words.slice(1).join(' ');

  const renderLogo = () => {
    if (branding?.logoType === 'image' && branding?.logoImageUrl) {
      return (
        <img
          src={branding.logoImageUrl}
          alt={branding.brandName}
          className="w-9 h-9 object-contain rounded-xl border border-cyan-500/40 p-1 bg-[#0a0c14]"
        />
      );
    }
    const IconComponent =
      branding?.logoIcon === 'shield'
        ? Shield
        : branding?.logoIcon === 'flame'
        ? Flame
        : branding?.logoIcon === 'crown'
        ? Crown
        : branding?.logoIcon === 'sparkles'
        ? Sparkles
        : Zap;

    return (
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20">
        <div className="w-full h-full bg-[#0a0c14] rounded-xl flex items-center justify-center">
          <IconComponent className="w-4 h-4 text-cyan-400" />
        </div>
      </div>
    );
  };

  const showrooms = isBn
    ? [
        { city: 'ঢাকা (বাংলাদেশ)', address: 'গুলশান-২ কূটনৈতিক জোন, ঢাকা' },
        { city: 'দুবাই (UAE)', address: 'ডিআইএফসি গেট ভিলেজ ০৪, দুবাই' },
        { city: 'লন্ডন (UK)', address: '৪৪ বার্কলে স্কয়ার, মেফেয়ার, লন্ডন' },
        { city: 'টোকিও (জাপান)', address: 'গিনজা ৬, চুও সিটি, টোকিও' },
        { city: 'বেভারলি হিলস (USA)', address: 'উইলশায়ার ও রোডিও ড্রাইভ, ক্যালিফোর্নিয়া' },
      ]
    : [
        { city: 'Dubai', address: 'DIFC Gate Village 04, UAE' },
        { city: 'London', address: '44 Berkeley Square, Mayfair, UK' },
        { city: 'Dhaka', address: 'Gulshan-2 Diplomatic Zone, Bangladesh' },
        { city: 'Tokyo', address: 'Ginza 6, Chuo City, Japan' },
        { city: 'Beverly Hills', address: 'Wilshire & Rodeo Dr, CA, USA' },
      ];

  return (
    <footer className="relative bg-[#040507]/90 backdrop-blur-xl border-t border-white/10 text-neutral-400 pt-16 pb-12 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              {renderLogo()}
              <span className="text-xl font-black tracking-wider text-white uppercase font-sans">
                {firstWord} {restWords && <span className="text-cyan-400">{restWords}</span>}
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {t('footerBrandDesc')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />{' '}
                {isBn ? 'এফআইএ নিরাপত্তা মানদণ্ড' : 'FIA Safety Standard'}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />{' '}
                {isBn ? 'বিশ্বব্যাপী কনসিয়ার্জ ডেলিভারি' : 'Global Delivery'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-4">
              {isBn ? 'নেভিগেশন ও গাইড' : 'Bespoke Atelier'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/customizer" className="hover:text-cyan-400 transition-colors">
                  {t('navCustomizer')}
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="hover:text-cyan-400 transition-colors">
                  {t('navInventory')}
                </Link>
              </li>
              <li>
                <Link href="/garage" className="hover:text-cyan-400 transition-colors">
                  {t('navGarage')}
                </Link>
              </li>
              <li>
                <Link href="/test-drive" className="hover:text-cyan-400 transition-colors">
                  {t('navTestDrive')}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-cyan-400 transition-colors font-bold text-cyan-300 flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-cyan-400" />
                  <span>{t('navGuide')}</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors text-neutral-500">
                  {t('navAdmin')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Global Showrooms */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-4">
              {t('footerShowrooms')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {showrooms.map((room, i) => (
                <li key={i}>
                  <span className="text-white font-medium block">{room.city}</span>
                  <span className="text-[11px] text-neutral-500">{room.address}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* VIP Newsletter / Confidential Allocation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-4">
              {isBn ? 'ভিআইপি ইনভিটেশন' : 'Confidential Allocations'}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              {isBn
                ? 'পাবলিক রিলিজের পূর্বেই নতুন হাইপারকারের প্রাইভেট স্লট আমন্ত্রণ পেতে নিবন্ধন করুন।'
                : 'Receive private build slot invitations prior to public disclosure.'}
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="vip@domain.com"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {isBn ? 'আমন্ত্রণ গ্রহণ করুন' : 'Request Access'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            © {toBnDigits('2026')} {isBn ? 'ভেলোসিটি মোটরস' : (branding?.brandName || 'VELOCITY MOTORS')}. {t('footerAllRightsReserved')}
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-300 cursor-pointer transition-colors">
              {t('footerPrivacy')}
            </span>
            <span className="hover:text-neutral-300 cursor-pointer transition-colors">
              {t('footerTerms')}
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <span>{isBn ? 'উপরে যান' : 'Back to Top'}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
