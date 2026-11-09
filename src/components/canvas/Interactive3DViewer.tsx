'use client';

import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { RealisticCarModel } from './RealisticCarModel';
import { SupercarModel } from './SupercarModel';
import { GlassCarControls } from './GlassCarControls';
import { CarFinish, GlassTint, EnvironmentPresetType } from '@/types';
import { getCarSoundProfile, CarSoundProfile } from '@/lib/soundProfiles';
import { RotateCw } from 'lucide-react';

interface Interactive3DViewerProps {
  modelUrl?: string;
  color: string;
  finish?: CarFinish;
  rimColor?: string;
  caliperColor?: string;
  interiorColor?: string;
  trimColor?: string;
  headlightColor?: string;
  glassTint?: GlassTint;
  headlightsOn?: boolean;
  onHeadlightsChange?: (on: boolean) => void;
  environmentPreset?: EnvironmentPresetType;
  onEnvironmentChange?: (preset: EnvironmentPresetType) => void;
  showBackdrop?: boolean;
  autoRotate?: boolean;
  allowZoom?: boolean;
  heightClass?: string;
  cameraPosition?: [number, number, number];
  hideControls?: boolean;
}

// ================= DYNAMIC STRAIGHT ROAD & ASPHALT TRACK BED =================
function RoadMotionLines({
  speedRef,
  speed = 0,
  accentColor = '#38bdf8',
}: {
  speedRef?: React.RefObject<number | null | undefined>;
  speed?: number;
  accentColor?: string;
}) {
  const streaksGroupRef = useRef<THREE.Group>(null);
  const stripesCount = 16;

  useFrame((_, delta) => {
    const currentSpeed = speedRef?.current !== undefined ? (speedRef.current ?? 0) : speed;
    if (streaksGroupRef.current && currentSpeed > 0) {
      // Stream stripes straight backward from front (+Z) to back (-Z)
      const moveZ = currentSpeed * 0.2778 * delta * 1.8;
      streaksGroupRef.current.children.forEach((child) => {
        child.position.z -= moveZ;
        if (child.position.z < -12) {
          child.position.z += 24;
        }
      });
    }
  });

  return (
    <group position={[0, -0.015, 0]}>
      {/* 1. Realistic Asphalt Road Track Bed (Aligned straight along Z with car) */}
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 28]} />
        <meshStandardMaterial
          color="#0c0d12"
          roughness={0.85}
          metalness={0.15}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 2. Left Continuous Edge Barrier / Road Border */}
      <mesh position={[-1.5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 28]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* 3. Right Continuous Edge Barrier / Road Border */}
      <mesh position={[1.5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 28]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* 4. Dynamic Moving Lane Markings & Speed Streaks */}
      <group ref={streaksGroupRef}>
        {Array.from({ length: stripesCount }).map((_, i) => {
          const z = -12 + (24 / stripesCount) * i;
          return (
            <group key={i} position={[0, 0.001, z]}>
              {/* Center Dashed Road Line */}
              <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.05, 0.75]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.65}
                />
              </mesh>

              {/* Left Tire Motion Streak */}
              <mesh position={[-0.85, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.035, 0.45]} />
                <meshBasicMaterial
                  color={accentColor}
                  transparent
                  opacity={0.5}
                />
              </mesh>

              {/* Right Tire Motion Streak */}
              <mesh position={[0.85, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.035, 0.45]} />
                <meshBasicMaterial
                  color={accentColor}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

// ================= DRIVING SIMULATION & AUDIO PHYSICS CONTROLLER =================
function DrivingSimulationScene({
  modelUrl,
  color,
  finish,
  rimColor,
  caliperColor,
  interiorColor,
  trimColor,
  headlightColor,
  glassTint,
  isHeadlightOn,
  isEngineRunning,
  soundProfile,
  onTelemetryUpdate,
  driveAudioRef,
  isAudioMuted,
}: {
  modelUrl: string;
  color: string;
  finish: CarFinish;
  rimColor: string;
  caliperColor: string;
  interiorColor: string;
  trimColor: string;
  headlightColor: string;
  glassTint: GlassTint;
  isHeadlightOn: boolean;
  isEngineRunning: boolean;
  soundProfile: CarSoundProfile;
  onTelemetryUpdate: (telemetry: { speed: number; gear: string; rpm: number }) => void;
  driveAudioRef: React.RefObject<HTMLAudioElement | null>;
  isAudioMuted: boolean;
}) {
  const speedRef = useRef(0);
  const gearRef = useRef('P');
  const rpmRef = useRef(0);
  const lastUiUpdate = useRef(0);

  useFrame((state, delta) => {
    const topSpeed = soundProfile.topSpeedKmh;
    const targetCruisingSpeed = topSpeed * 0.65; // ~220 km/h cruising target

    // 1. Realistic Hypercar Acceleration / Deceleration Dynamics
    if (isEngineRunning) {
      // Accelerate along progressive power curve
      const s = speedRef.current;
      const accelRate = s < 50 ? 42 : s < 110 ? 32 : s < 180 ? 22 : 12; // km/h per second
      speedRef.current = Math.min(targetCruisingSpeed, speedRef.current + accelRate * delta);
    } else {
      // Coast / brake deceleration down to standstill
      speedRef.current = Math.max(0, speedRef.current - 55 * delta);
    }

    const currentSpeed = speedRef.current;

    // 2. Dynamic Gear Shift Simulation & Realistic Engine RPM Curves
    let gear = 'P';
    let rpm = soundProfile.idleRpm;

    if (isEngineRunning || currentSpeed > 0) {
      if (currentSpeed < 45) {
        gear = 'D1';
        rpm = 1200 + (currentSpeed / 45) * 5800;
      } else if (currentSpeed < 88) {
        gear = 'D2';
        rpm = 4000 + ((currentSpeed - 45) / 43) * 3400;
      } else if (currentSpeed < 138) {
        gear = 'D3';
        rpm = 4200 + ((currentSpeed - 88) / 50) * 3600;
      } else if (currentSpeed < 188) {
        gear = 'D4';
        rpm = 4600 + ((currentSpeed - 138) / 50) * 3200;
      } else {
        gear = 'D5';
        rpm = 5000 + Math.min(2600, ((currentSpeed - 188) / 55) * 2600);
      }
    } else {
      gear = 'P';
      rpm = 0;
    }

    gearRef.current = gear;
    rpmRef.current = rpm;

    // 3. Audio Pitch & Volume Modulation with Vehicle Velocity
    if (driveAudioRef.current) {
      if (currentSpeed > 2 || isEngineRunning) {
        // Pitch scales naturally with speed for spine-tingling acceleration!
        const pitchRatio = 0.82 + (currentSpeed / topSpeed) * 0.65;
        driveAudioRef.current.playbackRate = Math.min(1.65, Math.max(0.75, pitchRatio));
        driveAudioRef.current.volume = isAudioMuted
          ? 0
          : Math.min(1.0, 0.35 + (currentSpeed / 120) * 0.65);
      } else {
        driveAudioRef.current.volume = 0;
      }
    }

    // 4. Update UI Telemetry at 20fps for smooth glass HUD rendering
    const now = state.clock.elapsedTime;
    if (now - lastUiUpdate.current > 0.05) {
      lastUiUpdate.current = now;
      onTelemetryUpdate({
        speed: currentSpeed,
        gear: gearRef.current,
        rpm: rpmRef.current,
      });
    }
  });

  return (
    <>
      {/* Dynamic Road Motion Stripes */}
      <RoadMotionLines speedRef={speedRef} accentColor={soundProfile.accentGlow} />

      <Suspense
        key={modelUrl}
        fallback={
          <SupercarModel
            color={color}
            finish={finish}
            headlightsOn={isHeadlightOn}
            speed={speedRef.current}
          />
        }
      >
        <Float
          speed={isEngineRunning ? 0 : 0.6}
          rotationIntensity={isEngineRunning ? 0 : 0.04}
          floatIntensity={isEngineRunning ? 0 : 0.05}
          floatingRange={[-0.015, 0.015]}
        >
          <RealisticCarModel
            key={modelUrl}
            modelUrl={modelUrl}
            color={color}
            finish={finish}
            rimColor={rimColor}
            caliperColor={caliperColor}
            interiorColor={interiorColor}
            trimColor={trimColor}
            headlightColor={headlightColor}
            glassTint={glassTint}
            headlightsOn={isHeadlightOn}
            speedRef={speedRef}
            isEngineRunning={isEngineRunning}
          />
        </Float>
      </Suspense>

    </>
  );
}

// ================= MAIN INTERACTIVE 3D VIEWER COMPONENT =================
export function Interactive3DViewer({
  modelUrl = '/models/car.glb',
  color,
  finish = 'metallic',
  rimColor = '#d1d5db',
  caliperColor = '#dc2626',
  interiorColor = '#9a3412',
  trimColor = '#0a0a0a',
  headlightColor = '#38bdf8',
  glassTint = 'sport',
  headlightsOn,
  onHeadlightsChange,
  environmentPreset,
  onEnvironmentChange,
  showBackdrop: initialShowBackdrop = true,
  autoRotate = false,
  allowZoom = true,
  heightClass = 'h-[500px] w-full',
  cameraPosition = [3.8, 1.5, 4.6],
  hideControls = false,
}: Interactive3DViewerProps) {
  const controlsRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. Environment Switcher State
  const [internalEnvPreset, setInternalEnvPreset] = useState<EnvironmentPresetType>('studio');
  const [showBackdrop, setShowBackdrop] = useState(initialShowBackdrop);
  const currentEnvPreset = environmentPreset ?? internalEnvPreset;

  // 2. Engine & Audio State
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [telemetry, setTelemetry] = useState({ speed: 0, gear: 'P', rpm: 0 });

  // Sound Profile for Current Car Model
  const soundProfile = useMemo(() => {
    return getCarSoundProfile(modelUrl);
  }, [modelUrl]);

  // Audio References
  const ignitionAudioRef = useRef<HTMLAudioElement | null>(null);
  const driveAudioRef = useRef<HTMLAudioElement | null>(null);

  // 3. Headlight State
  const [internalHeadlightOn, setInternalHeadlightOn] = useState(true);
  const isHeadlightOn = headlightsOn !== undefined ? headlightsOn : internalHeadlightOn;

  // Keep internal states in sync with external props if provided
  useEffect(() => {
    if (headlightsOn !== undefined) {
      setInternalHeadlightOn(headlightsOn);
    }
  }, [headlightsOn]);

  useEffect(() => {
    if (environmentPreset !== undefined) {
      setInternalEnvPreset(environmentPreset);
    }
  }, [environmentPreset]);

  // ================= PER-CAR HTML5 AUDIO LIFECYCLE (ZERO LEAKS, NO OVERLAP) =================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Preload vehicle-specific ignition audio
    const ignition = new Audio(soundProfile.startAudio);
    ignition.preload = 'auto';
    ignitionAudioRef.current = ignition;

    // Preload continuous driving & acceleration sound loop
    const drive = new Audio(soundProfile.driveAudio);
    drive.preload = 'auto';
    drive.loop = true;
    driveAudioRef.current = drive;

    return () => {
      // Memory leak prevention & cleanup on model switch or component unmount
      ignition.pause();
      ignition.currentTime = 0;
      ignitionAudioRef.current = null;

      drive.pause();
      drive.currentTime = 0;
      driveAudioRef.current = null;
    };
  }, [soundProfile]);


  // Update volume when mute toggles
  useEffect(() => {
    if (ignitionAudioRef.current) {
      ignitionAudioRef.current.muted = isAudioMuted;
    }
    if (driveAudioRef.current) {
      driveAudioRef.current.muted = isAudioMuted;
    }
  }, [isAudioMuted]);

  // Handle Engine Toggle
  const handleToggleEngine = () => {
    const nextState = !isEngineRunning;
    setIsEngineRunning(nextState);

    if (nextState) {
      // REQUIREMENT 3: Headlights automatically turn true when engine starts!
      setInternalHeadlightOn(true);
      if (onHeadlightsChange) {
        onHeadlightsChange(true);
      }

      // REQUIREMENT 2: Play high-quality engine start sound without overlap
      const ignAudio = ignitionAudioRef.current;
      if (ignAudio) {
        ignAudio.pause();
        ignAudio.currentTime = 0; // Rewind to start: prevent overlap on rapid clicks
        const playPromise = ignAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Ignition audio playback handled:', err);
          });
        }
      }

      // Start continuous driving sound loop
      const drvAudio = driveAudioRef.current;
      if (drvAudio) {
        drvAudio.pause();
        drvAudio.currentTime = 0;
        drvAudio.volume = isAudioMuted ? 0 : 0.35;
        const drvPromise = drvAudio.play();
        if (drvPromise !== undefined) {
          drvPromise.catch((err) => {
            console.warn('Drive audio playback handled:', err);
          });
        }
      }
    } else {
      // Stop Engine
      const ignAudio = ignitionAudioRef.current;
      if (ignAudio) {
        ignAudio.pause();
        ignAudio.currentTime = 0;
      }
      const drvAudio = driveAudioRef.current;
      if (drvAudio) {
        drvAudio.pause();
        drvAudio.currentTime = 0;
      }
    }
  };

  // Handle Headlight Manual Toggle
  const handleToggleHeadlight = () => {
    const nextVal = !isHeadlightOn;
    setInternalHeadlightOn(nextVal);
    if (onHeadlightsChange) {
      onHeadlightsChange(nextVal);
    }
  };

  // Handle Environment Preset Switch
  const handleEnvironmentChange = (preset: EnvironmentPresetType) => {
    setInternalEnvPreset(preset);
    if (onEnvironmentChange) {
      onEnvironmentChange(preset);
    }
  };

  // Reset Camera Angle
  const resetCamera = (pos: [number, number, number]) => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(...pos);
      controlsRef.current.target.set(0, 0.35, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div
      className={`relative flex flex-col ${heightClass} bg-[#070910]/80 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/15 shadow-2xl`}
    >
      {/* ================= DEDICATED TOP DASHBOARD CONTROL BAR ================= */}
      {!hideControls && (
        <div className="w-full shrink-0 border-b border-white/10 bg-black/50 backdrop-blur-xl px-3 sm:px-4 py-2 sm:py-2.5 z-20">
          <GlassCarControls
            currentEnvPreset={currentEnvPreset}
            onEnvironmentChange={handleEnvironmentChange}
            showBackdrop={showBackdrop}
            onToggleBackdrop={() => setShowBackdrop((prev) => !prev)}
            isEngineRunning={isEngineRunning}
            onToggleEngine={handleToggleEngine}
            isHeadlightOn={isHeadlightOn}
            onToggleHeadlight={handleToggleHeadlight}
            speed={telemetry.speed}
            rpm={telemetry.rpm}
            gear={telemetry.gear}
            soundProfile={soundProfile}
            isAudioMuted={isAudioMuted}
            onToggleMute={() => setIsAudioMuted((prev) => !prev)}
          />
        </div>
      )}

      {/* ================= PURE 3D CANVAS VIEWPORT (100% UNOBSTRUCTED) ================= */}
      <div className="relative flex-1 w-full min-h-0">
        <Canvas
        shadows={!isMobile}
        camera={{
          position: cameraPosition,
          fov: isMobile ? 46 : 40,
          near: 0.1,
          far: 100,
        }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{
          powerPreference: 'high-performance',
          antialias: !isMobile,
          stencil: false,
          alpha: true,
          depth: true,
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* ================= THREE.JS LIGHTING RIG ================= */}
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[6, 8, 5]}
          intensity={2.0}
          castShadow={!isMobile}
          shadow-bias={-0.0001}
          shadow-mapSize-width={isMobile ? 512 : 1024}
          shadow-mapSize-height={isMobile ? 512 : 1024}
        />
        <directionalLight position={[-6, 4, -5]} intensity={1.5} color="#93c5fd" />
        <pointLight position={[0, -0.3, 0]} intensity={1.2} color="#38bdf8" distance={6} />

        {/* ================= DYNAMIC HEADLIGHT BEAMS (SPOTLIGHT & POINTLIGHT) ================= */}
        {isHeadlightOn && (
          <group position={[0, 0, 0]}>
            {/* Left Headlight Focused Projector */}
            <spotLight
              position={[-0.72, 0.45, 2.05]}
              target-position={[-0.72, 0.05, 8.5]}
              angle={0.58}
              penumbra={0.6}
              intensity={7.5}
              color={headlightColor || '#38bdf8'}
              distance={18}
              castShadow={!isMobile}
            />
            {/* Right Headlight Focused Projector */}
            <spotLight
              position={[0.72, 0.45, 2.05]}
              target-position={[0.72, 0.05, 8.5]}
              angle={0.58}
              penumbra={0.6}
              intensity={7.5}
              color={headlightColor || '#38bdf8'}
              distance={18}
              castShadow={!isMobile}
            />
            {/* Forward Ground Illumination PointLight */}
            <pointLight
              position={[0, 0.35, 2.2]}
              intensity={3.8}
              color={headlightColor || '#38bdf8'}
              distance={5}
            />
          </group>
        )}

        {/* ================= @REACT-THREE/DREI ENVIRONMENT HDRI ================= */}
        <Suspense fallback={null}>
          <Environment
            key={currentEnvPreset}
            preset={currentEnvPreset}
            background={showBackdrop}
            blur={0.5}
          />
        </Suspense>

        {/* ================= DRIVING SIMULATION SCENE (WHEELS, ROAD & CAR) ================= */}
        <DrivingSimulationScene
          modelUrl={modelUrl}
          color={color}
          finish={finish}
          rimColor={rimColor}
          caliperColor={caliperColor}
          interiorColor={interiorColor}
          trimColor={trimColor}
          headlightColor={headlightColor}
          glassTint={glassTint}
          isHeadlightOn={isHeadlightOn}
          isEngineRunning={isEngineRunning}
          soundProfile={soundProfile}
          onTelemetryUpdate={setTelemetry}
          driveAudioRef={driveAudioRef}
          isAudioMuted={isAudioMuted}
        />

        {/* Showroom Floor & Realistic Contact Shadows (frames={1} bakes once for silky 60fps) */}
        <ContactShadows
          key={modelUrl}
          position={[0, -0.01, 0]}
          opacity={0.82}
          scale={9}
          blur={isMobile ? 1.4 : 2.0}
          far={3.0}
          resolution={isMobile ? 256 : 512}
          color="#000000"
          frames={1}
        />

        {/* Polished Showroom Dark Ground Disk */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
          <circleGeometry args={[12, 48]} />
          <meshStandardMaterial
            color="#080a10"
            roughness={0.25}
            metalness={0.75}
            transparent
            opacity={showBackdrop ? 0.35 : 0.65}
          />
        </mesh>

        {/* Floor accent ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
          <ringGeometry args={[3.2, 3.24, 64]} />
          <meshBasicMaterial
            color={isHeadlightOn ? (headlightColor || '#38bdf8') : '#334155'}
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Orbit Controls for 360° Drag & Inspection */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={allowZoom}
          minDistance={3.2}
          maxDistance={8.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.05}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          dampingFactor={0.05}
          target={[0, 0.35, 0]}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />
        </Canvas>
      </div>

      {/* ================= BOTTOM STATUS & CAMERA ANGLE BAR ================= */}
      <div className="w-full shrink-0 border-t border-white/10 bg-black/40 backdrop-blur-xl px-3 sm:px-4 py-2 flex items-center justify-between z-10 text-xs font-mono select-none">
        {/* 360 Degree Drag / Zoom Hint */}
        <div className="flex items-center gap-2 text-cyan-400">
          <RotateCw className="w-3.5 h-3.5 animate-spin-slow shrink-0" />
          <span className="hidden sm:inline text-[11px] text-cyan-300">
            360° Turntable Active • Drag to Rotate • Scroll to Zoom
          </span>
          <span className="sm:hidden text-[10px] text-cyan-300">
            360° Turntable • Drag to Rotate
          </span>
        </div>

        {/* Quick Camera Preset Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-0.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="hidden md:inline px-1.5 text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">
            Angle:
          </span>
          <button
            onClick={() => resetCamera([0, 1.2, 5.2])}
            className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] uppercase font-bold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Front
          </button>
          <button
            onClick={() => resetCamera([4.8, 1.0, 0])}
            className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] uppercase font-bold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Side
          </button>
          <button
            onClick={() => resetCamera([-3.2, 1.2, -4.2])}
            className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] uppercase font-bold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Rear
          </button>
          <button
            onClick={() => resetCamera([0, 5.2, 0.1])}
            className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] uppercase font-bold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Top Aero
          </button>
        </div>
      </div>
    </div>
  );
}
