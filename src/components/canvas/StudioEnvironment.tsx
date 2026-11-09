'use client';

import React from 'react';
import { ContactShadows, Float, Sparkles } from '@react-three/drei';

interface StudioEnvironmentProps {
  accentColor?: string;
  isMobile?: boolean;
}

export function StudioEnvironment({ accentColor = '#38bdf8', isMobile = false }: StudioEnvironmentProps) {
  return (
    <>
      {/* Ambient Fill Light */}
      <ambientLight intensity={0.65} />

      {/* Main Studio Key Light */}
      <directionalLight
        position={[6, 8, 5]}
        intensity={2.2}
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 512 : 2048}
        shadow-mapSize-height={isMobile ? 512 : 2048}
        shadow-bias={-0.0001}
      />

      {/* Dramatic Cool Rim Light (accents car silhouette) */}
      <directionalLight position={[-6, 5, -5]} intensity={1.8} color="#93c5fd" />

      {/* Warm Fill / Underbody Accent Light */}
      <pointLight position={[0, -0.4, 0]} intensity={1.5} color={accentColor} distance={6} />

      {/* Front Accent Spot */}
      <spotLight
        position={[0, 6, 7]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.2}
        color="#ffffff"
      />

      {/* Subtle Atmospheric Sparks/Dust Motes */}
      {!isMobile && (
        <Sparkles
          count={40}
          scale={10}
          size={1.6}
          speed={0.3}
          opacity={0.4}
          color={accentColor}
        />
      )}

      {/* Studio Floor Grid & Contact Shadows */}
      <group position={[0, -0.01, 0]}>
        {/* Soft, High-Performance Contact Shadow under Car (frames={1} bakes once for silky 60fps) */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.85}
          scale={9}
          blur={isMobile ? 1.4 : 1.8}
          far={3.5}
          resolution={isMobile ? 256 : 1024}
          color="#000000"
          frames={1}
        />

        {/* Polished Showroom Dark Ground Disk */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
          <circleGeometry args={[14, 48]} />
          <meshStandardMaterial
            color="#07080b"
            roughness={0.25}
            metalness={0.8}
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Circular Accent Neon Floor Rings */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
          <ringGeometry args={[3.2, 3.24, 64]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
          <ringGeometry args={[5.0, 5.03, 64]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.3} />
        </mesh>
      </group>
    </>
  );
}
