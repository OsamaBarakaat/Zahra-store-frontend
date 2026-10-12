"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  Sparkles,
  Layers,
  ShoppingBag,
  RotateCcw,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";

// Set types and pricing
const SET_OPTIONS = [
  {
    id: "single-sofa",
    name: "طقم كنبة 3 مقاعد + خدادية",
    pieces: "قطعتين",
    description: "رانر كنبة كبير (210×90 سم) مطرز + خدادية مطرزة (45×45 سم)",
    price: 650,
    originalPrice: 880,
  },
  {
    id: "full-salon",
    name: "طقم أنتريه متكامل 6 قطع",
    pieces: "6 قطع",
    description: "رانر كنبة 3 مقاعد + رانر كنبة 2 مقعد + 2 مفرش فوتيه + 2 خدادية مطرزة",
    price: 1850,
    originalPrice: 2450,
    popular: true,
  },
  {
    id: "corner-sofa",
    name: "طقم ركنة كبير + 3 خداديات",
    pieces: "5 قطع",
    description: "2 رانر ركنة مقاس كبير + 3 خداديات مطرزة",
    price: 1450,
    originalPrice: 1950,
  },
];

// Couch base color options
const COUCH_COLORS = [
  { id: "cream", name: "بيج كريمي", hex: "#EAE3D6" },
  { id: "warm-grey", name: "رمادي هادئ", hex: "#BFB8B0" },
  { id: "camel", name: "جملي دافئ", hex: "#B8977E" },
];

// Precise 3D profile of the couch seat & front waterfall
const PROFILE_POINTS = [
  { z: -0.22, y: 0.065, v: 1.00 },
  { z: -0.10, y: 0.076, v: 0.88 },
  { z:  0.05, y: 0.081, v: 0.74 },
  { z:  0.20, y: 0.083, v: 0.62 },
  { z:  0.35, y: 0.084, v: 0.52 },
  { z:  0.46, y: 0.080, v: 0.42 },
  { z:  0.54, y: 0.070, v: 0.32 },
  { z:  0.58, y: 0.050, v: 0.24 },
  { z:  0.608, y: 0.010, v: 0.17 },
  { z:  0.614, y: -0.055, v: 0.11 },
  { z:  0.610, y: -0.125, v: 0.06 },
  { z:  0.592, y: -0.205, v: 0.02 },
  { z:  0.585, y: -0.275, v: 0.00 },
];

const NUM_X = 32;
const NUM_Z = PROFILE_POINTS.length;
const RUNNER_WIDTH = 1.74;

export default function ScrollSofaCover3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedSet, setSelectedSet] = useState(SET_OPTIONS[1]);
  const [selectedCouchColor, setSelectedCouchColor] = useState(COUCH_COLORS[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [coveragePercent, setCoveragePercent] = useState(0);

  // Scroll Progress linked to container (260vh track)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Spring physics for smooth scroll response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  // Three.js internal references
  const threeState = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    couchMesh: THREE.Mesh | null;
    runnerMesh: THREE.Mesh | null;
    pillowMeshLeft: THREE.Mesh | null;
    pillowMeshRight: THREE.Mesh | null;
    masterGroup: THREE.Group;
    animFrameId: number;
    targetRotationY: number;
    currentRotationY: number;
    targetRotationX: number;
    currentRotationX: number;
    isDragging: boolean;
    prevPointerX: number;
    prevPointerY: number;
  } | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // 2. Camera: focused directly on the couch ensemble
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.72, 2.85);
    camera.lookAt(0, 0.0, 0.15);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // 4. Studio Lighting matching the warm luxury showroom photo
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.3);
    keyLight.position.set(3.5, 4.5, 3.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe5efff, 0.9);
    fillLight.position.set(-3.5, 2.8, 2.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd6b8, 1.5);
    rimLight.position.set(0, 3.6, -3.2);
    scene.add(rimLight);

    // Contact shadow floor plane
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.73;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Master Group for 360 drag rotation
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 5. Load textures from user's latest reference photo
    const textureLoader = new THREE.TextureLoader();

    // Master runner texture: clean linen on seat + embroidered leaves & border & tassels
    const runnerTexture = textureLoader.load(
      "/showcase/runner-v2-clean.jpg",
      () => renderer.render(scene, camera)
    );
    runnerTexture.colorSpace = THREE.SRGBColorSpace;
    runnerTexture.wrapS = THREE.ClampToEdgeWrapping;
    runnerTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Left cushion texture
    const cushionTextureLeft = textureLoader.load(
      "/showcase/cushion-v2-left.jpg",
      () => renderer.render(scene, camera)
    );
    cushionTextureLeft.colorSpace = THREE.SRGBColorSpace;

    // Right cushion texture
    const cushionTextureRight = textureLoader.load(
      "/showcase/cushion-v2-right.jpg",
      () => renderer.render(scene, camera)
    );
    cushionTextureRight.colorSpace = THREE.SRGBColorSpace;

    // 6. Dynamic Parametric Runner Ribbon Geometry
    const runnerGeo = new THREE.BufferGeometry();
    const totalVerts = (NUM_X + 1) * NUM_Z;
    const initialPositions = new Float32Array(totalVerts * 3);
    const uvs = new Float32Array(totalVerts * 2);
    const indices: number[] = [];

    let pIdx = 0;
    let uvIdx = 0;

    for (let zi = 0; zi < NUM_Z; zi++) {
      const pt = PROFILE_POINTS[zi];
      for (let xi = 0; xi <= NUM_X; xi++) {
        const u = xi / NUM_X;
        const x = -RUNNER_WIDTH / 2 + u * RUNNER_WIDTH;

        initialPositions[pIdx++] = x;
        initialPositions[pIdx++] = pt.y;
        initialPositions[pIdx++] = pt.z;

        uvs[uvIdx++] = u;
        uvs[uvIdx++] = pt.v;
      }
    }

    for (let zi = 0; zi < NUM_Z - 1; zi++) {
      for (let xi = 0; xi < NUM_X; xi++) {
        const a = zi * (NUM_X + 1) + xi;
        const b = zi * (NUM_X + 1) + (xi + 1);
        const c = (zi + 1) * (NUM_X + 1) + xi;
        const d = (zi + 1) * (NUM_X + 1) + (xi + 1);

        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    runnerGeo.setAttribute("position", new THREE.BufferAttribute(initialPositions, 3));
    runnerGeo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    runnerGeo.setIndex(indices);
    runnerGeo.computeVertexNormals();

    const runnerMat = new THREE.MeshStandardMaterial({
      map: runnerTexture,
      roughness: 0.88,
      metalness: 0.02,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    });

    const runnerMesh = new THREE.Mesh(runnerGeo, runnerMat);
    runnerMesh.castShadow = true;
    runnerMesh.receiveShadow = true;
    masterGroup.add(runnerMesh);

    // 7. Matching Plush Embroidered Cushions (الخداديات المطرزة)
    const makePillow = (tex: THREE.Texture) => {
      const pillowGeo = new THREE.BoxGeometry(0.36, 0.36, 0.13, 8, 8, 4);
      const pos = pillowGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const d = Math.sqrt((x / 0.18) ** 2 + (y / 0.18) ** 2);
        const bulge = Math.cos(Math.min(Math.PI * 0.48, d * 1.2));
        pos.setZ(i, z * (0.45 + 0.55 * Math.max(0, bulge)));
      }
      pillowGeo.computeVertexNormals();

      const linenMat = new THREE.MeshStandardMaterial({
        color: 0xede7dd,
        roughness: 0.9,
        metalness: 0.02,
      });

      const frontMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.88,
        metalness: 0.02,
      });

      const materials = [linenMat, linenMat, linenMat, linenMat, frontMat, linenMat];
      const mesh = new THREE.Mesh(pillowGeo, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    // Left cushion: nestled in left corner
    const pillowMeshLeft = makePillow(cushionTextureLeft);
    pillowMeshLeft.position.set(-0.56, 0.21, -0.09);
    pillowMeshLeft.rotation.set(-0.15, 0.26, 0.05);
    masterGroup.add(pillowMeshLeft);

    // Right cushion: nestled in right corner
    const pillowMeshRight = makePillow(cushionTextureRight);
    pillowMeshRight.position.set(0.56, 0.21, -0.09);
    pillowMeshRight.rotation.set(-0.15, -0.26, -0.05);
    masterGroup.add(pillowMeshRight);

    // 8. Load Couch GLB Model
    const loader = new GLTFLoader();
    let loadedCouchMesh: THREE.Mesh | null = null;

    loader.load(
      "/couch/couch-light.glb",
      (gltf) => {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.7 / maxDim;

        gltf.scene.scale.setScalar(targetScale);
        gltf.scene.position.set(
          -center.x * targetScale,
          -center.y * targetScale,
          -center.z * targetScale
        );

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(selectedCouchColor.hex),
              roughness: 0.86,
              metalness: 0.04,
            });
            loadedCouchMesh = mesh;
          }
        });

        masterGroup.add(gltf.scene);
        setIsLoaded(true);
      },
      undefined,
      (error) => {
        console.error("Error loading couch 3D model:", error);
        setLoadError(true);
      }
    );

    // Save Three.js State
    threeState.current = {
      scene,
      camera,
      renderer,
      couchMesh: loadedCouchMesh,
      runnerMesh,
      pillowMeshLeft,
      pillowMeshRight,
      masterGroup,
      animFrameId: 0,
      targetRotationY: 0,
      currentRotationY: 0,
      targetRotationX: 0,
      currentRotationX: 0,
      isDragging: false,
      prevPointerX: 0,
      prevPointerY: 0,
    };

    // 9. Render Loop
    const animate = () => {
      const state = threeState.current;
      if (!state) return;

      // Smooth inertia on 360 drag rotation
      state.currentRotationY += (state.targetRotationY - state.currentRotationY) * 0.09;
      state.currentRotationX += (state.targetRotationX - state.currentRotationX) * 0.09;

      masterGroup.rotation.y = state.currentRotationY;
      masterGroup.rotation.x = state.currentRotationX;

      state.renderer.render(state.scene, state.camera);
      state.animFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 10. Resize Handler
    const handleResize = () => {
      if (!canvas || !threeState.current) return;
      const newWidth = canvas.clientWidth;
      const newHeight = canvas.clientHeight;
      threeState.current.camera.aspect = newWidth / newHeight;
      threeState.current.camera.updateProjectionMatrix();
      threeState.current.renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (threeState.current) {
        cancelAnimationFrame(threeState.current.animFrameId);
        threeState.current.renderer.dispose();
      }
    };
  }, []);

  // Update Couch Color Live
  useEffect(() => {
    if (!threeState.current) return;
    const { scene } = threeState.current;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name.includes("couch")) {
        const mesh = child as THREE.Mesh;
        if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).color) {
          (mesh.material as THREE.MeshStandardMaterial).color.set(selectedCouchColor.hex);
        }
      }
    });
  }, [selectedCouchColor]);

  // Sync Scroll to Draping Animation
  useEffect(() => {
    return smoothProgress.on("change", (p) => {
      setCoveragePercent(Math.round(p * 100));

      const state = threeState.current;
      if (!state) return;

      // 1. Dynamic Unrolling & Draping of the Runner across the Couch
      if (state.runnerMesh) {
        const geo = state.runnerMesh.geometry;
        const posAttr = geo.attributes.position as THREE.BufferAttribute;
        const startZ = PROFILE_POINTS[0].z;
        const startY = PROFILE_POINTS[0].y;

        let ptr = 0;
        for (let zi = 0; zi < NUM_Z; zi++) {
          const target = PROFILE_POINTS[zi];
          const rowProgressThreshold = zi / (NUM_Z - 1);

          // Smooth unroll wave: each row moves forward from start crease to target draped contour
          const reach = Math.min(1, Math.max(0, (p * 1.25 - rowProgressThreshold * 0.75) / 0.45));

          const curZ = startZ + (target.z - startZ) * reach;
          // Natural settling drape: subtle arc while rolling out
          const arc = (1 - reach) * 0.015 * Math.sin(reach * Math.PI);
          const curY = startY + (target.y - startY) * reach + arc;

          for (let xi = 0; xi <= NUM_X; xi++) {
            const u = xi / NUM_X;
            const x = -RUNNER_WIDTH / 2 + u * RUNNER_WIDTH;

            // Fabric settling ripple that flattens out as reach -> 1
            const ripple = (1 - reach) * 0.003 * Math.sin(u * Math.PI * 4 + p * 8);

            posAttr.setXYZ(ptr++, x, curY + ripple, curZ);
          }
        }

        posAttr.needsUpdate = true;
        geo.computeVertexNormals();

        // Runner opacity smoothly adjusts
        const mat = state.runnerMesh.material as THREE.MeshStandardMaterial;
        mat.opacity = Math.min(1, 0.35 + p * 0.65);
      }

      // 2. Cushions gently settle into position
      if (state.pillowMeshLeft) {
        const settle = Math.min(1, p * 1.2);
        state.pillowMeshLeft.position.y = 0.21 + (1 - settle) * 0.15;
        state.pillowMeshLeft.scale.setScalar(0.75 + settle * 0.25);
      }

      if (state.pillowMeshRight) {
        if (selectedSet.id !== "single-sofa") {
          const settle = Math.min(1, Math.max(0, (p - 0.2) * 1.25));
          state.pillowMeshRight.position.y = 0.21 + (1 - settle) * 0.15;
          state.pillowMeshRight.scale.setScalar(0.75 + settle * 0.25);
        } else {
          state.pillowMeshRight.scale.set(0, 0, 0);
        }
      }

      // 3. Subtle camera elevation & zoom
      state.camera.position.z = 2.85 - p * 0.2;
      state.camera.position.y = 0.72 - p * 0.08;
      state.camera.lookAt(0, 0.0, 0.15);
    });
  }, [smoothProgress, selectedSet]);

  // Pointer drag controls for 360 rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!threeState.current) return;
    threeState.current.isDragging = true;
    threeState.current.prevPointerX = e.clientX;
    threeState.current.prevPointerY = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!threeState.current || !threeState.current.isDragging) return;
    const deltaX = e.clientX - threeState.current.prevPointerX;
    const deltaY = e.clientY - threeState.current.prevPointerY;
    threeState.current.prevPointerX = e.clientX;
    threeState.current.prevPointerY = e.clientY;

    threeState.current.targetRotationY += deltaX * 0.008;
    threeState.current.targetRotationX = Math.max(
      -0.2,
      Math.min(0.3, threeState.current.targetRotationX + deltaY * 0.006)
    );
  };

  const handlePointerUp = () => {
    if (!threeState.current) return;
    threeState.current.isDragging = false;
  };

  const handleResetAngle = () => {
    if (!threeState.current) return;
    threeState.current.targetRotationY = 0;
    threeState.current.targetRotationX = 0;
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[260vh] bg-[#1a1412] text-white select-none"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-3.5 sm:p-6 lg:p-8">
        {/* Warm Ambient Studio Background Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_40%,rgba(196,140,110,0.14)_0%,rgba(26,20,18,0.98)_80%)]" />

        {/* ═════════════════════════════════════════════════════════════════════
            1. TOP HEADER & CONTROLS BAR
           ═════════════════════════════════════════════════════════════════════ */}
        <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 w-full max-w-7xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold mb-1.5">
              <Sparkles size={13} className="text-[#E8A4A0]" />
              <span className="text-[#F2D4CC]">معاينة 3D واقعية وتفاعلية</span>
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>طقم بياضات ومفارش الأنتريه المطرزة</span>
              <span className="text-xs font-normal text-white/70 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 hidden md:inline">
                انزلي بالسكرول لمشاهدة المفرش يتفرد بالكامل ↓
              </span>
            </h2>
          </div>

          {/* Couch Base Color Selector & Reset Angle */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
              <span className="text-xs font-bold text-white/80 px-2 hidden sm:inline">
                لون الكنبة:
              </span>
              {COUCH_COLORS.map((c) => {
                const isSelected = selectedCouchColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCouchColor(c)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white text-[#1A0C08] shadow-md scale-102"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleResetAngle}
              title="إعادة ضبط زاوية الرؤية"
              aria-label="إعادة ضبط زاوية الرؤية"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            2. THE 3D WEBGL COUCH & DRAPED RUNNER CANVAS STAGE
           ═════════════════════════════════════════════════════════════════════ */}
        <div className="relative flex-1 w-full max-w-5xl mx-auto flex items-center justify-center my-1.5 sm:my-3">
          <div className="relative w-full max-w-4xl aspect-[4/3] xs:aspect-[16/11] sm:aspect-[16/10] max-h-[62vh] rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.8)] bg-gradient-to-b from-[#241c19] to-[#171210]">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="w-full h-full cursor-grab active:cursor-grabbing touch-none block"
            />

            {/* Loading Indicator */}
            {!isLoaded && !loadError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#171210]/95 backdrop-blur-md z-30">
                <div className="w-10 h-10 rounded-full border-3 border-[#C4876A] border-t-transparent animate-spin mb-3" />
                <p className="text-sm font-bold text-[#F2D4CC]">جاري تحميل مجسم الكنبة ثلاثي الأبعاد...</p>
                <p className="text-xs text-white/50 mt-1">تجهيز النسيج والتطريز بدقة عالية</p>
              </div>
            )}

            {/* 360 Rotate Hint */}
            <div className="absolute top-3.5 right-3.5 z-20 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white/80">
              <Eye size={12} className="text-[#E8A4A0]" />
              <span>اسحبي بالماوس لتدوير الكنبة 360°</span>
            </div>

            {/* Fabric Detail Badge */}
            <div
              className={`absolute bottom-4 right-4 z-20 transition-all duration-500 pointer-events-none ${
                coveragePercent > 35 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
            >
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-black/80 backdrop-blur-md border border-[#E8A4A0]/50 shadow-xl">
                <div className="w-7 h-7 rounded-lg bg-[#8B1A2E] text-white flex items-center justify-center font-black text-xs">
                  ✓
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    تطريز أوراق الشجر البارزة والشراشيب
                  </span>
                  <span className="text-[11px] text-[#E8A4A0] block">
                    كتان مصري ناعم طبيعي ومقاوم للانزلاق
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            3. BOTTOM HUD: SPREAD PROGRESS, SET SELECTION & PRICING
           ═════════════════════════════════════════════════════════════════════ */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 pt-2.5 border-t border-white/10">
          {/* Live Coverage Percentage */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-2 text-xs font-bold text-white/80">
              <Layers size={15} className="text-[#E8A4A0]" />
              <span>نسبة الفرش:</span>
              <span className="text-base font-black text-[#E8A4A0] tabular-nums">
                {coveragePercent}%
              </span>
              <span className="text-white/40 text-[11px] hidden sm:inline">
                {coveragePercent >= 90 ? "(مفروشة بالكامل ✨)" : "(انزلي بالسكرول لتكملة الفرش)"}
              </span>
            </div>

            <div className="w-24 sm:w-32 h-2 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                style={{ scaleX: smoothProgress, transformOrigin: "right" }}
                className="h-full bg-gradient-to-r from-[#C4876A] to-[#E8A4A0] rounded-full"
              />
            </div>
          </div>

          {/* Set Options Selector */}
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 scroll-x">
            {SET_OPTIONS.map((opt) => {
              const isSelected = selectedSet.id === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedSet(opt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-white text-[#1A0C08] shadow-md font-black"
                      : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  <span>{opt.name}</span>
                  {opt.popular && (
                    <span className="text-[10px] bg-[#8B1A2E] text-white px-1.5 py-0.2 rounded-full">
                      الأكثر طلباً
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between lg:justify-end gap-3.5 w-full lg:w-auto">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-[#E8A4A0] tabular-nums">
                  {formatPrice(selectedSet.price)}
                </span>
                <span className="text-xs text-white/40 line-through tabular-nums">
                  {formatPrice(selectedSet.originalPrice)}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold block">
                معاينة مجاناً عند الاستلام
              </span>
            </div>

            <Link
              href="/categories/living-room"
              className="btn-primary h-11 px-5 sm:px-7 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#8B1A2E]/40 hover:scale-103 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag size={16} />
              <span>اطلبي الطقم الآن</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
