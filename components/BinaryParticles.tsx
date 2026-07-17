'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Component, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import * as THREE from 'three';

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function canCreateWebGLContext() {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return Boolean(context);
  } catch {
    return false;
  }
}

function FallbackParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-80" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_30%,rgba(0,0,0,0.18)_0_1px,transparent_2px),radial-gradient(circle_at_72%_58%,rgba(0,0,0,0.16)_0_1px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[length:56px_56px,72px_72px,128px_128px,128px_128px]" />
      <div className="absolute left-[12%] top-[20%] h-44 w-44 rounded-full border border-black/30" />
      <div className="absolute right-[18%] top-[34%] h-72 w-72 rounded-full border border-black/20" />
      <div className="absolute left-[38%] bottom-[8%] h-80 w-80 rounded-full border border-dashed border-black/20" />
      <div className="absolute left-[18%] top-[48%] h-2 w-2 rounded-full bg-black/70" />
      <div className="absolute right-[30%] top-[24%] h-3 w-3 rounded-full bg-black/70" />
      <div className="absolute right-[12%] bottom-[20%] h-2 w-2 rounded-full bg-black/70" />
      <div className="absolute left-[30%] bottom-[18%] text-xs font-black tracking-[0.35em] text-black/35">想象 · 成图</div>
      <div className="absolute right-[24%] top-[16%] text-xs font-black tracking-[0.35em] text-black/35">创造 · 实现</div>
    </div>
  );
}

class WebGLErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('BinaryParticles 已切换到 CSS 降级粒子层：', error.message, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function ParticleCloud() {
  const points = useRef<THREE.Points>(null);
  const startedAt = useRef(0);

  const positions = useMemo(() => {
    const count = 880;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const radius = 1.2 + seededRandom(i + 11) * 3.2;
      const angle = seededRandom(i + 37) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius + side * (0.18 + seededRandom(i + 71) * 0.9);
      pos[i * 3 + 1] = (seededRandom(i + 109) - 0.5) * 4.6;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (seededRandom(i + 151) - 0.5) * 1.2;
    }

    return pos;
  }, []);

  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  useFrame(({ pointer }) => {
    if (!points.current || document.hidden) return;
    const elapsed = (performance.now() - startedAt.current) / 1000;
    points.current.rotation.y = elapsed * 0.045 + pointer.x * 0.08;
    points.current.rotation.x = Math.sin(elapsed * 0.28) * 0.06 + pointer.y * 0.05;
    points.current.position.y = Math.sin(elapsed * 0.35) * 0.08;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#050505" sizeAttenuation transparent opacity={0.54} />
    </points>
  );
}

function WebGLParticlesCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.8} />
      <ParticleCloud />
    </Canvas>
  );
}

export default function BinaryParticles({ className = '' }: { className?: string }) {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglAvailable(canCreateWebGLContext());
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {webglAvailable ? (
        <WebGLErrorBoundary fallback={<FallbackParticleField />}>
          <WebGLParticlesCanvas />
        </WebGLErrorBoundary>
      ) : (
        <FallbackParticleField />
      )}
    </div>
  );
}
