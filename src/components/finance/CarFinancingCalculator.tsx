'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Sliders,
  RotateCcw,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Coins,
  Printer,
  Info,
} from 'lucide-react';
import {
  calculateFinanceDetails,
  formatUSD,
  formatBDT,
  formatDualCurrency,
  DEFAULT_USD_TO_BDT_RATE,
} from '@/lib/financeUtils';
import { useLanguage } from '@/context/LanguageContext';

export interface CarFinancingCalculatorProps {
  initialPrice?: number;
  carName?: string;
  carId?: string;
  className?: string;
}

const TERM_OPTIONS = [24, 36, 48, 60, 72];
const DOWN_PERCENT_QUICK = [0, 10, 20, 30, 50];

export function CarFinancingCalculator({
  initialPrice = 350000,
  carName = 'Apex Supercar Fleet',
  carId,
  className = '',
}: CarFinancingCalculatorProps) {
  const { t, toBnDigits, isBn } = useLanguage();

  // Primary State
  const [carPrice, setCarPrice] = useState<number>(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60);
  const [interestRateAPR, setInterestRateAPR] = useState<number>(4.9);
  const [tradeInValue, setTradeInValue] = useState<number>(0);

  // Advanced toggles
  const [includeSalesTax, setIncludeSalesTax] = useState<boolean>(false);
  const [salesTaxPercent, setSalesTaxPercent] = useState<number>(5.5);
  const [capitalizeTax, setCapitalizeTax] = useState<boolean>(true);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // Currency Display Mode ('USD' or 'BDT')
  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'BDT'>('USD');
  const [exchangeRate] = useState<number>(DEFAULT_USD_TO_BDT_RATE);

  const creditTiers = useMemo(() => [
    {
      id: 'diamond',
      label: isBn ? t('creditTierDiamond') : 'Diamond Tier',
      score: isBn ? toBnDigits('780+') : '780+',
      apr: 2.9,
      desc: isBn ? t('creditTierDiamondDesc') : 'Ultra-prime private banking rates',
    },
    {
      id: 'platinum',
      label: isBn ? t('creditTierPlatinum') : 'Platinum Tier',
      score: isBn ? `${toBnDigits('720')} - ${toBnDigits('779')}` : '720 - 779',
      apr: 4.9,
      desc: isBn ? t('creditTierPlatinumDesc') : 'Excellent executive financing',
    },
    {
      id: 'gold',
      label: isBn ? t('creditTierGold') : 'Gold Tier',
      score: isBn ? `${toBnDigits('660')} - ${toBnDigits('719')}` : '660 - 719',
      apr: 7.4,
      desc: isBn ? t('creditTierGoldDesc') : 'Standard premier automotive tier',
    },
    {
      id: 'select',
      label: isBn ? t('creditTierSelect') : 'Select Tier',
      score: isBn ? `${toBnDigits('600')} - ${toBnDigits('659')}` : '600 - 659',
      apr: 10.9,
      desc: isBn ? t('creditTierSelectDesc') : 'Flexible bespoke financing',
    },
  ], [isBn, t, toBnDigits]);

  // Real-time calculation computation
  const financeResult = useMemo(() => {
    return calculateFinanceDetails({
      carPrice,
      downPaymentPercent,
      loanTermMonths,
      interestRateAPR,
      tradeInValue,
      salesTaxPercent: includeSalesTax ? salesTaxPercent : 0,
      includeTaxInLoan: includeSalesTax && capitalizeTax,
    });
  }, [
    carPrice,
    downPaymentPercent,
    loanTermMonths,
    interestRateAPR,
    tradeInValue,
    includeSalesTax,
    salesTaxPercent,
    capitalizeTax,
  ]);

  // Reset to initial settings
  const handleReset = () => {
    setCarPrice(initialPrice);
    setDownPaymentPercent(20);
    setLoanTermMonths(60);
    setInterestRateAPR(4.9);
    setTradeInValue(0);
    setIncludeSalesTax(false);
  };

  // Helper for Dual Currency Display
  const renderDualAmount = (amountInUSD: number) => {
    const { primary, secondary } = formatDualCurrency(amountInUSD, activeCurrency, exchangeRate);
    return (
      <div className="flex flex-col">
        <span className="font-bold text-white tracking-tight">
          {isBn ? toBnDigits(primary) : primary}
        </span>
        <span className="text-[10px] text-neutral-400 font-mono tracking-normal">
          {isBn ? toBnDigits(secondary) : secondary}
        </span>
      </div>
    );
  };

  // Monthly Payment Formatted
  const monthlyPaymentFormatted = formatDualCurrency(
    financeResult.monthlyPayment,
    activeCurrency,
    exchangeRate
  );

  return (
    <section
      id="finance-calculator"
      className={`relative w-full rounded-3xl bg-[#080a12]/90 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden ${className}`}
    >
      {/* Background Ambient Glow Accents */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ================= HEADER SECTION ================= */}
      <div className="px-6 py-6 sm:px-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t('financeBadge', 'VIP Financing & EMI Atelier')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{t('financeTitle', 'Automotive Financing & Lease Estimator')}</span>
            <span className="hidden sm:inline-block text-xs font-mono font-normal px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-300">
              {t('financeLiveAmortization', 'Live Compounding')}
            </span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans">
            {t('financeConfigureAmortization', 'Configure down payment, loan tenure, and APR interest to model real-time luxury amortization for')}{' '}
            <span className="text-cyan-300 font-semibold">{carName}</span>.
          </p>
        </div>

        {/* Currency Switcher & Reset Tools */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          {/* USD / BDT Toggle Pill */}
          <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/15 backdrop-blur-md">
            <button
              onClick={() => setActiveCurrency('USD')}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCurrency === 'USD'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>USD ($)</span>
            </button>

            <button
              onClick={() => setActiveCurrency('BDT')}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCurrency === 'BDT'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>BDT (৳)</span>
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            type="button"
            title="Reset to default terms"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= MAIN CALCULATOR BODY GRID ================= */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* ================= LEFT COLUMN: INPUTS & SLIDERS (7 COLS) ================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Base Vehicle Price Input */}
          <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl relative group hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('financeValuation', 'Base Vehicle Valuation')}</span>
              </label>
              <span className="text-[11px] font-mono text-cyan-400/80">
                {activeCurrency === 'USD'
                  ? (isBn ? toBnDigits(formatBDT(carPrice, exchangeRate)) : formatBDT(carPrice, exchangeRate))
                  : (isBn ? toBnDigits(formatUSD(carPrice)) : formatUSD(carPrice))}
              </span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 text-neutral-500 font-mono text-lg font-bold">
                {activeCurrency === 'USD' ? '$' : '৳'}
              </span>
              <input
                type="number"
                min={10000}
                max={10000000}
                step={5000}
                value={carPrice}
                onChange={(e) => setCarPrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-10 pr-4 py-3 bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl font-mono text-lg font-black text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          {/* 2. Down Payment Slider & Controls */}
          <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('financeDownPaymentEquity', 'Down Payment Equity')}</span>
                </label>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  {isBn ? toBnDigits(formatUSD(financeResult.downPaymentAmount)) : formatUSD(financeResult.downPaymentAmount)}{' '}
                  <span className="text-xs font-normal text-neutral-400">
                    ({isBn ? toBnDigits(downPaymentPercent) : downPaymentPercent}% {t('financeOfMsrp', 'of MSRP')})
                  </span>
                </div>
              </div>

              {/* Exact BDT Equivalent */}
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                  {t('financeBdtEquivalent', 'BDT Equivalent')}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {isBn ? toBnDigits(formatBDT(financeResult.downPaymentAmount, exchangeRate)) : formatBDT(financeResult.downPaymentAmount, exchangeRate)}
                </span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="space-y-1.5">
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>{isBn ? toBnDigits('0%') : '0%'} ({t('financeNoDown', 'No Down')})</span>
                <span>{isBn ? toBnDigits('25%') : '25%'}</span>
                <span>{isBn ? toBnDigits('50%') : '50%'} {t('financeMax', 'Max')}</span>
              </div>
            </div>

            {/* Quick Percentage Buttons */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none">
              {DOWN_PERCENT_QUICK.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDownPaymentPercent(pct)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer shrink-0 ${
                    downPaymentPercent === pct
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {isBn ? toBnDigits(pct) : pct}%
                </button>
              ))}
            </div>
          </div>

          {/* 3. Loan Term Duration (Months) */}
          <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('financeLoanTermDuration', 'Loan Term Duration')}</span>
              </label>
              <span className="text-xs font-mono text-cyan-300 font-bold">
                {isBn ? toBnDigits(loanTermMonths) : loanTermMonths} {t('financeMonths', 'Months')} ({isBn ? toBnDigits((loanTermMonths / 12).toFixed(1)) : (loanTermMonths / 12).toFixed(1)} {t('financeYears', 'Years')})
              </span>
            </div>

            {/* Term Pill Selector Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {TERM_OPTIONS.map((term) => {
                const isSelected = loanTermMonths === term;
                return (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setLoanTermMonths(term)}
                    className={`py-2.5 px-1 rounded-xl text-xs font-mono text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-b from-cyan-500/25 to-blue-500/20 border border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/20'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold text-sm leading-none">{isBn ? toBnDigits(term) : term}</span>
                    <span className="text-[9px] uppercase text-neutral-400 mt-0.5">{t('financeMonths', 'Months')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Interest Rate (APR) & Credit Score Tier Presets */}
          <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('financeInterestRate', 'Annual Percentage Rate (APR)')}</span>
                </label>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  {isBn ? toBnDigits(interestRateAPR.toFixed(1)) : interestRateAPR.toFixed(1)}% APR
                </div>
              </div>

              {/* Number Input for Fine-tuning */}
              <div className="flex items-center gap-1 bg-black/60 border border-white/15 px-3 py-1.5 rounded-xl">
                <input
                  type="number"
                  min={0.1}
                  max={25.0}
                  step={0.1}
                  value={interestRateAPR}
                  onChange={(e) => setInterestRateAPR(Math.max(0, Number(e.target.value)))}
                  className="w-14 bg-transparent text-right font-mono font-bold text-white focus:outline-none"
                />
                <span className="text-xs text-neutral-400 font-mono">%</span>
              </div>
            </div>

            {/* APR Range Slider */}
            <div className="space-y-1.5">
              <input
                type="range"
                min={1.9}
                max={15.9}
                step={0.1}
                value={interestRateAPR}
                onChange={(e) => setInterestRateAPR(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>{isBn ? toBnDigits('1.9%') : '1.9%'}</span>
                <span>{isBn ? toBnDigits('8.9%') : '8.9%'}</span>
                <span>{isBn ? toBnDigits('15.9%') : '15.9%'}</span>
              </div>
            </div>

            {/* Credit Score Presets */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2 block">
                {t('financeAprBenchmark', 'VIP Credit Rating Benchmarks:')}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {creditTiers.map((tier) => {
                  const isMatch = Math.abs(interestRateAPR - tier.apr) < 0.05;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setInterestRateAPR(tier.apr)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        isMatch
                          ? 'bg-cyan-500/15 border-cyan-400/60 ring-1 ring-cyan-400/40'
                          : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white leading-tight">
                          {tier.label}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300 font-bold">
                          {isBn ? toBnDigits(tier.apr) : tier.apr}%
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-400 block mt-0.5">
                        {tier.score}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. Advanced Trade-In & Tax Adjustments (Expandable) */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/40">
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="w-full p-4 flex items-center justify-between text-left text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('financeAdvancedToggle', 'Advanced Equity & Taxes (Optional Trade-In)')}</span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-5 pt-0 border-t border-white/10 space-y-4">
                {/* Trade In Input */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-neutral-400">{t('financeTradeInAllowance', 'Trade-In Allowance Equity')}</label>
                    <span className="text-xs font-mono text-neutral-300">
                      {isBn ? toBnDigits(formatUSD(tradeInValue)) : formatUSD(tradeInValue)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={200000}
                    step={1000}
                    value={tradeInValue}
                    onChange={(e) => setTradeInValue(Math.max(0, Number(e.target.value)))}
                    placeholder={t('financeTradeInPlaceholder', 'Enter trade-in vehicle valuation')}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-white/15 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Sales Tax Checkbox */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeTax"
                      checked={includeSalesTax}
                      onChange={(e) => setIncludeSalesTax(e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                    />
                    <label htmlFor="includeTax" className="text-xs text-neutral-300 cursor-pointer">
                      {t('financeSalesTaxOption', 'Include Estimated Sales Tax & Title')} ({isBn ? toBnDigits(salesTaxPercent) : salesTaxPercent}%)
                    </label>
                  </div>
                  {includeSalesTax && (
                    <span className="text-xs font-mono text-cyan-400">
                      +{isBn ? toBnDigits(formatUSD(financeResult.taxAmount)) : formatUSD(financeResult.taxAmount)}
                    </span>
                  )}
                </div>

                {includeSalesTax && (
                  <div className="pl-6 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="capitalizeTax"
                      checked={capitalizeTax}
                      onChange={(e) => setCapitalizeTax(e.target.checked)}
                      className="w-3.5 h-3.5 accent-cyan-400 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="capitalizeTax"
                      className="text-[11px] text-neutral-400 cursor-pointer"
                    >
                      {t('financeRollTaxesOption', 'Roll taxes into monthly financing payments (Zero upfront tax)')}
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: PAYMENT TELEMETRY & BREAKDOWN (5 COLS) ================= */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Main Hero Card: Estimated Monthly Payment */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0f1422] to-[#090c14] border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.12)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('financeMonthlyInstallment', 'Estimated Monthly Payment')}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                {isBn ? toBnDigits(loanTermMonths) : loanTermMonths} {t('financeMonths', 'Mo')} • {isBn ? toBnDigits(interestRateAPR) : interestRateAPR}%
              </span>
            </div>

            {/* Hero Big Payment Number */}
            <div className="mt-3">
              <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight leading-none drop-shadow-md">
                {isBn ? toBnDigits(monthlyPaymentFormatted.primary) : monthlyPaymentFormatted.primary}
                <span className="text-sm sm:text-base font-normal text-neutral-400 font-sans ml-1">
                  {t('financePerMonth', '/ month')}
                </span>
              </div>
              <div className="mt-2 text-sm sm:text-base font-mono font-semibold text-cyan-300">
                ≈ {isBn ? toBnDigits(monthlyPaymentFormatted.secondary) : monthlyPaymentFormatted.secondary} {t('financePerMonth', '/ month')}
              </div>
            </div>

            {/* Amortization Ratio Bar */}
            <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>{t('financePrincipalRatio', 'Principal')}: {isBn ? toBnDigits(financeResult.principalRatioPercent) : financeResult.principalRatioPercent}%</span>
                </span>
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{t('financeInterestRatio', 'Interest')}: {isBn ? toBnDigits(financeResult.interestRatioPercent) : financeResult.interestRatioPercent}%</span>
                </span>
              </div>

              {/* Bi-color Progress Track */}
              <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${financeResult.principalRatioPercent}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
                  style={{ width: `${financeResult.interestRatioPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Detailed Financial Breakdown Cards */}
          <div className="grid grid-cols-2 gap-3 text-left">
            {/* Principal Loan Amount */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                {t('financeLoanPrincipalCard', 'Loan Principal')}
              </span>
              {renderDualAmount(financeResult.principalLoanAmount)}
            </div>

            {/* Total Interest Paid */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                {t('financeTotalInterestCard', 'Total Interest Paid')}
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-amber-300 font-mono tracking-tight">
                  {activeCurrency === 'USD'
                    ? (isBn ? toBnDigits(formatUSD(financeResult.totalInterestPayable)) : formatUSD(financeResult.totalInterestPayable))
                    : (isBn ? toBnDigits(formatBDT(financeResult.totalInterestPayable, exchangeRate)) : formatBDT(financeResult.totalInterestPayable, exchangeRate))}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {activeCurrency === 'USD'
                    ? (isBn ? toBnDigits(formatBDT(financeResult.totalInterestPayable, exchangeRate)) : formatBDT(financeResult.totalInterestPayable, exchangeRate))
                    : (isBn ? toBnDigits(formatUSD(financeResult.totalInterestPayable)) : formatUSD(financeResult.totalInterestPayable))}
                </span>
              </div>
            </div>

            {/* Total Loan Cost (All Payments) */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                {t('financeTotalFinancedCard', 'Total Financed Cost')}
              </span>
              {renderDualAmount(financeResult.totalLoanCost)}
            </div>

            {/* Total Out-of-Pocket / Ownership Cost */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                {t('financeTotalPurchaseCard', 'Total Purchase Cost')}
              </span>
              {renderDualAmount(financeResult.totalCostOfOwnership)}
            </div>
          </div>

          {/* Schedule View Toggle Button */}
          <button
            type="button"
            onClick={() => setShowSchedule((prev) => !prev)}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showSchedule ? t('financeHideScheduleBtn', 'Hide Amortization Schedule') : t('financeShowScheduleBtn', 'View Year-by-Year Amortization Schedule')}</span>
            {showSchedule ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <Link
              href={`/test-drive?car=${encodeURIComponent(carName)}&financePlan=${encodeURIComponent(
                `${monthlyPaymentFormatted.primary}/mo, ${loanTermMonths}mo, ${interestRateAPR}% APR`
              )}`}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <span>{t('financeLockWithConcierge', 'Lock This Finance Plan with Concierge')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('financeZeroObligationQuote', 'Zero Obligation Quote')}</span>
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t('financePrintSpecBtn', 'Print Spec')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= YEAR-BY-YEAR AMORTIZATION SCHEDULE TABLE ================= */}
      {showSchedule && (
        <div className="border-t border-white/10 bg-black/60 p-6 sm:p-8 relative z-10 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{t('financeFullAmortProgression', 'Full Amortization Progression')} ({isBn ? toBnDigits(loanTermMonths) : loanTermMonths} {t('financeMonths', 'Months')})</span>
            </h3>
            <span className="text-xs font-mono text-neutral-400">
              {t('financeCompoundedMonthlyAt', 'Compounded Monthly @')} {isBn ? toBnDigits(interestRateAPR) : interestRateAPR}% APR
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">{t('financeThTimeline', 'Timeline')}</th>
                  <th className="py-2.5 px-3">{t('financeThPrincipalPaid', 'Principal Paid')}</th>
                  <th className="py-2.5 px-3">{t('financeThInterestPaid', 'Interest Paid')}</th>
                  <th className="py-2.5 px-3">{t('financeThCumPrincipal', 'Cum. Principal')}</th>
                  <th className="py-2.5 px-3">{t('financeThCumInterest', 'Cum. Interest')}</th>
                  <th className="py-2.5 px-3 text-right">{t('financeThRemainingBalance', 'Remaining Balance')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {financeResult.schedule.map((pt) => (
                  <tr key={pt.year} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{isBn ? toBnDigits(pt.periodLabel) : pt.periodLabel}</span>
                    </td>
                    <td className="py-3 px-3 text-neutral-200">
                      {activeCurrency === 'USD'
                        ? (isBn ? toBnDigits(formatUSD(pt.principalPaid)) : formatUSD(pt.principalPaid))
                        : (isBn ? toBnDigits(formatBDT(pt.principalPaid, exchangeRate)) : formatBDT(pt.principalPaid, exchangeRate))}
                    </td>
                    <td className="py-3 px-3 text-amber-300">
                      {activeCurrency === 'USD'
                        ? (isBn ? toBnDigits(formatUSD(pt.interestPaid)) : formatUSD(pt.interestPaid))
                        : (isBn ? toBnDigits(formatBDT(pt.interestPaid, exchangeRate)) : formatBDT(pt.interestPaid, exchangeRate))}
                    </td>
                    <td className="py-3 px-3 text-cyan-300">
                      {activeCurrency === 'USD'
                        ? (isBn ? toBnDigits(formatUSD(pt.cumulativePrincipal)) : formatUSD(pt.cumulativePrincipal))
                        : (isBn ? toBnDigits(formatBDT(pt.cumulativePrincipal, exchangeRate)) : formatBDT(pt.cumulativePrincipal, exchangeRate))}
                    </td>
                    <td className="py-3 px-3 text-neutral-400">
                      {activeCurrency === 'USD'
                        ? (isBn ? toBnDigits(formatUSD(pt.cumulativeInterest)) : formatUSD(pt.cumulativeInterest))
                        : (isBn ? toBnDigits(formatBDT(pt.cumulativeInterest, exchangeRate)) : formatBDT(pt.cumulativeInterest, exchangeRate))}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      {activeCurrency === 'USD'
                        ? (isBn ? toBnDigits(formatUSD(pt.remainingBalance)) : formatUSD(pt.remainingBalance))
                        : (isBn ? toBnDigits(formatBDT(pt.remainingBalance, exchangeRate)) : formatBDT(pt.remainingBalance, exchangeRate))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
