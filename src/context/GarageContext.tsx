'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SavedCarConfig } from '@/types';
import { DEFAULT_USD_TO_BDT_RATE } from '@/lib/financeUtils';

const GARAGE_STORAGE_KEY = 'apex_virtual_garage';

export interface GarageContextType {
  garageCars: SavedCarConfig[];
  isLoaded: boolean;
  count: number;
  saveCar: (
    config: Omit<SavedCarConfig, 'id' | 'timestamp' | 'formattedDate'> & {
      id?: string;
    }
  ) => SavedCarConfig;
  removeCar: (id: string) => void;
  clearGarage: () => void;
  isInGarage: (idOrCarId: string) => boolean;
  totalValueUSD: number;
  totalValueBDT: number;
}

const GarageContext = createContext<GarageContextType | undefined>(undefined);

export function GarageProvider({ children }: { children: React.ReactNode }) {
  const [garageCars, setGarageCars] = useState<SavedCarConfig[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Safe load from localStorage on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(GARAGE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setGarageCars(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to read garage storage:', err);
    } finally {
      setIsLoaded(true);
    }

    // Storage event for multi-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === GARAGE_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setGarageCars(parsed);
          }
        } catch {
          // ignore parsing error
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save or Update Car Configuration
  const saveCar = useCallback(
    (
      config: Omit<SavedCarConfig, 'id' | 'timestamp' | 'formattedDate'> & {
        id?: string;
      }
    ): SavedCarConfig => {
      const now = Date.now();
      const dateFormatted = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(now);

      const newId = config.id || `cfg-${now}-${Math.random().toString(36).substring(2, 6)}`;
      const savedCar: SavedCarConfig = {
        ...config,
        id: newId,
        timestamp: now,
        formattedDate: dateFormatted,
      };

      setGarageCars((prev) => {
        // If exact car already exists with same ID or carId, replace; otherwise prepend
        const existingIdx = prev.findIndex(
          (c) => c.id === savedCar.id || (savedCar.carId && c.carId === savedCar.carId)
        );
        let updated: SavedCarConfig[];
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = savedCar;
        } else {
          updated = [savedCar, ...prev];
        }

        // Persist to localStorage safely
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(GARAGE_STORAGE_KEY, JSON.stringify(updated));
          } catch (err) {
            console.error('Failed to save to localStorage:', err);
          }
        }
        return updated;
      });

      return savedCar;
    },
    []
  );

  // Remove Car from Garage
  const removeCar = useCallback((id: string) => {
    setGarageCars((prev) => {
      const updated = prev.filter((c) => c.id !== id && c.carId !== id);
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(GARAGE_STORAGE_KEY, JSON.stringify(updated));
        } catch (err) {
          console.error('Failed to remove from localStorage:', err);
        }
      }
      return updated;
    });
  }, []);

  // Clear entire Garage
  const clearGarage = useCallback(() => {
    setGarageCars([]);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(GARAGE_STORAGE_KEY, JSON.stringify([]));
      } catch (err) {
        console.error('Failed to clear localStorage:', err);
      }
    }
  }, []);

  // Check if car is already in garage
  const isInGarage = useCallback(
    (idOrCarId: string) => {
      return garageCars.some((c) => c.id === idOrCarId || c.carId === idOrCarId);
    },
    [garageCars]
  );

  // Total Portfolio Calculations
  const totalValueUSD = useMemo(
    () => garageCars.reduce((acc, car) => acc + (car.priceTotal || 0), 0),
    [garageCars]
  );
  const totalValueBDT = useMemo(
    () => totalValueUSD * DEFAULT_USD_TO_BDT_RATE,
    [totalValueUSD]
  );

  const contextValue = useMemo(
    () => ({
      garageCars,
      isLoaded,
      count: garageCars.length,
      saveCar,
      removeCar,
      clearGarage,
      isInGarage,
      totalValueUSD,
      totalValueBDT,
    }),
    [garageCars, isLoaded, saveCar, removeCar, clearGarage, isInGarage, totalValueUSD, totalValueBDT]
  );

  return <GarageContext.Provider value={contextValue}>{children}</GarageContext.Provider>;
}

export function useGarage(): GarageContextType {
  const context = useContext(GarageContext);
  if (!context) {
    // Graceful fallback if invoked outside GarageProvider
    return {
      garageCars: [],
      isLoaded: true,
      count: 0,
      saveCar: () => ({} as SavedCarConfig),
      removeCar: () => {},
      clearGarage: () => {},
      isInGarage: () => false,
      totalValueUSD: 0,
      totalValueBDT: 0,
    };
  }
  return context;
}
