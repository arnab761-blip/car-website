'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CarFinish } from '@/types';

interface SupercarModelProps {
  color: string;
  finish: CarFinish;
  headlightsOn?: boolean;
  speed?: number;
}

export function SupercarModel({ color, finish, headlightsOn = true, speed = 0 }: SupercarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);

  // Calculate material properties based on finish
  const getMaterialProps = () => {
    switch (finish) {
      case 'matte':
        return {
          roughness: 0.6,
          metalness: 0.2,
          clearcoat: 0.05,
          clearcoatRoughness: 0.4,
        };
      case 'gloss':
        return {
          roughness: 0.08,
          metalness: 0.4,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
        };
      case 'carbon':
        return {
          roughness: 0.3,
          metalness: 0.6,
          clearcoat: 0.5,
          clearcoatRoughness: 0.2,
        };
      case 'metallic':
      default:
        return {
          roughness: 0.18,
          metalness: 0.85,
          clearcoat: 0.95,
          clearcoatRoughness: 0.1,
        };
    }
  };

  const matProps = getMaterialProps();

  // Subtle floating and speed-synchronized wheel rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      if (speed > 0) {
        const flutter = Math.sin(state.clock.elapsedTime * (32 + speed * 0.15)) * 0.001;
        groupRef.current.position.y = flutter;
        groupRef.current.rotation.x = -Math.min(0.012, speed * 0.00007);
      } else {
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.025;
        groupRef.current.rotation.x = 0;
      }
    }
    // Rotate wheels proportional to speed (or slow idle when stopped)
    const wheelRotSpeed = speed > 0 ? ((speed * 0.278) / 0.35) * delta * 0.45 : delta * 0.8;
    wheelsRef.current.forEach((wheel) => {
      if (wheel) {
        wheel.rotation.x += wheelRotSpeed;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} castShadow receiveShadow>
      {/* ================= LOWER CHASSIS & UNDERBODY ================= */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.18, 4.4]} />
        <meshStandardMaterial color="#0c0d12" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Front Splitter with Aero Winglets */}
      <mesh position={[0, 0.12, 2.15]} castShadow>
        <boxGeometry args={[1.98, 0.04, 0.4]} />
        <meshStandardMaterial color="#111218" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[-0.98, 0.18, 2.15]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.04, 0.14, 0.35]} />
        <meshStandardMaterial color="#111218" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0.98, 0.18, 2.15]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.04, 0.14, 0.35]} />
        <meshStandardMaterial color="#111218" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Rear Aero Diffuser Fins */}
      <group position={[0, 0.18, -2.18]}>
        <mesh castShadow>
          <boxGeometry args={[1.85, 0.12, 0.45]} />
          <meshStandardMaterial color="#08090d" roughness={0.5} metalness={0.7} />
        </mesh>
        {[-0.6, -0.3, 0, 0.3, 0.6].map((x, i) => (
          <mesh key={i} position={[x, -0.02, 0.02]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.03, 0.16, 0.42]} />
            <meshStandardMaterial color="#181a24" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ================= MAIN CAR BODY (AERODYNAMIC SUPERCAR COCKPIT & HOOD) ================= */}
      {/* Front Nose & Hood */}
      <mesh position={[0, 0.42, 1.25]} rotation={[-0.12, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.78, 0.28, 1.8]} />
        <meshPhysicalMaterial
          color={color}
          roughness={matProps.roughness}
          metalness={matProps.metalness}
          clearcoat={matProps.clearcoat}
          clearcoatRoughness={matProps.clearcoatRoughness}
        />
      </mesh>

      {/* Hood Aerodynamic Inverted Duct */}
      <mesh position={[0, 0.52, 1.2]} rotation={[-0.14, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.04, 0.8]} />
        <meshStandardMaterial color="#0b0c10" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Center Cabin / Roof Cockpit */}
      <mesh position={[0, 0.72, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[1.42, 0.42, 1.7]} />
        <meshPhysicalMaterial
          color={color}
          roughness={matProps.roughness}
          metalness={matProps.metalness}
          clearcoat={matProps.clearcoat}
          clearcoatRoughness={matProps.clearcoatRoughness}
        />
      </mesh>

      {/* Rear Engine Deck & Haunches */}
      <mesh position={[0, 0.54, -1.25]} rotation={[0.08, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.82, 0.34, 1.65]} />
        <meshPhysicalMaterial
          color={color}
          roughness={matProps.roughness}
          metalness={matProps.metalness}
          clearcoat={matProps.clearcoat}
          clearcoatRoughness={matProps.clearcoatRoughness}
        />
      </mesh>

      {/* Wide Rear Wheel Arch Flares */}
      <mesh position={[-0.92, 0.44, -0.9]} castShadow>
        <boxGeometry args={[0.22, 0.38, 1.2]} />
        <meshPhysicalMaterial
          color={color}
          roughness={matProps.roughness}
          metalness={matProps.metalness}
          clearcoat={matProps.clearcoat}
        />
      </mesh>
      <mesh position={[0.92, 0.44, -0.9]} castShadow>
        <boxGeometry args={[0.22, 0.38, 1.2]} />
        <meshPhysicalMaterial
          color={color}
          roughness={matProps.roughness}
          metalness={matProps.metalness}
          clearcoat={matProps.clearcoat}
        />
      </mesh>

      {/* Wide Front Wheel Arch Flares */}
      <mesh position={[-0.9, 0.38, 1.15]} castShadow>
        <boxGeometry args={[0.18, 0.32, 1.0]} />
        <meshPhysicalMaterial
          color={color}
          roughness={matProps.roughness}
          metalness={matProps.metalness}
          clearcoat={matProps.clearcoat}
        />
      </mesh>
      <mesh position={[0.9, 0.38, 1.15]} castShadow>
        <boxGeometry args={[0.18, 0.32, 1.0]} />
        <meshPhysicalMaterial
          color={color}
          roughness={matProps.roughness}
          metalness={matProps.metalness}
          clearcoat={matProps.clearcoat}
        />
      </mesh>

      {/* ================= TINTED CANOPY GLASS ================= */}
      {/* Windshield */}
      <mesh position={[0, 0.72, 0.6]} rotation={[-0.6, 0, 0]} castShadow>
        <planeGeometry args={[1.36, 0.75]} />
        <meshPhysicalMaterial
          color="#060910"
          roughness={0.05}
          metalness={0.9}
          transmission={0.4}
          ior={1.5}
          reflectivity={0.9}
        />
      </mesh>

      {/* Side Windows (Left & Right) */}
      <mesh position={[-0.71, 0.73, -0.08]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <planeGeometry args={[1.38, 0.36]} />
        <meshPhysicalMaterial
          color="#060910"
          roughness={0.05}
          metalness={0.9}
          transmission={0.3}
          ior={1.5}
        />
      </mesh>
      <mesh position={[0.71, 0.73, -0.08]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <planeGeometry args={[1.38, 0.36]} />
        <meshPhysicalMaterial
          color="#060910"
          roughness={0.05}
          metalness={0.9}
          transmission={0.3}
          ior={1.5}
        />
      </mesh>

      {/* Rear Window / Engine Glass */}
      <mesh position={[0, 0.72, -0.74]} rotation={[0.65, 0, 0]} castShadow>
        <planeGeometry args={[1.28, 0.72]} />
        <meshPhysicalMaterial
          color="#060910"
          roughness={0.05}
          metalness={0.9}
          transmission={0.4}
          ior={1.5}
        />
      </mesh>

      {/* ================= ACTIVE CARBON FIBER REAR WING ================= */}
      <group position={[0, 0.88, -1.95]}>
        {/* Aerodynamic Carbon Wing Blade */}
        <mesh castShadow>
          <boxGeometry args={[1.9, 0.05, 0.34]} />
          <meshStandardMaterial color="#0a0a0d" roughness={0.35} metalness={0.8} />
        </mesh>
        {/* Endplates */}
        <mesh position={[-0.95, 0.02, 0]}>
          <boxGeometry args={[0.03, 0.16, 0.38]} />
          <meshStandardMaterial color="#11131a" roughness={0.35} metalness={0.8} />
        </mesh>
        <mesh position={[0.95, 0.02, 0]}>
          <boxGeometry args={[0.03, 0.16, 0.38]} />
          <meshStandardMaterial color="#11131a" roughness={0.35} metalness={0.8} />
        </mesh>
        {/* Dual Swan-Neck Mount Struts */}
        <mesh position={[-0.45, -0.16, 0.02]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.04, 0.32, 0.08]} />
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.45, -0.16, 0.02]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.04, 0.32, 0.08]} />
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ================= HEADLIGHTS & TAILLIGHTS (EMISSIVE GLOW) ================= */}
      {/* Front Razor Matrix Headlights (Left & Right) */}
      <group position={[0, 0.44, 2.12]}>
        {/* Left Headlight */}
        <mesh position={[-0.68, 0, 0]} rotation={[0.05, -0.3, 0]}>
          <boxGeometry args={[0.4, 0.04, 0.06]} />
          <meshStandardMaterial
            color={headlightsOn ? '#67e8f9' : '#1e293b'}
            emissive={headlightsOn ? '#00f2fe' : '#000000'}
            emissiveIntensity={headlightsOn ? 3.5 : 0}
            toneMapped={false}
          />
        </mesh>
        {/* Right Headlight */}
        <mesh position={[0.68, 0, 0]} rotation={[0.05, 0.3, 0]}>
          <boxGeometry args={[0.4, 0.04, 0.06]} />
          <meshStandardMaterial
            color={headlightsOn ? '#67e8f9' : '#1e293b'}
            emissive={headlightsOn ? '#00f2fe' : '#000000'}
            emissiveIntensity={headlightsOn ? 3.5 : 0}
            toneMapped={false}
          />
        </mesh>

        {/* Dynamic Light Beam Projections */}
        {headlightsOn && (
          <>
            <spotLight
              position={[-0.68, 0.1, 0.2]}
              target-position={[-0.8, -0.5, 6]}
              angle={0.65}
              penumbra={0.5}
              intensity={4}
              color="#38bdf8"
              distance={12}
            />
            <spotLight
              position={[0.68, 0.1, 0.2]}
              target-position={[0.8, -0.5, 6]}
              angle={0.65}
              penumbra={0.5}
              intensity={4}
              color="#38bdf8"
              distance={12}
            />
          </>
        )}
      </group>

      {/* Full-Width Horizon OLED Rear Lightbar */}
      <mesh position={[0, 0.5, -2.12]}>
        <boxGeometry args={[1.74, 0.035, 0.04]} />
        <meshStandardMaterial
          color="#ff1133"
          emissive="#ff002b"
          emissiveIntensity={3.2}
          toneMapped={false}
        />
      </mesh>

      {/* Dual Exhaust Tips or Aero Diffuser Lights */}
      <mesh position={[-0.28, 0.28, -2.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
        <meshStandardMaterial color="#4b5563" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.28, 0.28, -2.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
        <meshStandardMaterial color="#4b5563" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* ================= WHEELS, TIRES & BRAKES ================= */}
      {/* 4 Performance Wheels */}
      {[
        { x: -0.92, y: 0.32, z: 1.25, isLeft: true },
        { x: 0.92, y: 0.32, z: 1.25, isLeft: false },
        { x: -0.94, y: 0.34, z: -1.25, isLeft: true },
        { x: 0.94, y: 0.34, z: -1.25, isLeft: false },
      ].map((pos, index) => (
        <group
          key={index}
          position={[pos.x, pos.y, pos.z]}
          ref={(el) => {
            if (el) wheelsRef.current[index] = el;
          }}
        >
          {/* Performance Low-Profile Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.24, 24]} />
            <meshStandardMaterial color="#141518" roughness={0.85} metalness={0.1} />
          </mesh>

          {/* Forged Multi-Spoke Alloy Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[pos.isLeft ? -0.02 : 0.02, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.23, 20]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.15} />
          </mesh>

          {/* Center Wheel Lock Hub with Brand Accent */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[pos.isLeft ? -0.13 : 0.13, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Cross-Drilled Carbon-Ceramic Brake Disc */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[pos.isLeft ? 0.02 : -0.02, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.03, 20]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} />
          </mesh>

          {/* Racing Brake Caliper (Neon Accent) */}
          <mesh position={[pos.isLeft ? 0.02 : -0.02, 0.14, 0.08]}>
            <boxGeometry args={[0.06, 0.1, 0.16]} />
            <meshStandardMaterial color="#00f2fe" metalness={0.6} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ================= INTERIOR SILHOUETTE ================= */}
      <group position={[0, 0.58, 0.1]}>
        {/* Sport Bucket Seats */}
        <mesh position={[-0.32, 0, -0.1]} castShadow>
          <boxGeometry args={[0.42, 0.44, 0.38]} />
          <meshStandardMaterial color="#1e222d" roughness={0.7} />
        </mesh>
        <mesh position={[0.32, 0, -0.1]} castShadow>
          <boxGeometry args={[0.42, 0.44, 0.38]} />
          <meshStandardMaterial color="#1e222d" roughness={0.7} />
        </mesh>
        {/* Cockpit Yoke / Steering Silhouette */}
        <mesh position={[-0.32, 0.08, 0.3]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.12, 0.02, 8, 20, Math.PI * 1.5]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>
        {/* Center Minimalist Console HUD */}
        <mesh position={[0, -0.02, 0.25]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.2, 0.3, 0.03]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0284c7"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </group>
  );
}
