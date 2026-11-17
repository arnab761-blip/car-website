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

export interface CarCategoryItem {
  id: string;
  nameEn: string;
  nameBn: string;
  modelsDescription: string;
}

export const POPULAR_BANGLADESH_CATEGORIES: CarCategoryItem[] = [
  {
    id: 'Sedan',
    nameEn: 'Sedan (সেডান)',
    nameBn: 'সেডান (Sedan)',
    modelsDescription: 'Toyota Premio, Allion, Corolla Axio, Camry, Honda Civic, Grace, Bluebird Sylphy',
  },
  {
    id: 'Luxury SUV',
    nameEn: 'Luxury SUV (লাক্সারি এসইউভি)',
    nameBn: 'লাক্সারি এসইউভি (Luxury SUV)',
    modelsDescription: 'Toyota Land Cruiser Prado, Harrier, Land Cruiser LC300/V8, Pajero Sport, Defender',
  },
  {
    id: 'Microbus & MPV',
    nameEn: 'Microbus & MPV (মাইক্রোবাস ও এমপিভি)',
    nameBn: 'মাইক্রোবাস ও এমপিভি (Microbus & MPV)',
    modelsDescription: 'Toyota Noah, Voxy, Esquire, Alphard Executive, HiAce Super GL, Serena',
  },
  {
    id: 'Hatchback & Compact',
    nameEn: 'Hatchback & Compact (হ্যাচব্যাক)',
    nameBn: 'হ্যাচব্যাক ও কমপ্যাক্ট (Hatchback)',
    modelsDescription: 'Toyota Aqua, Vitz, Yaris, Suzuki Swift, Honda Fit, Nissan Note',
  },
  {
    id: 'Hybrid & Eco',
    nameEn: 'Hybrid & Eco (হাইব্রিড কার)',
    nameBn: 'হাইব্রিড কার (Hybrid & Eco)',
    modelsDescription: 'Toyota Prius, Vezel e:HEV, Axio Hybrid, Fielder Hybrid, Aqua Hybrid',
  },
  {
    id: 'Electric Vehicle (EV)',
    nameEn: 'Electric Vehicle - EV (ইলেকট্রিক)',
    nameBn: 'ইলেকট্রিক ভেহিকল (Electric Vehicle)',
    modelsDescription: 'Tesla Model Y/3, BYD Seal, Atto 3, Porsche Taycan, Audi e-tron, BMW i4',
  },
  {
    id: 'Executive Flagship',
    nameEn: 'Executive Flagship (এক্সিকিউটিভ ফ্ল্যাগশিপ)',
    nameBn: 'এক্সিকিউটিভ ফ্ল্যাগশিপ (Executive Flagship)',
    modelsDescription: 'Mercedes-Benz S/E-Class, BMW 7/5 Series, Audi A6/Q8, Lexus LX600/RX450h',
  },
  {
    id: 'Double Cabin Pickup',
    nameEn: 'Double Cabin Pickup (পিকআপ ৪x৪)',
    nameBn: 'পিকআপ ডাবল কেবিন (Double Cabin 4x4)',
    modelsDescription: 'Toyota Hilux Revo Rocco, Ford Ranger Raptor, Isuzu D-Max, Mitsubishi Triton',
  },
  {
    id: 'Hypercar',
    nameEn: 'Hypercar & Supercar (হাইপারকার)',
    nameBn: 'হাইপারকার ও সুপারকার (Hypercar)',
    modelsDescription: 'Ferrari 458/488/F8, Lamborghini Aventador/Huracan, McLaren 720S, Bugatti',
  },
  {
    id: 'Track Series',
    nameEn: 'Track Series & Sports Coupe (স্পোর্টস কার)',
    nameBn: 'ট্র্যাক সিরিজ ও স্পোর্টস কার (Sports Coupe)',
    modelsDescription: 'Porsche 911 Carrera, Nissan GT-R R35, Toyota GR Supra, Ford Mustang GT',
  },
];

export const BANGLADESH_POPULAR_MODELS = [
  'Toyota Land Cruiser Prado TX-L',
  'Toyota Land Cruiser LC300 GR Sport',
  'Toyota Land Cruiser LC200 V8',
  'Toyota Harrier 2.0 Progress / Elegance',
  'Toyota Premio F EX Package',
  'Toyota Allion A15 / A18 G-Package',
  'Toyota Corolla Cross Hybrid',
  'Toyota Corolla Axio Hybrid',
  'Toyota Corolla Fielder Hybrid',
  'Toyota Alphard Executive Lounge',
  'Toyota Vellfire Executive Lounge',
  'Toyota Noah Hybrid Si / X',
  'Toyota Voxy ZS Kirameki',
  'Toyota Esquire Gi Premium',
  'Toyota HiAce Super GL',
  'Toyota Aqua G-Grade Hybrid',
  'Toyota Prius S Touring Selection',
  'Toyota RAV4 Adventure AWD',
  'Toyota Hilux Revo Rocco 4x4',
  'Toyota GR Supra 3.0 Pro',
  'Honda Vezel e:HEV RS / Z Sensing',
  'Honda Civic RS Turbo',
  'Honda CR-V Turbo AWD',
  'Honda Grace EX Hybrid',
  'Honda Fit Hybrid / Shuttle',
  'Mitsubishi Pajero Sport 4WD',
  'Mitsubishi Outlander PHEV',
  'Nissan X-Trail Hybrid / Turbo',
  'Nissan Bluebird Sylphy G',
  'Nissan Serena e-POWER Highway Star',
  'Nissan GT-R Nismo (R35)',
  'Mercedes-Benz S-Class S450 AMG Line',
  'Mercedes-Benz E-Class E200 / E300 AMG',
  'Mercedes-Benz C-Class C200 AMG Line',
  'Mercedes-Benz G-Wagon G63 AMG',
  'Mercedes-Benz GLC 300 / GLE 450',
  'BMW 7 Series 740Li M Sport',
  'BMW 5 Series 520i / 530e M Sport',
  'BMW 3 Series 320i / 330e M Sport',
  'BMW X5 xDrive40i / X7 xDrive40i',
  'Audi A6 Matrix LED 2.0 TFSI',
  'Audi Q7 55 TFSI Quattro',
  'Audi Q8 55 TFSI Quattro',
  'Audi e-tron GT Quattro',
  'Lexus LX600 Ultra Luxury',
  'Lexus LX570 V8 Super Sport',
  'Lexus RX450h / RX350 F-Sport',
  'Range Rover Defender 110 X-Dynamic',
  'Range Rover Autobiography LWB',
  'Tesla Model Y Long Range AWD',
  'Tesla Model 3 Performance',
  'BYD Seal Performance AWD',
  'BYD Atto 3 Extended Range',
  'Ford Ranger Raptor 2.0 Bi-Turbo',
  'Ford Mustang GT 5.0 V8',
  'Porsche 911 Carrera S (992)',
  'Porsche Cayenne Coupe Turbo',
  'Porsche Macan GTS',
  'Porsche Taycan 4S Turbo',
  'Apex Hyperion GT',
  'Lumina Phantom V12',
  'CyberTrack GTS',
  'Monolith Stealth SUV',
  'Aether Spider Roadster',
  'Valkyrie Carbon R',
];

export interface InventoryCar {
  id: string;
  name: string;
  tagline: string;
  category: string;
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
  brandName: 'OMNIMOTORS 3D',
  tagline: 'GLOBAL 3D AUTOMOTIVE PLATFORM & SHOWROOM',
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


