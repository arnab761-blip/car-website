'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INVENTORY_CARS } from '@/data/cars';
import { InventoryCar, TestDriveBooking, SiteBranding, DEFAULT_BRANDING } from '@/types';
import { convertGoogleDriveUrl } from '@/lib/drive';

export interface UserSession {
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'user';
  avatar: string;
}

export interface UserActivityLog {
  id: string;
  email: string;
  name: string;
  role: string;
  timestamp: string;
  action: string;
}

export interface StoredBooking {
  id: string;
  referenceId: string;
  booking: TestDriveBooking;
  createdAt: string;
}

interface CarContextType {
  cars: InventoryCar[];
  featuredModelUrl: string;
  setFeaturedModelUrl: (url: string) => void;
  addCar: (car: Omit<InventoryCar, 'id'>) => void;
  updateCar: (car: InventoryCar) => void;
  deleteCar: (id: string) => void;
  getCarById: (id: string) => InventoryCar | undefined;

  // Branding & White-labeling
  branding: SiteBranding;
  updateBranding: (branding: Partial<SiteBranding>) => void;

  // Admin access
  adminList: string[];
  addAdmin: (email: string) => boolean;
  removeAdmin: (email: string) => void;

  // Auth & logs
  loggedInUser: UserSession | null;
  loginWithGoogle: (email: string, name?: string) => { success: boolean; role: string };
  logout: () => void;
  userLogs: UserActivityLog[];

  // Bookings
  bookings: StoredBooking[];
  addBooking: (booking: TestDriveBooking) => string;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

const DEFAULT_ADMINS = ['admin@apexmotors.com', 'owner@gmail.com', 'shihab@gmail.com'];

export function CarProvider({ children }: { children: React.ReactNode }) {
  const [cars, setCars] = useState<InventoryCar[]>(INVENTORY_CARS);
  const [featuredModelUrl, setFeaturedModelUrl] = useState<string>('/models/car.glb');
  const [adminList, setAdminList] = useState<string[]>(DEFAULT_ADMINS);
  const [loggedInUser, setLoggedInUser] = useState<UserSession | null>(null);
  const [userLogs, setUserLogs] = useState<UserActivityLog[]>([]);
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [branding, setBranding] = useState<SiteBranding>(DEFAULT_BRANDING);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedBranding = localStorage.getItem('apex_branding');
      if (storedBranding) {
        setBranding({ ...DEFAULT_BRANDING, ...JSON.parse(storedBranding) });
      }

      const storedCars = localStorage.getItem('apex_cars');
      if (storedCars) {
        const parsed = JSON.parse(storedCars);
        const updated = parsed.map((car: InventoryCar) => {
          const defaultMatch = INVENTORY_CARS.find((c) => c.id === car.id);
          if (defaultMatch) {
            const isOldUnsplash = typeof car.image === 'string' && car.image.includes('images.unsplash.com');
            return {
              ...car,
              image: isOldUnsplash || !car.image ? defaultMatch.image : car.image,
              model3dUrl: defaultMatch.model3dUrl || car.model3dUrl || '/models/car.glb',
            };
          }
          return {
            ...car,
            model3dUrl: car.model3dUrl || '/models/car.glb',
          };
        });

        // Also ensure any newly introduced default fleet cars are present
        const missingDefaults = INVENTORY_CARS.filter(
          (defaultCar) => !updated.some((c: InventoryCar) => c.id === defaultCar.id)
        );
        setCars([...updated, ...missingDefaults]);
      } else {
        setCars(INVENTORY_CARS);
      }

      const storedModel = localStorage.getItem('apex_featured_model');
      if (storedModel) setFeaturedModelUrl(storedModel);

      const storedAdmins = localStorage.getItem('apex_admins');
      if (storedAdmins) setAdminList(JSON.parse(storedAdmins));

      const storedUser = localStorage.getItem('apex_current_user');
      if (storedUser) setLoggedInUser(JSON.parse(storedUser));

      const storedLogs = localStorage.getItem('apex_user_logs');
      if (storedLogs) setUserLogs(JSON.parse(storedLogs));

      const storedBookings = localStorage.getItem('apex_bookings');
      if (storedBookings) setBookings(JSON.parse(storedBookings));
    } catch (e) {
      console.error('Failed to load stored state', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('apex_branding', JSON.stringify(branding));
      if (typeof document !== 'undefined' && branding?.brandName) {
        document.title = `${branding.brandName} | ${branding.tagline || 'Global Automotive Showroom'}`;
      }
    } catch (e) {
      console.error(e);
    }
  }, [branding, isLoaded]);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('apex_cars', JSON.stringify(cars));
    } catch (e) {
      console.error(e);
    }
  }, [cars, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('apex_featured_model', featuredModelUrl);
    } catch (e) {
      console.error(e);
    }
  }, [featuredModelUrl, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('apex_admins', JSON.stringify(adminList));
    } catch (e) {
      console.error(e);
    }
  }, [adminList, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (loggedInUser) {
        localStorage.setItem('apex_current_user', JSON.stringify(loggedInUser));
      } else {
        localStorage.removeItem('apex_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [loggedInUser, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('apex_user_logs', JSON.stringify(userLogs));
    } catch (e) {
      console.error(e);
    }
  }, [userLogs, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('apex_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings, isLoaded]);

  const addCar = (newCarData: Omit<InventoryCar, 'id'>) => {
    const id = newCarData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const formattedImage = convertGoogleDriveUrl(newCarData.image);
    const newCar: InventoryCar = {
      ...newCarData,
      id,
      image: formattedImage,
    };
    setCars((prev) => [newCar, ...prev]);
  };

  const updateCar = (updatedCar: InventoryCar) => {
    const formatted = {
      ...updatedCar,
      image: convertGoogleDriveUrl(updatedCar.image),
    };
    setCars((prev) => prev.map((c) => (c.id === updatedCar.id ? formatted : c)));
  };

  const deleteCar = (id: string) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  const getCarById = (id: string) => {
    return cars.find((c) => c.id === id);
  };

  const addAdmin = (email: string) => {
    const trimmed = email.toLowerCase().trim();
    if (!adminList.includes(trimmed)) {
      setAdminList((prev) => [...prev, trimmed]);
      return true;
    }
    return false;
  };

  const removeAdmin = (email: string) => {
    const trimmed = email.toLowerCase().trim();
    // Keep at least one superadmin
    if (adminList.length > 1) {
      setAdminList((prev) => prev.filter((a) => a !== trimmed));
    }
  };

  const loginWithGoogle = (email: string, customName?: string) => {
    const normalized = email.toLowerCase().trim();
    const isAdmin = adminList.includes(normalized);
    const isSuperAdmin = normalized === 'admin@apexmotors.com' || normalized === 'owner@gmail.com';
    const role: 'superadmin' | 'admin' | 'user' = isSuperAdmin
      ? 'superadmin'
      : isAdmin
      ? 'admin'
      : 'user';

    const name = customName || (email.split('@')[0].toUpperCase());
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${normalized}`;

    const session: UserSession = {
      email: normalized,
      name,
      role,
      avatar,
    };

    setLoggedInUser(session);

    // Record login in user logs
    const newLog: UserActivityLog = {
      id: 'log-' + Date.now(),
      email: normalized,
      name,
      role,
      timestamp: new Date().toLocaleString(),
      action: `Logged in as ${role}`,
    };
    setUserLogs((prev) => [newLog, ...prev.slice(0, 49)]); // keep latest 50

    return { success: true, role };
  };

  const logout = () => {
    setLoggedInUser(null);
  };

  const addBooking = (booking: TestDriveBooking) => {
    const refId = `APX-${Math.floor(1000 + Math.random() * 9000)}-VIP`;
    const newBooking: StoredBooking = {
      id: 'bk-' + Date.now(),
      referenceId: refId,
      booking,
      createdAt: new Date().toLocaleString(),
    };
    setBookings((prev) => [newBooking, ...prev]);

    // Also record in logs
    const newLog: UserActivityLog = {
      id: 'log-' + Date.now(),
      email: booking.email,
      name: booking.fullName,
      role: 'Client',
      timestamp: new Date().toLocaleString(),
      action: `Booked VIP Test Drive for ${booking.selectedCar}`,
    };
    setUserLogs((prev) => [newLog, ...prev.slice(0, 49)]);

    return refId;
  };

  const updateBranding = (newBranding: Partial<SiteBranding>) => {
    setBranding((prev) => {
      const updated = { ...prev, ...newBranding };
      try {
        localStorage.setItem('apex_branding', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  return (
    <CarContext.Provider
      value={{
        cars,
        featuredModelUrl,
        setFeaturedModelUrl,
        addCar,
        updateCar,
        deleteCar,
        getCarById,
        branding,
        updateBranding,
        adminList,
        addAdmin,
        removeAdmin,
        loggedInUser,
        loginWithGoogle,
        logout,
        userLogs,
        bookings,
        addBooking,
      }}
    >
      {children}
    </CarContext.Provider>
  );
}

export function useCars() {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
}
