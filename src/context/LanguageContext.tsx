'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Language, UI_TRANSLATIONS, CAR_TRANSLATIONS } from '@/data/translations';
import { InventoryCar } from '@/types';
import { DEFAULT_USD_TO_BDT_RATE } from '@/lib/financeUtils';

const LANGUAGE_STORAGE_KEY = 'apex_preferred_language';

const BN_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isBn: boolean;
  t: (key: string, fallback?: string) => string;
  toBnDigits: (input: string | number) => string;
  getTranslatedCar: (car: InventoryCar) => InventoryCar;
  formatPrice: (amountUSD: number, currency?: 'USD' | 'BDT') => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load preferred language from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'bn' || stored === 'en') {
        setLanguageState(stored);
        document.documentElement.lang = stored;
      }
    } catch (err) {
      console.warn('Failed to read language preference:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
        document.documentElement.lang = newLang;
      } catch (err) {
        console.error('Failed to persist language preference:', err);
      }
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  }, [language, setLanguage]);

  const isBn = language === 'bn';

  // Translation lookup helper
  const t = useCallback(
    (key: string, fallback?: string): string => {
      const currentDict = UI_TRANSLATIONS[language];
      if (currentDict && key in currentDict) {
        return currentDict[key];
      }
      const fallbackDict = UI_TRANSLATIONS.en;
      if (fallbackDict && key in fallbackDict) {
        return fallbackDict[key];
      }
      return fallback !== undefined ? fallback : key;
    },
    [language]
  );

  // Bengali numeral conversion
  const toBnDigits = useCallback(
    (input: string | number): string => {
      if (!isBn) return String(input);
      return String(input).replace(/[0-9]/g, (digit) => BN_DIGITS[digit] || digit);
    },
    [isBn]
  );

  // Car model translation helper
  const getTranslatedCar = useCallback(
    (car: InventoryCar): InventoryCar => {
      if (!isBn) return car;
      const trans = CAR_TRANSLATIONS[car.id]?.bn;
      if (!trans) return car;

      return {
        ...car,
        name: trans.name || car.name,
        tagline: trans.tagline || car.tagline,
        category: (trans.category as any) || car.category,
        description: trans.description || car.description,
        features: trans.features || car.features,
        specs: {
          ...car.specs,
          powertrain: trans.specs?.powertrain || car.specs.powertrain,
          range: trans.specs?.range || car.specs.range,
          horsepower: car.specs.horsepower,
          zeroToSixty: toBnDigits(car.specs.zeroToSixty),
          topSpeed: toBnDigits(car.specs.topSpeed),
          torque: toBnDigits(car.specs.torque),
          dragCoefficient: toBnDigits(car.specs.dragCoefficient),
          curbWeight: toBnDigits(car.specs.curbWeight),
        },
      };
    },
    [isBn, toBnDigits]
  );

  // Price formatting helper
  const formatPrice = useCallback(
    (amountUSD: number, currency: 'USD' | 'BDT' = 'USD'): string => {
      if (currency === 'BDT') {
        const bdt = Math.round(amountUSD * DEFAULT_USD_TO_BDT_RATE);
        const formatted = new Intl.NumberFormat('en-US').format(bdt);
        if (isBn) {
          return `৳${toBnDigits(formatted)}`;
        }
        return `৳${formatted}`;
      } else {
        const formatted = new Intl.NumberFormat('en-US').format(Math.round(amountUSD));
        if (isBn) {
          return `$${toBnDigits(formatted)}`;
        }
        return `$${formatted}`;
      }
    },
    [isBn, toBnDigits]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      isBn,
      t,
      toBnDigits,
      getTranslatedCar,
      formatPrice,
    }),
    [language, setLanguage, toggleLanguage, isBn, t, toBnDigits, getTranslatedCar, formatPrice]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Default safe fallback if rendered outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      toggleLanguage: () => {},
      isBn: false,
      t: (key: string, fallback?: string) => fallback || key,
      toBnDigits: (input: string | number) => String(input),
      getTranslatedCar: (car: InventoryCar) => car,
      formatPrice: (amount: number) => `$${amount.toLocaleString()}`,
    };
  }
  return context;
}
