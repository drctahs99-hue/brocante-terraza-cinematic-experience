import type { ElementType, PointerEvent, ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

type Tag = "div" | "article" | "section" | "header";

type Props = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  tilt?: boolean;
  [key: string]: unknown;
};

const flipIn = {
  hidden: { opacity: 0, rotateX: 24, y: 52, filter: "blur(8px)" },
  visible: { opacity: 1, rotateX: 0, y: 0, filter: "blur(0px)" },
};

const liftIn = {
  hidden: { opacity: 0, y: 52, scale: 0.94, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
};

// Immersive 3D reveal (Motion) for headings and key blocks. With `tilt`, the
// block also follows the pointer in 3D. Static when reduced motion is on.
export function Reveal3D({ children, className, as = "div", delay = 0, tilt = false, ...rest }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), { stiffness: 170, damping: 16 });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), { stiffness: 170, damping: 16 });

  if (shouldReduceMotion) {
    const Static = as as ElementType;
    return <Static className={className} {...rest}>{children}</Static>;
  }

  const MotionTag = motion[as] as unknown as ElementType;
  const onMove = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - box.left) / box.width - 0.5);
    pointerY.set((event.clientY - box.top) / box.height - 0.5);
  };
  const onLeave = () => { pointerX.set(0); pointerY.set(0); };

  return (
    <MotionTag
      className={className}
      style={tilt ? { transformPerspective: 900, rotateX, rotateY } : { perspective: 1000 }}
      initial="hidden"
      whileInView="visible"
      whileHover={tilt ? { y: -8 } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      variants={tilt ? liftIn : flipIn}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      onPointerMove={tilt ? onMove : undefined}
      onPointerLeave={tilt ? onLeave : undefined}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
