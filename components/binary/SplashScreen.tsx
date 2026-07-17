'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const SPLASH_SESSION_KEY = 'eryuan-splash-seen';
/** 读数时长：够慢到能看清 00→100，又不过度拖沓 */
const COUNT_DURATION_MS = 2000;
/** 到 100 后的退场时长 */
const EXIT_DURATION_MS = 360;

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const forceSplash =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('splash') === '1';

    // 无障碍：系统要求减少动效时直接进入
    // 同会话已看过：跳过（?splash=1 可强制每次重播，便于验收）
    if (
      prefersReducedMotion ||
      (!forceSplash && window.sessionStorage.getItem(SPLASH_SESSION_KEY) === '1')
    ) {
      onComplete();
      return;
    }

    let frameId = 0;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / COUNT_DURATION_MS, 1);
      // 二次 ease-out：前半可读、后半略收，避免三次方前冲导致数字糊成一片
      const eased = 1 - Math.pow(1 - progress, 2);
      setCount(Math.round(eased * 100));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      window.sessionStorage.setItem(SPLASH_SESSION_KEY, '1');
      setExiting(true);
      exitTimer = setTimeout(onComplete, EXIT_DURATION_MS);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, [onComplete, prefersReducedMotion]);

  return (
    <motion.div
      className={`fixed inset-0 z-[100] overflow-hidden bg-[#f6f4ef] text-[#050505] transition-[opacity,clip-path] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        exiting ? 'opacity-0 [clip-path:inset(0_0_100%_0)]' : 'opacity-100 [clip-path:inset(0_0_0_0)]'
      }`}
      initial={{ opacity: 1 }}
      aria-label="页面加载中"
      aria-live="polite"
      aria-busy={!exiting}
    >
      <div className="hero-grid absolute inset-0 opacity-70" />
      <div className="noise absolute inset-0" />
      <div className="absolute left-5 right-5 top-6 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] md:left-10 md:right-10">
        <span>PROMPT TO IMAGE</span>
        <span>创造 / 实现</span>
      </div>
      <img
        src="/brand/er-yuan-window.svg"
        alt="二元｜AI 图像生成"
        className="absolute left-1/2 top-1/2 h-auto w-72 -translate-x-1/2 -translate-y-1/2 object-contain md:w-[24rem]"
      />
      <div className="absolute bottom-6 left-5 right-5 md:bottom-10 md:left-10 md:right-10">
        <div className="mb-5 h-px w-full bg-[#050505]/20">
          <div
            className="h-full origin-left bg-[#050505] will-change-transform"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </div>
        <div className="flex items-end justify-between gap-5">
          <span className="text-[clamp(4.5rem,16vw,12rem)] font-black leading-[0.78] tabular-nums tracking-tight">
            {String(count).padStart(2, '0')}
          </span>
          <span className="max-w-40 pb-2 text-right text-xs font-black leading-tight md:max-w-none md:pb-5 md:text-base">
            正在唤醒想象引擎
            <br />
            创造 / 实现
          </span>
        </div>
      </div>
    </motion.div>
  );
}
