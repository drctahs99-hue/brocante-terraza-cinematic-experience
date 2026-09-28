import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scenes, type Corner } from "./scenes";

const offsets: Record<Corner, { x: number; y: number; rotateY: number }> = {
  "top-left": { x: -70, y: -36, rotateY: -28 },
  "bottom-right": { x: 70, y: 36, rotateY: 28 },
  "bottom-left": { x: -70, y: 36, rotateY: -28 },
  "top-right": { x: 70, y: -36, rotateY: 28 },
};

const layer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -75, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -24, rotateX: 45, filter: "blur(8px)", transition: { duration: 0.32, ease: "easeIn" } },
};

const card: Variants = {
  hidden: (corner: Corner) => ({ opacity: 0, x: offsets[corner].x, y: offsets[corner].y, rotateY: offsets[corner].rotateY, scale: 0.94 }),
  show: { opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
  exit: (corner: Corner) => ({ opacity: 0, x: offsets[corner].x * 0.5, y: offsets[corner].y * 0.5, transition: { duration: 0.3, ease: "easeIn" } }),
};

const still: Variants = { hidden: { opacity: 1 }, show: { opacity: 1 }, exit: { opacity: 0 } };

export function SceneOverlay({ index, onBook }: { index: number; onBook: () => void }) {
  const reduced = useReducedMotion();
  const scene = scenes[index] ?? scenes[0]!;
  const words = scene.title.split(" ");
  const item = reduced ? still : rise;

  return (
    <AnimatePresence mode="wait">
      <motion.div key={index} className="scene-layer" variants={reduced ? still : layer} initial="hidden" animate="show" exit="exit">
        <div className={`scene-headline${index === 0 ? " is-hero" : ""}`}>
          <motion.span className="scene-tag" variants={item}>{scene.tag}</motion.span>
          <h1 aria-label={scene.title}>
            {words.map((word, wordIndex) => (
              <span className="word-mask" key={`${word}-${wordIndex}`} aria-hidden="true">
                <motion.span className={wordIndex === words.length - 1 ? "word word-accent" : "word"} variants={item}>{word}</motion.span>
              </span>
            ))}
          </h1>
          {scene.text && <motion.p variants={item}>{scene.text}</motion.p>}
          {scene.bigCta && (
            <motion.div className="scene-actions" variants={item}>
              <Button variant="goldOutline" size="xl" onClick={onBook}>Agendar una cita <ArrowUpRight /></Button>
            </motion.div>
          )}
        </div>

        <motion.aside className={`scene-note note-${scene.corner}`} custom={scene.corner} variants={reduced ? still : card}>
          <span className="note-index">{String(index + 1).padStart(2, "0")} — 04</span>
          <strong className="note-stat">{scene.stat}</strong>
          <span className="note-label">{scene.statLabel}</span>
          <p>{scene.note}</p>
          {!scene.bigCta && (
            <Button variant="goldOutline" size="luxury" onClick={onBook}>Agendar una cita <ArrowUpRight /></Button>
          )}
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}
