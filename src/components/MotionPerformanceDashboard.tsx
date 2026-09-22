import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import {
  Activity,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Cpu,
  Sparkles,
  Sliders,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Code2,
  Copy,
  Check,
  Flame,
  Volume2,
  Eye,
  Maximize2,
  Palette,
  MousePointerClick,
  CheckCircle2,
} from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';
import ThemeSelector from './ThemeSelector';

interface KeyframePoint {
  id: string;
  name: string;
  timeMs: number;
  displacement: number;
  velocity: number;
  label: string;
  description: string;
}

export default function MotionPerformanceDashboard() {
  const { theme, themeConfig, setTheme } = useTheme();

  // Mode tabs: 'explainer' | 'keyframe-lab' | 'saas-widgets' | 'duel'
  const [activeTab, setActiveTab] = useState<'keyframe-lab' | 'saas-widgets' | 'duel'>('keyframe-lab');

  // Interactive Physics Parameters
  const [stiffness, setStiffness] = useState<number>(340);
  const [damping, setDamping] = useState<number>(14);
  const [mass, setMass] = useState<number>(0.8);
  const [bounciness, setBounciness] = useState<number>(75); // 0 - 100%

  // Playback & Animation states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [selectedKeyframe, setSelectedKeyframe] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeMetric, setActiveMetric] = useState<'displacement' | 'velocity'>('displacement');

  // SaaS interactive demo widget states
  const [toastVisible, setToastVisible] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toggleState, setToggleState] = useState<boolean>(true);
  const [bounceCounter, setBounceCounter] = useState<number>(1);
  const [duelActive, setDuelActive] = useState<boolean>(false);

  // Calculate mathematical dynamic spring curve points
  const { chartData, keyframePoints, durationMs, peakOvershoot } = useMemo(() => {
    const points = [];
    const steps = 60;
    // Calculate natural frequency omega and damping ratio zeta
    const effDamping = Math.max(2, damping * (1 - (bounciness / 100) * 0.45));
    const omega0 = Math.sqrt(stiffness / mass);
    const zeta = effDamping / (2 * Math.sqrt(stiffness * mass));
    const dampedFreq = omega0 * Math.sqrt(Math.max(0.01, 1 - zeta * zeta));
    const totalDuration = Math.min(1200, Math.max(500, Math.round((6 / (zeta * omega0)) * 1000)));

    let maxDisplacement = 100;
    let peakTime = 0;
    let valleyTime = 0;
    let minDisplacementAfterPeak = 100;

    for (let i = 0; i <= steps; i++) {
      const tSec = (i / steps) * (totalDuration / 1000);
      const timeMs = Math.round(tSec * 1000);

      // Harmonic Oscillator position formula
      const envelope = Math.exp(-zeta * omega0 * tSec);
      const oscillation = Math.cos(dampedFreq * tSec);
      const phaseCorrection = (zeta / Math.sqrt(Math.max(0.01, 1 - zeta * zeta))) * Math.sin(dampedFreq * tSec);
      
      // Target position is 100%
      const y = Math.round((1 - envelope * (oscillation + phaseCorrection)) * 100);

      // Velocity derivative
      const dy = Math.round(
        Math.abs(
          envelope *
            (omega0 * Math.sin(dampedFreq * tSec) -
              zeta * omega0 * Math.cos(dampedFreq * tSec)) *
            90
        )
      );

      if (y > maxDisplacement && timeMs < totalDuration * 0.5) {
        maxDisplacement = y;
        peakTime = timeMs;
      }
      if (peakTime > 0 && timeMs > peakTime && y < minDisplacementAfterPeak && timeMs < totalDuration * 0.75) {
        minDisplacementAfterPeak = y;
        valleyTime = timeMs;
      }

      points.push({
        time: timeMs,
        displacement: y,
        velocity: Math.min(220, dy),
        idealFps: 60,
      });
    }

    // Identify explicit keyframe events
    const kf: KeyframePoint[] = [
      {
        id: 'kf-trigger',
        name: 'T0: Initial Impulse',
        timeMs: 0,
        displacement: 0,
        velocity: 0,
        label: 'Impulse Launch',
        description: 'Instant zero-latency trigger dispatched directly from user gesture or click event.',
      },
      {
        id: 'kf-peak',
        name: 'T1: Elastic Apex',
        timeMs: peakTime || Math.round(totalDuration * 0.25),
        displacement: maxDisplacement,
        velocity: 140,
        label: `Peak Overshoot (${maxDisplacement}%)`,
        description: `Natural kinetic momentum carrying the visual element ${(maxDisplacement - 100).toFixed(0)}% past its final container bounds.`,
      },
      {
        id: 'kf-recoil',
        name: 'T2: Damped Recoil',
        timeMs: valleyTime || Math.round(totalDuration * 0.55),
        displacement: minDisplacementAfterPeak < 100 ? minDisplacementAfterPeak : 96,
        velocity: 45,
        label: `Recoil Valley (${minDisplacementAfterPeak < 100 ? minDisplacementAfterPeak : 96}%)`,
        description: 'Physical spring tension snaps backward, creating organic elasticity.',
      },
      {
        id: 'kf-settle',
        name: 'T3: Harmonic Rest',
        timeMs: totalDuration,
        displacement: 100,
        velocity: 0,
        label: 'Stable Equilibrium (100%)',
        description: 'Zero residual inertia. Pixel-perfect alignment on the rendering grid.',
      },
    ];

    return {
      chartData: points,
      keyframePoints: kf,
      durationMs: totalDuration,
      peakOvershoot: Math.max(0, maxDisplacement - 100),
    };
  }, [stiffness, damping, mass, bounciness]);

  // Real-time animation loop
  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!isPlaying) return;
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = (elapsed % (durationMs + 600)) / durationMs;

      setSimulationProgress(Math.min(1, Math.max(0, progress)));
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, durationMs]);

  // Current interpolated values
  const currentPointIndex = Math.min(
    chartData.length - 1,
    Math.floor(simulationProgress * (chartData.length - 1))
  );
  const currentDisplacement = chartData[currentPointIndex]?.displacement ?? 0;
  const currentVelocity = chartData[currentPointIndex]?.velocity ?? 0;
  const currentTimeMs = chartData[currentPointIndex]?.time ?? 0;

  // Preset physics quick toggles
  const applyPreset = (presetName: 'ultra-bouncy' | 'natural-apple' | 'snappy-saas' | 'gentle-luxury') => {
    if (presetName === 'ultra-bouncy') {
      setStiffness(420);
      setDamping(10);
      setMass(0.7);
      setBounciness(90);
    } else if (presetName === 'natural-apple') {
      setStiffness(300);
      setDamping(22);
      setMass(1.0);
      setBounciness(45);
    } else if (presetName === 'snappy-saas') {
      setStiffness(500);
      setDamping(28);
      setMass(0.5);
      setBounciness(30);
    } else if (presetName === 'gentle-luxury') {
      setStiffness(220);
      setDamping(32);
      setMass(1.2);
      setBounciness(15);
    }
  };

  const copyFramerCode = () => {
    const code = `// Spring Kinematics for Framer Motion / Motion
const springTransition = {
  type: "spring",
  stiffness: ${stiffness},
  damping: ${damping},
  mass: ${mass},
  bounce: ${(bounciness / 100).toFixed(2)},
  restDelta: 0.001
};`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <div
      id="motion-saas-dashboard"
      className="relative rounded-3xl overflow-hidden border shadow-2xl transition-all duration-500"
      style={{
        backgroundColor: themeConfig.bgSurface,
        borderColor: themeConfig.border,
        color: themeConfig.textPrimary,
      }}
    >
      {/* Top Banner / SaaS Explainer Header */}
      <div
        className="p-5 sm:p-7 border-b flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          backgroundColor: themeConfig.bgCard,
          borderColor: themeConfig.border,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border"
            style={{
              backgroundColor: `${themeConfig.accent}18`,
              borderColor: `${themeConfig.accent}40`,
              color: themeConfig.accent,
            }}
          >
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: themeConfig.accent }}>
                Motion Physics Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                120 FPS HIGH-REFRESH READY
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                style={{
                  backgroundColor: `${themeConfig.accent}15`,
                  color: themeConfig.accent,
                  borderColor: `${themeConfig.accent}30`,
                }}
              >
                OVERSHOOT: +{peakOvershoot}%
              </span>
            </div>
            <h4 className="font-serif text-2xl sm:text-3xl mt-1 tracking-tight" style={{ color: themeConfig.textPrimary }}>
              Harmonic Spring & Keyframe Visualizer
            </h4>
            <p className="text-xs sm:text-sm mt-1 max-w-xl font-light opacity-75">
              Mathematical curve kinematics crafted with sub-pixel interpolation. Say goodbye to stiff, artificial cubic-beziers.
            </p>
          </div>
        </div>

        {/* Section Actions: Theme Selector + Explainer Tabs */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Theme switcher pill */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/10 dark:bg-white/5 border border-current/10">
            <Palette className="w-3.5 h-3.5 ml-1.5 opacity-60" />
            <ThemeSelector variant="compact" />
          </div>

          {/* Navigation Mode Pill */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/20 dark:bg-white/5 border border-current/10">
            <button
              onClick={() => setActiveTab('keyframe-lab')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'keyframe-lab'
                  ? 'bg-current/15 shadow-sm'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{ color: activeTab === 'keyframe-lab' ? themeConfig.accent : undefined }}
            >
              Keyframe Graph Lab
            </button>
            <button
              onClick={() => setActiveTab('saas-widgets')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'saas-widgets'
                  ? 'bg-current/15 shadow-sm'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{ color: activeTab === 'saas-widgets' ? themeConfig.accent : undefined }}
            >
              Bouncy UI Sandbox
            </button>
            <button
              onClick={() => setActiveTab('duel')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'duel'
                  ? 'bg-current/15 shadow-sm'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{ color: activeTab === 'duel' ? themeConfig.accent : undefined }}
            >
              Linear vs Spring
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-5 sm:p-8 space-y-8">
        {/* ================= TAB 1: KEYFRAME GRAPH LAB ================= */}
        {activeTab === 'keyframe-lab' && (
          <div className="space-y-6">
            {/* Top Quick Physics Presets */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-current/10">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4" style={{ color: themeConfig.accent }} />
                <span className="text-xs font-mono uppercase tracking-wider font-bold">
                  Physics Presets:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => applyPreset('ultra-bouncy')}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono border hover:scale-105 transition-all"
                  style={{
                    backgroundColor: bounciness > 70 ? `${themeConfig.accent}20` : 'transparent',
                    borderColor: bounciness > 70 ? themeConfig.accent : 'currentColor',
                    color: bounciness > 70 ? themeConfig.accent : 'inherit',
                  }}
                >
                  ⚡ Hyper-Elastic (+{peakOvershoot}%)
                </button>
                <button
                  onClick={() => applyPreset('natural-apple')}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono border hover:scale-105 transition-all opacity-80 hover:opacity-100"
                >
                  🍏 Tactile Apple Spring
                </button>
                <button
                  onClick={() => applyPreset('snappy-saas')}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono border hover:scale-105 transition-all opacity-80 hover:opacity-100"
                >
                  🚀 Snappy SaaS UI
                </button>
                <button
                  onClick={() => applyPreset('gentle-luxury')}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono border hover:scale-105 transition-all opacity-80 hover:opacity-100"
                >
                  💎 Gentle Luxury Settle
                </button>
              </div>
            </div>

            {/* Interactive Physics Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Bounciness / Overshoot */}
              <div
                className="p-4 rounded-2xl border flex flex-col justify-between space-y-3 shadow-sm"
                style={{ backgroundColor: themeConfig.bgCard, borderColor: themeConfig.border }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
                    Bounciness
                  </span>
                  <span className="text-xs font-mono font-bold" style={{ color: themeConfig.accent }}>
                    {bounciness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bounciness}
                  onChange={(e) => setBounciness(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-black/20 rounded-lg"
                />
                <span className="text-[10px] font-mono opacity-50">
                  Controls harmonic overshoot amplitude
                </span>
              </div>

              {/* 2. Stiffness */}
              <div
                className="p-4 rounded-2xl border flex flex-col justify-between space-y-3 shadow-sm"
                style={{ backgroundColor: themeConfig.bgCard, borderColor: themeConfig.border }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
                    Stiffness (k)
                  </span>
                  <span className="text-xs font-mono font-bold" style={{ color: themeConfig.accent }}>
                    {stiffness} N/m
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="600"
                  step="10"
                  value={stiffness}
                  onChange={(e) => setStiffness(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-black/20 rounded-lg"
                />
                <span className="text-[10px] font-mono opacity-50">
                  Higher = faster snappy snapback
                </span>
              </div>

              {/* 3. Damping */}
              <div
                className="p-4 rounded-2xl border flex flex-col justify-between space-y-3 shadow-sm"
                style={{ backgroundColor: themeConfig.bgCard, borderColor: themeConfig.border }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
                    Damping (c)
                  </span>
                  <span className="text-xs font-mono font-bold" style={{ color: themeConfig.accent }}>
                    {damping} Ns/m
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="40"
                  value={damping}
                  onChange={(e) => setDamping(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-black/20 rounded-lg"
                />
                <span className="text-[10px] font-mono opacity-50">
                  Friction absorbing recoil oscillations
                </span>
              </div>

              {/* 4. Mass */}
              <div
                className="p-4 rounded-2xl border flex flex-col justify-between space-y-3 shadow-sm"
                style={{ backgroundColor: themeConfig.bgCard, borderColor: themeConfig.border }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" style={{ color: themeConfig.accent }} />
                    Mass (m)
                  </span>
                  <span className="text-xs font-mono font-bold" style={{ color: themeConfig.accent }}>
                    {mass.toFixed(1)} kg
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={mass}
                  onChange={(e) => setMass(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-black/20 rounded-lg"
                />
                <span className="text-[10px] font-mono opacity-50">
                  Simulated object inertia & weight
                </span>
              </div>
            </div>

            {/* Bouncy Keyframe Recharts Visualizer Stage */}
            <div
              className="relative rounded-2xl p-5 sm:p-7 border overflow-hidden shadow-inner"
              style={{
                backgroundColor: themeConfig.isLight ? '#FFFFFF' : '#05070A',
                borderColor: themeConfig.border,
              }}
            >
              {/* Header inside graph */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveMetric('displacement')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        activeMetric === 'displacement'
                          ? 'shadow-md text-black'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: activeMetric === 'displacement' ? themeConfig.accent : 'transparent',
                        border: '1px solid currentColor',
                      }}
                    >
                      Displacement Wave (0 → {100 + peakOvershoot}%)
                    </button>
                    <button
                      onClick={() => setActiveMetric('velocity')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        activeMetric === 'velocity'
                          ? 'shadow-md text-black'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: activeMetric === 'velocity' ? themeConfig.secondaryAccent : 'transparent',
                        border: '1px solid currentColor',
                      }}
                    >
                      Velocity Derivative (px/s)
                    </button>
                  </div>
                </div>

                {/* Scrubber playback controls */}
                <div className="flex items-center gap-3">
                  <div className="text-xs font-mono opacity-70">
                    t = <span className="font-bold font-mono" style={{ color: themeConfig.accent }}>{currentTimeMs}ms</span> / {durationMs}ms
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold hover:scale-105 transition-all"
                      style={{ borderColor: themeConfig.border, backgroundColor: `${themeConfig.accent}15` }}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setSimulationProgress(0);
                        setIsPlaying(true);
                      }}
                      className="p-1.5 rounded-xl border hover:scale-105 transition-all"
                      style={{ borderColor: themeConfig.border }}
                      title="Reset Keyframe Playhead"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recharts Area Chart */}
              <div className="h-[240px] sm:h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="bounceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={themeConfig.graphGradientStart} stopOpacity={0.55} />
                        <stop offset="60%" stopColor={themeConfig.graphGradientEnd} stopOpacity={0.15} />
                        <stop offset="100%" stopColor={themeConfig.graphGradientEnd} stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={themeConfig.secondaryAccent} stopOpacity={0.6} />
                        <stop offset="100%" stopColor={themeConfig.secondaryAccent} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: themeConfig.textMuted }}
                      tickFormatter={(val) => `${val}ms`}
                      axisLine={{ stroke: themeConfig.border }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: themeConfig.textMuted }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, activeMetric === 'displacement' ? Math.max(130, 100 + peakOvershoot + 15) : 220]}
                      tickFormatter={(val) => `${val}%`}
                    />

                    {/* 100% Target Baseline */}
                    <ReferenceLine
                      y={100}
                      stroke={themeConfig.textMuted}
                      strokeDasharray="4 4"
                      strokeOpacity={0.4}
                      label={{
                        value: '100% Target Settle',
                        position: 'insideTopRight',
                        fill: themeConfig.textMuted,
                        fontSize: 9,
                      }}
                    />

                    {/* Dynamic Synchronized Playhead Line */}
                    <ReferenceLine
                      x={currentTimeMs}
                      stroke={themeConfig.accent}
                      strokeWidth={2.5}
                    />

                    {/* Keyframe Reference Anchors */}
                    {keyframePoints.map((kf) => (
                      <ReferenceDot
                        key={kf.id}
                        x={kf.timeMs}
                        y={activeMetric === 'displacement' ? kf.displacement : kf.velocity}
                        r={selectedKeyframe === kf.id ? 7 : 5}
                        fill={themeConfig.accent}
                        stroke="#000000"
                        strokeWidth={2}
                        className="cursor-pointer hover:scale-125 transition-transform"
                        onClick={() => setSelectedKeyframe(kf.id)}
                      />
                    ))}

                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div
                              className="p-3 rounded-xl border shadow-2xl text-xs font-mono"
                              style={{
                                backgroundColor: themeConfig.bgCard,
                                borderColor: themeConfig.border,
                                color: themeConfig.textPrimary,
                              }}
                            >
                              <div className="font-bold flex items-center justify-between gap-4" style={{ color: themeConfig.accent }}>
                                <span>t = {data.time}ms</span>
                                <span>{data.displacement >= 100 ? `+${data.displacement - 100}% Overshoot` : `${data.displacement}%`}</span>
                              </div>
                              <div className="text-[11px] opacity-80 mt-1">
                                Displacement: {data.displacement}%
                              </div>
                              <div className="text-[11px] opacity-80">
                                Velocity: {data.velocity} px/s
                              </div>
                              <div className="text-[10px] text-emerald-400 mt-1">
                                Framerate: 60 FPS Compositor Lock
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    {activeMetric === 'displacement' ? (
                      <Area
                        type="monotone"
                        dataKey="displacement"
                        stroke={themeConfig.graphStroke}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#bounceGradient)"
                        isAnimationActive={false}
                      />
                    ) : (
                      <Area
                        type="monotone"
                        dataKey="velocity"
                        stroke={themeConfig.secondaryAccent}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#velocityGrad)"
                        isAnimationActive={false}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Keyframe Interactive Step Strip */}
              <div className="mt-4 pt-4 border-t border-current/10 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {keyframePoints.map((kf, idx) => {
                  const isSelected = selectedKeyframe === kf.id;
                  return (
                    <button
                      key={kf.id}
                      onClick={() => setSelectedKeyframe(kf.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-current shadow-md'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isSelected ? `${themeConfig.accent}15` : themeConfig.bgCard,
                        borderColor: isSelected ? themeConfig.accent : themeConfig.border,
                      }}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold" style={{ color: themeConfig.accent }}>
                          0{idx + 1}
                        </span>
                        <span className="opacity-60">{kf.timeMs}ms</span>
                      </div>
                      <div className="text-xs font-mono font-semibold mt-1 truncate">
                        {kf.label}
                      </div>
                      <div className="text-[10px] opacity-60 line-clamp-1 mt-0.5">
                        {kf.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Synchronized Motion Stage & Code Export */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Animated Kinematic Stage */}
              <div
                className="lg:col-span-7 p-6 rounded-2xl border space-y-4"
                style={{ backgroundColor: themeConfig.bgCard, borderColor: themeConfig.border }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" style={{ color: themeConfig.accent }} />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Live Physical Specimen
                    </span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: themeConfig.accent }}>
                    Pos: {currentDisplacement}%
                  </span>
                </div>

                {/* Animated Track */}
                <div
                  className="relative h-16 rounded-2xl border overflow-hidden flex items-center px-4"
                  style={{
                    backgroundColor: themeConfig.isLight ? '#F0ECE4' : '#07090E',
                    borderColor: themeConfig.border,
                  }}
                >
                  <div className="absolute inset-x-6 h-[1px] bg-current/20" />
                  <div className="absolute left-6 text-[9px] font-mono opacity-40">0% START</div>
                  <div className="absolute right-6 text-[9px] font-mono opacity-40">100% TARGET</div>

                  {/* Bouncy Physical Card moving according to spring calculations */}
                  <div
                    className="relative z-10 transition-transform duration-75 ease-out"
                    style={{
                      transform: `translateX(calc(${Math.max(0, currentDisplacement)} * (100% - 130px) / 100)) scale(${
                        1 + (currentDisplacement > 100 ? (currentDisplacement - 100) * 0.004 : 0)
                      })`,
                    }}
                  >
                    <div
                      className="px-4 py-2 rounded-xl text-black font-mono text-xs font-bold shadow-2xl flex items-center gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${themeConfig.secondaryAccent} 0%, ${themeConfig.accent} 100%)`,
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                      <span>{currentDisplacement}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono opacity-70">
                  <span>Spring Formula: stiffness={stiffness}, damping={damping}, mass={mass}</span>
                  <span className="text-emerald-400">Zero Jank Guarantee</span>
                </div>
              </div>

              {/* Framer Motion / CSS Export snippet */}
              <div
                className="lg:col-span-5 p-6 rounded-2xl border space-y-3"
                style={{ backgroundColor: themeConfig.bgCard, borderColor: themeConfig.border }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4" style={{ color: themeConfig.accent }} />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Export Transition Code
                    </span>
                  </div>
                  <button
                    onClick={copyFramerCode}
                    className="px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 border hover:scale-105 transition-all"
                    style={{
                      backgroundColor: copiedCode ? '#10B981' : `${themeConfig.accent}20`,
                      borderColor: copiedCode ? '#10B981' : themeConfig.accent,
                      color: copiedCode ? '#FFFFFF' : themeConfig.accent,
                    }}
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Motion Config'}</span>
                  </button>
                </div>

                <pre
                  className="p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border"
                  style={{
                    backgroundColor: themeConfig.isLight ? '#F5F2EC' : '#06080D',
                    borderColor: themeConfig.border,
                    color: themeConfig.accent,
                  }}
                >
{`transition: {
  type: "spring",
  stiffness: ${stiffness},
  damping: ${damping},
  mass: ${mass},
  bounce: ${(bounciness / 100).toFixed(2)}
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: BOUNCY SAAS UI SANDBOX ================= */}
        {activeTab === 'saas-widgets' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-xs font-mono uppercase tracking-widest font-bold" style={{ color: themeConfig.accent }}>
                Interactive SaaS Interface Sandbox
              </span>
              <h5 className="font-serif text-3xl mt-1">
                Experience real-world spring bouncy micro-interactions
              </h5>
              <p className="text-xs sm:text-sm font-light opacity-75 mt-2">
                Click, toggle, and trigger the UI components below to feel how custom keyframe physics transform ordinary UI into a memorable tactile brand experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Bouncy Notification Toast */}
              <div
                className="p-6 rounded-2xl border flex flex-col justify-between space-y-6"
                style={{ backgroundColor: themeConfig.bgCard, borderColor: themeConfig.border }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: themeConfig.accent }}>
                      01 / Toast Dialog
                    </span>
                    <button
                      onClick={() => {
                        setToastVisible(false);
                        setTimeout(() => setToastVisible(true), 200);
                      }}
                      className="text-[10px] font-mono opacity-60 hover:opacity-100 underline"
                    >
                      Re-trigger
                    </button>
                  </div>
                  <h6 className="font-serif text-lg">Bouncy Alert Toast</h6>
                  <p className="text-xs opacity-70 font-light mt-1">
                    Pops in with an energetic overshoot scale before softly resting.
                  </p>
                </div>

                <div className="min-h-[120px] flex items-center justify-center p-4 rounded-xl bg-black/10 dark:bg-white/5">
                  <AnimatePresence mode="wait">
                    {toastVisible && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{
                          type: 'spring',
                          stiffness: stiffness,
                          damping: damping,
                          mass: mass,
                        }}
                        className="p-4 rounded-2xl border shadow-xl flex items-center gap-3 w-full max-w-xs"
                        style={{
                          backgroundColor: themeConfig.bgSurface,
                          borderColor: themeConfig.accent,
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${themeConfig.accent}20`, color: themeConfig.accent }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold">Project Deployed!</div>
                          <div className="text-[10px] opacity-70">120 FPS render active.</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => setToastVisible(!toastVisible)}
                  className="w-full py-2.5 rounded-xl border text-xs font-mono font-semibold hover:scale-105 transition-all"
                  style={{ borderColor: themeConfig.border }}
                >
                  {toastVisible ? 'Dismiss Toast' : 'Trigger Bouncy Toast'}
                </button>
              </div>

              {/* 2. Tactile Haptic Switch & Bouncy Metric Counter */}
              <div
                className="p-6 rounded-2xl border flex flex-col justify-between space-y-6"
                style={{ backgroundColor: themeConfig.bgCard, borderColor: themeConfig.border }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: themeConfig.accent }}>
                      02 / Tactile Toggle & Counter
                    </span>
                  </div>
                  <h6 className="font-serif text-lg">Elastic Switch Rebound</h6>
                  <p className="text-xs opacity-70 font-light mt-1">
                    Tactile physical switch with inertia slide and spring recoil.
                  </p>
                </div>

                <div className="min-h-[120px] flex flex-col items-center justify-center gap-4 p-4 rounded-xl bg-black/10 dark:bg-white/5">
                  {/* Bouncy Toggle */}
                  <div
                    onClick={() => setToggleState(!toggleState)}
                    className="w-16 h-9 rounded-full p-1 cursor-pointer transition-colors border shadow-inner flex items-center"
                    style={{
                      backgroundColor: toggleState ? themeConfig.accent : 'rgba(0,0,0,0.3)',
                      borderColor: themeConfig.border,
                    }}
                  >
                    <motion.div
                      layout
                      transition={{
                        type: 'spring',
                        stiffness: stiffness,
                        damping: damping,
                      }}
                      className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center"
                      style={{
                        marginLeft: toggleState ? 'auto' : '0',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black" />
                    </motion.div>
                  </div>

                  {/* Bouncy Metric Counter */}
                  <motion.button
                    key={bounceCounter}
                    initial={{ scale: 0.8, rotate: -4 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: stiffness,
                      damping: damping,
                    }}
                    onClick={() => setBounceCounter((c) => c + 1)}
                    className="px-4 py-2 rounded-full border text-xs font-mono font-bold shadow-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                    style={{
                      backgroundColor: `${themeConfig.accent}15`,
                      borderColor: themeConfig.accent,
                      color: themeConfig.accent,
                    }}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Bounce Count: {bounceCounter}</span>
                  </motion.button>
                </div>

                <div className="text-[10px] font-mono text-center opacity-60">
                  Click the toggle or button to test spring response
                </div>
              </div>

              {/* 3. Bouncy Modal Popover */}
              <div
                className="p-6 rounded-2xl border flex flex-col justify-between space-y-6"
                style={{ backgroundColor: themeConfig.bgCard, borderColor: themeConfig.border }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: themeConfig.accent }}>
                      03 / Popover Dialog
                    </span>
                  </div>
                  <h6 className="font-serif text-lg">Spring Zoom Modal</h6>
                  <p className="text-xs opacity-70 font-light mt-1">
                    Over-zooms to 1.12x scale before pulling back into sharp crisp focus.
                  </p>
                </div>

                <div className="min-h-[120px] flex items-center justify-center p-4 rounded-xl bg-black/10 dark:bg-white/5">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="p-4 rounded-2xl border shadow-lg text-center cursor-pointer"
                    style={{
                      backgroundColor: themeConfig.bgSurface,
                      borderColor: themeConfig.border,
                    }}
                    onClick={() => setBounceCounter((c) => c + 1)}
                  >
                    <MousePointerClick className="w-6 h-6 mx-auto mb-2" style={{ color: themeConfig.accent }} />
                    <div className="text-xs font-mono font-bold">Interactive Card</div>
                    <div className="text-[10px] opacity-60">Hover & Click Physics</div>
                  </motion.div>
                </div>

                <button
                  onClick={() => {
                    applyPreset('ultra-bouncy');
                    setBounceCounter((c) => c + 1);
                  }}
                  className="w-full py-2.5 rounded-xl border text-xs font-mono font-semibold hover:scale-105 transition-all"
                  style={{
                    backgroundColor: `${themeConfig.accent}20`,
                    borderColor: themeConfig.accent,
                    color: themeConfig.accent,
                  }}
                >
                  Apply Max Elasticity
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: LINEAR VS SPRING DUEL ================= */}
        {activeTab === 'duel' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto mb-4">
              <span className="text-xs font-mono uppercase tracking-widest font-bold" style={{ color: themeConfig.accent }}>
                Why Springs Win (The SaaS Difference)
              </span>
              <h5 className="font-serif text-3xl mt-1">
                Standard Easing vs. Dynamic Harmonic Physics
              </h5>
              <p className="text-xs sm:text-sm font-light opacity-75 mt-2">
                Click “Launch Race” to observe how standard linear curves feel rigid and robotic, while harmonic springs generate natural emotional satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Linear Standard Curve */}
              <div
                className="p-6 rounded-2xl border space-y-4 opacity-75"
                style={{ backgroundColor: themeConfig.bgCard, borderColor: themeConfig.border }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <h6 className="font-mono text-sm font-bold">Standard ease-in-out (Robotic ❌)</h6>
                  </div>
                  <span className="text-xs font-mono opacity-60">Linear Curve</span>
                </div>
                <p className="text-xs opacity-70 font-light">
                  Abrupt deceleration curve. No real-world inertia. Disconnected from user tactile feedback.
                </p>

                {/* Animated Race Track 1 */}
                <div className="h-16 rounded-xl bg-black/20 border border-current/10 flex items-center px-4 relative overflow-hidden">
                  <motion.div
                    animate={duelActive ? { x: [0, 220, 0] } : {}}
                    transition={{ duration: 1.4, repeat: duelActive ? Infinity : 0, ease: 'easeInOut' }}
                    className="w-10 h-10 rounded-xl bg-neutral-600 text-white font-mono text-xs font-bold flex items-center justify-center shadow-md"
                  >
                    Ease
                  </motion.div>
                </div>
                <div className="text-[11px] font-mono opacity-50">Formula: cubic-bezier(0.42, 0, 0.58, 1)</div>
              </div>

              {/* Right: Harmonic Spring Curve */}
              <div
                className="p-6 rounded-2xl border space-y-4 shadow-xl"
                style={{
                  backgroundColor: themeConfig.bgCard,
                  borderColor: themeConfig.accent,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <h6 className="font-mono text-sm font-bold" style={{ color: themeConfig.accent }}>
                      Harmonic Spring Kinematics (Tactile & Alive ✅)
                    </h6>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">Momentum Preserving</span>
                </div>
                <p className="text-xs opacity-80 font-light">
                  Continuous physics simulation. Overshoots organically and dampens with micro-tactile energy.
                </p>

                {/* Animated Race Track 2 */}
                <div className="h-16 rounded-xl bg-black/20 border border-current/10 flex items-center px-4 relative overflow-hidden">
                  <motion.div
                    animate={duelActive ? { x: [0, 220, 0] } : {}}
                    transition={{
                      duration: 1.4,
                      repeat: duelActive ? Infinity : 0,
                      type: 'spring',
                      stiffness: stiffness,
                      damping: damping,
                      mass: mass,
                    }}
                    className="w-10 h-10 rounded-xl text-black font-mono text-xs font-bold flex items-center justify-center shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.secondaryAccent} 0%, ${themeConfig.accent} 100%)`,
                    }}
                  >
                    Spring
                  </motion.div>
                </div>
                <div className="text-[11px] font-mono" style={{ color: themeConfig.accent }}>
                  Formula: spring(k: {stiffness}, c: {damping}, m: {mass})
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => setDuelActive(!duelActive)}
                className="px-8 py-3.5 rounded-full text-black font-mono text-xs font-bold uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${themeConfig.secondaryAccent} 0%, ${themeConfig.accent} 100%)`,
                }}
              >
                <Zap className="w-4 h-4" />
                <span>{duelActive ? 'Stop Duel Race' : 'Launch Side-by-Side Duel Race'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Meta Guarantee */}
      <div
        className="p-4 sm:p-5 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono opacity-70"
        style={{
          backgroundColor: themeConfig.bgCard,
          borderColor: themeConfig.border,
        }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Zero Layout Shift (CLS: 0.00) • Hardware Accelerated Transform & Opacity Compositor</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Active Theme: <strong style={{ color: themeConfig.accent }}>{themeConfig.name}</strong></span>
        </div>
      </div>
    </div>
  );
}
