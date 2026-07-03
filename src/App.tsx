import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

type WorkCategory = "人物" | "风景" | "建筑" | "静物" | "抽象";

type Work = {
  id: string;
  category: WorkCategory;
  className?: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  label: string;
  prompt: string;
};

const works: Work[] = [
  {
    id: "portrait",
    category: "人物",
    image: "/images/work-portrait.webp",
    alt: "人物肖像生成结果",
    eyebrow: "肖像实验",
    title: "人物肖像",
    label: "Portrait",
    prompt: "warm cinematic portrait, quiet gaze, soft gallery light",
  },
  {
    id: "moon",
    category: "风景",
    className: "featured",
    image: "/images/work-moon.webp",
    alt: "月相荒原生成结果",
    eyebrow: "地景构想",
    title: "月相荒原",
    label: "Landscape",
    prompt: "giant moon, black monolith, desert shore, golden dusk",
  },
  {
    id: "city",
    category: "建筑",
    className: "lowered",
    image: "/images/work-city.webp",
    alt: "未来建筑生成结果",
    eyebrow: "空间预演",
    title: "未来建筑",
    label: "Architecture",
    prompt: "futuristic towers, mirrored skyline, dramatic clouds",
  },
  {
    id: "abstract",
    category: "抽象",
    className: "compact-card",
    image: "/images/work-abstract.webp",
    alt: "墨色流体生成结果",
    eyebrow: "材质研究",
    title: "墨色流体",
    label: "Abstract",
    prompt: "monochrome liquid marble, museum wall, minimal frame",
  },
  {
    id: "stilllife",
    category: "静物",
    className: "raised",
    image: "/images/work-stilllife.webp",
    alt: "静物研究生成结果",
    eyebrow: "静物布光",
    title: "静物研究",
    label: "Still Life",
    prompt: "ceramic vases, stone table, muted atelier light",
  },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

function App() {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const storyRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dustLayerRef = useRef<HTMLDivElement | null>(null);

  const openWork = (work: Work) => {
    const source = document.querySelector<HTMLElement>(`[data-work-id="${work.id}"] .work-image`);
    const state = source ? Flip.getState(source) : null;

    setSelectedWork(work);

    window.requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(`[data-modal-image="${work.id}"]`);

      if (state && target) {
        Flip.from(state, {
          targets: target,
          absolute: true,
          duration: 0.72,
          ease: "power3.inOut",
          scale: true,
        });
      }

      gsap.fromTo(".gallery-modal-backdrop", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: "power2.out" });
      gsap.fromTo(
        ".gallery-modal-copy > *",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out", stagger: 0.06, delay: 0.18 },
      );
    });
  };

  const closeWork = () => {
    const modal = document.querySelector<HTMLElement>(".gallery-modal");

    if (!modal) {
      setSelectedWork(null);
      return;
    }

    gsap.to(modal, {
      autoAlpha: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => setSelectedWork(null),
    });
  };

  useEffect(() => {
    if (!selectedWork) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeWork();
    };

    document.documentElement.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedWork]);

  useEffect(() => {
    const story = storyRef.current;
    const stage = stageRef.current;
    const dustLayer = dustLayerRef.current;
    if (!story || !stage) return;

    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldStartAtTop = !window.location.hash || window.location.hash === "#top";
    let initialScrollLockActive = shouldStartAtTop;
    let initialScrollLockTimer = 0;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const setVar = (name: string, value: string) => {
      stage.style.setProperty(name, value);
    };

    const render = (progress: number) => {
      if (prefersReducedMotion) return;
      const scrollProgress = clamp(initialScrollLockActive ? 0 : progress);

      const uiOut = smoothstep(0.03, 0.17, scrollProgress);
      const pushIn = smoothstep(0.08, 0.46, scrollProgress);
      const screenWake = smoothstep(0.14, 0.25, scrollProgress);
      const bootIn = 1 - smoothstep(0.22, 0.36, scrollProgress);
      const redIn = smoothstep(0.26, 0.38, scrollProgress) * (1 - smoothstep(0.48, 0.58, scrollProgress));
      const spreadIn = smoothstep(0.50, 0.61, scrollProgress) * (1 - smoothstep(0.66, 0.75, scrollProgress));
      const screenGalleryIn = smoothstep(0.66, 0.75, scrollProgress) * (1 - smoothstep(0.78, 0.86, scrollProgress));
      const galleryIn = smoothstep(0.77, 0.88, scrollProgress);

      setVar("--hero-ui-opacity", `${1 - uiOut}`);
      setVar("--hero-ui-y", `${lerp(0, -24, uiOut)}px`);
      setVar("--hero-bg-scale", `${lerp(1.025, 1.12, pushIn)}`);
      setVar("--hero-bg-blur", `${lerp(0, 4, pushIn)}px`);
      setVar("--hero-bg-opacity", `${lerp(1, 0.68, smoothstep(0.56, 0.82, scrollProgress))}`);
      setVar("--screen-opacity", `${screenWake * (1 - smoothstep(0.80, 0.88, scrollProgress))}`);
      setVar("--screen-content-scale", `${lerp(1.004, 1.026, smoothstep(0.18, 0.72, scrollProgress))}`);
      setVar("--screen-glow", `${lerp(0, 1, screenWake)}`);
      setVar("--scene-boot", `${bootIn * screenWake}`);
      setVar("--scene-red", `${redIn}`);
      setVar("--scene-spread", `${spreadIn}`);
      setVar("--scene-gallery", `${screenGalleryIn}`);
      setVar("--screen-strip-x", `${lerp(8, -34, smoothstep(0.68, 0.78, scrollProgress))}%`);
      setVar("--gallery-opacity", `${galleryIn}`);
      setVar("--gallery-y", `${lerp(16, 0, galleryIn)}%`);
      setVar("--gallery-events", galleryIn > 0.92 ? "auto" : "none");

      const track = stage.querySelector<HTMLElement>(".works-track");
      const galleryStage = stage.querySelector<HTMLElement>(".gallery-stage");
      const galleryHold = window.innerWidth < 768 ? window.innerWidth * 0.52 : window.innerWidth * 0.16;
      const galleryTravel = track && galleryStage
        ? Math.max(track.scrollWidth - galleryStage.clientWidth - galleryHold, window.innerWidth * 0.2)
        : window.innerWidth * 0.65;
      setVar("--works-x", `${lerp(window.innerWidth * 0.16, -galleryTravel, smoothstep(0.80, 1, scrollProgress))}px`);

      const cards = Array.from(stage.querySelectorAll<HTMLElement>(".work-card"));
      cards.forEach((card, index) => {
        const cardIn = smoothstep(0.74 + index * 0.022, 0.88 + index * 0.022, scrollProgress);
        card.style.setProperty("--card-opacity", `${cardIn}`);
        card.style.setProperty("--card-y", `${lerp(96, 0, cardIn)}px`);
        card.style.setProperty("--card-ry", `${lerp(-12, 0, cardIn)}deg`);
        card.style.setProperty("--card-scale", `${lerp(0.96, 1, cardIn)}`);
      });
    };

    const keepInitialTop = () => {
      if (!initialScrollLockActive) return;
      window.scrollTo({ left: 0, top: 0, behavior: "auto" });
      root.scrollTop = 0;
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      document.body.scrollTop = 0;
      render(0);
    };

    const releaseInitialScrollLock = () => {
      if (!initialScrollLockActive) return;
      keepInitialTop();
      initialScrollLockActive = false;
      window.clearTimeout(initialScrollLockTimer);
      ScrollTrigger.refresh();
      render(0);
    };

    const releaseInitialScrollLockForInput = () => {
      if (!initialScrollLockActive) return;
      initialScrollLockActive = false;
      window.clearTimeout(initialScrollLockTimer);
      ScrollTrigger.refresh();
    };

    const createDust = () => {
      if (!dustLayer) return;
      dustLayer.replaceChildren();

      const glowPoints = [
        [10, 18], [14, 56], [18, 74], [22, 47], [25, 63], [28, 35],
        [31, 72], [34, 22], [37, 58], [40, 46], [43, 67], [46, 18],
        [49, 53], [52, 28], [55, 74], [58, 40], [61, 21], [64, 60],
        [67, 35], [70, 70], [73, 16], [76, 49], [79, 28], [82, 64],
        [85, 38], [88, 22], [91, 57], [94, 76], [23, 82], [36, 84],
        [48, 86], [60, 82], [72, 84], [86, 82], [15, 31], [29, 18],
        [41, 30], [53, 15], [69, 24], [83, 12], [93, 36], [57, 62],
      ];

      const featherWisps = [
        [24, 44, 150, 74, -14], [29, 58, 128, 64, 9], [18, 30, 92, 46, -22],
        [36, 51, 118, 54, 18], [45, 35, 96, 48, -10], [62, 22, 76, 38, 15],
        [72, 48, 104, 52, -18], [82, 34, 86, 42, 12], [56, 72, 110, 52, 20],
        [14, 68, 78, 38, -8], [68, 76, 92, 44, -16], [88, 66, 72, 36, 14],
      ];

      glowPoints.forEach(([left, top], index) => {
        const dot = document.createElement("span");
        dot.className = index % 3 === 0 ? "dust-dot glow-dot is-bright" : "dust-dot glow-dot";
        dot.style.left = `${left}%`;
        dot.style.top = `${top}%`;
        dot.style.setProperty("--dot-size", `${3 + (index % 5) * 1.4}px`);
        dot.style.setProperty("--duration", `${8 + (index % 9) * 1.1}s`);
        dot.style.setProperty("--pulse-duration", `${5 + (index % 9) * 0.8}s`);
        dot.style.setProperty("--delay", `${(index % 13) * -0.74}s`);
        dot.style.setProperty("--float-x", `${-42 + (index * 17) % 84}px`);
        dot.style.setProperty("--float-y", `${-68 + (index * 11) % 44}px`);
        dustLayer.appendChild(dot);
      });

      featherWisps.forEach(([left, top, width, height, rotate], index) => {
        const feather = document.createElement("span");
        feather.className = "feather-wisp";
        feather.style.left = `${left}%`;
        feather.style.top = `${top}%`;
        feather.style.setProperty("--wisp-width", `${width}px`);
        feather.style.setProperty("--wisp-height", `${height}px`);
        feather.style.setProperty("--wisp-rotate", `${rotate}deg`);
        feather.style.setProperty("--wisp-duration", `${15 + (index % 5) * 2.2}s`);
        feather.style.setProperty("--wisp-pulse-duration", `${7 + (index % 5) * 1.1}s`);
        feather.style.setProperty("--wisp-delay", `${index * -1.35}s`);
        feather.style.setProperty("--wisp-x", `${-64 + (index * 29) % 128}px`);
        feather.style.setProperty("--wisp-y", `${-58 - (index * 17) % 72}px`);
        dustLayer.appendChild(feather);
      });
    };

    createDust();

    if (prefersReducedMotion) {
      render(1);
      return;
    }

    root.classList.add("gsap-ready");
    keepInitialTop();

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: story,
        start: "top top",
        end: "bottom bottom",
        pin: stage,
        pinSpacing: false,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => render(self.progress),
      });

    });

    if (shouldStartAtTop) {
      [0, 16, 60, 140, 300, 600].forEach((delay) => {
        window.setTimeout(keepInitialTop, delay);
      });
      window.addEventListener("load", releaseInitialScrollLock, { once: true });
      ["wheel", "touchstart", "pointerdown", "keydown"].forEach((eventName) => {
        window.addEventListener(eventName, releaseInitialScrollLockForInput, { once: true, passive: true });
      });
      initialScrollLockTimer = window.setTimeout(releaseInitialScrollLock, 1000);
    }

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize, { passive: true });
    ScrollTrigger.refresh();
    keepInitialTop();
    render(0);

    return () => {
      window.clearTimeout(initialScrollLockTimer);
      window.removeEventListener("resize", onResize);
      context.revert();
      root.classList.remove("gsap-ready");
      dustLayer?.replaceChildren();
    };
  }, []);

  return (
    <main className="landing" id="top">
      <section className="story" id="story" ref={storyRef} aria-label="二元首页滚动叙事">
        <div className="stage" id="stage" ref={stageRef}>
          <img
            className="hero-bg"
            src="/images/hero-studio.webp"
            alt="极简画室中的空白画布"
            fetchPriority="high"
          />

          <div className="grain-layer" aria-hidden="true" />
          <div className="light-wash" aria-hidden="true" />
          <div className="dust-layer" ref={dustLayerRef} aria-hidden="true" />

            <header className="main-nav hero-ui">
              <a className="brand-mark" href="#top" aria-label="返回二元首页">二元</a>
              <nav aria-label="主导航">
                <a href="#inspiration">灵感</a>
              </nav>
            </header>

          <div className="canvas-screen" id="canvasScreen" aria-hidden="true">
            <div className="canvas-content">
              <div className="screen-vignette" />
              <section className="screen-scene screen-scene-boot">
                <span className="screen-index">01</span>
                <strong>二元</strong>
                <small>CREATIVE IDENTITY LOADING</small>
                <i />
              </section>

              <section className="screen-scene screen-scene-red">
                <img src="/images/work-portrait.webp" alt="" />
                <div className="screen-red-copy">
                  <span>THE ART OF</span>
                  <strong>IMAGINATION</strong>
                </div>
              </section>

              <section className="screen-scene screen-scene-spread">
                <div className="spread-copy">
                  <span>Prompt</span>
                  <strong>Voyage</strong>
                  <p>把提示词变成可观看的视觉身份。</p>
                </div>
                <i />
                <div className="spread-copy align-right">
                  <span>Image</span>
                  <strong>Verite</strong>
                  <p>在画布里完成从想象到图像的切换。</p>
                </div>
              </section>

              <section className="screen-scene screen-scene-gallery">
                <div className="screen-strip">
                  <img src="/images/work-moon.webp" alt="" />
                  <img src="/images/work-city.webp" alt="" />
                  <img src="/images/work-abstract.webp" alt="" />
                </div>
                <p>生成成果进入展厅</p>
              </section>
            </div>
          </div>

          <div className="hero-copy hero-ui">
            <p>想象，是起点<br />图像，是语言</p>
            <span>IMAGINATION IS THE BEGINNING<br />IMAGE IS THE LANGUAGE</span>
          </div>

          <a className="scroll-cue hero-ui" href="#inspiration" aria-label="向下滚动查看生成成果">
            <span />
          </a>

          <section className="gallery-section" id="inspiration" aria-label="生成成果灵感展厅">
            <aside className="gallery-sidebar">
              <a className="brand-mark compact" href="#top" aria-label="返回首页">二元</a>

              <div className="gallery-heading">
                <p className="section-note">从提示词到影像</p>
                <h2>生成成果</h2>
                <span>灵感展厅</span>
              </div>

              <p className="gallery-caption">由想象开始，<br />让视觉落地。</p>
            </aside>

            <div className="gallery-stage">
              <div className="works-track">
                {works.map((work) => (
                  <article
                    className={["work-card", work.className].filter(Boolean).join(" ")}
                    data-category={work.category}
                    data-work-id={work.id}
                    key={work.title}
                    role="button"
                    tabIndex={0}
                    onClick={() => openWork(work)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openWork(work);
                      }
                    }}
                  >
                    <img className="work-image" src={work.image} alt={work.alt} data-flip-id={work.id} loading="lazy" />
                    <div className="work-shadow" />
                    <div className="work-meta">
                      <span>{work.eyebrow}</span>
                      <strong>{work.title}</strong>
                      <em>{work.label}</em>
                      <p>{work.prompt}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      {selectedWork && (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={`${selectedWork.title} 放大预览`}>
          <button className="gallery-modal-backdrop" type="button" aria-label="关闭预览" onClick={closeWork} />
          <figure className="gallery-modal-panel">
            <button className="modal-close" type="button" onClick={closeWork}>关闭</button>
            <img
              src={selectedWork.image}
              alt={selectedWork.alt}
              data-modal-image={selectedWork.id}
              data-flip-id={selectedWork.id}
            />
            <figcaption className="gallery-modal-copy">
              <span>{selectedWork.eyebrow}</span>
              <strong>{selectedWork.title}</strong>
              <em>{selectedWork.label}</em>
              <p>{selectedWork.prompt}</p>
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}

export default App;
