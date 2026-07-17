'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function LenisGsapBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Keep ScrollTrigger in lockstep with Lenis (critical for silky pin/unpin).
    const update = () => ScrollTrigger.update();
    lenis.on('scroll', update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // After Lenis mounts / route paint, remeasure pins.
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 80);

    return () => {
      window.clearTimeout(refreshTimer);
      lenis.off('scroll', update);
      gsap.ticker.remove(raf);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        // Slightly snappier lerp so GSAP pin/unpin stays glued to the wheel.
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.1,
        // Prevents overscroll rubber-band fighting pinned panels on trackpads.
        syncTouch: false
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
