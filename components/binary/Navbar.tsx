'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { navLinks } from './assets';
import { ArrowIcon, PlusIcon, StudioMark } from './Icons';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';

    const focusFrame = requestAnimationFrame(() => {
      menuPanelRef.current?.querySelector<HTMLElement>('button, a[href]')?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !menuPanelRef.current) return;
      const focusable = Array.from(
        menuPanelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      (previousFocus ?? menuButtonRef.current)?.focus({ preventScroll: true });
    };
  }, [open]);

  const navigateToSection = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    event.preventDefault();
    setOpen(false);

    requestAnimationFrame(() => {
      const behavior = prefersReducedMotion ? 'auto' : 'smooth';
      if (href === '#hero') {
        window.scrollTo({ top: 0, behavior });
      } else {
        document.querySelector<HTMLElement>(href)?.scrollIntoView({ behavior, block: 'start' });
      }
      window.history.replaceState(null, '', href);
    });
  };

  const menu = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] md:hidden"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button className="absolute inset-0 bg-[#050505]/35 backdrop-blur-md" onClick={() => setOpen(false)} aria-label="关闭菜单背景" />
          <motion.div
            id="mobile-menu"
            ref={menuPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="主导航菜单"
            initial={prefersReducedMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="hero-grid absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col justify-center overflow-hidden bg-[#f6f4ef] px-8 shadow-2xl"
          >
            <div className="noise absolute inset-0" />
            <button
              type="button"
              className="absolute right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-[#050505]/15 bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#050505]"
              onClick={() => setOpen(false)}
              aria-label="关闭菜单"
            >
              <span className="relative block h-4 w-4" aria-hidden="true">
                <span className="absolute left-0 top-1/2 h-0.5 w-4 rotate-45 bg-current" />
                <span className="absolute left-0 top-1/2 h-0.5 w-4 -rotate-45 bg-current" />
              </span>
            </button>
            <div className="relative z-10">
              <div className="mb-10 flex items-center gap-3">
                <StudioMark className="h-14 w-24" />
                <span className="text-xs font-black leading-tight">创造想象<br />实现想象</span>
              </div>
              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(event) => navigateToSection(event, link.href)}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.08 + index * 0.05, duration: prefersReducedMotion ? 0.01 : 0.44, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-between border-b border-[#050505]/10 py-4 text-4xl font-black leading-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#050505]"
                  >
                    {link.label}
                    <PlusIcon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
              <a
                href="#generate"
                onClick={(event) => navigateToSection(event, '#generate')}
                className="mt-10 flex min-h-12 items-center justify-between rounded-full bg-[#050505] px-6 py-4 text-sm font-black text-[#f6f4ef] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#050505]"
              >
                启动一次二元生成
                <ArrowIcon className="-rotate-45" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.nav
        initial={prefersReducedMotion ? false : { y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0.01 : 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 right-0 top-0 z-50 bg-transparent px-5 py-3 text-[#050505] md:px-8"
      >
        <div className="relative flex items-center justify-between">
          <a
            href="#hero"
            onClick={(event) => navigateToSection(event, '#hero')}
            className="group relative z-10 flex items-center rounded-xl border border-white/60 bg-[#f6f4ef]/90 px-1.5 py-1 shadow-[0_8px_24px_rgba(5,5,5,0.08)] backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#050505]"
            aria-label="二元，AI 图像生成工作室，回到首页"
          >
            <StudioMark className="h-12 w-20 transition-opacity duration-300 group-hover:opacity-75 md:h-14 md:w-24" />
          </a>

          {/* Optical center: absolute capsule, independent of logo / menu widths */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <div className="liquid-glass pointer-events-auto flex items-center gap-1 rounded-full px-1.5 py-1.5">
              {navLinks.slice(1).map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(event) => navigateToSection(event, link.href)}
                  className="rounded-full px-5 py-2 text-sm font-black transition-colors hover:bg-[#050505] hover:text-[#f6f4ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#050505]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#050505]/12 bg-white/55 backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#050505] md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? '关闭菜单' : '打开菜单'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className={`absolute h-0.5 w-5 rounded-full bg-[#050505] transition-all duration-300 ${open ? 'translate-y-0 rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-0.5 w-5 rounded-full bg-[#050505] transition-all duration-300 ${open ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'}`} />
            <span className={`absolute h-0.5 w-5 rounded-full bg-[#050505] transition-all duration-300 ${open ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'}`} />
          </button>
        </div>
      </motion.nav>

      {mounted ? createPortal(menu, document.body) : null}
    </>
  );
}
