'use client';

import { type CSSProperties, type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowIcon } from './Icons';
import { selectedProjects, type SelectedProject } from './projectAssets';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const revealEase = [0.76, 0, 0.24, 1] as const;

function ProjectPicture({ project }: { project: SelectedProject }) {
  return (
    <picture className="block h-full w-full">
      <source media="(max-width: 1023px)" srcSet={project.mobileImage} />
      <img
        src={project.desktopImage}
        alt={project.alt}
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover"
      />
    </picture>
  );
}

export function WorksGallery() {
  const rootRef = useRef<HTMLElement | null>(null);
  const previewCardRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const scrollIndexRef = useRef(0);
  const manualInteractionRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const activateProject = useCallback((index: number) => {
    if (activeIndexRef.current === index) return;
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const preloadProject = useCallback((project: SelectedProject) => {
    if (typeof window === 'undefined') return;
    const src = window.matchMedia('(max-width: 1023px)').matches ? project.mobileImage : project.desktopImage;
    const image = new window.Image();
    image.decoding = 'async';
    image.src = src;
  }, []);

  useEffect(() => {
    const nextProject = selectedProjects[Math.min(activeIndex + 1, selectedProjects.length - 1)];
    if (nextProject && nextProject !== selectedProjects[activeIndex]) preloadProject(nextProject);
  }, [activeIndex, preloadProject]);

  const selectProjectManually = useCallback(
    (index: number) => {
      manualInteractionRef.current = true;
      activateProject(index);
    },
    [activateProject]
  );

  const releaseManualSelection = useCallback(() => {
    manualInteractionRef.current = false;
    activateProject(scrollIndexRef.current);
  }, [activateProject]);

  const focusProject = useCallback(
    (index: number) => {
      selectProjectManually(index);
      document.getElementById(`works-tab-${selectedProjects[index]!.id}`)?.focus();
    },
    [selectProjectManually]
  );

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        focusProject((index + 1) % selectedProjects.length);
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        focusProject((index - 1 + selectedProjects.length) % selectedProjects.length);
      } else if (event.key === 'Home') {
        event.preventDefault();
        focusProject(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        focusProject(selectedProjects.length - 1);
      }
    },
    [focusProject]
  );

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(min-width: 1024px)', () => {
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const index = Math.round(self.progress * (selectedProjects.length - 1));
            scrollIndexRef.current = index;
            if (!manualInteractionRef.current) activateProject(index);
          }
        });
      });

      if (!prefersReducedMotion) media.add('(min-width: 1024px) and (hover: hover) and (pointer: fine)', () => {
        const card = previewCardRef.current;
        if (!card) return;

        gsap.set(card, { transformPerspective: 900, transformOrigin: 'center center' });
        const rotateX = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3.out' });
        const rotateY = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3.out' });
        const shiftX = gsap.quickTo(card, 'x', { duration: 0.5, ease: 'power3.out' });
        const shiftY = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3.out' });

        const onPointerMove = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          rotateY(x * 8);
          rotateX(y * -6);
          shiftX(x * 5);
          shiftY(y * 4);
        };

        const onPointerLeave = () => {
          rotateX(0);
          rotateY(0);
          shiftX(0);
          shiftY(0);
        };

        card.addEventListener('pointermove', onPointerMove);
        card.addEventListener('pointerleave', onPointerLeave);

        return () => {
          card.removeEventListener('pointermove', onPointerMove);
          card.removeEventListener('pointerleave', onPointerLeave);
        };
      });

      return () => media.revert();
    },
    { scope: rootRef, dependencies: [activateProject, prefersReducedMotion], revertOnUpdate: true }
  );

  const activeProject = selectedProjects[activeIndex]!;
  const transitionDuration = prefersReducedMotion ? 0.01 : 0.68;
  const progressStyle = {
    '--works-progress': `${((activeIndex + 1) / selectedProjects.length) * 100}%`
  } as CSSProperties;

  return (
    <section
      id="works"
      ref={rootRef}
      className="works-index-section story-panel pin-panel z-[2]"
      style={progressStyle}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;
        if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
        releaseManualSelection();
      }}
    >
      <div className="works-index-noise noise" aria-hidden="true" />
      <div className="works-index-shell">
        <div className="works-index-left">
          <header className="works-index-header">
            <p className="works-index-kicker">SELECTED WORK / 精选作品</p>
            <h2 className="works-index-heading">作品索引</h2>
            <div className="works-index-progress" aria-hidden="true">
              <span />
            </div>
          </header>

          <div className="works-project-list" role="list" aria-label="精选项目">
            {selectedProjects.map((project, index) => {
              const isActive = index === activeIndex;
              const number = String(index + 1).padStart(2, '0');

              return (
                <article
                  key={project.id}
                  role="listitem"
                  className="works-project-row"
                  data-active={isActive ? 'true' : 'false'}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== 'mouse') return;
                    const focused = document.activeElement;
                    if (
                      focused instanceof HTMLElement &&
                      rootRef.current?.contains(focused) &&
                      !event.currentTarget.contains(focused)
                    ) return;
                    preloadProject(project);
                    selectProjectManually(index);
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType !== 'mouse') return;
                    if (event.currentTarget.contains(document.activeElement)) return;
                    releaseManualSelection();
                  }}
                  onFocusCapture={() => selectProjectManually(index)}
                >
                  <h3>
                    <button
                      id={`works-tab-${project.id}`}
                      type="button"
                      aria-expanded={isActive}
                      aria-controls={`works-expanded-${project.id}`}
                      tabIndex={0}
                      className="works-project-button"
                      onClick={() => selectProjectManually(index)}
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                    >
                      <span className="works-project-number">{number}</span>
                      <span className="works-project-title">{project.title}</span>
                      <span className="works-project-meta">
                        {project.year} · {project.tags.join(' / ')}
                      </span>
                      <ArrowIcon className="works-project-arrow" />
                    </button>
                  </h3>

                  <div
                    id={`works-expanded-${project.id}`}
                    role="region"
                    aria-labelledby={`works-tab-${project.id}`}
                    className="works-project-expanded"
                    hidden={!isActive}
                  >
                    {isActive && (
                      <>
                        <div className="works-project-details">
                          <div className="works-project-details-inner">
                            <p>{project.description}</p>
                            <a href="#generate">
                              进入生成台
                              <ArrowIcon className="-rotate-45" />
                            </a>
                          </div>
                        </div>
                        <div className="works-mobile-preview">
                          <div className="works-mobile-preview-inner">
                            <div className="works-mobile-image">
                              <ProjectPicture project={project} />
                            </div>
                            <div className="works-preview-tags">
                              {project.tags.map((tag) => (
                                <span key={tag}>{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside
          id="works-project-panel"
          role="region"
          aria-label="当前项目预览"
          className="works-preview-panel"
        >
          <p className="works-preview-kicker">PROJECT INDEX</p>
          <div ref={previewCardRef} className="works-preview-card">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={activeProject.id}
                className="works-preview-picture"
                initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0.55, scale: 1.035 }}
                animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.015 }}
                transition={{ duration: transitionDuration, ease: revealEase }}
              >
                <ProjectPicture project={activeProject} />
              </motion.div>
            </AnimatePresence>
            <span className="works-preview-corner works-preview-corner--left">ER YUAN / VISUAL OUTPUT</span>
            <span className="works-preview-corner works-preview-corner--right">16:9</span>
          </div>

          <motion.div
            key={activeProject.id}
            className="works-preview-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="works-preview-count">
              {String(activeIndex + 1).padStart(2, '0')} / {String(selectedProjects.length).padStart(2, '0')}
            </span>
            <div>
              <h3>{activeProject.title}</h3>
              <p>{activeProject.description}</p>
              <div className="works-preview-tags">
                {activeProject.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <a href="#generate" className="works-preview-cta">
                进入生成台
                <ArrowIcon className="-rotate-45" />
              </a>
            </div>
          </motion.div>
        </aside>
      </div>
    </section>
  );
}
