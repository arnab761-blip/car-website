export type CarColor = {
  id: string;
  name: string;
  hex: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  accentColor: string;
};

export type CarFinish = 'metallic' | 'matte' | 'gloss' | 'carbon';
export type GlassTint = 'limo' | 'sport' | 'clear';

export type EnvironmentPresetType = 'studio' | 'city' | 'sunset' | 'night';

export interface EnvironmentOption {
  id: EnvironmentPresetType;
  label: string;
  sub: string;
  description: string;
  themeColor: string;
  glow: string;
}

export interface CustomizerOption {
  id: string;
  name: string;
  hex?: string;
  desc?: string;
}

export interface CarSpecs {
  horsepower: number;
  zeroToSixty: string; // e.g. "1.99s"
  topSpeed: string;    // e.g. "240 mph"
  range?: string;      // e.g. "420 miles"
  powertrain: string;  // e.g. "Tri-Motor All-Wheel Drive"
  torque: string;      // e.g. "1,420 Nm"
  dragCoefficient: string; // e.g. "0.208 Cd"
  curbWeight: string;  // e.g. "1,850 kg"
}

export interface InventoryCar {
  id: string;
  name: string;
  tagline: string;
  category: 'Hypercar' | 'Electric GT' | 'Luxury SUV' | 'Track Series';
  price: number;
  formattedPrice: string;
  year: number;
  status: 'In Stock' | 'Rare Spec' | 'Arriving Soon' | 'Custom Order';
  image: string;
  model3dUrl?: string;
  specs: CarSpecs;
  description: string;
  features: string[];
}

export interface TestDriveBooking {
  fullName: string;
  email: string;
  phone: string;
  selectedCar: string;
  deliveryType: 'showroom' | 'vip_home' | 'private_track';
  date: string;
  timeSlot: string;
  notes?: string;
}

export interface SiteBranding {
  brandName: string;
  tagline: string;
  logoType: 'icon' | 'image';
  logoIcon: 'shield' | 'zap' | 'flame' | 'crown' | 'sparkles';
  logoImageUrl?: string;
  accentColor?: string;
}

export const DEFAULT_BRANDING: SiteBranding = {
  brandName: 'VELOCITY MOTORS',
  tagline: 'GLOBAL LUXURY & PERFORMANCE AUTOMOTIVE',
  logoType: 'icon',
  logoIcon: 'shield',
  logoImageUrl: '',
  accentColor: '#38bdf8',
};

export interface SavedCarConfig {
  id: string;
  carId?: string;
  modelName: string;
  tagline?: string;
  category?: string;
  bodyColorHex: string;
  bodyColorName: string;
  finish: string;
  wheelType: string;
  wheelHex?: string;
  interiorTrim: string;
  interiorHex?: string;
  caliperColor?: string;
  caliperHex?: string;
  headlightColor?: string;
  headlightHex?: string;
  glassTint?: string;
  priceTotal: number;
  timestamp: number;
  formattedDate?: string;
  imageThumbnail: string;
  customizerUrl?: string;
  notes?: string;
}


