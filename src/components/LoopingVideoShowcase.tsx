import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Maximize2, Sparkles, Film, Activity, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LoopingVideoShowcaseProps {
  type?: 'chai' | 'piyhealth' | 'codaburry' | 'chocolate' | 'nexora' | 'obsidian' | 'arc' | 'monument' | 'forma' | 'hero' | 'avatar' | 'generic' | 'custom';
  videoUrl?: string;
  badge?: string;
  accentColor?: string;
  className?: string;
  aspectRatio?: string;
  interactive?: boolean;
}

export default function LoopingVideoShowcase({
  type = 'chai',
  videoUrl,
  badge,
  accentColor,
  className = '',
  aspectRatio = 'aspect-[16/10]',
  interactive = true,
}: LoopingVideoShowcaseProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [fps, setFps] = useState(60);
  const [timecode, setTimecode] = useState('00:01:24:08');
  const [hasVideoError, setHasVideoError] = useState(false);
  const { themeConfig } = useTheme();

  const effectiveAccent = accentColor || themeConfig.accent;

  // Real-time Procedural Looping Video Visualizer Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    const resize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const render = (now: number) => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Speed boost on hover
      const speedMultiplier = isHovered ? 1.8 : 1.0;
      t += 0.018 * speedMultiplier;

      // FPS and Timecode Calculation
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
        const frames = Math.floor((t * 30) % 30).toString().padStart(2, '0');
        const secs = Math.floor((t * 0.8) % 60).toString().padStart(2, '0');
        setTimecode(`00:00:${secs}:${frames}`);
      }

      ctx.clearRect(0, 0, w, h);

      // Deep atmospheric background
      const grad = ctx.createLinearGradient(0, 0, w, h);
      if (themeConfig.isLight) {
        grad.addColorStop(0, '#F5F2EB');
        grad.addColorStop(0.5, '#ECE6DC');
        grad.addColorStop(1, '#E2D9CC');
      } else {
        grad.addColorStop(0, '#07080B');
        grad.addColorStop(0.5, '#0E1118');
        grad.addColorStop(1, '#050608');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Unique 60FPS generative loop shader routines per type
      if (type === 'chai') {
        // Teju Chai Tales — Warm Spiced Tea Kettle & Ethereal Cardamom Steam Waves
        const cx = w / 2;
        const cy = h * 0.58;
        const radius = Math.min(w, h) * 0.32;

        // Warm Amber Ambient Core Glow
        const chaiAmber = '#E89838';
        const chaiGold = '#F3C068';
        const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.6);
        coreGlow.addColorStop(0, 'rgba(232, 152, 56, 0.28)');
        coreGlow.addColorStop(0.5, 'rgba(197, 168, 128, 0.12)');
        coreGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGlow;
        ctx.fillRect(0, 0, w, h);

        // Flowing Aromatic Chai Steam Waves (Golden cardamom spirals)
        ctx.lineWidth = 1.8;
        for (let s = 0; s < 6; s++) {
          ctx.beginPath();
          const steamOffset = (s * Math.PI * 2) / 6;
          ctx.strokeStyle = s % 2 === 0 ? chaiGold : 'rgba(243, 192, 104, 0.5)';
          for (let sy = cy - 20; sy > 20; sy -= 4) {
            const progress = (cy - sy) / (cy - 20);
            const wave = Math.sin(progress * 8 - t * 2.5 + steamOffset) * (14 + progress * 24);
            const sx = cx + wave + Math.cos(t + s) * 8;
            if (sy === cy - 20) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }

        // Traditional Indian Kulhad / Cutting Glass Silhouette with Golden Brass Rings
        const cupTopW = radius * 0.85;
        const cupBottomW = radius * 0.55;
        const cupHeight = radius * 0.95;

        // Chai Liquid Body Gradient
        const cupGrad = ctx.createLinearGradient(cx - cupTopW / 2, cy - 10, cx + cupTopW / 2, cy + cupHeight);
        cupGrad.addColorStop(0, 'rgba(197, 122, 42, 0.85)');
        cupGrad.addColorStop(0.5, 'rgba(142, 74, 20, 0.9)');
        cupGrad.addColorStop(1, 'rgba(92, 42, 10, 0.95)');

        // Cup Body
        ctx.beginPath();
        ctx.moveTo(cx - cupTopW / 2, cy);
        ctx.lineTo(cx + cupTopW / 2, cy);
        ctx.lineTo(cx + cupBottomW / 2, cy + cupHeight);
        ctx.lineTo(cx - cupBottomW / 2, cy + cupHeight);
        ctx.closePath();
        ctx.fillStyle = cupGrad;
        ctx.fill();
        ctx.strokeStyle = '#F3C068';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Top Rim Ellipse
        ctx.beginPath();
        ctx.ellipse(cx, cy, cupTopW / 2, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#E89838';
        ctx.fill();
        ctx.strokeStyle = '#FFE2A4';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Spiced Saffron & Cinnamon Sparkles / Steam Embers
        const emberCount = 16;
        for (let e = 0; e < emberCount; e++) {
          const ea = (e * Math.PI * 2) / emberCount + t * 0.4;
          const er = radius * 0.65 + Math.sin(e * 3 + t * 3) * 18;
          const ex = cx + Math.cos(ea) * er;
          const ey = cy - 40 - (Math.abs(Math.sin(t * 1.5 + e)) * 70);
          ctx.fillStyle = e % 2 === 0 ? '#FFE2A4' : '#F3C068';
          ctx.beginPath();
          ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Indian Typography Motif
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText('TEJU CHAI TALES • KINETIC D2C FLAVOR', 18, h - 16);
      } else if (type === 'nexora') {
        // AI Neural Fluid & Synaptic Lattice
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) * 0.38;

        // Glowing center core
        const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.5);
        coreGlow.addColorStop(0, `${effectiveAccent}44`);
        coreGlow.addColorStop(0.5, `${effectiveAccent}11`);
        coreGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGlow;
        ctx.fillRect(0, 0, w, h);

        // Sine wave synaptic ribbons
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 7; i++) {
          ctx.beginPath();
          const angleOffset = (i * Math.PI * 2) / 7;
          ctx.strokeStyle = i % 2 === 0 ? effectiveAccent : `${effectiveAccent}88`;
          for (let a = 0; a <= Math.PI * 2; a += 0.05) {
            const distortion = Math.sin(a * 4 + t * 2 + i) * 18 + Math.cos(a * 2 - t * 1.5) * 12;
            const r = radius * (0.6 + i * 0.08) + distortion;
            const px = cx + Math.cos(a + angleOffset + t * 0.3) * r;
            const py = cy + Math.sin(a + angleOffset + t * 0.3) * r * 0.75;
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }

        // Orbiting synaptic nodes
        const nodeCount = 18;
        for (let j = 0; j < nodeCount; j++) {
          const na = (j * Math.PI * 2) / nodeCount + t * 0.5;
          const nr = radius * (0.8 + Math.sin(j * 3 + t) * 0.2);
          const nx = cx + Math.cos(na) * nr;
          const ny = cy + Math.sin(na) * nr * 0.75;

          ctx.beginPath();
          ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = effectiveAccent;
          ctx.fill();

          // Node beam lines
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(nx, ny);
          ctx.strokeStyle = `${effectiveAccent}22`;
          ctx.stroke();
        }
      } else if (type === 'piyhealth') {
        // Piyhealth Clinic — Clinical AI Telemetry, Live Biometric ECG & Radial Vitals Monitor
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) * 0.36;

        // Clinical Grid Matrix
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.08)';
        ctx.lineWidth = 0.8;
        const gridSpacing = 24;
        for (let x = 0; x < w; x += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Concentric Biometric Radar Rings with Scanner Sweep
        for (let r = 1; r <= 3; r++) {
          ctx.beginPath();
          ctx.arc(cx, cy, (radius / 3) * r, 0, Math.PI * 2);
          ctx.strokeStyle = r === 3 ? 'rgba(45, 212, 191, 0.4)' : 'rgba(20, 184, 166, 0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Radar Sweep Line
        const sweepAngle = t * 1.8;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweepAngle) * radius, cy + Math.sin(sweepAngle) * radius);
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pulsing ECG / Vitals Heartbeat Waveform
        const ecgY = cy + 10;
        ctx.beginPath();
        ctx.strokeStyle = '#2DD4BF';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#14B8A6';
        ctx.shadowBlur = 12;

        const numPoints = 120;
        const step = w / numPoints;
        for (let i = 0; i <= numPoints; i++) {
          const x = i * step;
          // Localized heartbeat spikes moving across time
          const phase = ((x / w) * 4 - t * 1.5) % 4;
          let yOffset = 0;
          if (phase > 0.8 && phase < 1.2) {
            const p = (phase - 0.8) / 0.4;
            if (p < 0.2) yOffset = -Math.sin(p * Math.PI * 5) * 8;
            else if (p < 0.5) yOffset = -Math.sin((p - 0.2) * Math.PI * 3.33) * 40; // R-wave spike
            else if (p < 0.7) yOffset = Math.sin((p - 0.5) * Math.PI * 5) * 16;  // S-wave
            else yOffset = -Math.sin((p - 0.7) * Math.PI * 3.33) * 12; // T-wave
          } else {
            yOffset = Math.sin(x * 0.05 + t * 3) * 2;
          }
          const y = ecgY + yOffset;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

        // Telemetry Data Dots
        for (let d = 0; d < 8; d++) {
          const da = (d * Math.PI * 2) / 8 + t * 0.3;
          const dr = radius * 0.85;
          const dx = cx + Math.cos(da) * dr;
          const dy = cy + Math.sin(da) * dr * 0.8;
          ctx.beginPath();
          ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#38BDF8';
          ctx.fill();
        }

        // Medical HUD Typography
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(45, 212, 191, 0.9)';
        ctx.fillText('PIYHEALTH CLINIC • LIVE TELEMETRY', 18, 28);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillText('HEART RATE: 72 BPM | SpO2: 99%', 18, h - 16);
      } else if (type === 'obsidian') {
        // Monolithic Architectural 3D Glass Wireframe & Raymarched Caustics
        const cx = w / 2;
        const cy = h / 2;
        const size = Math.min(w, h) * 0.45;

        // Rotating brutalist cubes in 3D projection
        const rotX = t * 0.4;
        const rotY = t * 0.6;

        const vertices = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
        ];

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        // Project 3D to 2D
        const projected = vertices.map(([vx, vy, vz]) => {
          // Rotate Y
          const x1 = vx * Math.cos(rotY) + vz * Math.sin(rotY);
          const z1 = -vx * Math.sin(rotY) + vz * Math.cos(rotY);
          // Rotate X
          const y2 = vy * Math.cos(rotX) - z1 * Math.sin(rotX);
          const z2 = vy * Math.sin(rotX) + z1 * Math.cos(rotX);
          // Perspective
          const fov = 3.5;
          const scale = fov / (fov + z2);
          return [cx + x1 * size * scale, cy + y2 * size * scale, z2];
        });

        // Draw glowing glass faces
        ctx.strokeStyle = effectiveAccent;
        ctx.lineWidth = 2;
        edges.forEach(([p1, p2]) => {
          ctx.beginPath();
          ctx.moveTo(projected[p1][0], projected[p1][1]);
          ctx.lineTo(projected[p2][0], projected[p2][1]);
          ctx.stroke();
        });

        // Inner nested cube
        const innerProjected = vertices.map(([vx, vy, vz]) => {
          const s = 0.5;
          const x1 = vx * s * Math.cos(-rotY) + vz * s * Math.sin(-rotY);
          const z1 = -vx * s * Math.sin(-rotY) + vz * s * Math.cos(-rotY);
          const y2 = vy * s * Math.cos(-rotX) - z1 * Math.sin(-rotX);
          const z2 = vy * s * Math.sin(-rotX) + z1 * Math.cos(-rotX);
          const fov = 3.5;
          const scale = fov / (fov + z2);
          return [cx + x1 * size * scale, cy + y2 * size * scale];
        });

        ctx.strokeStyle = `${effectiveAccent}55`;
        ctx.lineWidth = 1;
        edges.forEach(([p1, p2]) => {
          ctx.beginPath();
          ctx.moveTo(innerProjected[p1][0], innerProjected[p1][1]);
          ctx.lineTo(innerProjected[p2][0], innerProjected[p2][1]);
          ctx.stroke();
        });
      } else if (type === 'arc') {
        // High-frequency Financial Oscilloscope & Candlestick Telemetry
        const padding = 30;
        const gridW = w - padding * 2;
        const gridH = h - padding * 2;

        // Grid lines
        ctx.strokeStyle = `${themeConfig.textMuted}22`;
        ctx.lineWidth = 0.8;
        for (let gx = 0; gx <= 10; gx++) {
          const xPos = padding + (gridW / 10) * gx;
          ctx.beginPath();
          ctx.moveTo(xPos, padding);
          ctx.lineTo(xPos, h - padding);
          ctx.stroke();
        }
        for (let gy = 0; gy <= 6; gy++) {
          const yPos = padding + (gridH / 6) * gy;
          ctx.beginPath();
          ctx.moveTo(padding, yPos);
          ctx.lineTo(w - padding, yPos);
          ctx.stroke();
        }

        // Live flowing spline wave
        ctx.beginPath();
        const waveGradient = ctx.createLinearGradient(0, 0, w, 0);
        waveGradient.addColorStop(0, '#10B981');
        waveGradient.addColorStop(0.5, effectiveAccent);
        waveGradient.addColorStop(1, '#3B82F6');
        ctx.strokeStyle = waveGradient;
        ctx.lineWidth = 2.5;

        for (let wx = 0; wx < gridW; wx += 4) {
          const progress = wx / gridW;
          const wy =
            h / 2 +
            Math.sin(progress * 14 - t * 3) * 35 +
            Math.sin(progress * 28 + t * 2) * 18 +
            Math.cos(progress * 8 - t) * 25;
          if (wx === 0) ctx.moveTo(padding + wx, wy);
          else ctx.lineTo(padding + wx, wy);
        }
        ctx.stroke();

        // Candlesticks
        const candleCount = 14;
        for (let c = 0; c < candleCount; c++) {
          const cxPos = padding + 20 + (gridW / candleCount) * c;
          const candlePhase = Math.sin(c * 2 + t * 2);
          const ch = 20 + Math.abs(Math.sin(c + t)) * 40;
          const cyPos = h / 2 + Math.cos(c * 1.5 + t) * 30;
          const isGreen = candlePhase > 0;

          ctx.fillStyle = isGreen ? '#10B98188' : '#EF444488';
          ctx.fillRect(cxPos - 4, cyPos - ch / 2, 8, ch);
          ctx.strokeStyle = isGreen ? '#10B981' : '#EF4444';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cxPos, cyPos - ch / 2 - 8);
          ctx.lineTo(cxPos, cyPos + ch / 2 + 8);
          ctx.stroke();
        }
      } else if (type === 'monument') {
        // 3D Swiss Horology Tourbillon & Kinetic Escapement
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) * 0.36;

        // Outer Gear Rim
        const teeth = 36;
        ctx.strokeStyle = effectiveAccent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let tooth = 0; tooth < teeth; tooth++) {
          const ta = (tooth * Math.PI * 2) / teeth + t * 0.4;
          const tr1 = r;
          const tr2 = r + 8;
          const x1 = cx + Math.cos(ta) * tr1;
          const y1 = cy + Math.sin(ta) * tr1;
          const x2 = cx + Math.cos(ta + 0.05) * tr2;
          const y2 = cy + Math.sin(ta + 0.05) * tr2;
          const x3 = cx + Math.cos(ta + 0.1) * tr1;
          const y3 = cy + Math.sin(ta + 0.1) * tr1;
          if (tooth === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner Rotating Tourbillon Cage
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-t * 1.2);

        // 3-arm balance bridge
        for (let arm = 0; arm < 3; arm++) {
          ctx.rotate((Math.PI * 2) / 3);
          ctx.strokeStyle = `${effectiveAccent}CC`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, r * 0.85);
          ctx.stroke();

          // Weight screws
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, r * 0.85, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Hairspring spiral
        ctx.strokeStyle = `${effectiveAccent}88`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const spiralCoils = 6;
        for (let sp = 0; sp < Math.PI * 2 * spiralCoils; sp += 0.1) {
          const oscillation = Math.sin(t * 6) * 4;
          const sr = (sp / (Math.PI * 2 * spiralCoils)) * (r * 0.5) + oscillation;
          const sx = Math.cos(sp) * sr;
          const sy = Math.sin(sp) * sr;
          if (sp === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        ctx.restore();
      } else if (type === 'codaburry' || type === 'chocolate' || type === 'forma') {
        // Codaburry — Editorial Luxury Confectionery & Molten Cacao Wave Simulator
        const cx = w / 2;
        const cy = h / 2;

        // Radial Velvet Cocoa Glow
        const cocoaGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.55);
        cocoaGlow.addColorStop(0, 'rgba(212, 175, 55, 0.2)');
        cocoaGlow.addColorStop(0.4, 'rgba(92, 44, 22, 0.25)');
        cocoaGlow.addColorStop(1, 'rgba(28, 16, 8, 0)');
        ctx.fillStyle = cocoaGlow;
        ctx.fillRect(0, 0, w, h);

        // Artisanal Chocolate Bar Segment Geometric Grid
        const barW = Math.min(w * 0.5, 180);
        const barH = Math.min(h * 0.55, 110);
        const barX = cx - barW / 2;
        const barY = cy - barH / 2 - 10;
        
        ctx.save();
        ctx.translate(cx, cy - 10);
        ctx.rotate(Math.sin(t * 0.4) * 0.05);
        ctx.translate(-cx, -(cy - 10));

        // Chocolate Tablet Outer Border
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(barX, barY, barW, barH);

        // 3x2 Chocolate Segments
        const cols = 3;
        const rows = 2;
        const cellW = (barW - 16) / cols;
        const cellH = (barH - 12) / rows;
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const bx = barX + 4 + c * (cellW + 4);
            const by = barY + 4 + r * (cellH + 4);
            
            // Beveled chocolate square
            ctx.fillStyle = 'rgba(44, 24, 16, 0.6)';
            ctx.fillRect(bx, by, cellW, cellH);
            
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(bx, by, cellW, cellH);

            // Gold Leaf Accent on first square
            if (c === 0 && r === 0) {
              ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
              ctx.beginPath();
              ctx.arc(bx + cellW / 2, by + cellH / 2, 4 + Math.sin(t * 2) * 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.restore();

        // Molten Silk Chocolate & Caramel Fluid Ribbons
        const ribbonCount = 4;
        for (let rb = 0; rb < ribbonCount; rb++) {
          ctx.beginPath();
          const ribbonGrad = ctx.createLinearGradient(0, 0, w, 0);
          ribbonGrad.addColorStop(0, 'rgba(92, 44, 22, 0)');
          ribbonGrad.addColorStop(0.3, rb === 0 ? '#D4AF37' : '#C59A3F');
          ribbonGrad.addColorStop(0.7, 'rgba(162, 88, 56, 0.85)');
          ribbonGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');

          ctx.strokeStyle = ribbonGrad;
          ctx.lineWidth = 2 + rb * 1.2;

          for (let rx = 0; rx <= w; rx += 6) {
            const normX = (rx - cx) / w;
            const ry =
              cy + 25 +
              Math.sin(normX * 5 + t * 1.8 + rb * 0.9) * (26 + rb * 12) +
              Math.cos(normX * 10 - t * 1.2) * 12;

            if (rx === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.stroke();
        }

        // Shimmering Gold Flakes & Cocoa Embers
        for (let g = 0; g < 14; g++) {
          const ga = (g * 137.5 * Math.PI) / 180;
          const gr = ((t * 24 + g * 35) % (Math.min(w, h) * 0.48));
          const gx = cx + Math.cos(ga + t * 0.3) * gr;
          const gy = cy + Math.sin(ga + t * 0.2) * (gr * 0.7);
          const size = 1.2 + Math.sin(t * 3 + g) * 0.8;

          ctx.fillStyle = g % 2 === 0 ? 'rgba(212, 175, 55, 0.9)' : 'rgba(255, 235, 179, 0.8)';
          ctx.beginPath();
          ctx.arc(gx, gy, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Editorial Typography HUD
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.95)';
        ctx.fillText('CODABURRY • 74% SINGLE-ORIGIN CACAO', 18, 28);
        ctx.fillStyle = 'rgba(255, 244, 230, 0.75)';
        ctx.fillText('ARTISANAL EDITORIAL CONFECTIONERY', 18, h - 16);
      } else if (type === 'hero') {
        // Holographic Creative Engine Core
        const cx = w / 2;
        const cy = h / 2;
        const ringR = Math.min(w, h) * 0.35;

        // Multi-layered pulsing holographic rings
        for (let ring = 0; ring < 4; ring++) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(ring % 2 === 0 ? t * 0.6 : -t * 0.8);
          ctx.beginPath();
          ctx.strokeStyle = ring === 0 ? effectiveAccent : `${effectiveAccent}55`;
          ctx.lineWidth = 1.5;
          ctx.arc(0, 0, ringR * (0.4 + ring * 0.2), 0, Math.PI * 1.6);
          ctx.stroke();
          ctx.restore();
        }

        // Particle halo
        const pCount = 30;
        for (let p = 0; p < pCount; p++) {
          const pa = (p * Math.PI * 2) / pCount + t * 0.4;
          const pr = ringR * (0.8 + Math.sin(p * 2 + t * 3) * 0.2);
          ctx.fillStyle = effectiveAccent;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(pa) * pr, cy + Math.sin(pa) * pr, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'avatar') {
        // Holographic Anime Creator Avatar Matrix
        const cx = w / 2;
        const cy = h / 2;

        // Glowing backdrop halo
        const avatarGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120);
        avatarGlow.addColorStop(0, `${effectiveAccent}55`);
        avatarGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = avatarGlow;
        ctx.fillRect(0, 0, w, h);

        // Holographic face silhouette & glowing glasses
        ctx.strokeStyle = effectiveAccent;
        ctx.lineWidth = 2;

        // Stylized head contour
        ctx.beginPath();
        ctx.arc(cx, cy - 10, 45, 0, Math.PI * 2);
        ctx.stroke();

        // Glowing Cyber Visor
        ctx.fillStyle = effectiveAccent;
        ctx.fillRect(cx - 30, cy - 20, 60, 14);
        ctx.fillStyle = '#090A0C';
        ctx.fillRect(cx - 28, cy - 18, 56, 10);

        // Blinking visor LED light
        const blink = Math.sin(t * 5) > 0;
        ctx.fillStyle = blink ? effectiveAccent : '#FFFFFF';
        ctx.fillRect(cx - 20, cy - 16, 40, 6);

        // Floating headphone halos
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx - 50, cy - 10, 14, 0, Math.PI * 2);
        ctx.arc(cx + 50, cy - 10, 14, 0, Math.PI * 2);
        ctx.stroke();

        // Floating code glyphs & audio bars
        for (let bar = 0; bar < 9; bar++) {
          const bh = 10 + Math.abs(Math.sin(t * 4 + bar)) * 30;
          ctx.fillStyle = effectiveAccent;
          ctx.fillRect(cx - 40 + bar * 10, cy + 50 - bh / 2, 5, bh);
        }
      }

      // CRT Scanline Filter effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let s = 0; s < h; s += 3) {
        ctx.fillRect(0, s, w, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [type, effectiveAccent, isHovered, themeConfig]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl overflow-hidden group shadow-2xl border transition-all duration-500 ${aspectRatio} ${className}`}
      style={{
        borderColor: isHovered ? themeConfig.borderHover : themeConfig.border,
        backgroundColor: themeConfig.bgSurface,
      }}
    >
      {/* Real-time 60FPS Generative Motion Canvas */}
      <canvas ref={canvasRef} className="w-full h-full object-cover block" />

      {/* Real HTML5 Video Overlay (if videoUrl is supplied and active) */}
      {videoUrl && !hasVideoError && (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setHasVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-70 group-hover:opacity-100 transition-opacity duration-500"
        />
      )}

      {/* High-Tech HUD Scanline Overlays & Telemetry */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-90" />

      {/* Top HUD Telemetry Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[9px] font-mono tracking-widest text-white uppercase">
            REC • {badge || '60 FPS LOOP'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-zinc-300">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>{fps} FPS</span>
        </div>
      </div>

      {/* Bottom HUD Timecode & Interactive Status */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono text-amber-200">
          TIMECODE: {timecode}
        </div>

        <div className="flex items-center gap-1 text-[9px] font-mono text-white/70">
          <Film className="w-3 h-3 text-amber-400" />
          <span>REAL-TIME LOOP</span>
        </div>
      </div>

      {/* Hover Kinetic Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-xl border shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          style={{
            backgroundColor: `${themeConfig.bgCard}DD`,
            borderColor: effectiveAccent,
            color: effectiveAccent,
          }}
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </div>
      </motion.div>
    </div>
  );
}
