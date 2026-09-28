import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import arrival from "@/assets/brocante-arrival.jpg";
import { SceneOverlay } from "./SceneOverlay";
import { sceneIndexAt } from "./scenes";

const TOTAL_FRAMES = 480;
const FRAMES_URL = "https://cdn.jsdelivr.net/gh/drctahs99-hue/frames@v1/Desktop";
const CONCURRENCY = 6;

type Props = { onBook: () => void; onCompleteChange: (complete: boolean) => void };

function clampFrame(value: number) {
  return Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(value)));
}

const facts = [["120", "invitados"], ["Interior + terraza", "un solo recorrido"], ["Catering de autor", "a su medida"]] as const;

export function CinematicStage({ onBook, onCompleteChange }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cache = useRef(new Map<number, ImageBitmap>());
  const targetFrame = useRef(0);
  const sceneRef = useRef(0);
  const rafId = useRef<number | undefined>(undefined);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [sequenceAvailable, setSequenceAvailable] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let destroyed = false;

    const poster = new Image();
    poster.src = arrival;

    const cover = (source: CanvasImageSource) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const sourceWidth = source instanceof ImageBitmap ? source.width : (source as HTMLImageElement).naturalWidth;
      const sourceHeight = source instanceof ImageBitmap ? source.height : (source as HTMLImageElement).naturalHeight;
      if (!sourceWidth || !sourceHeight || !width || !height) return;
      canvas.width = Math.round(width * Math.min(devicePixelRatio, 2));
      canvas.height = Math.round(height * Math.min(devicePixelRatio, 2));
      context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      const scale = Math.max(width / sourceWidth, height / sourceHeight);
      const dw = sourceWidth * scale;
      const dh = sourceHeight * scale;
      context.drawImage(source, (width - dw) / 2, (height - dh) / 2, dw, dh);
    };

    const nearest = (target: number) => {
      for (let d = 1; d < TOTAL_FRAMES; d += 1) {
        const lower = cache.current.get(target - d);
        if (lower) return lower;
        const upper = cache.current.get(target + d);
        if (upper) return upper;
      }
      return undefined;
    };

    // Only the most recently requested frame is drawn, always inside 0–479.
    const draw = () => {
      const index = clampFrame(targetFrame.current);
      const image = cache.current.get(index) ?? nearest(index);
      if (image) cover(image);
      else if (poster.complete && poster.naturalWidth) cover(poster);
      if (!destroyed) rafId.current = requestAnimationFrame(draw);
    };
    rafId.current = requestAnimationFrame(draw);

    const frameUrl = (index: number) => `${FRAMES_URL}/frame_${String(index + 1).padStart(4, "0")}.webp`;

    const loadFrame = (index: number) =>
      fetch(frameUrl(index))
        .then((response) => {
          if (!response.ok) throw new Error("frame unavailable");
          return response.blob();
        })
        .then((blob) => createImageBitmap(blob))
        .then((bitmap) => {
          if (destroyed) return;
          cache.current.set(index, bitmap);
          setLoadedCount((count) => count + 1);
        })
        .catch(() => {
          if (index === 0) setSequenceAvailable(false);
        });

    // Frame 1 first (it becomes the intro background), then the whole
    // sequence is kept in memory and scroll unlocks once it is complete.
    const loadAll = async () => {
      await loadFrame(0);
      let cursor = 1;
      const workers = Array.from({ length: CONCURRENCY }, async () => {
        while (cursor < TOTAL_FRAMES && !destroyed) {
          const index = cursor;
          cursor += 1;
          await loadFrame(index);
        }
      });
      await Promise.all(workers);
      if (!destroyed) setReady(true);
    };

    if (reduced) {
      onCompleteChange(true);
      setReady(true);
      void loadFrame(0);
    } else {
      void loadAll();
    }

    let cleanup = () => undefined;
    if (!reduced) {
      Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("lenis")]).then(([gsapModule, scrollModule, lenisModule]) => {
        if (destroyed) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollModule.ScrollTrigger;
        const Lenis = lenisModule.default;
        gsap.registerPlugin(ScrollTrigger);
        const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        const ticker = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
        const state = { frame: 0 };
        const trigger = gsap.to(state, {
          frame: TOTAL_FRAMES - 1,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "+=600%", pin: true, scrub: 0.8 },
          onUpdate: () => {
            const progress = state.frame / (TOTAL_FRAMES - 1);
            targetFrame.current = state.frame;
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
            const next = sceneIndexAt(progress);
            if (next !== sceneRef.current) {
              sceneRef.current = next;
              setActiveScene(next);
            }
            onCompleteChange(state.frame >= TOTAL_FRAMES - 3);
          },
        });
        cleanup = () => {
          trigger.kill();
          ScrollTrigger.getAll().forEach((item) => item.kill());
          gsap.ticker.remove(ticker);
          lenis.destroy();
        };
      });
    }

    return () => {
      destroyed = true;
      cleanup();
      if (rafId.current) cancelAnimationFrame(rafId.current);
      cache.current.forEach((bitmap) => bitmap.close());
      cache.current.clear();
      onCompleteChange(false);
    };
  }, [onCompleteChange]);

  // Page scroll stays locked until every frame is cached.
  useEffect(() => {
    if (ready || !sequenceAvailable) document.body.style.removeProperty("overflow");
    else document.body.style.overflow = "hidden";
    return () => { document.body.style.removeProperty("overflow"); };
  }, [ready, sequenceAvailable]);

  const loadPercent = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
  const loaderLabel = `Preparando el recorrido · ${loadPercent}%`;
  const showIntro = !ready && sequenceAvailable;

  return (
    <section ref={sectionRef} id="terraza" className={`cinematic-stage${showIntro ? " is-loading" : ""}`} style={{ backgroundImage: `url(${arrival})` }}>
      <canvas ref={canvasRef} aria-label="Recorrido cinematográfico por Brocante Terraza" />
      <div className="cinematic-veil" />
      <div ref={progressRef} className="cinematic-progress" />

      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            className="cinematic-intro"
            role="status"
            aria-live="polite"
            exit={{ opacity: 0, filter: "blur(12px)", scale: 1.03, transition: { duration: 0.7 } }}
          >
            <span className="intro-eyebrow">BROCANTE TERRAZA · LOMAS DE CHAPULTEPEC</span>
            <h1 className="intro-title">Una terraza privada para las fechas que merecen <em>quedarse.</em></h1>
            <p className="intro-copy">Bodas íntimas, cenas privadas y celebraciones de hasta 120 invitados entre cantera, vegetación y luz de poniente. En unos segundos podrán recorrer la terraza con solo deslizar.</p>
            <ul className="intro-facts">
              {facts.map(([value, label]) => <li key={value}><strong>{value}</strong><span>{label}</span></li>)}
            </ul>
            <span className="loader-fill" data-text={loaderLabel} style={{ ["--fill" as string]: `${loadPercent}%` }}>{loaderLabel}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {ready && <SceneOverlay index={activeScene} onBook={onBook} />}
      <a className="scroll-cue" href="#ficha" aria-label="Continuar a la ficha técnica"><ArrowDown /></a>
    </section>
  );
}
