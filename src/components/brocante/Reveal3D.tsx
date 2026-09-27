import type { ElementType, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type Tag = "div" | "article" | "section" | "header";

type Props = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  [key: string]: unknown;
};

const variants = {
  hidden: { opacity: 0, rotateX: 14, y: 36 },
  visible: { opacity: 1, rotateX: 0, y: 0 },
};

// Immersive 3D reveal for headings and key content blocks. Falls back to a
// plain static element when the visitor prefers reduced motion.
export function Reveal3D({ children, className, as = "div", delay = 0, ...rest }: Props) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Static = as as ElementType;
    return (
      <Static className={className} {...rest}>
        {children}
      </Static>
    );
  }

  const MotionTag = motion[as] as unknown as ElementType;

  return (
    <MotionTag
      className={className}
      style={{ perspective: 1000 }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={variants}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
