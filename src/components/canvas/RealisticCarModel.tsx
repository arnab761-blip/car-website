'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CarFinish, GlassTint } from '@/types';

export function isWheelNode(name: string): boolean {
  if (!name || /steer/i.test(name)) return false;
  // Specific patterns for the fleet (supporting both raw GLTF names and Three.js sanitized names)
  if (/^wheel_(fl|fr|rl|rr)$/i.test(name)) return true;
  if (/^Obj_DiscRotor_(FL|FR|RL|RR)$/i.test(name)) return true;
  if (/^(DEF-Wheel|bmw27-Wheel)\.?(Ft|Bk)\.?(L|R)$/i.test(name)) return true;
  if (/^jantes\.?\d+$/i.test(name)) return true;
  if (/^pneu1?\.?\d+$/i.test(name)) return true;
  if (/^Cylinder\.?0*(0|1)$/i.test(name)) return true;
  if (/^(Protector|Rims)\.?0*(1|2)$/i.test(name)) return true;
  return false;
}

export function isGenericWheel(name: string): boolean {
  const n = (name || '').toLowerCase();
  return (
    !/steer|caliper|brake|sensor|hub|arch|chassis|body|frame/i.test(n) &&
    /wheel|tire|tyre|rim|jante|felna/i.test(n)
  );
}


export type CarPartType =
  | 'body'
  | 'rim'
  | 'caliper'
  | 'tire'
  | 'glass'
  | 'headlight'
  | 'taillight'
  | 'interior'
  | 'trim'
  | 'badge';

export function classifyCarPart(matName: string, meshName: string): CarPartType {
  const m = (matName || '').toLowerCase();
  const n = (meshName || '').toLowerCase();

  // 1. Tires & Rubber
  if (
    m.includes('tire') ||
    m.includes('tyre') ||
    m.includes('pneu') ||
    m.includes('rubber') ||
    n.includes('tire') ||
    n.includes('tyre')
  ) {
    return 'tire';
  }

  // 2. Brake Calipers
  if (
    m.includes('brakecaliper') ||
    m.includes('plaquette') ||
    m.includes('caliper') ||
    m === 'ferrari_yellow' ||
    m.includes('goldshiny') ||
    m.includes('chromered_001') ||
    n.includes('caliper') ||
    (m === 'material.001' && (n.includes('cylinder') || n.includes('000_3') || n.includes('001_3')))
  ) {
    return 'caliper';
  }

  // 3. Wheels / Rims / Rotors
  if (
    m.includes('felna') ||
    m.includes('jante') ||
    m.includes('alloywheels') ||
    m.includes('rim') ||
    m.includes('wheel') ||
    m.includes('rotor') ||
    m.includes('disc') ||
    (m.includes('aluminiumbrushed') && !m.includes('sensor')) ||
    m === 'metal_gray' ||
    m === 'metal_chrome' ||
    m === 'silver' ||
    m === 'tex_shiny' ||
    n.includes('rim') ||
    n.includes('wheel') ||
    n.includes('felna')
  ) {
    return 'rim';
  }

  // 4. Glass / Windows / Windshields
  if (
    (m.includes('staklo') && !m.includes('svijetla')) ||
    (m.includes('glass') && !m.includes('projector') && !m.includes('tail')) ||
    m.includes('window') ||
    m.includes('windscreen') ||
    m.includes('windshield') ||
    m.includes('fumé') ||
    m.includes('tinted') ||
    n.includes('window') ||
    n.includes('windshield') ||
    n.includes('glass')
  ) {
    return 'glass';
  }

  // 5. Taillights & Rear Reflectors
  if (
    m.includes('taillight') ||
    m.includes('rearlight') ||
    m.includes('phare arriere') ||
    m.includes('reflector') ||
    m.includes('chromered') ||
    ((m.includes('tail') || m.includes('rear') || m.includes('arriere')) &&
      (m.includes('light') || m.includes('phare'))) ||
    n.includes('taillight') ||
    n.includes('rear_light')
  ) {
    return 'taillight';
  }

  // 6. Headlights & Front Projectors
  if (
    m.includes('phare') ||
    m.includes('frontlight') ||
    m.includes('sideligt') ||
    m.includes('staklo_svijetla') ||
    m.includes('projector') ||
    m.includes('turn_signal') ||
    m.includes('light_emissive') ||
    m.includes('turnlights') ||
    m.includes('lights') ||
    (m.includes('light') && !m.includes('interior_light')) ||
    m.includes('lamp') ||
    n.includes('headlight') ||
    n.includes('front_light')
  ) {
    return 'headlight';
  }

  // 7. Interior (Seats, Leather, Cockpit, Dashboard, Carpet)
  if (
    m.includes('sjedista') ||
    m.includes('leather') ||
    m.includes('carpet') ||
    m.includes('seat') ||
    m.includes('interior') ||
    m.includes('tableau') ||
    n.includes('seat') ||
    n.includes('interior') ||
    n.includes('cockpit') ||
    n.includes('steer')
  ) {
    return 'interior';
  }

  // 8. Body Paint (Strictly matching true lacquer/paint materials)
  if (
    m.includes('carpaint') ||
    m.includes('boja dzipa') ||
    m.includes('body_color') ||
    m.includes('body_paint') ||
    m.includes('_0098_dodgerblue') ||
    m === 'paint' ||
    m === 'coat' ||
    m === 'mt_body' ||
    m === 'steel' ||
    m === 'body'
  ) {
    return 'body';
  }

  // 9. Badges & Emblems
  if (
    m.includes('znak') ||
    m.includes('logo') ||
    m.includes('matricule') ||
    m.includes('license') ||
    m === 'zlatna' ||
    n.includes('logo') ||
    n.includes('badge')
  ) {
    return 'badge';
  }

  // 10. Exterior Trims (Carbon, Grille, Mirrors, Plastic, Chrome)
  return 'trim';
}

export interface WheelRigItem {
  object: THREE.Object3D;
  axis: 'x' | 'y' | 'z';
  direction: number;
}

export interface RealisticCarModelProps {
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
  speed?: number;
  speedRef?: React.RefObject<number | null | undefined>;
  isEngineRunning?: boolean;
}

function centerPivotAtGeometryCenter(obj: THREE.Object3D) {
  if (obj.userData._pivotCentered) return;
  obj.userData._pivotCentered = true;

  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj);
  if (box.isEmpty()) return;

  const worldCenter = new THREE.Vector3();
  box.getCenter(worldCenter);

  const parent = obj.parent;
  const targetPos = parent ? parent.worldToLocal(worldCenter.clone()) : worldCenter.clone();
  const shift = targetPos.clone().sub(obj.position);

  // If shift is negligible, pivot is already at center of wheel
  if (shift.lengthSq() < 0.00001) return;

  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).geometry) {
      const mesh = child as THREE.Mesh;
      mesh.geometry = mesh.geometry.clone();
      mesh.geometry.translate(-shift.x, -shift.y, -shift.z);
      mesh.geometry.computeBoundingBox();
      if (mesh.geometry.computeBoundingSphere) {
        mesh.geometry.computeBoundingSphere();
      }
    }
  });

  obj.position.copy(targetPos);
  obj.updateMatrixWorld(true);
}

export function RealisticCarModel({
  modelUrl = '/models/car.glb',
  color = '#00d2ff',
  finish = 'metallic',
  rimColor = '#d1d5db',
  caliperColor = '#dc2626',
  interiorColor = '#9a3412',
  trimColor = '#0a0a0a',
  headlightColor = '#38bdf8',
  glassTint = 'sport',
  headlightsOn = true,
  speed = 0,
  speedRef,
  isEngineRunning = false,
}: RealisticCarModelProps) {
  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const isInitialized = useRef(false);
  const wheelRigsRef = useRef<WheelRigItem[]>([]);
  const chassisRef = useRef<THREE.Group>(null);
  const internalSpeedRef = useRef(0);

  // 1. One-time geometry positioning, normal calculation, and material classification
  useEffect(() => {
    isInitialized.current = false;

    // Reset base transforms
    clonedScene.position.set(0, 0, 0);
    clonedScene.rotation.set(0, 0, 0);
    clonedScene.scale.set(1, 1, 1);
    clonedScene.updateMatrixWorld(true);

    const url = (modelUrl || '').toLowerCase();

    // 0. Remove defective or misplaced CAD geometry before measuring bounds:
    // - For sedan.glb (Valkyrie Carbon R / Mercedes):
    //   1. Node 54 'Plane.019' (mesh 'Plane.037'): floating intake/sticker mesh outside the front bumper
    //   2. Node 58 'Plane.001' (mesh 'Plane.018', material 'barre toit'): asymmetric wavy roof rail
    if (url.includes('sedan.glb') || url.includes('mercedes')) {
      const defectiveParts: THREE.Object3D[] = [];
      clonedScene.traverse((child) => {
        const name = child.name || '';
        const lowerName = name.toLowerCase();
        let isDefective = false;

        // Check sanitized Three.js names (Plane019, Plane037, Plane001, Plane018) and raw names (Plane.019, etc.)
        if (
          /^plane[._]?0*(19|37|1|18)$/i.test(name) ||
          lowerName.includes('plane019') ||
          lowerName.includes('plane.019') ||
          lowerName.includes('plane037') ||
          lowerName.includes('plane.037') ||
          lowerName.includes('plane001') ||
          lowerName.includes('plane.001') ||
          lowerName.includes('plane018') ||
          lowerName.includes('plane.018')
        ) {
          isDefective = true;
        }

        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          if (mats.some((m) => (m?.name || '').toLowerCase().includes('barre toit'))) {
            isDefective = true;
          }
          // Unique vertex count fingerprints for defective parts in sedan.glb:
          // Mesh 54 (Plane.037 / Plane.019 floating front grille sticker): exactly 3776 vertices
          // Mesh 58 (Plane.018 / Plane.001 wavy roof rail): exactly 2356 vertices
          const vertCount = mesh.geometry?.attributes?.position?.count;
          if (vertCount === 3776 || vertCount === 2356) {
            isDefective = true;
          }
        }

        if (isDefective) {
          child.visible = false;
          defectiveParts.push(child);
        }
      });

      defectiveParts.forEach((part) => {
        part.visible = false;
        if ((part as THREE.Mesh).isMesh) {
          ((part as THREE.Mesh).material as any)?.dispose?.();
        }
        part.parent?.remove(part);
      });
    }

    // Measure raw bounds
    const rawBox = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    rawBox.getSize(size);

    // Normalize scale so maximum length is ~4.4 units
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const targetSize = 4.4;
      const s = targetSize / maxDim;
      clonedScene.scale.set(s, s, s);
    }

    // Align orientation: ensure EVERY car faces forward (+Z) straight down the road!
    if (url.includes('car.glb')) {
      // Ferrari 458 in car.glb: native front is at -Z -> rotate 180° around Y
      clonedScene.rotation.y = Math.PI;
    } else if (url.includes('aventador.glb')) {
      // Lamborghini Aventador: native front is at -X -> rotate 90° around Y
      clonedScene.rotation.y = Math.PI / 2;
    } else if (url.includes('sedan.glb') || url.includes('mercedes')) {
      // Mercedes / Sedan: native front is at +X -> rotate -90° around Y to face +Z
      clonedScene.rotation.y = -Math.PI / 2;
    } else {
      // suv.glb, porsche.glb, cybertruck.glb all natively face +Z
      clonedScene.rotation.y = 0;
    }

    // Recompute bounding box and center at origin on ground (y = 0)
    clonedScene.updateMatrixWorld(true);
    const finalBox = new THREE.Box3().setFromObject(clonedScene);
    const finalCenter = new THREE.Vector3();
    finalBox.getCenter(finalCenter);

    clonedScene.position.x = -finalCenter.x;
    clonedScene.position.z = -finalCenter.z;
    clonedScene.position.y = -finalBox.min.y; // Sit flush on ground
    clonedScene.updateMatrixWorld(true);

    // Traverse and initialize materials
    clonedScene.traverse((child) => {
      if (!child.visible) return;
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Recompute vertex normals to guarantee smooth showroom shading (especially fixes suv.glb corrupted normals)
        if (mesh.geometry) {
          if (!mesh.geometry.attributes.normal || url.includes('suv.glb')) {
            mesh.geometry.computeVertexNormals();
          }
        }

        const originalMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const carParts: CarPartType[] = [];
        const newMaterials: THREE.MeshStandardMaterial[] = [];

        originalMaterials.forEach((origMat) => {
          if (!origMat) return;
          const origName = origMat.name || '';
          const part = classifyCarPart(origName, mesh.name || '');
          carParts.push(part);

          let stdMat: THREE.MeshStandardMaterial;
          if ((origMat as any).isMeshStandardMaterial) {
            stdMat = (origMat as THREE.MeshStandardMaterial).clone();
          } else {
            stdMat = new THREE.MeshStandardMaterial({
              name: origName,
              roughness: 0.25,
              metalness: 0.8,
              map: (origMat as any).map || null,
            });
          }

          if (part === 'body') {
            // Strip any foreign normal / bump textures from CAD files to guarantee flawless mirror-smooth lacquer
            stdMat.normalMap = null;
            stdMat.bumpMap = null;
            stdMat.map = null;
          }

          stdMat.name = origName;
          newMaterials.push(stdMat);
        });

        mesh.userData.carParts = carParts;
        mesh.material = Array.isArray(mesh.material) ? newMaterials : newMaterials[0];
      }
    });

    // Collect and configure wheel rigs strictly without reparenting (preserves bone & parent hierarchies)
    const wheelRigs: WheelRigItem[] = [];

    if (url.includes('car.glb')) {
      // 1. Apex Hyperion GT (Ferrari 458): 4 clean wheel nodes, rotate around X with direction -1 to roll forward (+Z)
      clonedScene.traverse((child) => {
        if (/^wheel_(fl|fr|rl|rr)$/i.test(child.name)) {
          wheelRigs.push({ object: child, axis: 'x', direction: -1 });
        }
      });
    } else if (url.includes('aventador.glb')) {
      // 2. Lumina Phantom V12 (Lamborghini): disc rotor + rim + tire lie in XY plane, rolling axle is Z!
      clonedScene.traverse((child) => {
        if (/^Obj_DiscRotor_(FL|RL)$/i.test(child.name)) {
          wheelRigs.push({ object: child, axis: 'z', direction: 1 });
        } else if (/^Obj_DiscRotor_(FR|RR)$/i.test(child.name)) {
          wheelRigs.push({ object: child, axis: 'z', direction: -1 });
        }
      });
    } else if (url.includes('sedan.glb') || url.includes('mercedes')) {
      // 3. Valkyrie Carbon R (Mercedes): rims (jantes) and tires (pneu1)
      clonedScene.traverse((child) => {
        if (/^jantes\.?0*(0|2)$/i.test(child.name)) {
          wheelRigs.push({ object: child, axis: 'y', direction: -1 });
        } else if (/^jantes\.?0*(1|3)$/i.test(child.name)) {
          wheelRigs.push({ object: child, axis: 'y', direction: 1 });
        } else if (/^pneu1?\.?\d+$/i.test(child.name)) {
          wheelRigs.push({ object: child, axis: 'x', direction: -1 });
        }
      });
    } else if (url.includes('suv.glb')) {
      // 4. Monolith SUV: DEF-Wheel bone rigs have horizontal world X rolling axle and true center pivot
      clonedScene.traverse((child) => {
        if (/^DEF-Wheel\.?(Ft|Bk)\.?(L|R)$/i.test(child.name)) {
          wheelRigs.push({ object: child, axis: 'x', direction: 1 });
        }
      });
      // Fallback if DEF-Wheel bone nodes are absent
      if (wheelRigs.length === 0) {
        clonedScene.traverse((child) => {
          if (/^bmw27-Wheel\.?(Ft|Bk)\.?(L|R)$/i.test(child.name)) {
            wheelRigs.push({ object: child, axis: 'x', direction: 1 });
          }
        });
      }
    } else if (url.includes('porsche.glb')) {
      // 5. Aether Spider (Porsche 911 Carrera):
      // The rear wheels (Cylinder.000) are 100% factory straight, perfectly perpendicular to the rolling axis.
      // The original front wheels (Cylinder.001) were modeled turned at an angle in the CAD file, which caused wobbling.
      // We clone Cylinder.000 to the front axle (Y offset -4.220165) so both front and rear wheels are 100% identical,
      // perfectly straight, and roll with 0.000° wobble just like all other supercars!
      let c000: THREE.Object3D | null = null;
      let c001: THREE.Object3D | null = null;

      clonedScene.traverse((child) => {
        if (/^Cylinder\.?0*0$/i.test(child.name)) c000 = child;
        else if (/^Cylinder\.?0*1$/i.test(child.name)) c001 = child;
      });

      if (c000) {
        const pC000 = c000 as THREE.Object3D;
        const root = pC000.parent || clonedScene;

        // Hide original turned front wheels
        if (c001) {
          const pC001 = c001 as THREE.Object3D;
          pC001.visible = false;
          pC001.position.set(0, -999, 0);
        }

        // Clone the straight rear wheels to create front wheels
        const frontWheels = pC000.clone(true);
        frontWheels.name = 'Cylinder.001_StraightFront';

        // Translate the cloned wheel meshes forward to the front axle (delta Y = -4.220165)
        frontWheels.children.forEach((child) => {
          if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).geometry) {
            const mesh = child as THREE.Mesh;
            mesh.geometry = mesh.geometry.clone();
            mesh.geometry.translate(0, -4.220165, 0);
            mesh.geometry.computeBoundingBox();
            if (mesh.geometry.computeBoundingSphere) {
              mesh.geometry.computeBoundingSphere();
            }
          }
        });
        root.add(frontWheels);

        // Reparent calipers (_3) to Root so they remain stationary and don't rotate with wheels
        [pC000, frontWheels].forEach((cyl) => {
          const caliper = cyl.children.find((c) => /_3$/i.test(c.name));
          if (caliper) {
            caliper.applyMatrix4(cyl.matrix);
            root.add(caliper);
          }
        });

        // Align both wheel hubs to their exact axle centers
        const setupPorscheAxle = (obj: THREE.Object3D, axleY: number, axleZ: number) => {
          const currentPos = obj.position.clone();
          const targetPos = new THREE.Vector3(0, axleY, axleZ);
          const shift = targetPos.clone().sub(currentPos);
          if (shift.lengthSq() < 0.00001) return;

          obj.children.forEach((child) => {
            if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).geometry) {
              const mesh = child as THREE.Mesh;
              mesh.geometry = mesh.geometry.clone();
              mesh.geometry.translate(-shift.x, -shift.y, -shift.z);
              mesh.geometry.computeBoundingBox();
              if (mesh.geometry.computeBoundingSphere) {
                mesh.geometry.computeBoundingSphere();
              }
            }
          });
          obj.position.copy(targetPos);
          obj.updateMatrixWorld(true);
        };

        setupPorscheAxle(pC000, 2.126565, -0.51017);
        setupPorscheAxle(frontWheels, -2.0936, -0.51017);

        wheelRigs.push({ object: pC000, axis: 'x', direction: 1 });
        wheelRigs.push({ object: frontWheels, axis: 'x', direction: 1 });
      }
    } else if (url.includes('cybertruck.glb')) {
      // 6. CyberTrack GTS (Cybertruck): rear Protector001/Rims001 and front Protector002/Rims002 with true geometry centering
      clonedScene.traverse((child) => {
        if (/^(Protector|Rims)\.?0*1$/i.test(child.name)) {
          centerPivotAtGeometryCenter(child);
          wheelRigs.push({ object: child, axis: 'x', direction: 1 });
        } else if (/^(Protector|Rims)\.?0*2$/i.test(child.name)) {
          centerPivotAtGeometryCenter(child);
          wheelRigs.push({ object: child, axis: 'x', direction: 1 });
        }
      });
    }

    // Universal Fallback: if no model-specific rigs matched, find any wheel/tire node
    if (wheelRigs.length === 0) {
      clonedScene.traverse((child) => {
        if (isWheelNode(child.name) || isGenericWheel(child.name)) {
          wheelRigs.push({ object: child, axis: 'x', direction: 1 });
        }
      });
    }


    wheelRigsRef.current = wheelRigs;
    isInitialized.current = true;
  }, [clonedScene, modelUrl]);


  // 2. Real-time reactive shader updates whenever ANY customization prop changes!
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const parts: CarPartType[] = mesh.userData.carParts || [];

        materials.forEach((mat, idx) => {
          if (!mat || !(mat as any).isMeshStandardMaterial) return;
          const stdMat = mat as THREE.MeshStandardMaterial;
          const part = parts[idx] || 'trim';

          // A. CAR BODY PAINT
          if (part === 'body') {
            stdMat.color.set(color);
            stdMat.normalMap = null;
            stdMat.bumpMap = null;
            stdMat.map = null;

            if (finish === 'metallic') {
              stdMat.roughness = 0.18;
              stdMat.metalness = 0.85;
            } else if (finish === 'matte') {
              stdMat.roughness = 0.65;
              stdMat.metalness = 0.15;
            } else if (finish === 'gloss') {
              stdMat.roughness = 0.04;
              stdMat.metalness = 0.45;
            } else if (finish === 'carbon') {
              stdMat.roughness = 0.35;
              stdMat.metalness = 0.65;
            }
            stdMat.transparent = false;
            stdMat.opacity = 1.0;
            stdMat.needsUpdate = true;
          }

          // B. WHEEL RIMS
          else if (part === 'rim') {
            stdMat.color.set(rimColor);
            stdMat.metalness = 0.92;
            stdMat.roughness = 0.18;
            stdMat.needsUpdate = true;
          }

          // C. BRAKE CALIPERS
          else if (part === 'caliper') {
            stdMat.color.set(caliperColor);
            stdMat.metalness = 0.45;
            stdMat.roughness = 0.25;
            stdMat.needsUpdate = true;
          }

          // D. INTERIOR CABIN LEATHER
          else if (part === 'interior') {
            stdMat.color.set(interiorColor);
            stdMat.roughness = 0.68;
            stdMat.metalness = 0.08;
            stdMat.needsUpdate = true;
          }

          // E. EXTERIOR TRIMS & ACCENTS
          else if (part === 'trim') {
            if (trimColor === 'body') {
              stdMat.color.set(color);
            } else {
              stdMat.color.set(trimColor);
            }
            stdMat.roughness = 0.22;
            stdMat.metalness = 0.75;
            stdMat.needsUpdate = true;
          }

          // F. HIGH-PERFORMANCE GLASS
          else if (part === 'glass') {
            const opacity = glassTint === 'limo' ? 0.88 : glassTint === 'clear' ? 0.35 : 0.65;
            stdMat.color.set('#040711');
            stdMat.transparent = true;
            stdMat.opacity = opacity;
            stdMat.roughness = 0.05;
            stdMat.metalness = 0.95;
            stdMat.needsUpdate = true;
          }

          // G. HEADLIGHTS & OPTICS
          else if (part === 'headlight') {
            const beamColor = headlightColor || '#38bdf8';
            stdMat.color.set(headlightsOn ? '#f8fafc' : '#475569');
            stdMat.emissive.set(headlightsOn ? beamColor : '#000000');
            stdMat.emissiveIntensity = headlightsOn ? 4.8 : 0;
            stdMat.roughness = 0.08;
            stdMat.needsUpdate = true;
          }

          // H. TAILLIGHTS
          else if (part === 'taillight') {
            stdMat.color.set('#ef4444');
            stdMat.emissive.set(headlightsOn ? '#dc2626' : '#440a0a');
            stdMat.emissiveIntensity = headlightsOn ? 2.5 : 0.3;
            stdMat.roughness = 0.2;
            stdMat.needsUpdate = true;
          }

          // I. TIRES & RUBBER
          else if (part === 'tire') {
            stdMat.color.set('#141416');
            stdMat.roughness = 0.88;
            stdMat.metalness = 0.08;
            stdMat.needsUpdate = true;
          }
        });
      }
    });
  }, [
    clonedScene,
    color,
    finish,
    rimColor,
    caliperColor,
    interiorColor,
    trimColor,
    headlightColor,
    glassTint,
    headlightsOn,
  ]);

  // 3. Dynamic Wheel Rotation and High-Speed Suspension Dynamics
  useFrame((state, delta) => {
    // Determine real-time speed: direct speedRef at 60/120fps, fallback to speed prop or isEngineRunning
    let currentSpeed = 0;
    if (speedRef && speedRef.current !== undefined && speedRef.current !== null) {
      currentSpeed = speedRef.current;
    } else if (speed > 0) {
      currentSpeed = speed;
    } else if (isEngineRunning) {
      internalSpeedRef.current = Math.min(220, internalSpeedRef.current + 35 * delta);
      currentSpeed = internalSpeedRef.current;
    } else {
      internalSpeedRef.current = Math.max(0, internalSpeedRef.current - 50 * delta);
      currentSpeed = internalSpeedRef.current;
    }

    if (chassisRef.current) {
      if (currentSpeed > 0) {
        // High-speed tarmac micro-flutter & acceleration squat
        const flutter = Math.sin(state.clock.elapsedTime * (32 + currentSpeed * 0.15)) * 0.001;
        chassisRef.current.position.y = -0.02 + flutter;
        chassisRef.current.rotation.x = -Math.min(0.012, currentSpeed * 0.00007);
      } else {
        chassisRef.current.position.y = -0.02;
        chassisRef.current.rotation.x = 0;
      }
    }

    if (currentSpeed > 0 && wheelRigsRef.current.length > 0) {
      // Angular velocity proportional to linear velocity (km/h -> rad/s)
      const angularDelta = ((currentSpeed * 0.2778) / 0.35) * delta;

      wheelRigsRef.current.forEach((item) => {
        if (item.axis === 'x') {
          item.object.rotateX(angularDelta * item.direction);
        } else if (item.axis === 'y') {
          item.object.rotateY(angularDelta * item.direction);
        } else if (item.axis === 'z') {
          item.object.rotateZ(angularDelta * item.direction);
        }
      });
    }
  });

  return (
    <group ref={chassisRef} position={[0, -0.02, 0]} rotation={[0, 0, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload all 6 models for instantaneous zero-latency switching
useGLTF.preload('/models/car.glb');
useGLTF.preload('/models/porsche.glb');
useGLTF.preload('/models/aventador.glb');
useGLTF.preload('/models/cybertruck.glb');
useGLTF.preload('/models/suv.glb');
useGLTF.preload('/models/sedan.glb');
