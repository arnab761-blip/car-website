import {
  CarColor,
  CarFinish,
  CustomizerOption,
  GlassTint,
  InventoryCar,
  EnvironmentOption,
  EnvironmentPresetType,
} from '@/types';

export const ENVIRONMENT_PRESETS: EnvironmentOption[] = [
  {
    id: 'studio',
    label: 'Studio',
    sub: 'Clean Showroom',
    description: 'High-specular white studio lights with crystal-clear reflections.',
    themeColor: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.45)',
  },
  {
    id: 'city',
    label: 'Neon City',
    sub: 'Cyber Metropolis',
    description: 'Nighttime skyscraper skyline with vivid cyber-neon reflections.',
    themeColor: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.45)',
  },
  {
    id: 'sunset',
    label: 'Desert Track',
    sub: 'Golden Horizon',
    description: 'Warm golden hour desert racing circuit with amber rays.',
    themeColor: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.45)',
  },
  {
    id: 'night',
    label: 'Night Horizon',
    sub: 'Midnight Circuit',
    description: 'Deep midnight mood with cool moonlight and high-contrast silhouettes.',
    themeColor: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.45)',
  },
];

export const CAR_COLORS: CarColor[] = [
  {
    id: 'cyber-cyan',
    name: 'Electric Neon Cyan',
    hex: '#00d2ff',
    roughness: 0.25,
    metalness: 0.8,
    clearcoat: 1.0,
    accentColor: '#67e8f9',
  },
  {
    id: 'apex-red',
    name: 'Monza Crimson Red',
    hex: '#dc2626',
    roughness: 0.18,
    metalness: 0.82,
    clearcoat: 1.0,
    accentColor: '#f87171',
  },
  {
    id: 'phantom-black',
    name: 'Phantom Obsidian',
    hex: '#0a0b0e',
    roughness: 0.15,
    metalness: 0.85,
    clearcoat: 1.0,
    accentColor: '#38bdf8',
  },
  {
    id: 'quicksilver',
    name: 'Liquid Quicksilver',
    hex: '#d1d5db',
    roughness: 0.1,
    metalness: 0.95,
    clearcoat: 1.0,
    accentColor: '#e5e7eb',
  },
  {
    id: 'solar-gold',
    name: 'Solar Amber Flare',
    hex: '#d97706',
    roughness: 0.2,
    metalness: 0.8,
    clearcoat: 1.0,
    accentColor: '#fbbf24',
  },
  {
    id: 'british-emerald',
    name: 'Verde Nürburgring',
    hex: '#064e3b',
    roughness: 0.25,
    metalness: 0.85,
    clearcoat: 1.0,
    accentColor: '#34d399',
  },
  {
    id: 'electric-violet',
    name: 'Ultra Violet Metallic',
    hex: '#7c3aed',
    roughness: 0.2,
    metalness: 0.85,
    clearcoat: 1.0,
    accentColor: '#a78bfa',
  },
  {
    id: 'racing-orange',
    name: 'Gulf Papaya Orange',
    hex: '#ea580c',
    roughness: 0.22,
    metalness: 0.78,
    clearcoat: 1.0,
    accentColor: '#fdba74',
  },
  {
    id: 'riviera-blue',
    name: 'Daytona French Blue',
    hex: '#2563eb',
    roughness: 0.2,
    metalness: 0.82,
    clearcoat: 1.0,
    accentColor: '#60a5fa',
  },
  {
    id: 'frozen-white',
    name: 'Arctic Pearl White',
    hex: '#f8fafc',
    roughness: 0.15,
    metalness: 0.6,
    clearcoat: 1.0,
    accentColor: '#ffffff',
  },
  {
    id: 'nardo-grey',
    name: 'Stealth Nardo Grey',
    hex: '#64748b',
    roughness: 0.25,
    metalness: 0.7,
    clearcoat: 1.0,
    accentColor: '#94a3b8',
  },
  {
    id: 'monaco-bronze',
    name: 'Monaco Royal Bronze',
    hex: '#78350f',
    roughness: 0.25,
    metalness: 0.88,
    clearcoat: 1.0,
    accentColor: '#d97706',
  },
];

export const FINISH_OPTIONS: { id: CarFinish; label: string; desc: string }[] = [
  { id: 'metallic', label: 'Metallic', desc: 'Aluminum flake clearcoat luster' },
  { id: 'matte', label: 'Matte Stealth', desc: 'Light-absorbing velvet satin' },
  { id: 'gloss', label: 'High Gloss', desc: 'Mirror-finish deep ceramic polish' },
  { id: 'carbon', label: 'Carbon Weave', desc: 'T700 dry exposed carbon' },
];

export const RIM_COLORS: CustomizerOption[] = [
  { id: 'rim-silver', name: 'Liquid Silver Alloy', hex: '#d1d5db', desc: 'Polished forged aluminum' },
  { id: 'rim-black', name: 'Gloss Jet Black', hex: '#111318', desc: 'Stealth black gloss' },
  { id: 'rim-bronze', name: 'Satin Monaco Bronze', hex: '#ca8a04', desc: 'Track-spec bronze' },
  { id: 'rim-gunmetal', name: 'Titanium Gunmetal', hex: '#475569', desc: 'Anodized titanium' },
  { id: 'rim-gold', name: 'Solar Champagne Gold', hex: '#eab308', desc: '24K metallic luster' },
  { id: 'rim-white', name: 'Frozen Arctic White', hex: '#f8fafc', desc: 'Rally pure white' },
];

export const CALIPER_COLORS: CustomizerOption[] = [
  { id: 'caliper-red', name: 'Brembo Rosso Red', hex: '#dc2626', desc: 'Racing heritage red' },
  { id: 'caliper-yellow', name: 'Acid Neon Yellow', hex: '#eab308', desc: 'High-contrast optic' },
  { id: 'caliper-cyan', name: 'Electric Cyber Cyan', hex: '#06b6d4', desc: 'Apex modern glow' },
  { id: 'caliper-green', name: 'Porsche Acid Green', hex: '#84cc16', desc: 'Motorsport hybrid green' },
  { id: 'caliper-black', name: 'Stealth Obsidian', hex: '#1f2937', desc: 'Understated dark finish' },
  { id: 'caliper-silver', name: 'Silver Chrome', hex: '#e2e8f0', desc: 'Monoblock cast finish' },
];

export const INTERIOR_COLORS: CustomizerOption[] = [
  { id: 'interior-tan', name: 'Cognac Saddle Tan', hex: '#9a3412', desc: 'Handcrafted Tuscan leather' },
  { id: 'interior-black', name: 'Jet Obsidian Black', hex: '#18181b', desc: 'Nappa leather & Alcantara' },
  { id: 'interior-crimson', name: 'Crimson Daytona Red', hex: '#991b1b', desc: 'Track bucket leather' },
  { id: 'interior-white', name: 'Arctic Ivory White', hex: '#f1f5f9', desc: 'Semi-aniline bespoke hide' },
  { id: 'interior-navy', name: 'Deep Royal Navy', hex: '#1e3a5f', desc: 'Maritime yacht club blue' },
  { id: 'interior-espresso', name: 'Tuscan Espresso Brown', hex: '#451a03', desc: 'Vintage warm leather' },
];

export const TRIM_OPTIONS: CustomizerOption[] = [
  { id: 'trim-black', name: 'Piano Gloss Black', hex: '#0a0a0a', desc: 'Shadowline exterior trim' },
  { id: 'trim-carbon', name: 'Dry Carbon Fiber', hex: '#1e2229', desc: 'Lightweight composite aero' },
  { id: 'trim-chrome', name: 'Polished Chrome', hex: '#e5e7eb', desc: 'Mirror luxury finish' },
  { id: 'trim-body', name: 'Body Color Match', hex: 'body', desc: 'Seamless monochrome look' },
];

export const HEADLIGHT_COLORS: CustomizerOption[] = [
  { id: 'headlight-cyan', name: 'Laser Matrix Cyan', hex: '#38bdf8', desc: 'Hypercar futuristic ice beam' },
  { id: 'headlight-white', name: 'Pure Xenon White', hex: '#ffffff', desc: 'Ultra-bright 6500K daylight' },
  { id: 'headlight-amber', name: 'Le Mans Endurance Amber', hex: '#fbbf24', desc: 'GT3 endurance race optics' },
  { id: 'headlight-demon', name: 'Track Demon Red', hex: '#f43f5e', desc: 'Aggressive show optics' },
];

export const GLASS_TINT_OPTIONS: { id: GlassTint; label: string; desc: string; opacity: number }[] = [
  { id: 'limo', label: '5% VIP Limo Tint', desc: 'Ultra-dark privacy glass', opacity: 0.88 },
  { id: 'sport', label: '20% Sport Tint', desc: 'Balanced sleek smoke tint', opacity: 0.65 },
  { id: 'clear', label: '50% Crystal Clear', desc: 'Pure showcase transparency', opacity: 0.35 },
];

export interface Available3DModel {
  id: string;
  name: string;
  url: string;
  category: string;
  desc: string;
  previewImage: string;
}

export const AVAILABLE_3D_MODELS: Available3DModel[] = [
  {
    id: 'car-hyperion',
    name: 'Apex Hyperion GT (Ferrari 458 Real)',
    url: '/models/car.glb',
    category: 'Hypercar',
    desc: 'High-detail open-top roadster with sculpted aero ducts and bespoke cockpit',
    previewImage: '/images/fleet/ferrari.jpg',
  },
  {
    id: 'aventador-phantom',
    name: 'Lumina Phantom V12 (Lamborghini Aventador)',
    url: '/models/aventador.glb',
    category: 'Hypercar V12',
    desc: 'Aggressive widebody V12 supercar with razor-sharp contours and rear diffuser',
    previewImage: '/images/fleet/lamborghini.jpg',
  },
  {
    id: 'cybertruck-cybertrack',
    name: 'CyberTrack GTS (Tesla Cybertruck Armor)',
    url: '/models/cybertruck.glb',
    category: 'Track Series',
    desc: 'Angular stainless-steel cyber exoskeleton with geometric lightbars',
    previewImage: '/images/fleet/cybertruck.jpg',
  },
  {
    id: 'suv-monolith',
    name: 'Monolith Stealth SUV (Armored Luxury SUV)',
    url: '/models/suv.glb',
    category: 'Luxury SUV',
    desc: 'Imposing executive luxury SUV with commanding high-profile stance',
    previewImage: '/images/fleet/suv.jpg',
  },
  {
    id: 'porsche-aether',
    name: 'Aether Spider Roadster (Porsche 911 Carrera)',
    url: '/models/porsche.glb',
    category: 'Electric GT',
    desc: 'Legendary German curved coupe with timeless aero silhouettes',
    previewImage: '/images/fleet/porsche.jpg',
  },
  {
    id: 'sedan-valkyrie',
    name: 'Valkyrie Carbon R (Executive GT Sedan)',
    url: '/models/sedan.glb',
    category: 'Hypercar Prototype',
    desc: 'Aerodynamic executive high-speed saloon with low-drag profile',
    previewImage: '/images/fleet/sedan.jpg',
  },
];

export const INVENTORY_CARS: InventoryCar[] = [
  {
    id: 'apex-hyperion-gt',
    name: 'Apex Hyperion GT',
    tagline: 'Pure electric supremacy. Built for the hyper-future.',
    category: 'Hypercar',
    price: 2450000,
    formattedPrice: '$2,450,000',
    year: 2026,
    status: 'In Stock',
    image: '/images/fleet/ferrari.jpg',
    model3dUrl: '/models/car.glb',
    specs: {
      horsepower: 1450,
      zeroToSixty: '1.85s',
      topSpeed: '265 mph',
      range: '440 mi',
      powertrain: 'Quad-Motor Torque Vectoring AWD',
      torque: '1,680 Nm',
      dragCoefficient: '0.198 Cd',
      curbWeight: '1,790 kg',
    },
    description:
      'The Apex Hyperion GT redefines hypercar physics with an ultra-lightweight carbon-titanium monocoque and active morphing aerodynamics. Capable of generating 1,200 kg of downforce at top speed.',
    features: [
      'Carbon-Ceramic Matrix Brakes (420mm front)',
      'Active Telemetry & Ghost Lap Simulator',
      'Hydraulic Active Ride-Height Suspension',
      'Neural Voice AI Cockpit System',
    ],
  },
  {
    id: 'lumina-phantom-v12',
    name: 'Lumina Phantom V12',
    tagline: 'Timeless luxury meets twin-turbocharged savagery.',
    category: 'Hypercar',
    price: 495000,
    formattedPrice: '$495,000',
    year: 2025,
    status: 'Rare Spec',
    image: '/images/fleet/lamborghini.jpg',
    model3dUrl: '/models/aventador.glb',
    specs: {
      horsepower: 830,
      zeroToSixty: '2.6s',
      topSpeed: '228 mph',
      powertrain: '6.5L Twin-Turbo V12 + 48V Hybrid',
      torque: '900 Nm',
      dragCoefficient: '0.245 Cd',
      curbWeight: '1,560 kg',
    },
    description:
      'A bespoke grand tourer crafted for collectors who demand the auditory masterpiece of a 9,500 RPM naturally harmonized V12, draped in handcrafted Italian semi-aniline leather.',
    features: [
      'Titanium Inconel Exhaust System',
      'Bespoke Starlight Fiber-Optic Headliner',
      '24-Speaker Burmester 3D Soundscape',
      'Forged Monoblock 21-inch Magnesium Wheels',
    ],
  },
  {
    id: 'cybertrack-gts',
    name: 'CyberTrack GTS',
    tagline: 'Track-bred precision engineered for daily dominance.',
    category: 'Track Series',
    price: 215000,
    formattedPrice: '$215,000',
    year: 2026,
    status: 'In Stock',
    image: '/images/fleet/cybertruck.jpg',
    model3dUrl: '/models/cybertruck.glb',
    specs: {
      horsepower: 780,
      zeroToSixty: '2.4s',
      topSpeed: '215 mph',
      range: '380 mi',
      powertrain: 'Tri-Motor Performance AWD',
      torque: '1,120 Nm',
      dragCoefficient: '0.224 Cd',
      curbWeight: '1,720 kg',
    },
    description:
      'Engineered directly on the Nürburgring Nordschleife. The CyberTrack GTS incorporates carbon-fiber aero canards, adjustable swan-neck rear wing, and predictive track suspension.',
    features: [
      'Swan-Neck Multi-Angle Active Wing',
      'FIA-Certified Carbon Bucket Seats',
      'Real-Time Tire Thermal Vision Interface',
      'Dual High-Discharge Silicon-Carbide Inverters',
    ],
  },
  {
    id: 'monolith-stealth-suv',
    name: 'Monolith Stealth SUV',
    tagline: 'Armored elegance with unstoppable hyper-performance.',
    category: 'Luxury SUV',
    price: 320000,
    formattedPrice: '$320,000',
    year: 2026,
    status: 'In Stock',
    image: '/images/fleet/suv.jpg',
    model3dUrl: '/models/suv.glb',
    specs: {
      horsepower: 920,
      zeroToSixty: '2.8s',
      topSpeed: '195 mph',
      range: '410 mi',
      powertrain: 'Dual-Motor High-Output AWD',
      torque: '1,350 Nm',
      dragCoefficient: '0.280 Cd',
      curbWeight: '2,350 kg',
    },
    description:
      'The ultimate fortress on wheels. Combines composite bullet-resistant side glass, adaptive air-cushion suspension, and 920 horsepower capable of leaving sports cars in the dust.',
    features: [
      'Level BR6 Armored Composite Glass Option',
      'Executive Rear Reclining Lounge with Massage',
      'Off-Road Terrain Vectoring 4WD',
      'Night-Vision HUD & 360 Lidar Security Array',
    ],
  },
  {
    id: 'aether-spider-roadster',
    name: 'Aether Spider Roadster',
    tagline: 'Open-air exhilaration powered by next-gen hybrid dynamics.',
    category: 'Electric GT',
    price: 640000,
    formattedPrice: '$640,000',
    year: 2025,
    status: 'Arriving Soon',
    image: '/images/fleet/porsche.jpg',
    model3dUrl: '/models/porsche.glb',
    specs: {
      horsepower: 1050,
      zeroToSixty: '2.1s',
      topSpeed: '235 mph',
      range: '360 mi',
      powertrain: 'Twin-Turbo V8 Hybrid with Dual Front E-Motors',
      torque: '1,280 Nm',
      dragCoefficient: '0.230 Cd',
      curbWeight: '1,640 kg',
    },
    description:
      'With a 12-second carbon folding hardtop, the Aether Spider bridges the gap between raw wind-in-your-hair sensations and 1,050 horsepower hybrid thrust.',
    features: [
      'Retractable Electrochromic Hardtop Roof',
      'Active Wake Deflection Cockpit Aerodynamics',
      'Carbon-Composite Anti-Roll Stabilization',
      'Bespoke Titanium Switchgear',
    ],
  },
  {
    id: 'valkyrie-carbon-r',
    name: 'Valkyrie Carbon R',
    tagline: 'Unrestricted prototype aerodynamics for ultimate collectors.',
    category: 'Hypercar',
    price: 3600000,
    formattedPrice: '$3,600,000',
    year: 2026,
    status: 'Rare Spec',
    image: '/images/fleet/sedan.jpg',
    model3dUrl: '/models/sedan.glb',
    specs: {
      horsepower: 1600,
      zeroToSixty: '1.75s',
      topSpeed: '280 mph',
      powertrain: 'Quad-Turbo W16 + Triple Axial-Flux Motors',
      torque: '1,950 Nm',
      dragCoefficient: '0.215 Cd',
      curbWeight: '1,490 kg',
    },
    description:
      'Limited to 15 examples worldwide. Every square centimeter is exposed dry-weave carbon fiber with gold foil heat-shielding in the engine bay.',
    features: [
      'Full Exposed Dry-Carbon Fiber Aerobody',
      'F1-Derived Pushrod Suspension with Inerters',
      'Custom 3D-Printed Titanium Exhaust Tips',
      'Private Trackside Concierge & Factory Support',
    ],
  },
];
