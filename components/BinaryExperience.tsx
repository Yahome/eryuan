'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SmoothScroll from './SmoothScroll';
import { GenerationMethod } from './binary/GenerationMethod';
import { HeroStage } from './binary/HeroStage';
import { Navbar } from './binary/Navbar';
import { SplashScreen } from './binary/SplashScreen';
import { WorksGallery } from './binary/WorksGallery';
import { ArrowIcon } from './binary/Icons';
import { CONTACT_HREF, CONTACT_IS_CONFIGURED, CONTACT_REL, CONTACT_TARGET } from './binary/contact';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Layered pin + overscroll (desktop), adapted from GSAP's pinned-panels demo:
 * https://demos.gsap.com/demo/pinned-panels-with-overscroll/
 * https://codepen.io/GreenSock/pen/bGRdvMy
 *
 * - #hero (~100svh): pin from top + pinSpacing:false → #works covers it
 * - #works (170svh runway): pin the 100svh index stage from "top top" until
 *   #method reaches the viewport, so the project view stays locked while the
 *   next panel overscroll-covers it
 * - #method (tall console): free scroll
 */
function BinaryExperienceInner() {
  const [showSplash, setShowSplash] = useState(true);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const onSplashComplete = useCallback(() => setShowSplash(false), []);

  // Splash unmount changes layout — refresh pin distances after it leaves.
  useEffect(() => {
    if (showSplash) return;
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 160);
    return () => {
      window.cancelAnimationFrame(id);
      window.clearTimeout(timer);
    };
  }, [showSplash]);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;
      if (!pageRef.current) return;

      // Smoother pin/unpin with Lenis-driven RAF (cuts micro-stutters on fast wheel).
      gsap.ticker.lagSmoothing(0);

      const refreshScrollTriggers = () => ScrollTrigger.refresh();
      const refreshTimer = window.setTimeout(refreshScrollTriggers, 700);
      window.addEventListener('load', refreshScrollTriggers);

      const media = gsap.matchMedia();

      // Desktop only: mobile keeps native section flow (works already reflows <1024).
      media.add('(min-width: 1024px)', () => {
        const page = pageRef.current;
        if (!page) return;

        const created: ScrollTrigger[] = [];
        const hero = page.querySelector<HTMLElement>('#hero');
        const works = page.querySelector<HTMLElement>('#works');
        const method = page.querySelector<HTMLElement>('#method');

        // 1) Hero → Works: classic layered pin (hold hero, next panel covers).
        if (hero) {
          created.push(
            ScrollTrigger.create({
              trigger: hero,
              start: 'top top',
              pin: true,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true
            })
          );

          // Depth while covered — transform/opacity only (no filter scrub).
          const heroDepth = hero.querySelector<HTMLElement>('[data-pin-depth]');
          if (heroDepth) {
            gsap.fromTo(
              heroDepth,
              { scale: 1, opacity: 1, y: 0 },
              {
                scale: 0.97,
                opacity: 0.9,
                y: -18,
                ease: 'none',
                transformOrigin: 'center center',
                force3D: true,
                scrollTrigger: {
                  trigger: hero,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: 0.4,
                  invalidateOnRefresh: true
                }
              }
            );
          }
        }

        // 2) Works → Method: keep the entire 100svh stage pinned for the whole
        // desktop runway, then let #method cover it. Pinning the sticky node only
        // near "bottom bottom" wraps it in a pin-spacer too early, which breaks the
        // sticky layout and exposes the black runway below the index stage.
        if (works && method) {
          const worksShell = works.querySelector<HTMLElement>('.works-index-shell');
          const pinTarget = worksShell ?? works;

          created.push(
            ScrollTrigger.create({
              trigger: works,
              start: 'top top',
              endTrigger: method,
              end: 'top top',
              pin: pinTarget,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true
            })
          );

          // Depth while method covers the stage (shell is no longer relying on sticky).
          gsap.fromTo(
            pinTarget,
            { scale: 1, opacity: 1, y: 0 },
            {
              scale: 0.97,
              opacity: 0.9,
              y: -18,
              ease: 'none',
              transformOrigin: 'center center',
              force3D: true,
              scrollTrigger: {
                trigger: works,
                start: 'bottom bottom',
                endTrigger: method,
                end: 'top top',
                scrub: 0.4,
                invalidateOnRefresh: true
              }
            }
          );
        }

        return () => {
          created.forEach((trigger) => trigger.kill());
        };
      });

      // Story reveals: opacity + lift only. Never use filter:blur on body copy
      // (scrub blur was making hero subtitle illegible).
      gsap.utils.toArray<HTMLElement>('[data-story]').forEach((item) => {
        if (item.closest('#hero')) return;

        gsap.fromTo(
          item,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              end: 'top 58%',
              scrub: 0.75
            }
          }
        );
      });

      // Hero parallax lives on a dedicated layer inside HeroStage (not on the same
      // node as pointer-follow transform / Framer Motion), to avoid transform fights
      // that look like vertical vibration while scrolling.
      gsap.to('.hero-parallax-layer', {
        y: -48,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.utils.toArray<HTMLElement>('.method-step').forEach((step, index) => {
        gsap.fromTo(
          step,
          { opacity: 0.42, y: 34 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#method',
              start: `top ${78 - index * 7}%`,
              end: `top ${52 - index * 7}%`,
              scrub: true
            }
          }
        );
      });

      gsap.fromTo(
        '.generation-preview',
        { clipPath: 'inset(10% 10% 10% 10% round 34px)', scale: 0.94 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 26px)',
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.generation-console',
            start: 'top 80%',
            end: 'top 28%',
            scrub: true
          }
        }
      );

      gsap.fromTo(
        '.stack-card',
        { y: 38, rotate: 1.4 },
        {
          y: 0,
          rotate: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.generation-console',
            start: 'top 74%',
            end: 'top 32%',
            scrub: true
          }
        }
      );

      return () => {
        window.clearTimeout(refreshTimer);
        window.removeEventListener('load', refreshScrollTriggers);
        media.revert();
      };
    },
    { scope: pageRef, dependencies: [showSplash], revertOnUpdate: true }
  );

  return (
    <div ref={pageRef} className="page-pin-root relative w-full">
      {showSplash && <SplashScreen onComplete={onSplashComplete} />}
      <a href="#main-content" className="skip-link">跳到主要内容</a>
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="relative w-full max-w-full bg-[#f6f4ef] text-[#050505]"
      >
        <HeroStage />
        <WorksGallery />
        <GenerationMethod />
      </main>
      <footer
        id="contact"
        className="pin-panel relative z-[4] flex min-h-[100svh] items-center overflow-hidden bg-[#050505] px-5 py-16 text-[#f6f4ef] md:px-8 md:py-20"
        style={{ backgroundColor: '#050505' }}
      >
        <div className="mx-auto flex max-w-[1500px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <img
              src="/brand/er-yuan-window-light.svg"
              alt="二元｜AI 图像生成"
              className="mb-8 h-auto w-64 object-contain object-left md:w-72"
            />
            <h2 className="font-display-zh mt-4 max-w-[10ch] text-6xl font-normal leading-[0.82] md:text-8xl">创造想象，实现想象。</h2>
          </div>
          <div className="max-w-sm text-sm font-bold leading-7 text-white/64">
            <p>二元，把模糊灵感生成成可展示、可投放的作品。提示词、成图、精修与发布在同一个视觉系统里发生。</p>
            {CONTACT_IS_CONFIGURED && CONTACT_HREF ? (
              <a
                href={CONTACT_HREF}
                target={CONTACT_TARGET}
                rel={CONTACT_REL}
                className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-full bg-[#e9ff33] px-6 py-3 text-sm font-black text-[#050505] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9ff33]"
              >
                联系二元
                <ArrowIcon className="-rotate-45" />
              </a>
            ) : (
              <span
                aria-disabled="true"
                className="mt-7 inline-flex min-h-11 cursor-not-allowed items-center gap-3 rounded-full border border-white/18 px-6 py-3 text-sm font-black text-white/55"
              >
                联系方式待配置
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function BinaryExperience() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <BinaryExperienceInner />
      </SmoothScroll>
    </MotionConfig>
  );
}
