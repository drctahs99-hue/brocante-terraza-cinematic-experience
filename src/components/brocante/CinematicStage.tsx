import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import arrival from "@/assets/brocante-arrival.jpg";
import { defaultWhatsApp } from "@/data/venue-config";

const TOTAL_FRAMES = 480;
const WINDOW = 16;
const FRAMES_URL = "https://drctahs99-hue.github.io/frames/Desktop";

const scenes = [
  { range: [9, 99], tag: "LOMAS–VIRREYES · CDMX", title: "L'Art de Recevoir.", text: "Una terraza privada concebida para bodas íntimas y celebraciones que trascienden el tiempo." },
  { range: [129, 219], tag: "DISEÑO Y MATERIA", title: "La Belleza en el Detalle.", text: "Texturas orgánicas, cantera y luz natural en un entorno exclusivo de hasta 120 invitados." },
  { range: [249, 339], tag: "ESPACIOS VERSÁTILES", title: "Entre Cielo y Arquitectura.", text: "Salón interior climatizado, asador de autor, horno de leña y vistas panorámicas del poniente." },
  { range: [369, 479], tag: "TU FECHA EN BROCANTE", title: "Vivan la Experiencia.", text: "Una celebración privada, concebida alrededor de ustedes." },
] as const;

type Props = { onBook: () => void; onCompleteChange: (complete: boolean) => void };

export function CinematicStage({ onBook, onCompleteChange }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cache = useRef(new Map<number, ImageBitmap>());
  const queued = useRef(new Set<number>());
  const frameRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [sequenceAvailable, setSequenceAvailable] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) onCompleteChange(true);
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const base = import.meta.env["VITE_FRAMES_BASE_URL"] as string | undefined;
    let destroyed = false;
    let poster: HTMLImageElement | null = new Image();

    const cover = (source: CanvasImageSource, alpha = 1) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const sourceWidth = source instanceof ImageBitmap ? source.width : (source as HTMLImageElement).naturalWidth;
      const sourceHeight = source instanceof ImageBitmap ? source.height : (source as HTMLImageElement).naturalHeight;
      if (!sourceWidth || !sourceHeight) return;
      canvas.width = Math.round(width * Math.min(devicePixelRatio, 2));
      canvas.height = Math.round(height * Math.min(devicePixelRatio, 2));
      context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      const scale = Math.max(width / sourceWidth, height / sourceHeight);
      const dw = sourceWidth * scale;
      const dh = sourceHeight * scale;
      context.globalAlpha = alpha;
      context.drawImage(source, (width - dw) / 2, (height - dh) / 2, dw, dh);
      context.globalAlpha = 1;
    };

    const render = (value: number) => {
      const a = Math.floor(value);
      const b = Math.min(TOTAL_FRAMES - 1, a + 1);
      const imageA = cache.current.get(a);
      const imageB = cache.current.get(b);
      if (imageA) cover(imageA);
      else if (poster?.complete) cover(poster);
      if (imageA && imageB) cover(imageB, value - a);
    };

    poster.crossOrigin = "anonymous";
    poster.src = base ? arrival : `${FRAMES_URL}/f_0001.webp`;
    poster.onload = () => render(frameRef.current);

    const frameUrl = (index: number) => base
      ? `${base}/${mobile ? "mobile" : "desktop"}/f_${String(index + 1).padStart(4, "0")}.webp`
      : `${FRAMES_URL}/f_${String(index + 1).padStart(4, "0")}.webp`;
    const loadFrame = async (index: number) => {
      if (cache.current.has(index) || queued.current.has(index) || destroyed) return;
      queued.current.add(index);
      try {
        const response = await fetch(frameUrl(index));
        if (!response.ok) throw new Error("frame unavailable");
        const bitmap = await createImageBitmap(await response.blob());
        if (!destroyed) cache.current.set(index, bitmap);
      } catch {
        if (index === 0) setSequenceAvailable(false);
      } finally {
        queued.current.delete(index);
      }
    };

    const warmWindow = (center: number) => {
      for (let distance = 0; distance <= WINDOW; distance += 1) {
        [center + distance, center - distance].forEach((index) => {
          if (index >= 0 && index < TOTAL_FRAMES) void loadFrame(index);
        });
      }
      cache.current.forEach((bitmap, index) => {
        if (Math.abs(index - center) > WINDOW + 8) {
          bitmap.close();
          cache.current.delete(index);
        }
      });
    };

    let cleanup = () => undefined;
    if (!reduced) {
      void Promise.all([8, 4, 2, 1].map(async (step) => {
        for (let index = 0; index < TOTAL_FRAMES && !destroyed; index += step) await loadFrame(index);
      }));
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
            frameRef.current = state.frame;
            setProgress(state.frame / (TOTAL_FRAMES - 1));
            onCompleteChange(state.frame >= TOTAL_FRAMES - 3);
            warmWindow(Math.round(state.frame));
            render(state.frame);
          },
        });
        scenes.forEach((scene, index) => {
          const node = overlayRefs.current[index];
          if (!node) return;
          gsap.set(node, { autoAlpha: index === 0 ? 1 : 0, y: index === 0 ? 0 : 24 });
          gsap.to(node, { autoAlpha: 1, y: 0, scrollTrigger: { trigger: section, start: `${(scene.range[0] / TOTAL_FRAMES) * 600}% top`, end: `${(scene.range[1] / TOTAL_FRAMES) * 600}% top`, toggleActions: "play reverse play reverse" } });
        });
        cleanup = () => { trigger.kill(); ScrollTrigger.getAll().forEach((item) => item.kill()); gsap.ticker.remove(ticker); lenis.destroy(); };
      });
    }

    const resize = () => render(frameRef.current);
    window.addEventListener("resize", resize);
    return () => {
      destroyed = true;
      cleanup();
      window.removeEventListener("resize", resize);
      cache.current.forEach((bitmap) => bitmap.close());
      cache.current.clear();
      poster = null;
      onCompleteChange(false);
    };
  }, [onCompleteChange]);

  return (
    <section ref={sectionRef} id="terraza" className="cinematic-stage">
      <canvas ref={canvasRef} aria-label="Recorrido cinematográfico por Brocante Terraza" />
      <div className="cinematic-veil" />
      <div className="cinematic-progress" style={{ transform: `scaleX(${progress})` }} />
      <span className="cinematic-status">{sequenceAvailable ? "480 CUADROS · DESLIZA PARA RECORRER" : "BROCANTE · LOMAS–VIRREYES"}</span>
      {scenes.map((scene, index) => (
        <div key={scene.title} ref={(node) => { overlayRefs.current[index] = node; }} className={index === 0 ? "scene-copy scene-initial" : "scene-copy"}>
          <div className="scene-meta"><span>{scene.tag}</span></div>
          <h1>{scene.title}</h1>
          <p>{scene.text}</p>
          {index === 3 && (
            <div className="scene-actions">
              <Button variant="luxury" size="luxury" onClick={onBook}>Agendar visita privada <ArrowUpRight /></Button>
              <Button variant="glass" size="luxury" asChild><a href={defaultWhatsApp} target="_blank" rel="noopener noreferrer">Cotizar por WhatsApp <ArrowUpRight /></a></Button>
            </div>
          )}
        </div>
      ))}
      <a className="scroll-cue" href="#ficha" aria-label="Continuar a la ficha técnica"><ArrowDown /></a>
    </section>
  );
}
