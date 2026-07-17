'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import {
  getWallColumns,
  WALL_DESKTOP_COLUMN_COUNT,
  WALL_FRAME_CLASS,
  type WallTile
} from './wallAssets';

gsap.registerPlugin(Flip);

/** Staggered marquee speeds; odd columns reverse for denser floating motion. */
const WALL_COLUMN_MOTION = [
  { duration: 48, reverse: false },
  { duration: 56, reverse: true },
  { duration: 42, reverse: false },
  { duration: 52, reverse: true }
] as const;

const WALL_MOBILE_COLUMN_COUNT = 3;

const BinaryParticles = dynamic(() => import('../BinaryParticles'), {
  ssr: false,
  loading: () => null
});

type ActivePhoto = {
  flipId: string;
  item: WallTile;
};

function WallColumn({
  items,
  duration,
  reverse,
  columnIndex,
  onOpen,
  className = ''
}: {
  items: WallTile[];
  duration: number;
  reverse?: boolean;
  columnIndex: number;
  onOpen: (item: WallTile, source: HTMLButtonElement, flipId: string) => void;
  className?: string;
}) {
  const loop = useMemo(() => [...items, ...items], [items]);

  return (
    <div className={`relative h-full min-w-0 flex-1 overflow-hidden ${className}`.trim()}>
      <div
        className="hero-wall-track flex w-full flex-col gap-1.5 will-change-transform md:gap-2 lg:gap-3"
        data-duration={duration}
        data-reverse={reverse ? '1' : '0'}
      >
        {loop.map((item, index) => {
          // Reverse tracks start on the second copy, so that copy must own the
          // interactive/a11y state while the first copy becomes the hidden twin.
          const isHiddenCopy = reverse ? index < items.length : index >= items.length;
          const primaryStartIndex = reverse ? items.length : 0;
          const shouldLoadEagerly = index === primaryStartIndex;
          const shouldPrioritize = columnIndex === 1 && index === primaryStartIndex;

          return (
          <button
            key={`${item.id}-${index}`}
            type="button"
            className={`group hero-wall-card relative block shrink-0 cursor-zoom-in overflow-hidden rounded-md bg-[#f0ece3] text-left shadow-[0_8px_24px_rgba(5,5,5,0.06)] lg:rounded-2xl lg:shadow-[0_16px_40px_rgba(5,5,5,0.10),0_4px_12px_rgba(5,5,5,0.05)] lg:ring-1 lg:ring-black/[0.04] ${WALL_FRAME_CLASS}`}
            aria-label={`放大作品：${item.title}`}
            aria-hidden={isHiddenCopy || undefined}
            tabIndex={isHiddenCopy ? -1 : 0}
            onClick={(event) => onOpen(item, event.currentTarget, `hero-photo-${columnIndex}-${index}-${item.id}`)}
          >
            {/* Real asset swap: 9:16 mobile file / 16:9 desktop file — not just crop */}
            <picture className="pointer-events-none absolute inset-0 block h-full w-full">
              <source media="(min-width: 768px)" srcSet={item.desktop} />
              <img
                src={item.mobile}
                alt={item.alt}
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06] lg:group-hover:scale-[1.04]"
                style={{ objectPosition: item.crop }}
                draggable={false}
                sizes="(max-width: 767px) 33vw, (max-width: 1023px) 20vw, 12vw"
                loading={shouldLoadEagerly ? 'eager' : 'lazy'}
                fetchPriority={shouldPrioritize ? 'high' : 'auto'}
                decoding="async"
              />
            </picture>
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/18 group-focus-visible:bg-black/18" />
            <span className="pointer-events-none absolute bottom-2 left-2 right-2 translate-y-1 text-[10px] font-black tracking-wide text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:text-[11px]">
              {item.title}
            </span>
          </button>
          );
        })}
      </div>
    </div>
  );
}

export function HeroStage() {
  const prefersReducedMotion = useReducedMotion();
  const wallRef = useRef<HTMLDivElement | null>(null);
  const pointerLayerRef = useRef<HTMLDivElement | null>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const wallPauseReasonsRef = useRef(new Set<string>());
  const sourceCardRef = useRef<HTMLButtonElement | null>(null);
  const openingStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const modalMediaRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousBodyOverflowRef = useRef('');
  const [activePhoto, setActivePhoto] = useState<ActivePhoto | null>(null);
  // 5-column deal for desktop; columns 4–5 stay mounted but CSS-hidden below lg
  // so mobile keeps a 3-column wall without matchMedia flash / hydration churn.
  const [columns] = useState(() => getWallColumns(WALL_DESKTOP_COLUMN_COUNT));
  const [particlesReady, setParticlesReady] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (prefersReducedMotion || connection?.saveData) {
      setParticlesReady(false);
      return;
    }

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(() => setParticlesReady(true), { timeout: 1400 });
    } else {
      timerId = setTimeout(() => setParticlesReady(true), 900);
    }

    return () => {
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (timerId) clearTimeout(timerId);
    };
  }, [prefersReducedMotion]);

  // Pointer follow writes transform on a leaf layer via ref — never React state
  // (state re-renders + GSAP scrub on the same transform = scroll vibration).
  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const layer = pointerLayerRef.current;
    if (!layer) return;
    // Touch scrolling also emits pointermove events. Restrict the decorative
    // follow effect to a real mouse so mobile scroll cannot shift the wall.
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      layer.style.transform = 'translate3d(0, 0, 0)';
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    layer.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0)`;
  }, []);

  const onPointerLeave = useCallback(() => {
    const layer = pointerLayerRef.current;
    if (!layer) return;
    layer.style.transform = 'translate3d(0, 0, 0)';
  }, []);

  useEffect(() => {
    const root = wallRef.current;
    if (!root) return;

    if (prefersReducedMotion) {
      tweensRef.current.forEach((tween) => tween.kill());
      tweensRef.current = [];
      gsap.set(gsap.utils.toArray<HTMLElement>('.hero-wall-track', root), { clearProps: 'transform' });
      return;
    }

    let disposed = false;
    let frameId: number | undefined;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let lastAspectBreakpoint = window.matchMedia('(min-width: 768px)').matches;
    let lastDesktopColumns = window.matchMedia('(min-width: 1024px)').matches;

    const startMarquee = () => {
      if (disposed) return;
      tweensRef.current.forEach((tween) => tween.kill());
      tweensRef.current = [];

      const tracks = gsap.utils
        .toArray<HTMLElement>('.hero-wall-track', root)
        // Skip CSS-hidden desktop-only columns on mobile (offsetParent is null).
        .filter((track) => track.offsetParent !== null);
      tracks.forEach((track) => {
        const duration = Number(track.dataset.duration) || 48;
        const reverse = track.dataset.reverse === '1';
        const distance = track.scrollHeight / 2;
        if (distance <= 0) return;

        gsap.set(track, { y: reverse ? -distance : 0, force3D: true });

        const tween = gsap.to(track, {
          y: reverse ? 0 : -distance,
          duration,
          ease: 'none',
          repeat: -1,
          force3D: true
        });

        tweensRef.current.push(tween);
      });

      if (wallPauseReasonsRef.current.size > 0) {
        tweensRef.current.forEach((tween) => tween.pause());
      }
    };

    const scheduleStart = () => {
      if (frameId !== undefined) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        frameId = undefined;
        startMarquee();
      });
    };

    scheduleStart();

    const images = Array.from(root.querySelectorAll('img'));
    let pending = images.length;
    const onReady = () => {
      pending -= 1;
      if (pending <= 0) scheduleStart();
    };
    images.forEach((img) => {
      if (img.complete) {
        pending -= 1;
      } else {
        img.addEventListener('load', onReady, { once: true });
        img.addEventListener('error', onReady, { once: true });
      }
    });

    // Restart marquee when crossing mobile/desktop aspect (768) or column-density (1024).
    // Do NOT use ResizeObserver — mobile URL-bar show/hide resizes viewport while
    // scrolling and would kill/restart transforms, looking like hero vibration.
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const nextAspect = window.matchMedia('(min-width: 768px)').matches;
        const nextDesktopColumns = window.matchMedia('(min-width: 1024px)').matches;
        if (nextAspect === lastAspectBreakpoint && nextDesktopColumns === lastDesktopColumns) return;
        lastAspectBreakpoint = nextAspect;
        lastDesktopColumns = nextDesktopColumns;
        scheduleStart();
      }, 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      clearTimeout(resizeTimer);
      if (frameId !== undefined) cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      tweensRef.current.forEach((tween) => tween.kill());
      tweensRef.current = [];
    };
  }, [columns, prefersReducedMotion]);

  const setWallMotionPaused = useCallback((paused: boolean, reason = 'interaction') => {
    if (paused) wallPauseReasonsRef.current.add(reason);
    else wallPauseReasonsRef.current.delete(reason);

    const shouldPause = wallPauseReasonsRef.current.size > 0;
    tweensRef.current.forEach((tween) => {
      if (shouldPause) tween.pause();
      else tween.resume();
    });
  }, []);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => setWallMotionPaused(!entry?.isIntersecting, 'viewport'),
      { threshold: 0.04 }
    );
    const onVisibilityChange = () => setWallMotionPaused(document.hidden, 'document');

    observer.observe(wall);
    document.addEventListener('visibilitychange', onVisibilityChange);
    onVisibilityChange();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      wallPauseReasonsRef.current.delete('viewport');
      wallPauseReasonsRef.current.delete('document');
    };
  }, [prefersReducedMotion, setWallMotionPaused]);

  const openPhoto = useCallback(
    (item: WallTile, source: HTMLButtonElement, flipId: string) => {
      if (sourceCardRef.current || activePhoto) return;

      setWallMotionPaused(true, 'modal');
      source.dataset.flipId = flipId;
      openingStateRef.current = Flip.getState(source, { props: 'borderRadius' });
      source.dataset.flipId = '';
      source.style.visibility = 'hidden';
      sourceCardRef.current = source;
      setActivePhoto({ item, flipId });
    },
    [activePhoto, setWallMotionPaused]
  );

  const closePhoto = useCallback(() => {
    const source = sourceCardRef.current;
    const modalMedia = modalMediaRef.current;
    if (!source || !modalMedia || !activePhoto) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const state = Flip.getState(modalMedia, { props: 'borderRadius' });
    const flipId = activePhoto.flipId;

    gsap.killTweensOf('.hero-photo-modal__chrome');
    gsap.to('.hero-photo-modal__chrome', {
      opacity: 0,
      duration: reducedMotion ? 0 : 0.18,
      ease: 'power2.out'
    });

    setActivePhoto(null);
    source.dataset.flipId = flipId;
    source.style.visibility = 'visible';

    requestAnimationFrame(() => {
      if (!reducedMotion) {
        Flip.from(state, {
          targets: source,
          duration: 0.72,
          ease: 'power4.inOut',
          absolute: true,
          scale: true,
          zIndex: 110
        });
      }

      source.dataset.flipId = '';
      sourceCardRef.current = null;
      openingStateRef.current = null;
      document.body.style.overflow = previousBodyOverflowRef.current;
      setWallMotionPaused(false, 'modal');
      source.focus({ preventScroll: true });
    });
  }, [activePhoto, setWallMotionPaused]);

  useLayoutEffect(() => {
    if (!activePhoto || !modalMediaRef.current || !openingStateRef.current) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    previousBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const modalMedia = modalMediaRef.current;
    const state = openingStateRef.current;
    const timeline = reducedMotion
      ? gsap.timeline().set(modalMedia, { opacity: 1 })
      : Flip.from(state, {
          targets: modalMedia,
          duration: 0.9,
          ease: 'power4.inOut',
          absolute: true,
          scale: true,
          zIndex: 110
        });

    timeline.fromTo(
      '.hero-photo-modal__chrome',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: reducedMotion ? 0 : 0.42, ease: 'power3.out' },
      reducedMotion ? 0 : 0.46
    );

    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      timeline.kill();
    };
  }, [activePhoto]);

  useEffect(() => {
    if (!activePhoto) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePhoto();
        return;
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activePhoto, closePhoto]);

  useEffect(
    () => () => {
      document.body.style.overflow = previousBodyOverflowRef.current;
    },
    []
  );

  return (
    <section
      id="hero"
      className="pin-panel story-panel hero-grid relative z-[1] isolate flex min-h-[100svh] w-full overflow-hidden bg-[#f6f4ef] px-5 pb-10 pt-24 text-[#050505] md:px-8 md:pb-12 md:pt-28 lg:h-[100svh] lg:max-h-[100svh] lg:px-8 lg:pb-0 lg:pt-0"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {particlesReady && !prefersReducedMotion && <BinaryParticles className="opacity-20" />}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,rgba(233,255,51,0.18),transparent_24%),radial-gradient(circle_at_22%_84%,rgba(157,142,199,0.12),transparent_28%)]" />

      <div
        data-pin-depth
        className="relative z-10 grid w-full grid-cols-1 items-center gap-10 will-change-transform lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-stretch lg:gap-12 xl:gap-16"
      >
        <div className="hero-copy relative z-20 flex w-full max-w-[760px] flex-col justify-center lg:pointer-events-none lg:max-w-[700px] lg:min-h-0">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 text-[11px] font-black uppercase tracking-[0.18em] text-[#050505]/50 md:mb-8"
          >
            <span>AI IMAGE STUDIO</span>
          </motion.div>

          <motion.h1
            className="font-display-zh hero-title w-full max-w-[5.5em] text-[clamp(4.5rem,15vw,7rem)] font-normal leading-[0.8] tracking-[-0.035em] text-[#050505] lg:max-w-[5.15em] lg:text-[clamp(6rem,9vw,8.75rem)]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block">把想象</span>
            <span className="block">生成出来</span>
          </motion.h1>

          <motion.p
            className="mt-7 max-w-[42rem] text-[15px] font-normal leading-7 tracking-[0.01em] text-[#1a1a1a]/82 md:mt-8 md:text-base md:leading-8"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block">为品牌、电商与内容团队，把模糊灵感生成成可直接投放的视觉作品。</span>
            <span className="block">从提示词、成图、精修到发布，在同一套创作流程里完成。</span>
          </motion.p>
        </div>

        {/* Layers (never share continuous transforms on one node):
            entrance opacity → GSAP parallax y → pointer follow → 3D stage tilt → wall.
            Mobile: horizontal full-bleed. Desktop: the tilted edge may breathe into the
            column gap; #hero remains the final page-level clipping boundary. */}
        <motion.div
          className="hero-visual relative z-10 left-1/2 w-screen max-w-none -translate-x-1/2 lg:left-auto lg:mx-0 lg:h-full lg:min-h-0 lg:w-full lg:max-w-none lg:translate-x-0 lg:overflow-visible"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-parallax-layer h-full min-h-0 will-change-transform">
            <div
              ref={pointerLayerRef}
              className="h-full min-h-0 will-change-transform transition-transform duration-200 ease-out"
              style={{ transform: 'translate3d(0, 0, 0)' }}
            >
              <div className="hero-wall-stage h-full min-h-0">
                <div className="hero-wall-stage__tilt h-full min-h-0">
                  <div
                    ref={wallRef}
                    className="hero-wall relative h-[min(52vh,420px)] overflow-hidden md:h-[min(56vh,520px)] lg:absolute lg:inset-0 lg:h-auto lg:max-h-none"
                    aria-label="作品照片墙，自动滚动"
                    onPointerEnter={() => setWallMotionPaused(true, 'pointer')}
                    onPointerLeave={() => {
                      setWallMotionPaused(false, 'pointer');
                    }}
                    onFocusCapture={() => setWallMotionPaused(true, 'focus')}
                    onBlurCapture={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget) && !sourceCardRef.current) {
                        setWallMotionPaused(false, 'focus');
                      }
                    }}
                  >
                    {/* Mobile keeps its original paper fades; desktop uses a transparent CSS mask. */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-[#f6f4ef] via-[#f6f4ef]/75 to-transparent md:h-20 lg:hidden" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-[#f6f4ef] via-[#f6f4ef]/75 to-transparent md:h-20 lg:hidden" />

                    <div className="flex h-full gap-1.5 md:gap-2 lg:gap-3">
                      {columns.map((items, index) => {
                        const motion = WALL_COLUMN_MOTION[index] ?? WALL_COLUMN_MOTION[0];
                        const desktopOnly = index >= WALL_MOBILE_COLUMN_COUNT;
                        return (
                          <WallColumn
                            key={index}
                            items={items}
                            duration={motion.duration}
                            reverse={motion.reverse}
                            columnIndex={index}
                            onOpen={openPhoto}
                            className={desktopOnly ? 'hidden lg:block' : undefined}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {activePhoto &&
        createPortal(
          <div
            className="hero-photo-modal fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/96 px-4 py-5 text-white backdrop-blur-xl md:px-8 md:py-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-photo-modal-title"
            data-lenis-prevent
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closePhoto();
            }}
          >
            <div className="hero-photo-modal__chrome pointer-events-none absolute inset-x-4 top-4 z-20 flex items-center justify-between md:inset-x-8 md:top-7">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/62 md:text-xs">
                <span>ER YUAN / IMAGE VIEW</span>
                <span className="h-px w-10 bg-white/24 md:w-20" aria-hidden="true" />
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/26 bg-white/8 text-white transition hover:rotate-90 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                aria-label="关闭放大图片"
                onClick={closePhoto}
              >
                <span className="relative block h-4 w-4" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-px w-4 rotate-45 bg-current" />
                  <span className="absolute left-0 top-1/2 h-px w-4 -rotate-45 bg-current" />
                </span>
              </button>
            </div>

            <div
              ref={modalMediaRef}
              data-flip-id={activePhoto.flipId}
              className="hero-photo-modal__media relative overflow-hidden rounded-[4px] bg-[#171717] shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
            >
              <picture className="absolute inset-0 block h-full w-full">
                <source media="(min-width: 768px)" srcSet={activePhoto.item.desktop} />
                <img
                  src={activePhoto.item.mobile}
                  alt={activePhoto.item.alt}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: activePhoto.item.crop }}
                  draggable={false}
                />
              </picture>
            </div>

            <div className="hero-photo-modal__chrome pointer-events-none absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-6 md:inset-x-8 md:bottom-7">
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#e9ff33]">SELECTED WORK</p>
                <h2 id="hero-photo-modal-title" className="font-display-zh text-3xl font-normal leading-none md:text-5xl">
                  {activePhoto.item.title}
                </h2>
              </div>
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-white/42 md:block">ESC / CLICK OUTSIDE TO CLOSE</p>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
