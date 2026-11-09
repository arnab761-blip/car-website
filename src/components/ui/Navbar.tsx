'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Menu, X, ArrowUpRight, ShieldCheck, LogOut, Home, Sliders, Car, Calendar, Shield, Flame, Crown, Sparkles, Bookmark, Globe, BookOpen } from 'lucide-react';
import { useCars } from '@/context/CarContext';
import { useGarage } from '@/hooks/useGarage';
import { useLanguage } from '@/context/LanguageContext';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { loggedInUser, logout, branding } = useCars();
  const { language, setLanguage, toggleLanguage, isBn, t, toBnDigits } = useLanguage();

  const words = (isBn ? 'ভেলোসিটি মোটরস' : (branding?.brandName || 'VELOCITY MOTORS')).split(' ');
  const firstWord = words[0];
  const restWords = words.slice(1).join(' ');

  const renderLogo = () => {
    if (branding?.logoType === 'image' && branding?.logoImageUrl) {
      return (
        <img
          src={branding.logoImageUrl}
          alt={branding.brandName}
          className="w-10 h-10 object-contain rounded-xl border border-cyan-500/40 p-1 bg-[#0a0c14] shadow-lg shadow-cyan-500/20"
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
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
        <div className="w-full h-full bg-[#0a0c14] rounded-xl flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const { count: garageCount } = useGarage();

  const navLinks = [
    { name: t('navOverview'), href: '/', icon: Home },
    { name: t('navCustomizer'), href: '/customizer', icon: Sliders },
    { name: t('navInventory'), href: '/inventory', icon: Car },
    { name: t('navGarage'), href: '/garage', icon: Bookmark, badge: garageCount },
    { name: t('navTestDrive'), href: '/test-drive', icon: Calendar },
    { name: t('navGuide'), href: '/guide', icon: BookOpen },
  ];

  const isAdmin = loggedInUser?.role === 'admin' || loggedInUser?.role === 'superadmin';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? 'bg-[#07080b]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/80 py-3'
            : 'bg-gradient-to-b from-black/95 via-black/60 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group text-left focus:outline-none z-10"
          >
            {renderLogo()}
            <div>
              <span className="text-xl font-black tracking-wider text-white uppercase font-sans flex items-center gap-1.5">
                {firstWord} {restWords && <span className="text-cyan-400">{restWords}</span>}
              </span>
              <span className="block text-[9px] tracking-[0.25em] text-neutral-400 uppercase font-mono">
                {branding?.tagline || 'GLOBAL LUXURY & PERFORMANCE AUTOMOTIVE'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                      : 'text-neutral-300 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold leading-none ${
                        isActive
                          ? 'bg-black text-cyan-300'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language Switcher Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer ${
                isBn
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-md shadow-amber-500/20'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white border-white/10'
              }`}
              title={isBn ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isBn ? 'বাংলা' : 'EN'}</span>
              <span className="text-[10px] opacity-40">|</span>
              <span className="text-[10px] opacity-60">{isBn ? 'EN' : 'বাং'}</span>
            </button>

            {/* Admin Portal Link */}
            <Link
              href={isAdmin ? '/admin' : '/admin/login'}
              className={`px-3.5 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                pathname.startsWith('/admin')
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white border-white/10 hover:border-white/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAdmin ? t('navAdmin') : t('navAdminLogin')}</span>
            </Link>

            {/* User Session status */}
            {loggedInUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <span className="text-xs font-mono text-cyan-400 max-w-[120px] truncate">
                  {loggedInUser.name}
                </span>
                <button
                  onClick={logout}
                  title={t('navLogout')}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Book Test Drive Button */}
            <Link
              href="/test-drive"
              className="relative inline-flex items-center justify-center p-[1px] overflow-hidden rounded-full font-medium transition-all group cursor-pointer"
            >
              <span className="w-full h-full bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 group-hover:from-cyan-400 group-hover:to-blue-500 absolute" />
              <span className="relative px-4 py-2 transition-all ease-out bg-[#07090e] rounded-full group-hover:bg-opacity-0 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <span>{t('navBookTestDrive')}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center gap-2 z-10">
            {/* Quick Mobile Language Toggle Button */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.08] border border-white/15 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>{isBn ? 'বাং' : 'EN'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2.5 rounded-2xl bg-white/[0.1] active:bg-cyan-500/30 border border-white/20 text-white focus:outline-none cursor-pointer"
              aria-label="Toggle Mobile Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-cyan-400" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Robust Fullscreen Mobile Navigation Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[999] md:hidden flex flex-col justify-start">
          {/* Dark Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Mobile Drawer Panel */}
          <div className="relative top-20 mx-4 bg-[#0a0c14] border border-cyan-500/30 rounded-3xl p-5 shadow-2xl shadow-cyan-500/20 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                {isBn ? 'শোরুম মেনু' : 'Showroom Navigation'}
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg bg-white/[0.08] text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Language Switcher Bar */}
            <div className="flex items-center justify-between p-2 rounded-2xl bg-white/[0.04] border border-white/10 mb-3">
              <span className="text-xs font-mono text-neutral-300 flex items-center gap-2 pl-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{t('languageSelect')}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all ${
                    !isBn
                      ? 'bg-cyan-500 text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('bn')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all ${
                    isBn
                      ? 'bg-amber-400 text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full px-4 py-3.5 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                        : 'bg-white/[0.04] text-neutral-200 active:bg-white/[0.1] border border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                      <span>{link.name}</span>
                      {link.badge !== undefined && link.badge > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-400 text-black">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-70" />
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-white/10 mt-2 space-y-2">
                <Link
                  href={isAdmin ? '/admin' : '/admin/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs tracking-wider uppercase flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isAdmin ? t('navAdmin') : t('navAdminLogin')}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/test-drive"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/30"
                >
                  <span>{t('navBookTestDrive')}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
