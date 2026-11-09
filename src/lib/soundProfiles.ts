export interface CarSoundProfile {
  carId: string;
  engineName: string;
  powertrainType: string;
  startAudio: string;
  driveAudio: string;
  maxRpm: number;
  idleRpm: number;
  topSpeedKmh: number;
  accentGlow: string;
}

export function getCarSoundProfile(modelUrl = '', carId = ''): CarSoundProfile {
  const url = (modelUrl || '').toLowerCase();
  const id = (carId || '').toLowerCase();

  // 1. Lamborghini Aventador V12 / Lumina Phantom V12
  if (url.includes('aventador') || id.includes('aventador') || id.includes('phantom')) {
    return {
      carId: 'lumina-phantom-v12',
      engineName: '6.5L Naturally Aspirated V12',
      powertrainType: 'V12 Hypercar',
      startAudio: '/sounds/lamborghini-v12.m4a',
      driveAudio: '/sounds/lamborghini-v12.m4a',
      maxRpm: 8700,
      idleRpm: 950,
      topSpeedKmh: 365,
      accentGlow: '#eab308',
    };
  }

  // 2. Cybertruck / CyberTrack GTS (Tri-Motor Cyber Flux)
  if (url.includes('cybertruck') || id.includes('cybertruck') || id.includes('cyber')) {
    return {
      carId: 'cybertruck-apex',
      engineName: 'Tri-Motor Cyber Hyper-Flux',
      powertrainType: 'Electric Hyper-GT',
      startAudio: '/sounds/electric-gt.mp3',
      driveAudio: '/sounds/electric-gt.mp3',
      maxRpm: 18000,
      idleRpm: 0,
      topSpeedKmh: 280,
      accentGlow: '#06b6d4',
    };
  }

  // 3. Porsche 911 / Aether Spider Roadster (Twin-Turbo Boxer)
  if (url.includes('porsche') || id.includes('porsche') || id.includes('aether')) {
    return {
      carId: 'aether-spider',
      engineName: 'Twin-Turbo Flat-Six Hybrid',
      powertrainType: 'Boxer-6 Turbo',
      startAudio: '/sounds/porsche-gt2rs.m4a',
      driveAudio: '/sounds/porsche-gt2rs.m4a',
      maxRpm: 8400,
      idleRpm: 820,
      topSpeedKmh: 345,
      accentGlow: '#f43f5e',
    };
  }

  // 4. Chevy SUV / Sentinel SUV / Monolith Stealth (Supercharged Heavy V8)
  if (url.includes('suv') || id.includes('suv') || id.includes('sentinel') || id.includes('monolith')) {
    return {
      carId: 'sentinel-suv',
      engineName: '6.2L Supercharged Heavy V8',
      powertrainType: 'American Muscle V8',
      startAudio: '/sounds/chevy-v8-suv.m4a',
      driveAudio: '/sounds/chevy-v8-suv.m4a',
      maxRpm: 6600,
      idleRpm: 750,
      topSpeedKmh: 285,
      accentGlow: '#f97316',
    };
  }

  // 5. Mercedes-AMG / Executive Sedan / Valkyrie Carbon R (Handcrafted Bi-Turbo V8)
  if (url.includes('sedan') || url.includes('amg') || id.includes('valkyrie') || id.includes('sedan')) {
    return {
      carId: 'valkyrie-carbon-r',
      engineName: '4.0L Handcrafted Bi-Turbo V8',
      powertrainType: 'Bi-Turbo V8 GT',
      startAudio: '/sounds/mercedes-amg.m4a',
      driveAudio: '/sounds/mercedes-amg.m4a',
      maxRpm: 7500,
      idleRpm: 800,
      topSpeedKmh: 330,
      accentGlow: '#8b5cf6',
    };
  }

  // 6. Ferrari 458 / Apex Hyperion GT (Naturally Aspirated Flat-Plane V8)
  return {
    carId: 'apex-hyperion-gt',
    engineName: '4.5L Flat-Plane High-Rev V8',
    powertrainType: 'Flat-Plane V8',
    startAudio: '/sounds/ferrari-458.m4a',
    driveAudio: '/sounds/ferrari-458.m4a',
    maxRpm: 9000,
    idleRpm: 850,
    topSpeedKmh: 350,
    accentGlow: '#00d2ff',
  };
}
