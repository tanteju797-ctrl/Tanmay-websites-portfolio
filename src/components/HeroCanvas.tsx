import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroCanvasProps {
  interactive?: boolean;
}

export default function HeroCanvas({ interactive = true }: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Clear old canvases if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 1. Flowing Metallic Wave / Particle Ribbon
    const waveRows = window.innerWidth < 768 ? 30 : 45;
    const waveCols = window.innerWidth < 768 ? 60 : 95;
    const particleCount = waveRows * waveCols;
    const wavePositions = new Float32Array(particleCount * 3);
    const waveColors = new Float32Array(particleCount * 3);

    const baseColor1 = new THREE.Color(0xD4AF37); // Champagne Gold
    const baseColor2 = new THREE.Color(0x3A3F4D); // Soft Steel Charcoal
    const baseColor3 = new THREE.Color(0xE2D9CC); // Warm Ivory

    let idx = 0;
    for (let i = 0; i < waveRows; i++) {
      const u = i / waveRows;
      for (let j = 0; j < waveCols; j++) {
        const v = j / waveCols;
        const x = (v - 0.5) * 32;
        const z = (u - 0.5) * 16 - 2;
        const y = Math.sin(v * Math.PI * 3) * 1.5 + Math.cos(u * Math.PI * 2) * 0.8;

        wavePositions[idx * 3] = x;
        wavePositions[idx * 3 + 1] = y;
        wavePositions[idx * 3 + 2] = z;

        // Color gradient mix
        const mixColor = baseColor1.clone().lerp(u > 0.5 ? baseColor3 : baseColor2, Math.sin(v * Math.PI));
        waveColors[idx * 3] = mixColor.r;
        waveColors[idx * 3 + 1] = mixColor.g;
        waveColors[idx * 3 + 2] = mixColor.b;

        idx++;
      }
    }

    const waveGeometry = new THREE.BufferGeometry();
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
    waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));

    const particleTexture = createParticleTexture();
    const waveMaterial = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 0.11 : 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const wavePoints = new THREE.Points(waveGeometry, waveMaterial);
    wavePoints.position.y = -3;
    wavePoints.rotation.x = 0.4;
    scene.add(wavePoints);

    // 2. Monolithic Obsidian Crystal Cube with Champagne Edges
    const cubeGroup = new THREE.Group();
    cubeGroup.position.set(window.innerWidth < 768 ? 0 : 5.5, window.innerWidth < 768 ? -1 : 0.8, 1);

    const cubeGeo = new THREE.BoxGeometry(3.2, 3.2, 3.2);
    const cubeMat = new THREE.MeshPhysicalMaterial({
      color: 0x0D0F13,
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });
    const obsidianCube = new THREE.Mesh(cubeGeo, cubeMat);
    cubeGroup.add(obsidianCube);

    // Gold edge outline on the cube
    const edgesGeo = new THREE.EdgesGeometry(cubeGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xE5C97B,
      transparent: true,
      opacity: 0.65,
    });
    const cubeEdges = new THREE.LineSegments(edgesGeo, edgesMat);
    cubeGroup.add(cubeEdges);

    // 3. Orbital Ring around Cube (from Reference Image 1)
    const ringGeo = new THREE.TorusGeometry(3.4, 0.02, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xE8D5B5,
      transparent: true,
      opacity: 0.7,
    });
    const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
    orbitalRing.rotation.x = Math.PI / 2.6;
    orbitalRing.rotation.y = Math.PI / 6;
    cubeGroup.add(orbitalRing);

    // Orbiting light particle satellite
    const satelliteGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const satelliteMat = new THREE.MeshBasicMaterial({ color: 0xFFF5E0 });
    const satellite = new THREE.Mesh(satelliteGeo, satelliteMat);
    cubeGroup.add(satellite);

    scene.add(cubeGroup);

    // 4. Subtle Floating Stardust / Micro Particles
    const dustCount = window.innerWidth < 768 ? 60 : 150;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 40;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xC5A880,
      size: 0.05,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x222630, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xE8D5B5, 2.8);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x4A6B82, 1.2);
    dirLight2.position.set(-10, -10, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xD4AF37, 3, 25);
    pointLight.position.set(3, 4, 6);
    scene.add(pointLight);

    // Mouse Tracking with smooth inertia
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isVisible = true;

    // Intersection observer to pause rendering when not in view
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation (Lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Animate flowing wave points
      const positions = waveGeometry.attributes.position.array as Float32Array;
      let pIdx = 0;
      for (let i = 0; i < waveRows; i++) {
        const u = i / waveRows;
        for (let j = 0; j < waveCols; j++) {
          const v = j / waveCols;

          // Flow formula with multi-frequency sine
          const waveHeight =
            Math.sin(v * 7 + elapsedTime * 0.8 + u * 4) * 0.9 +
            Math.cos(u * 5 - elapsedTime * 0.5 + v * 3) * 0.6 +
            Math.sin(v * 12 + elapsedTime * 1.2) * 0.25;

          // React slightly to mouse
          const mouseDist = Math.hypot((v - 0.5) * 2 - mouse.x, (u - 0.5) * 2 - mouse.y);
          const mouseRipple = Math.exp(-mouseDist * 2) * Math.sin(elapsedTime * 4) * 0.4;

          positions[pIdx * 3 + 1] = waveHeight + mouseRipple - 2.5;
          pIdx++;
        }
      }
      waveGeometry.attributes.position.needsUpdate = true;

      // Rotate Obsidian Cube with organic breathing
      cubeGroup.rotation.y = elapsedTime * 0.25 + mouse.x * 0.5;
      cubeGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.2 + mouse.y * 0.3;
      cubeGroup.position.y = (window.innerWidth < 768 ? -1 : 0.8) + Math.sin(elapsedTime * 0.8) * 0.35;

      // Rotate orbital ring & satellite
      orbitalRing.rotation.z = elapsedTime * 0.6;
      const satAngle = elapsedTime * 1.4;
      satellite.position.set(Math.cos(satAngle) * 3.4, Math.sin(satAngle) * 3.4 * Math.sin(orbitalRing.rotation.x), Math.sin(satAngle) * 3.4 * Math.cos(orbitalRing.rotation.x));

      // Dust drift
      dustPoints.rotation.y = elapsedTime * 0.02 + mouse.x * 0.05;
      dustPoints.rotation.x = elapsedTime * 0.01;

      // Dynamic light movement
      pointLight.position.x = 4 + mouse.x * 3;
      pointLight.position.y = 3 + mouse.y * 3;

      // Subtle camera parallax
      camera.position.x = mouse.x * 0.8;
      camera.position.y = 1 + mouse.y * 0.6;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

      // Adjust cube position for mobile vs desktop
      cubeGroup.position.x = newWidth < 768 ? 0 : 5.5;
      cubeGroup.position.y = newWidth < 768 ? -1 : 0.8;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      waveGeometry.dispose();
      waveMaterial.dispose();
      cubeGeo.dispose();
      cubeMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      id="hero-webgl-canvas"
      className="absolute inset-0 pointer-events-none w-full h-full overflow-hidden z-0"
      aria-hidden="true"
    />
  );
}

// Generate smooth circular particle sprite
function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(226, 217, 204, 0.8)');
  gradient.addColorStop(0.7, 'rgba(212, 175, 55, 0.25)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
