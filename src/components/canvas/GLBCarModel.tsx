'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SupercarModel } from './SupercarModel';
import { CarFinish } from '@/types';

interface GLBCarModelProps {
  modelUrl?: string;
  color: string;
  finish: CarFinish;
  headlightsOn?: boolean;
}

function LoadedGLB({
  url,
  color,
  headlightsOn,
}: {
  url: string;
  color: string;
  headlightsOn?: boolean;
}) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          // If mesh name suggests body or paint, tint it with user selected color
          const name = mesh.name.toLowerCase();
          if (
            name.includes('body') ||
            name.includes('paint') ||
            name.includes('car_body') ||
            name.includes('exterior')
          ) {
            if (mesh.material) {
              const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
              mat.color = new THREE.Color(color);
              mesh.material = mat;
            }
          }
        }
      });
    }
  }, [scene, color]);

  return <primitive object={scene} scale={[1, 1, 1]} position={[0, -0.1, 0]} />;
}

export function GLBCarModel({
  modelUrl = '/models/car.glb',
  color,
  finish,
  headlightsOn = true,
}: GLBCarModelProps) {
  const [hasGLB, setHasGLB] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the file actually exists via fetch HEAD request
    let isMounted = true;
    fetch(modelUrl, { method: 'HEAD' })
      .then((res) => {
        if (isMounted) {
          if (res.ok && res.headers.get('content-type')?.includes('gltf') || res.status === 200) {
            setHasGLB(true);
          } else {
            setHasGLB(false);
          }
        }
      })
      .catch(() => {
        if (isMounted) setHasGLB(false);
      });

    return () => {
      isMounted = false;
    };
  }, [modelUrl]);

  // While checking or if no valid GLB, show the procedural SupercarModel
  if (!hasGLB) {
    return <SupercarModel color={color} finish={finish} headlightsOn={headlightsOn} />;
  }

  return (
    <Suspense fallback={<SupercarModel color={color} finish={finish} headlightsOn={headlightsOn} />}>
      <LoadedGLB url={modelUrl} color={color} headlightsOn={headlightsOn} />
    </Suspense>
  );
}
