'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { methodSteps, workAssets } from './assets';
import { ArrowIcon } from './Icons';
import { CONTACT_HREF, CONTACT_IS_CONFIGURED, CONTACT_REL, CONTACT_TARGET } from './contact';

export function GenerationMethod() {
  const [activeId, setActiveId] = useState(workAssets[0].id);
  const prefersReducedMotion = useReducedMotion();
  const active = useMemo(() => workAssets.find((asset) => asset.id === activeId) ?? workAssets[0], [activeId]);

  return (
    <section
      id="method"
      className="story-panel pin-panel relative z-[3] overflow-hidden bg-[#f6f4ef] px-5 py-24 text-[#050505] md:px-8 md:py-32"
      style={{ backgroundColor: '#f6f4ef' }}
    >
      <div className="hero-grid absolute inset-0 opacity-80" />
      <div className="noise absolute inset-0" />

      <div className="relative z-10 mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="min-w-0">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-[#050505]/60">METHOD / 生成方法</p>
          <h2 className="font-display-zh max-w-[10ch] text-[clamp(3.8rem,11vw,8.4rem)] font-normal leading-[0.8]" data-story>
            双路径创作
          </h2>
          <p className="mt-8 max-w-xl text-sm font-bold leading-7 text-[#050505]/70 md:text-base md:leading-8" data-story>
            一边创造想象，一边把想象做成作品。这里的生成不是静态展示，而是一个可切换、可比较、可导出的创意控制台。
          </p>

          <div className="mt-10 grid-flow-dense grid grid-cols-1 gap-3 sm:grid-cols-2">
            {methodSteps.map((step, index) => (
              <motion.article
                key={step.tag}
                className="method-step group relative min-h-[190px] overflow-hidden rounded-[24px] border border-[#050505]/10 bg-white/70 p-5 shadow-[0_20px_70px_rgba(5,5,5,0.06)] backdrop-blur-xl"
                whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#050505]/14 text-[10px] font-black">0{index + 1}</div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#050505]/60">{step.tag}</p>
                <h3 className="mt-8 text-3xl font-black leading-none">{step.title}</h3>
                <p className="mt-4 text-sm font-bold leading-6 text-[#050505]/66">{step.description}</p>
                <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-[#e9ff33] transition-transform duration-500 group-hover:scale-x-100" />
              </motion.article>
            ))}
          </div>

          <div id="generate" className="mt-8 rounded-[28px] bg-[#e9ff33] p-5 md:p-7" data-story>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em]">从想象到作品</p>
                <h3 className="mt-3 max-w-[16ch] text-4xl font-black leading-[0.9]">
                  写提示词 / 生成画面 / 输出成片
                </h3>
              </div>
              {CONTACT_IS_CONFIGURED && CONTACT_HREF ? (
                <a
                  href={CONTACT_HREF}
                  target={CONTACT_TARGET}
                  rel={CONTACT_REL}
                  className="inline-flex w-fit shrink-0 items-center gap-3 whitespace-nowrap rounded-full bg-[#050505] px-6 py-4 text-sm font-black text-[#f6f4ef] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#050505]"
                >
                  启动一次二元生成
                  <ArrowIcon className="-rotate-45" />
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  className="inline-flex w-fit shrink-0 cursor-not-allowed items-center gap-3 whitespace-nowrap rounded-full bg-[#050505]/60 px-6 py-4 text-sm font-black text-[#f6f4ef]/75"
                >
                  联系方式待配置
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="generation-console relative min-h-[720px] overflow-hidden rounded-[34px] border border-[#050505]/12 bg-[#050505] p-3 text-[#f6f4ef] shadow-[0_36px_140px_rgba(5,5,5,0.22)] md:p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(233,255,51,0.18),transparent_25%),radial-gradient(circle_at_84%_76%,rgba(255,255,255,0.12),transparent_25%)]" />
          <div className="relative z-10 flex h-full flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#e9ff33]" />
                <span className="text-xs font-black uppercase tracking-[0.16em]">生成控制台</span>
              </div>
              <span className="rounded-full bg-[#e9ff33] px-3 py-1 text-[10px] font-black text-[#050505]">可导出</span>
            </div>

            <div className="generation-preview relative min-h-[430px] flex-1 overflow-hidden rounded-[26px] bg-[#d7ddd8]">
              <img
                key={active.id}
                src={active.image}
                alt={active.alt}
                className="h-full w-full object-cover transition-transform duration-700"
                style={{ objectPosition: active.crop }}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/78 via-transparent to-[#050505]/18" />
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/85 px-3 py-1 text-[10px] font-black text-[#050505] backdrop-blur-md">{active.category}</span>
                <span className="rounded-full bg-[#e9ff33] px-3 py-1 text-[10px] font-black text-[#050505]">seed {active.seed}</span>
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="max-w-[11ch] text-5xl font-black leading-[0.9] md:text-7xl">{active.title}</h3>
                <p className="mt-4 max-w-lg text-sm font-bold leading-6 text-white/72">{active.description}</p>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur-xl" role="group" aria-label="选择生成示例">
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/52">prompt chip</p>
                <p className="sr-only" aria-live="polite">当前生成示例：{active.title}</p>
                <div className="flex flex-wrap gap-2">
                  {workAssets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => setActiveId(asset.id)}
                      aria-pressed={active.id === asset.id}
                      className={`rounded-full px-3 py-2 text-left text-[11px] font-black transition-colors ${
                        active.id === asset.id ? 'bg-[#e9ff33] text-[#050505]' : 'bg-white/10 text-white hover:bg-white/20'
                      } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e9ff33]`}
                    >
                      {asset.prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="stack-card rounded-[24px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.16em] text-white/52">
                  <span>style strength</span>
                  <span>{active.styleStrength}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/12">
                  <div className="h-full rounded-full bg-[#e9ff33] transition-[width] duration-500" style={{ width: `${active.styleStrength}%` }} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-black">
                  <span className="rounded-2xl bg-white/10 p-3">ratio<br />{active.ratio}</span>
                  <span className="rounded-2xl bg-white/10 p-3">status<br />可导出</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['写提示词', '生成画面', '输出作品'].map((label, index) => (
                <div key={label} className="flex items-center justify-between rounded-2xl bg-white/[0.08] px-3 py-3 text-xs font-black">
                  {label}
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-[#e9ff33]/55 text-[9px] text-[#e9ff33]" aria-hidden="true">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
