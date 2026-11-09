'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  scrollProgress?: number; // 0 to 1 (optional)
  isMobile: boolean;
}

export function CameraRig({ scrollProgress, isMobile }: CameraRigProps) {
  const { camera, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0, 0.4, 0));

  useFrame((state, delta) => {
    // If scrollProgress prop is provided use it, otherwise read directly from window without React state re-renders
    let rawProgress = scrollProgress;
    if (rawProgress === undefined && typeof window !== 'undefined' && typeof document !== 'undefined') {
      const scrollY = window.scrollY || 0;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      rawProgress = totalHeight > 0 ? scrollY / totalHeight : 0;
    }
    const p = Math.max(0, Math.min(1, rawProgress ?? 0));

    // Pointer parallax offsets (reduced on mobile for stability)
    const parallaxFactor = isMobile ? 0.3 : 0.8;
    const px = pointer.x * parallaxFactor;
    const py = pointer.y * (parallaxFactor * 0.4);

    // Calculate camera waypoint based on scroll progress
    if (p < 0.28) {
      // Phase 1: Hero Section - Dynamic Front Three-Quarter Angle
      const sub = p / 0.28;
      const radius = isMobile ? 5.8 : 5.0;
      const angle = (sub * 0.5) + (state.clock.elapsedTime * 0.05);

      const x = Math.sin(angle + 0.8) * radius + px;
      const y = (isMobile ? 1.8 : 1.4) + py;
      const z = Math.cos(angle + 0.8) * radius;

      targetPos.current.set(x, y, z);
      lookAtTarget.current.set(0, 0.4, 0);
    } else if (p < 0.55) {
      // Phase 2: Customization & Paint Section - Side Profile & Wheel Detail
      const sub = (p - 0.28) / (0.55 - 0.28);
      // Smooth interpolation from front-quarter to sharp side profile
      const startX = 3.8;
      const endX = isMobile ? 3.4 : 2.8;
      const startY = 1.3;
      const endY = 0.85;
      const startZ = 2.5;
      const endZ = 1.2;

      targetPos.current.set(
        THREE.MathUtils.lerp(startX, endX, sub) + px * 0.5,
        THREE.MathUtils.lerp(startY, endY, sub) + py * 0.5,
        THREE.MathUtils.lerp(startZ, endZ, sub)
      );
      lookAtTarget.current.set(0, 0.38, 0.2);
    } else if (p < 0.78) {
      // Phase 3: Rear Aerodynamics & Performance - Low Rear-Quarter Angle
      const sub = (p - 0.55) / (0.78 - 0.55);
      const startX = 2.8;
      const endX = isMobile ? -3.0 : -2.6;
      const startY = 0.85;
      const endY = 0.75;
      const startZ = 1.2;
      const endZ = -3.4;

      targetPos.current.set(
        THREE.MathUtils.lerp(startX, endX, sub) + px * 0.4,
        THREE.MathUtils.lerp(startY, endY, sub) + py * 0.4,
        THREE.MathUtils.lerp(startZ, endZ, sub)
      );
      lookAtTarget.current.set(0, 0.45, -0.6);
    } else {
      // Phase 4: Marketplace Transition - Elevated Pullback
      const sub = (p - 0.78) / (1.0 - 0.78);
      const startX = -2.6;
      const endX = 0;
      const startY = 0.75;
      const endY = isMobile ? 6.2 : 5.2;
      const startZ = -3.4;
      const endZ = isMobile ? 6.8 : 5.8;

      targetPos.current.set(
        THREE.MathUtils.lerp(startX, endX, sub),
        THREE.MathUtils.lerp(startY, endY, sub),
        THREE.MathUtils.lerp(startZ, endZ, sub)
      );
      lookAtTarget.current.set(0, 0.2, 0);
    }

    // Smooth camera position damping
    const lerpSpeed = Math.min(delta * 4.5, 0.25);
    camera.position.lerp(targetPos.current, lerpSpeed);

    // Smooth lookAt damping
    currentLookAt.current.lerp(lookAtTarget.current, lerpSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
