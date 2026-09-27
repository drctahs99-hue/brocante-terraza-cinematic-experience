import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import arrival from "@/assets/brocante-arrival.jpg";

const TOTAL_FRAMES = 480;
const FRAMES_URL = "https://cdn.jsdelivr.net/gh/drctahs99-hue/frames@v1/Desktop";
const CONCURRENCY = 6;

type Scene = { start: number; end: number; tag: string; title: string; text: string; centered?: boolean };

const scenes: Scene[] = [
  { start: 0, end: 0.33, tag: "LOMAS–VIRREYES · CDMX", title: "L'Art de Recevoir.", text: "Una terraza privada concebida para bodas íntimas y celebraciones que trascienden el tiempo.", centered: true },
  { start: 0.33, end: 0.66, tag: "DISEÑO Y MATERIA", title: "La Belleza en el Detalle.", text: "Texturas orgánicas, cantera y luz natural en un entorno exclusivo de hasta 120 invitados." },
  { start: 0.66, end: 0.9, tag: "ESPACIOS VERSÁTILES", title: "Entre Cielo y Arquitectura.", text: "Salón interior climatizado, asador de autor, horno de leña y vistas panorámicas del poniente." },
  { start: 0.9, end: 1, tag: "TU FECHA EN BROCANTE", title: "Vivan la Experiencia.", text: "" },
];

type Props = { onBook: () => void; onCompleteChange: (complete: boolean) => void };

function clampFrame(value: number) {
  return Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(value)));
}

export function CinematicStage({ onBook, onCompleteChange }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cache = useRef(new Map<number, ImageBitmap>());
  const targetFrame = useRef(0);
  const rafId = useRef<number | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);
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
    poster.crossOrigin = "anonymous";
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

    // Draw loop: always renders only the most recently requested frame,
    // decoupled from scroll event rate, clamped to the valid range.
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

    // Preload the entire 480-frame sequence once, keep it all in memory
    // (never evicted), then unlock scroll only once it is fully ready.
    const loadAll = async () => {
      let cursor = 0;
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
            targetFrame.current = state.frame;
            setProgress(state.frame / (TOTAL_FRAMES - 1));
            onCompleteChange(state.frame >= TOTAL_FRAMES - 3);
          },
        });
        scenes.forEach((scene, index) => {
          const node = overlayRefs.current[index];
          if (!node) return;
          gsap.set(node, { autoAlpha: index === 0 ? 1 : 0, y: index === 0 ? 0 : 24 });
          gsap.to(node, {
            autoAlpha: 1,
            y: 0,
            scrollTrigger: {
              trigger: section,
              start: `${scene.start * 600}% top`,
              end: `${scene.end * 600}% top`,
              toggleActions: "play reverse play reverse",
            },
          });
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

  // Block page scroll entirely until the full sequence is cached, so the
  // first scroll the visitor makes is already perfectly smooth.
  useEffect(() => {
    if (ready || !sequenceAvailable) {
      document.body.style.removeProperty("overflow");
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.removeProperty("overflow"); };
  }, [ready, sequenceAvailable]);

  const loadPercent = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));

  return (
    <section ref={sectionRef} id="terraza" className="cinematic-stage">
      <canvas ref={canvasRef} aria-label="Recorrido cinematográfico por Brocante Terraza" />
      <div className="cinematic-veil" />
      <div className="cinematic-progress" style={{ transform: `scaleX(${progress})` }} />
      {!ready && sequenceAvailable && (
        <div className="cinematic-loader" role="status" aria-live="polite">
          <span className="loader-fill" data-text="Preparando la experiencia" style={{ ["--fill" as string]: `${loadPercent}%` }}>
            Preparando la experiencia
          </span>
        </div>
      )}
      {ready && <span className="cinematic-status">{sequenceAvailable ? "480 CUADROS · DESLIZA PARA RECORRER" : "BROCANTE · LOMAS–VIRREYES"}</span>}
      {scenes.map((scene, index) => (
        <div
          key={scene.title}
          ref={(node) => {
            overlayRefs.current[index] = node;
          }}
          className={`scene-copy${index === 0 ? " scene-initial" : ""}${scene.centered ? " scene-centered" : ""}`}
        >
          <div className="scene-meta"><span>{scene.tag}</span></div>
          <h1>{scene.title}</h1>
          {scene.text && <p>{scene.text}</p>}
          {index === 3 && (
            <div className="scene-actions">
              <Button variant="goldOutline" size="xl" onClick={onBook}>Agendar una cita <ArrowUpRight /></Button>
            </div>
          )}
        </div>
      ))}
      <a className="scroll-cue" href="#ficha" aria-label="Continuar a la ficha técnica"><ArrowDown /></a>
    </section>
  );
}
