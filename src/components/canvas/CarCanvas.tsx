'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { RealisticCarModel } from './RealisticCarModel';
import { SupercarModel } from './SupercarModel';
import { StudioEnvironment } from './StudioEnvironment';
import { CameraRig } from './CameraRig';
import { CarFinish } from '@/types';

interface CarCanvasProps {
  modelUrl?: string;
  color: string;
  finish: CarFinish;
  headlightsOn?: boolean;
  accentColor?: string;
  scrollProgress?: number; // 0 to 1 (optional, CameraRig auto-computes)
}

export function CarCanvas({
  modelUrl = '/models/car.glb',
  color,
  finish,
  headlightsOn = true,
  accentColor = '#38bdf8',
  scrollProgress,
}: CarCanvasProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[1]">
      <Canvas
        shadows={!isMobile} // Disable shadow maps on mobile to guarantee 60fps
        camera={{
          position: isMobile ? [3.2, 1.4, 6.0] : [3.4, 1.4, 4.8],
          fov: isMobile ? 54 : 42,
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
        className="w-full h-full"
      >
        {/* Synchronized Camera Movement */}
        <CameraRig scrollProgress={scrollProgress} isMobile={isMobile} />

        {/* Suspense is placed INSIDE Canvas - Instant procedural fallback on slow mobile */}
        <Suspense
          key={modelUrl}
          fallback={
            <SupercarModel color={color} finish={finish} headlightsOn={headlightsOn} />
          }
        >
          <RealisticCarModel
            key={modelUrl}
            modelUrl={modelUrl}
            color={color}
            finish={finish}
            headlightsOn={headlightsOn}
          />
        </Suspense>

        {/* Studio Lights & Reflections */}
        <StudioEnvironment accentColor={accentColor} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
